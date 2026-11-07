// All data is fictitious and taken from the AstraMoto case or the team's model.
const PERSONAS = {
  rohan: {
    key: "rohan", name: "Rohan Mehta", short: "Rohan M.", age: 26, city: "Mumbai", area: "Andheri East", pincode: "400069",
    phone: "98XXXXX214", model: "TrailX 310", segment: "Adventure / Touring", price: 305000, tenure: 36, emiTarget: 8426,
    persona: "Trail Seeker", source: "YouTube lead form ad",
    creative: "Mumbai to Lonavala on the TrailX 310: long-term touring review",
    creator: "RideWithKabir (Mumbai riding creator)", campaign: "TrailX_Touring_Mumbai_3km", creativeId: "vid_77812",
    town: "Powai Ride Circle town hall", townPoster: "Powai cafe poster",
    rival: "a rival 300cc adventure bike", dealer: "Western Express Motors, Andheri East", advisor: "Sneha",
    lat: 19.1136, lng: 72.8697, home: [19.1197, 72.8746],
    rideSlot: "Saturday 11:00 am", rideType: "45-minute touring ride on the Western Express Highway",
    bike: "TrailX 310 demo bike #2", nba: "Confirm the 36-month EMI first, offer the Saturday touring ride, mention the Lonavala ride plan.",
    opening: "Hi Rohan, I saw you were checking the 36-month EMI for the TrailX. Shall I confirm that number for you first?",
    score: 86, tier: "A", evl: 7391,
    watched: "Long-form TrailX touring review, then one more video on our site",
    visits: "TrailX page 4 times", emoji: "🏍️",
    townHi: "Hi! Powai Ride Circle", townWhen: "this Thursday, 7 pm", he: "he", him: "him", app: "YouTube", townPlace: "Powai cafe", later: "Sunday 9:38 pm", base: [0, "21:38"],
    altSlots: ["Saturday 4:00 pm", "Sunday 10:00 am"], dealerFirst: false, onDuty: 26, hello: "Good evening"
  },
  neha: {
    key: "neha", name: "Neha Kulkarni", short: "Neha K.", age: 22, city: "Pune", area: "Hinjewadi", pincode: "411057",
    phone: "97XXXXX508", model: "Velocity 200", segment: "Premium Street", price: 150000, tenure: 36, emiTarget: 4144,
    persona: "First Upgrader", source: "Instagram Reel lead form (Meta)",
    creative: "My first bike after my first salary: Velocity 200 city test",
    creator: "PuneOnTwoWheels (nano creator)", campaign: "V200_FirstJob_Pune_IT", creativeId: "reel_40217",
    town: "First Bike Night at an IT-park cafe", townPoster: "IT-park cafe poster",
    rival: "a rival 200cc street bike", dealer: "Hinjewadi Moto Hub, Pune", advisor: "Arjun",
    lat: 18.5913, lng: 73.7389, home: [18.5979, 73.7301],
    rideSlot: "Wednesday 7:00 pm", rideType: "20-minute city ride after office hours",
    bike: "Velocity 200 demo bike #1", nba: "Open with the EMI and finance pre-approval, offer the Wednesday evening ride, keep it short.",
    opening: "Hi Neha, your Velocity 200 EMI comes to about ₹4,144 a month. Shall I check a pre-approval for you right now?",
    score: 79, tier: "A", evl: 6732,
    watched: "Instagram Reel on a first bike after a first salary",
    visits: "Velocity 200 page 3 times", emoji: "🛵",
    townHi: "Hi! First Bike Night", townWhen: "this Thursday, 7 pm", he: "she", him: "her", app: "Instagram", townPlace: "Hinjewadi IT-park cafe", later: "Monday 8:12 pm", base: [1, "20:12"],
    altSlots: ["Thursday 7:00 pm", "Saturday 11:00 am"], dealerFirst: false, onDuty: 26, hello: "Good evening"
  },
  imran: {
    key: "imran", name: "Imran Shaikh", short: "Imran S.", age: 29, city: "Thane", area: "Thane West", pincode: "400601",
    phone: "99XXXXX731", model: "Velocity X310", segment: "Premium Street", price: 265000, tenure: 36, emiTarget: 7320,
    persona: "Upgrader in a hurry", source: "Google search ad lead form",
    creative: "Velocity X310 on the Ghodbunder Road: owner review",
    creator: "ThaneThrottle (local riding creator)", campaign: "VX310_Thane_Search", creativeId: "srch_51920",
    town: "Thane owners' Sunday breakfast ride", townPoster: "Upvan Lake cafe poster",
    rival: "a rival 300cc street bike", dealer: "Thane Ride Point, Thane West", advisor: "Kavita",
    lat: 19.2183, lng: 72.9781, home: [19.2050, 72.9700],
    rideSlot: "Thursday 6:30 pm", rideType: "30-minute ride on the Ghodbunder Road after work",
    bike: "Velocity X310 demo bike #1", nba: "Answer the down-payment question first, offer the Thursday evening ride, bring the finance desk in.",
    opening: "Hi Imran, I saw you were checking the down payment on the Velocity X310. Shall I give you the exact number first?",
    score: 68, tier: "B", evl: 5968,
    watched: "Owner review on YouTube, then a Google search for the X310 price",
    visits: "Velocity X310 page 3 times", emoji: "🏍️",
    townHi: "Hi! Sunday breakfast ride", townWhen: "this Sunday, 7 am", he: "he", him: "him", app: "YouTube", townPlace: "Upvan Lake cafe", later: "Tuesday 1:58 pm", base: [2, "13:58"],
    altSlots: ["Friday 7:00 pm", "Saturday 10:00 am"], dealerFirst: true, onDuty: 13, hello: "Good afternoon"
  }
};

const QUEUE_SEED = [
  { name: "Imran S.", area: "Thane", model: "Velocity X310", tier: "B", evl: 5968, signal: "EMI calculator used", age: 380, key: "imran" },
  { name: "Rahul P.", area: "Malad", model: "TrailX 310", tier: "B", evl: 5968, signal: "EMI calculator used", age: 450 },
  { name: "Priya N.", area: "Bandra", model: "Nomad 250", tier: "B", evl: 5066, signal: "3+ product pages", age: 610 },
  { name: "Vikram R.", area: "Navi Mumbai", model: "Velocity 200", tier: "C", evl: 1006, signal: "Single visit", age: 900 },
  { name: "Asha D.", area: "Powai", model: "RS310", tier: "C", evl: 1006, signal: "Single visit", age: 1300 }
];

const AGENTS = [
  { id: 1, name: "Capture Agent", ph: "SENSE", job: "Catch every signal and join it into one person, with his consent level", gets: "Webhooks from Google and Meta, website events, QR scans, WhatsApp messages", makes: "One profile per phone number, with its source and consent level 1, 2 or 3", human: "Data Protection Officer audits monthly", on: "Rules in the existing CRM; AstraConnect Core from the scale phase" },
  { id: 2, name: "Score-and-Route Agent", ph: "THINK", job: "Decide how hot the lead is and who should call", gets: "Profile, pincode, showroom hours, advisor roster", makes: "Tier A, B or C, a score, the dealer, and the advisor or the Rider Desk", human: "Dealer manager can reassign", on: "A rules table in the pilot; MotoMind AI after Gate 1" },
  { id: 3, name: "Card Agent", ph: "THINK", job: "Write the Pickup Card in plain words", gets: "Profile, score, consent level", makes: "One-screen Card with an opening line and the next best action", human: "The advisor reads it before the call", on: "The only agent with a language model (Agentforce)" },
  { id: 4, name: "Nudge Agent", ph: "ACT", job: "Keep the customer moving without a human chasing him", gets: "New lead, ride request, ride completed, no booking", makes: "WhatsApp reply in 30 seconds, ride confirmation and reminders, follow-up within 24 hours", human: "The advisor sends or edits any follow-up", on: "Salesforce Flow, WhatsApp Business Platform, RideNow 2.0" },
  { id: 5, name: "Learning Agent", ph: "LEARN", job: "Make tomorrow better than today", gets: "Sales from the dealer system", makes: "Coded sale sent to Google and Meta, holdout reports, retrained score", human: "Head of Digital approves budget shifts", on: "Intelligent retargeting and the platforms' conversion APIs" }
];
// Version 1 had nine agents. Old event ids map onto the five merged agents.
const AGENT_MAP = { 1: 1, 2: 1, 3: 2, 4: 2, 5: 4, 6: 3, 7: 4, 8: 4, 9: 5 };

const STEPS = [
  { n: 1, ph: "SENSE", t: "Discovery", d: "Creator video, ad shown only near the dealer" },
  { n: 2, ph: "SENSE", t: "Town hall", d: "QR scan to WhatsApp" },
  { n: 3, ph: "SENSE", t: "Research", d: "EMI twice, one rival compared" },
  { n: 4, ph: "SENSE", t: "Raises hand", d: "OTP and consent level 3" },
  { n: 5, ph: "THINK", t: "Agents decide", d: "Tier, dealer, Card" },
  { n: 6, ph: "ACT", t: "WhatsApp", d: "Reply in 30 seconds" },
  { n: 7, ph: "ACT", t: "Human call", d: "Dealer first, Desk catches, within 15 minutes" },
  { n: 8, ph: "ACT", t: "Test ride", d: "Confirmed bike" },
  { n: 9, ph: "ACT", t: "Follow-up", d: "Within 24 hours" },
  { n: 10, ph: "ACT", t: "Sale", d: "Dealer sells" },
  { n: 11, ph: "LEARN", t: "Learning", d: "Sale back to ad systems" }
];

const DEALERS = [
  { name: "Western Express Motors, Andheri East", lat: 19.1136, lng: 72.8697, city: "Mumbai" },
  { name: "Lakeside Riders, Powai", lat: 19.1176, lng: 72.9060, city: "Mumbai" },
  { name: "Seaface Motors, Bandra", lat: 19.0596, lng: 72.8295, city: "Mumbai" },
  { name: "Thane Ride Point", lat: 19.2183, lng: 72.9781, city: "Mumbai" },
  { name: "Palm Beach Motors, Navi Mumbai", lat: 19.0330, lng: 73.0297, city: "Mumbai" },
  { name: "Hinjewadi Moto Hub, Pune", lat: 18.5913, lng: 73.7389, city: "Pune" },
  { name: "Koregaon Park Riders, Pune", lat: 18.5362, lng: 73.8939, city: "Pune" }
];

// Leads by pincode cluster this week, from AstraMoto's own consented leads (fictitious).
const DEMAND = [
  { area: "Andheri East and Powai", lat: 19.115, lng: 72.885, leads: 412, model: "TrailX 310", r: 2600 },
  { area: "Bandra", lat: 19.06, lng: 72.835, leads: 188, model: "Nomad 250", r: 1500 },
  { area: "Thane West", lat: 19.21, lng: 72.97, leads: 265, model: "Velocity X310", r: 1900 },
  { area: "Hinjewadi", lat: 18.59, lng: 73.74, leads: 344, model: "Velocity 200", r: 2300 },
  { area: "Kharghar", lat: 19.047, lng: 73.07, leads: 140, model: "Velocity 200", r: 1700, unserved: "nearest Premium Pickup dealer is 9 km away" }
];

const CHANNELS = [
  { n: "Organic and owned", v: 5875 }, { n: "CRM and retargeting", v: 14085 }, { n: "Paid search", v: 20569 },
  { n: "Creator", v: 20833 }, { n: "Social media", v: 21481 }, { n: "Display and video", v: 30508 }
];
