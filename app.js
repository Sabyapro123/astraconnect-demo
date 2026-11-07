/* AstraConnect demo. Pure front-end simulation; tabs stay in sync through BroadcastChannel. */
const $ = s => document.querySelector(s);
const fmt = n => "₹" + Math.round(n).toLocaleString("en-IN");
const sleep = ms => new Promise(r => setTimeout(r, ms));
const emi = (price, months, down = 0.15, rate = 0.105) => { const P = price * (1 - down), r = rate / 12; return P * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1); };
const bc = ("BroadcastChannel" in window) ? new BroadcastChannel("astraconnect") : null;
const params = new URLSearchParams(location.search);
const SOLO = params.get("view");

let S; // state
function fresh(personaKey) {
  return { persona: personaKey || "rohan", step: 0, cust: "video", waMsgs: [], emiRuns: 0, tenure: 36, compared: false,
    phoneEntered: false, consent3: false, lead: null, leadT0: null, calledAt: null, ride: null, rideDone: false, booked: false, sold: false,
    log: [], agentLast: {}, cardOpened: false, slots: [], callOpen: false, clock: 0 };
}
S = fresh(params.get("p") || "rohan");
const P = () => PERSONAS[S.persona];

/* ---------------- sync ---------------- */
function dispatch(type, payload = {}, remote = false) {
  reduce(type, payload);
  if (!remote && bc) bc.postMessage({ type, payload });
  render();
}
if (bc) bc.onmessage = e => dispatch(e.data.type, e.data.payload, true);

/* demo clock: the story starts at 9:38 pm on Sunday for Rohan */
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
function baseSec() { return S.persona === "rohan" ? 21 * 3600 + 38 * 60 : 20 * 3600 + 12 * 60; }
function baseDay() { return S.persona === "rohan" ? 0 : 1; }
function at(d, hm) { const [h, m] = hm.split(":").map(Number); return d * 86400 + h * 3600 + m * 60 - baseSec(); }
function clockLabel(addSec) {
  const t = baseSec() + addSec; const days = Math.floor(t / 86400); const r = ((t % 86400) + 86400) % 86400;
  const h = Math.floor(r / 3600), m = Math.floor(r / 60) % 60, s = r % 60;
  const day = days < 0 ? `${-days} days earlier` : DAYS[(baseDay() + days) % 7];
  return `${day} ${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
const SCHED = { rohan: { town: [-14, "19:05"], ride: [6, "11:50"], follow: [6, "16:00"], book: [7, "10:15"], sale: [9, "12:30"] },
                neha: { town: [-10, "19:30"], ride: [2, "19:25"], follow: [3, "09:30"], book: [3, "18:10"], sale: [5, "12:00"] } };
const SA = k => at(...SCHED[S.persona][k]);
function agentLog(id, text, sec) {
  const a = AGENTS.find(x => x.id === id);
  S.log.push({ t: clockLabel(sec), who: a ? a.name : "System", text, id });
  if (a) S.agentLast[id] = text;
}

/* ---------------- reducer ---------------- */
function reduce(type, p) {
  const per = P();
  switch (type) {
    case "RESET": S = fresh(p.persona || S.persona); break;
    case "PERSONA": S = fresh(p.persona); break;
    case "TO": S.cust = p.screen; if (p.step) S.step = Math.max(S.step, p.step); break;
    case "TOWNHALL_QR":
      S.step = Math.max(S.step, 2); S.cust = "wa";
      S.waMsgs.push({ me: true, text: per.key === "rohan" ? "Hi! Powai Ride Circle" : "Hi! First Bike Night" });
      S.waMsgs.push({ me: false, text: `Welcome ${per.name.split(" ")[0]}! ${per.town}: this Thursday, 7 pm, with owners and demo bikes. Reply STOP anytime.` });
      agentLog(1, `QR scan from "${per.townPoster}" received`, SA("town"));
      agentLog(2, "WhatsApp opt-in recorded: consent level 2", SA("town") + 2);
      agentLog(5, `Sent ${per.town} details`, SA("town") + 4);
      break;
    case "EMI": S.emiRuns++; S.tenure = p.tenure; S.step = Math.max(S.step, 3);
      agentLog(1, `Website event: EMI run ${S.emiRuns} at ${p.tenure} months = ${fmt(emi(per.price, p.tenure))}/month`, 30 + S.emiRuns * 20); break;
    case "COMPARE": S.compared = true; agentLog(1, `Website event: compared ${per.model} with ${per.rival}`, 95); break;
    case "SUBMIT":
      S.step = Math.max(S.step, 4); S.consent3 = true; S.cust = "wait";
      agentLog(1, `"Save my build" with OTP verified; source: ${per.source}, creative ${per.creativeId}`, 120); break;
    case "THINK":
      S.step = Math.max(S.step, 5);
      agentLog(2, `Joined website session + earlier WhatsApp contact into one profile; consent level 3`, 125);
      agentLog(3, `Tier ${per.tier}, score ${per.score}/100 (3+ touchpoints, EMI used); value per lead ${fmt(per.evl)}`, 128);
      agentLog(4, `Pincode ${per.pincode}: routed to ${per.dealer}; advisor ${per.advisor}; ${per.bike} free ${per.rideSlot}`, 134);
      agentLog(6, `Pickup Card written for ${per.short}; opening line and next best action ready`, 140);
      S.lead = { tier: per.tier, evl: per.evl }; S.leadT0 = p.t0 || Date.now();
      S.slots = [per.rideSlot, per.key === "rohan" ? "Saturday 4:00 pm" : "Thursday 7:00 pm", per.key === "rohan" ? "Sunday 10:00 am" : "Saturday 11:00 am"];
      break;
    case "WA_ACK":
      S.step = Math.max(S.step, 6); S.cust = "wa";
      S.waMsgs.push({ me: false, text: `Hi ${per.name.split(" ")[0]}, your ${per.model} quote is saved: about ${fmt(per.emiTarget)} a month for 36 months. Our riding expert will call you in a few minutes.` });
      agentLog(5, "Utility message sent: quote saved, call coming", 180); break;
    case "OPEN_CALL": S.callOpen = true; S.cardOpened = true; agentLog(0, "Rider Desk agent opened the Pickup Card", 470); break;
    case "BOOK":
      S.step = Math.max(S.step, 7); S.ride = p.slot; S.callOpen = false; S.calledAt = p.min || 6;
      S.waMsgs.push({ me: false, text: `Confirmed: ${per.model} test ride, ${p.slot} at ${per.dealer}. ${per.bike} is reserved for you. We will remind you 24 hours and 2 hours before.` });
      agentLog(7, `Ride booked: ${p.slot}, ${per.bike} reserved; reminders scheduled`, 490);
      agentLog(4, `Card and ride pushed to ${per.advisor}'s phone`, 492); break;
    case "RIDE_DONE":
      S.step = Math.max(S.step, 8); S.rideDone = true;
      agentLog(7, `Ride completed: ${per.rideType}`, SA("ride")); break;
    case "FOLLOWUP":
      S.step = Math.max(S.step, 9); S.cust = "wa";
      S.waMsgs.push({ me: false, text: `Thanks for riding the ${per.model}, ${per.name.split(" ")[0]}! Here is your ride photo 📸 and a finance pre-approval link. Tap below to book.`, book: true });
      agentLog(8, `Follow-up sent within 24 hours; ${per.advisor} will be alerted if no booking by tomorrow`, SA("follow")); break;
    case "CUST_BOOK":
      S.booked = true; S.waMsgs.push({ me: true, text: `Book my ${per.model}` });
      agentLog(1, "Booking request received; sent to dealer", SA("book")); break;
    case "SALE":
      S.step = Math.max(S.step, 10); S.sold = true;
      agentLog(0, `${per.dealer} recorded the retail. The dealer made the sale.`, SA("sale")); break;
    case "LEARN":
      S.step = 11;
      agentLog(9, "Coded (hashed) sale sent to Google Data Manager API and Meta Conversions API for CRM", SA("sale") + 60);
      agentLog(9, `Credit: ${per.creator} and ${per.townPoster}; ledger = ORIGINATED`, SA("sale") + 62);
      agentLog(9, "Score model retrained; similar leads now rank higher", SA("sale") + 64); break;
  }
}

/* ---------------- render ---------------- */
function render() {
  renderTracker(); renderCustomer(); renderDesk(); renderAdvisor(); renderLog(); renderAgents(); renderJourney(); renderTower(); renderMapSide();
}
function renderTracker() {
  $("#tracker").innerHTML = STEPS.map(s => `<div class="step ${s.ph} ${S.step >= s.n ? "done" : ""} ${S.step + 1 === s.n ? "cur" : ""}"><div class="ph ph-${s.ph}">${s.n}. ${s.ph}</div><b>${s.t}</b>${s.d}</div>`).join("");
}
function waView() {
  const per = P();
  return `<div class="wa"><div class="wa-h">AstraMoto ✓ <span style="font-weight:400;font-size:11px">WhatsApp Business</span></div>
  ${S.waMsgs.map(m => `<div class="bub ${m.me ? "me" : ""}">${m.text}${m.book && !S.booked ? `<button class="btn o" onclick="dispatch('CUST_BOOK')">Book my ${per.model}</button>` : ""}<div class="tm">✓✓</div></div>`).join("")}</div>
  ${S.step < 4 ? `<button class="btn n" onclick="dispatch('TO',{screen:'product',step:3})">Two weeks later: ${per.key === "rohan" ? "Sunday 9:38 pm" : "Monday 8:12 pm"}, tap the creator's link ›</button>` : ""}
  ${S.booked ? `<div class="card" style="text-align:center">🎉 Booking sent to ${per.dealer}. The dealer completes the sale.</div>` : ""}`;
}
function renderCustomer() {
  const per = P(); const el = $("#cust-screen"); let h = "";
  if (S.cust === "video") {
    const ig = per.key === "neha";
    h = `<div class="app-h">${ig ? "Instagram" : "YouTube"}</div>
    <div class="yt"><div class="thumb"><div class="play">▶</div></div>
      <div class="meta"><b>${per.creative}</b><div class="ch">${per.creator} · Sponsored</div></div>
      <div class="adbox"><b>AstraMoto ${per.model}</b><br>Shown only to people within 3 km of a Premium Pickup dealer.<br>
      <span class="small">Tagged link: astramoto.in/t/${per.creativeId}</span>
      <button class="btn o" onclick="dispatch('TO',{screen:'townhall',step:1})">Keep watching ›</button></div></div>
    <p class="small">Google and Meta never tell AstraMoto who watched. AstraMoto only learns about ${per.name.split(" ")[0]} when ${per.key === "rohan" ? "he" : "she"} chooses to respond.</p>`;
  } else if (S.cust === "townhall") {
    h = `<div class="app-h">A week later: a poster at a ${per.key === "rohan" ? "Powai cafe" : "Hinjewadi IT-park cafe"}</div>
    <div class="card" style="text-align:center"><b>${per.town}</b><br>Meet owners · Ride demo bikes · Ask anything<div class="qr"></div><span class="small">Scan to join on WhatsApp</span>
    <button class="btn n" onclick="dispatch('TOWNHALL_QR')">Scan the QR code</button></div>`;
  } else if (S.cust === "wa") {
    h = waView();
  } else if (S.cust === "product") {
    const v = emi(per.price, S.tenure);
    h = `<div class="app-h">astramoto.in · ${per.model}</div><div class="bike">${per.emoji}</div>
    <div class="card"><div class="price">${per.model}</div><div class="small">${per.segment} · ex-showroom about ${fmt(per.price)}</div>
    <label class="f">Tenure</label><select class="s" id="ten">${[24, 36, 42, 48].map(t => `<option ${t === S.tenure ? "selected" : ""}>${t}</option>`).join("")}</select>
    <div class="emi"><div class="small">Your monthly EMI (85% finance, 10.5%)</div><div class="v">${fmt(v)}</div></div>
    <button class="btn ghost" onclick="dispatch('EMI',{tenure:+document.getElementById('ten').value})">Calculate EMI (${S.emiRuns} run${S.emiRuns === 1 ? "" : "s"})</button>
    <button class="btn ghost" onclick="dispatch('COMPARE')" ${S.compared ? "disabled" : ""}>${S.compared ? "Compared with " + per.rival : "Compare with a rival"}</button>
    <button class="btn o" onclick="dispatch('TO',{screen:'form'})" ${S.emiRuns < 1 ? "disabled" : ""}>Save my build and get a call</button></div>`;
  } else if (S.cust === "form") {
    h = `<div class="app-h">Save my build</div>
    <div class="card"><label class="f">Mobile number</label><input type="tel" value="${per.phone}">
    <label class="f">Pincode</label><input type="text" value="${per.pincode}">
    <label class="f">OTP sent to your phone</label><input type="text" id="otp" placeholder="Enter 1234" value="${S.autoplaying ? "1234" : ""}">
    <div class="chk"><input type="checkbox" checked disabled> <span>Save my quote and build<span class="lvl">Level 2</span></span></div>
    <div class="chk"><input type="checkbox" id="c3" ${S.autoplaying ? "checked" : ""}> <span>Let my advisor see my research so I don't have to repeat myself<span class="lvl">Level 3</span></span></div>
    <div class="small" style="margin-top:6px">Expires in 90 days. Withdraw anytime from WhatsApp. Calls only between 9 am and 10 pm.</div>
    <button class="btn o" onclick="submitForm()">Save and request a call</button></div>`;
  } else if (S.cust === "wait") {
    h = `<div class="empty">⏳ Saving your build…</div>`;
  }
  el.innerHTML = h;
}
function remaining() {
  if (!S.leadT0) return null;
  const elapsedMin = S.calledAt != null ? S.calledAt : Math.min(15, (Date.now() - S.leadT0) / 1000);
  return 15 - elapsedMin;
}
function renderDesk() {
  const per = P(); const rows = [];
  if (S.lead) rows.push({ me: true, name: per.short, area: per.area, model: per.model, tier: per.tier, evl: per.evl, signal: "EMI twice, 1 rival, 3+ touchpoints" });
  QUEUE_SEED.forEach(q => rows.push(q));
  const rem = remaining();
  $("#desk").innerHTML = `<div class="desk-h"><b>Priority queue · sorted by value per lead, not by arrival</b><span class="st">16 agents on duty · 9 am to 10 pm</span></div>
  <table class="q"><tr><th>Lead</th><th>Area</th><th>Model</th><th>Tier</th><th>Value</th><th>Signal</th><th>15-min timer</th><th></th></tr>
  ${rows.map(r => `<tr class="${r.me && !S.calledAt ? "new" : ""}"><td><b>${r.name}</b></td><td>${r.area}</td><td>${r.model}</td><td><span class="tag ${r.tier}">${r.tier}</span></td><td>${fmt(r.evl)}</td><td>${r.signal}</td>
  <td>${r.me ? (S.calledAt != null ? `<span class="timer ok">Called at ${S.calledAt} min ✓</span>` : `<span class="timer ${rem < 5 ? "warn" : ""}" id="tmr">${fmtMin(rem)}</span>`) : (r.tier === "C" ? "Nurture, call in 24 h" : "Queued")}</td>
  <td>${r.me && S.calledAt == null ? `<button class="btn g" style="margin:0;padding:5px 8px" onclick="dispatch('OPEN_CALL')">Open Card and call</button>` : ""}</td></tr>`).join("")}</table>
  ${S.callOpen ? `<div class="callbox"><b>📞 Calling ${per.name} · Tier ${per.tier}</b>${cardHTML(true)}
   <div class="script">"${per.opening}"</div><div class="small">Confirmed demo-bike slots from the Ride Agent:</div>
   ${S.slots.map((s, i) => `<span class="slot ok" onclick="dispatch('BOOK',{slot:'${s}',min:${Math.max(1, Math.min(14, Math.round(15 - (remaining() ?? 9))))}})">✓ ${s}</span>`).join("")}</div>` : ""}
  ${!S.lead ? `<div class="small" style="margin-top:8px">Waiting for new leads. Tier A and B leads are called within 15 minutes; Tier C gets WhatsApp nurture and one call within 24 hours.</div>` : ""}`;
}
function fmtMin(m) { if (m == null) return ""; const mm = Math.max(0, Math.floor(m)), ss = Math.max(0, Math.floor((m - mm) * 60)); return `${mm}:${String(ss).padStart(2, "0")} left`; }
function cardHTML(compact) {
  const per = P();
  return `<div class="pc" style="margin-top:8px"><div class="pc-h"><span>Pickup Card · ${per.short}</span><span>Tier ${per.tier} · ${per.score}</span></div><div class="pc-b">
  <div class="pc-r"><span>Area</span><span>${per.area} (${per.pincode})</span></div>
  <div class="pc-r"><span>Model</span><span>${per.model}</span></div>
  <div class="pc-r"><span>Came from</span><span>${per.creator.split(" (")[0]}: ${per.source}</span></div>
  <div class="pc-r"><span>Community</span><span>${per.town}</span></div>
  <div class="pc-r"><span>On our site</span><span>${per.visits}</span></div>
  <div class="pc-r"><span>Finance</span><span>EMI run ${Math.max(2, S.emiRuns)}x at 36 months, about ${fmt(per.emiTarget)}/month</span></div>
  <div class="pc-r"><span>Compared</span><span>${per.rival}</span></div>
  ${compact ? "" : `<div class="pc-r"><span>Ride</span><span>${S.ride ? S.ride + " · " + per.bike + " ✓" : "Not booked yet"}</span></div>`}
  <div class="nba"><b>Next best action:</b> ${per.nba}</div>
  <div class="consent">✓ Consent level 3: research shared with advisor · expires in 90 days</div></div></div>`;
}
function renderAdvisor() {
  const per = P(); const el = $("#adv-screen");
  if (S.step < 5) { el.innerHTML = `<div class="app-h">${per.dealer.split(",")[0]} · Dealer app</div><div class="card">Good evening, ${per.advisor}. Today: 6 walk-ins, 3 rides done.</div><div class="empty">No new Premium Pickup leads yet.</div>`; return; }
  let h = `<div class="app-h">${per.dealer.split(",")[0]} · Dealer app</div>`;
  if (!S.ride) h += `<div class="notif">🔔 New Tier ${per.tier} lead routed to you: ${per.short}, ${per.area}. Rider Desk is calling now.</div>`;
  else if (!S.rideDone) h += `<div class="notif">✅ Ride booked: ${S.ride}. ${per.bike} reserved. Card ready.</div>`;
  else if (!S.sold) h += `<div class="notif">📋 Ride done. ${S.booked ? `${per.name.split(" ")[0]} wants to book!` : "Follow-up Agent has sent the photo and pre-approval link."}</div>`;
  else h += `<div class="notif" style="background:var(--green)">🏁 Sale recorded. Credited to ${per.dealer.split(",")[0]}.</div>`;
  h += cardHTML(false);
  h += `<button class="btn n" ${!S.ride || S.rideDone ? "disabled" : ""} onclick="rideDone()">Mark test ride completed</button>
  <button class="btn g" ${!S.booked || S.sold ? "disabled" : ""} onclick="sale()">Confirm sale</button>`;
  el.innerHTML = h;
}
function renderLog() {
  $("#agentlog").innerHTML = S.log.length ? S.log.slice().reverse().map(l => `<div class="l"><span class="t">${l.t}</span> <span class="ag" style="color:${l.id ? "var(--purple)" : "var(--green)"}">${l.who}</span>: ${l.text}</div>`).join("") : `<div class="small">Agents are idle. They wake up when ${P().name.split(" ")[0]} does something.</div>`;
}
function renderAgents() {
  $("#agentcards").innerHTML = AGENTS.map(a => `<div class="agent"><span class="st ${S.agentLast[a.id] ? "on" : ""}">${S.agentLast[a.id] ? "Acted" : "Idle"}</span><h3>${a.id}. ${a.name}</h3>
  <dl><dt>One job</dt><dd>${a.job}</dd><dt>Receives</dt><dd>${a.gets}</dd><dt>Produces</dt><dd>${a.makes}</dd><dt>Human check</dt><dd>${a.human}</dd><dt>Built on</dt><dd>${a.on}</dd></dl>
  <div class="last">${S.agentLast[a.id] ? "Last action: " + S.agentLast[a.id] : "Waiting"}</div></div>`).join("");
}
function renderJourney() {
  const per = P(); $("#jname").textContent = per.name.split(" ")[0];
  const rows = [
    ["1. Discovery", `Watches "${per.creative}" by ${per.creator}`, "Ad shown only within 3 km of the dealer; area demand from aggregated reports", "None needed"],
    ["2. Town hall", `Scans a QR at the ${per.town}`, "Signal Agent logs the source; WhatsApp Agent sends event details", "Level 2"],
    ["3. Research", `Runs the EMI twice (about ${fmt(per.emiTarget)} a month), compares ${per.rival}`, "Website events stored against an anonymous ID", "Level 1"],
    ["4. Raises hand", "Saves the build, verifies OTP, ticks level 3", "Signal and Identity Agents join everything into one profile", "Level 3"],
    ["5. Think", "Nothing; still on the page", `Tier ${per.tier}, score ${per.score}; routed to ${per.dealer}; Card written; 15-minute timer starts`, "Level 3"],
    ["6. WhatsApp", "Gets \"quote saved, call coming\"", "WhatsApp Agent, within 30 seconds", "Level 3"],
    ["7. Human call", "Takes the Rider Desk call", `EMI answered first; ${per.rideSlot} ride booked on ${per.bike}`, "Level 3"],
    ["8. Ride", `Rides: ${per.rideType}`, `${per.advisor} opens the Card; Ride Agent sent reminders`, "Level 3"],
    ["9. Follow-up", "Gets a ride photo and pre-approval link", `Follow-up Agent; ${per.advisor} alerted if no booking`, "Level 3"],
    ["10. Sale", `Books and buys at ${per.dealer}`, "The dealer makes the sale", "Normal paperwork"],
    ["11. Learning", "Gets a referral QR code", "Learning Agent sends the coded sale to Google and Meta; credits creator and poster", "Hashed data only"]
  ];
  $("#steptable").innerHTML = `<tr><th>Step</th><th>${per.name.split(" ")[0]} does</th><th>The engine does</th><th>Consent</th></tr>` + rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("");
}
function renderTower() {
  const live = { leads: S.lead ? 1 : 0, called: S.calledAt != null ? 1 : 0, cards: S.cardOpened ? 1 : 0, rides: S.ride ? 1 : 0, sales: S.sold ? 1 : 0 };
  const k = [
    ["Called within 15 minutes", "11% → 45%", `This session: ${live.called}/${live.leads}`],
    ["Advisor knew my context", "22% → 70%", `Cards opened: ${live.cards}`],
    ["Test rides completed", "69% → 82%", `Rides confirmed: ${live.rides}`],
    ["Cost per extra sale", "₹8,342", "Hurdle ₹15,422"],
    ["Extra sales a year (plan)", "23,974", `This session: ${live.sales}`]
  ];
  $("#kpis").innerHTML = k.map(x => `<div class="kpi"><div class="k">${x[0]}</div><div class="v">${x[1]}</div><div class="s">${x[2]}</div></div>`).join("");
  const val = S.step >= 11 ? 2.30 : 2.11;
  const ang = -90 + (val - 2.0) / 0.4 * 180;
  const tgt = -90 + (2.25 - 2.0) / 0.4 * 180;
  $("#gauge").innerHTML = `<svg viewBox="0 0 220 130" width="100%"><path d="M20 110 A90 90 0 0 1 200 110" fill="none" stroke="#e6e9f0" stroke-width="18"/>
   <path d="M20 110 A90 90 0 0 1 200 110" fill="none" stroke="#1F3864" stroke-width="18" stroke-dasharray="${(val - 2.0) / 0.4 * 283} 283"/>
   <line x1="110" y1="110" x2="${110 + 80 * Math.sin(tgt * Math.PI / 180)}" y2="${110 - 80 * Math.cos(tgt * Math.PI / 180)}" stroke="#C55A11" stroke-width="3" stroke-dasharray="4 3"/>
   <line x1="110" y1="110" x2="${110 + 72 * Math.sin(ang * Math.PI / 180)}" y2="${110 - 72 * Math.cos(ang * Math.PI / 180)}" stroke="#222" stroke-width="4" style="transition:all 1s"/>
   <circle cx="110" cy="110" r="7" fill="#222"/>
   <text x="20" y="127" font-size="10" fill="#666">2.00x</text><text x="182" y="127" font-size="10" fill="#666">2.40x</text></svg><div style="text-align:center;font-size:30px;font-weight:800;color:#1F3864;margin-top:-4px">${val.toFixed(2)}x</div>
   <div class="small">${S.step >= 11 ? "Every sale like this one, multiplied 23,974 times, moves RoMI to 2.30x." : "Finish the journey to see the needle move. Orange dashes mark the 2.25x target."}</div>`;
  const max = 32000;
  $("#channels").innerHTML = CHANNELS.map(c => `<div class="bar"><div class="n">${c.n}</div><div class="t"><div class="f" style="width:${c.v / max * 100}%;background:${c.v < 15422 ? "var(--navy)" : "#b7b7b7"}"></div><div class="hl" style="left:${15422 / max * 100}%"></div></div><div class="val">${fmt(c.v)}</div></div>`).join("") +
    `<div class="bar"><div class="n"><b>Our engine</b></div><div class="t"><div class="f" style="width:${8342 / max * 100}%;background:var(--green)"></div><div class="hl" style="left:${15422 / max * 100}%"></div></div><div class="val">₹8,342</div></div><div class="small">Orange line: ₹15,422 hurdle (₹34,700 ÷ 2.25).</div>`;
  $("#ledgers").innerHTML = [["Originated", 76650, "Full credit", "var(--navy)"], ["Influenced", 235350, "Credit only if holdout tests prove it", "var(--purple)"], ["No digital touch", 108000, "No digital credit", "var(--gray)"]]
    .map(l => `<div class="bar"><div class="n">${l[0]}</div><div class="t"><div class="f" style="width:${l[1] / 235350 * 100}%;background:${l[3]}"></div></div><div class="val">${l[1].toLocaleString("en-IN")}</div></div><div class="small" style="margin:-3px 0 6px 128px">${l[2]}</div>`).join("") +
    `<div class="small">${S.sold ? `${P().name.split(" ")[0]}'s sale is ORIGINATED: a digital lead started it.` : ""}</div>`;
}

/* ---------------- map ---------------- */
let map, mapLayers = [];
function initMap() {
  if (map || !window.L) return;
  map = L.map("map").setView([19.1, 72.9], 11);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18, attribution: "© OpenStreetMap contributors" }).addTo(map);
  DEMAND.forEach(d => L.circle([d.lat, d.lng], { radius: d.r, color: "#C55A11", fillColor: "#C55A11", fillOpacity: .18, weight: 1 }).addTo(map).bindTooltip(`${d.area}: ${d.model} interest ${d.change} this week (aggregated, 50+ users per row)`));
  DEALERS.forEach(d => L.marker([d.lat, d.lng]).addTo(map).bindTooltip(d.name));
  drawRoute();
}
function drawRoute() {
  if (!map) return; mapLayers.forEach(l => map.removeLayer(l)); mapLayers = [];
  const per = P();
  map.setView([per.lat, per.lng], 12);
  const home = L.circleMarker(per.home, { radius: 9, color: "#1F3864", fillColor: "#1F3864", fillOpacity: 1 }).addTo(map).bindTooltip(`${per.short}: pincode ${per.pincode}`, { permanent: true, direction: "top" });
  const line = L.polyline([per.home, [per.lat, per.lng]], { color: "#5B3F8C", weight: 4, dashArray: "6 6" }).addTo(map);
  const ring = L.circle([per.lat, per.lng], { radius: 3000, color: "#1F3864", weight: 1, fill: false, dashArray: "4 4" }).addTo(map).bindTooltip("3 km ad radius around the dealer");
  mapLayers.push(home, line, ring);
}
function renderMapSide() {
  const per = P();
  $("#mapside").innerHTML = `<div class="panel"><h3>Routing Agent decision</h3><div class="small">Lead</div><b>${per.short}, ${per.area} (${per.pincode})</b>
  <div class="small" style="margin-top:6px">Nearest Premium Pickup dealer</div><b>${per.dealer}</b>
  <div class="small" style="margin-top:6px">Advisor on duty</div><b>${per.advisor}</b>
  <div class="small" style="margin-top:6px">Demo bike</div><b>${per.bike}, free ${per.rideSlot}</b></div>
  <div class="panel"><h3>Regional demand this week</h3>${DEMAND.map(d => `<div class="bar"><div class="n">${d.area}</div><div class="val" style="width:auto">${d.model} ${d.change}</div></div>`).join("")}
  <div class="small">From aggregated reports only (at least 50 users per row). No individual is identified. When demand rises, the Ride Agent moves a demo bike and the Learning Agent shifts local budget.</div></div>`;
}

/* ---------------- actions ---------------- */
async function submitForm() {
  const otp = document.getElementById("otp"), c3 = document.getElementById("c3");
  if (otp && otp.value.trim() !== "1234") { toast("Demo OTP is 1234"); return; }
  if (c3 && !c3.checked) { toast("Without level 3 consent the advisor sees nothing. Tick it to share your research."); return; }
  dispatch("SUBMIT"); await sleep(1200); dispatch("THINK", { t0: Date.now() }); await sleep(1400); dispatch("WA_ACK");
}
async function rideDone() { dispatch("RIDE_DONE"); await sleep(1500); dispatch("FOLLOWUP"); }
async function sale() { dispatch("SALE"); await sleep(1500); dispatch("LEARN"); toast("Loop closed: the sale now teaches Google and Meta to find more buyers like this."); }
function toast(t) { const el = $("#toast"); el.textContent = t; el.classList.add("show"); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove("show"), 3200); }
function caption(t) { $("#caption").innerHTML = t; }

/* ---------------- autoplay ---------------- */
let runId = 0;
async function autoplay() {
  const id = ++runId; const per = P(); const first = per.name.split(" ")[0]; const he = per.key === "rohan" ? "he" : "she";
  const go = async (ms) => { await sleep(ms); if (id !== runId) throw "stop"; };
  try {
    dispatch("RESET", { persona: per.key }); S.autoplaying = true; showView("live");
    caption(`<b>Step 1, SENSE.</b> ${first} watches "${per.creative}". The ad is shown only within 3 km of ${per.dealer.split(",")[0]}. Google never tells AstraMoto who watched.`); await go(4500);
    dispatch("TO", { screen: "townhall", step: 1 });
    caption(`<b>Step 2, SENSE.</b> A week later ${first} sees a poster for the ${per.town} and scans the QR code. WhatsApp opens; ${he} gives level 2 consent by messaging.`); await go(3500);
    dispatch("TOWNHALL_QR"); await go(3500);
    dispatch("TO", { screen: "product", step: 3 });
    caption(`<b>Step 3, SENSE.</b> Two weeks later ${first} taps the creator's tagged link, runs the EMI twice and compares one rival. Each action is stored against an anonymous ID.`); await go(2000);
    dispatch("EMI", { tenure: 42 }); await go(1500); dispatch("EMI", { tenure: 36 }); await go(1500); dispatch("COMPARE"); await go(2000);
    dispatch("TO", { screen: "form" });
    caption(`<b>Step 4, SENSE.</b> ${first} saves the build, verifies the OTP and ticks "Let my advisor see my research". This is level 3 consent.`); await go(4000);
    S.autoplaying = true; dispatch("SUBMIT"); await go(1200);
    caption(`<b>Step 5, THINK.</b> In seconds, the agents join everything into one profile, score ${first} Tier ${per.tier} (${per.score}/100), route ${per.key === "rohan" ? "him" : "her"} to ${per.dealer} and write the Pickup Card. A 15-minute timer starts on the Rider Desk.`);
    dispatch("THINK", { t0: Date.now() }); await go(3500);
    caption(`<b>Step 6, ACT.</b> The WhatsApp Agent confirms the saved quote within 30 seconds. This is an acknowledgement, not the response: a human will call.`);
    dispatch("WA_ACK"); await go(4500);
    caption(`<b>Step 7, ACT.</b> A Rider Desk agent opens the Card and calls. The EMI question is answered first, and the ride is booked on a demo bike the Ride Agent has confirmed.`);
    dispatch("OPEN_CALL"); await go(4000); dispatch("BOOK", { slot: per.rideSlot, min: 6 }); await go(3000);
    caption(`<b>Step 8, ACT.</b> ${per.advisor} at the dealership already knows ${first}. ${first} takes a ${per.rideType}.`); await go(3500);
    dispatch("RIDE_DONE"); await go(1500);
    caption(`<b>Step 9, ACT.</b> The Follow-up Agent sends a ride photo and a finance pre-approval link within 24 hours. ${first} taps "Book".`);
    dispatch("FOLLOWUP"); await go(3500); dispatch("CUST_BOOK"); await go(2500);
    caption(`<b>Step 10, ACT.</b> The dealer confirms the sale. AstraMoto never sells directly; the dealer is credited.`);
    dispatch("SALE"); await go(3000);
    caption(`<b>Step 11, LEARN.</b> The Learning Agent sends the coded sale back to Google and Meta, credits the creator and the poster, and retrains the score. Open the Control Tower to see RoMI move to 2.30x.`);
    dispatch("LEARN"); await go(1000);
  } catch (e) { /* stopped */ }
  S.autoplaying = false;
}

/* ---------------- views and wiring ---------------- */
function showView(v) {
  document.querySelectorAll(".view").forEach(x => x.classList.toggle("active", x.id === "view-" + v));
  document.querySelectorAll("#tabs button").forEach(b => b.classList.toggle("active", b.dataset.view === v));
  if (v === "map") setTimeout(() => { initMap(); map && map.invalidateSize(); drawRoute(); }, 50);
}
document.querySelectorAll("#tabs button").forEach(b => b.onclick = () => showView(b.dataset.view));
$("#persona").value = S.persona;
$("#persona").onchange = e => { runId++; dispatch("PERSONA", { persona: e.target.value }); drawRoute(); caption(`Now following ${P().name}, ${P().age}, ${P().area}, looking at the ${P().model}.`); };
$("#autoplay").onclick = autoplay;
$("#reset").onclick = () => { runId++; dispatch("RESET", {}); caption('Reset. Press "Play journey" or click through the phone yourself.'); };
setInterval(() => { if (S.leadT0 && S.calledAt == null) { const t = document.getElementById("tmr"); if (t) { const r = remaining(); t.textContent = fmtMin(r); t.className = "timer " + (r < 5 ? "warn" : ""); } } }, 250);

if (SOLO) {
  document.body.classList.add("solo");
  const map2 = { customer: 0, desk: 1, advisor: 2 };
  document.querySelectorAll(".live-grid > .col").forEach((c, i) => { if (map2[SOLO] !== undefined && i !== map2[SOLO]) c.style.display = "none"; });
}
render();
