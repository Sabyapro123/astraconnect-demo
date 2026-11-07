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
    visits: "TrailX page 4 times", emoji: "🏍️"
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
    visits: "Velocity 200 page 3 times", emoji: "🛵"
  }
};

const QUEUE_SEED = [
  { name: "Imran S.", area: "Thane", model: "Velocity X310", tier: "B", evl: 5968, signal: "EMI calculator used", age: 380 },
  { name: "Priya N.", area: "Bandra", model: "Nomad 250", tier: "B", evl: 5066, signal: "3+ product pages", age: 610 },
  { name: "Vikram R.", area: "Navi Mumbai", model: "Velocity 200", tier: "C", evl: 1006, signal: "Single visit", age: 900 },
  { name: "Asha D.", area: "Powai", model: "RS310", tier: "C", evl: 1006, signal: "Single visit", age: 1300 }
];

const AGENTS = [
  { id: 1, name: "Signal Agent", job: "Catch every signal the moment it arrives", gets: "Webhooks from Google and Meta, website events, QR scans, WhatsApp messages", makes: "A clean event with its source", human: "None needed", on: "AstraConnect Core" },
  { id: 2, name: "Identity and Consent Agent", job: "Join signals into one person and check what he allowed", gets: "Events, phone number, consent ticks", makes: "One profile with consent level 1, 2 or 3", human: "Data Protection Officer audits weekly", on: "AstraConnect Core" },
  { id: 3, name: "Scoring Agent", job: "Decide how hot the lead is", gets: "The profile's behaviour", makes: "Tier A, B or C and a score from 0 to 100", human: "Rider Desk lead can override", on: "Rules first, then MotoMind AI" },
  { id: 4, name: "Routing Agent", job: "Pick the nearest dealer, advisor and demo bike", gets: "Pincode, dealer list, duty roster, bike calendar", makes: "Dealer and advisor name", human: "Dealer manager can reassign", on: "MotoMind and RideNow 2.0" },
  { id: 5, name: "WhatsApp Agent", job: "Acknowledge at once and answer simple questions", gets: "New lead, saved EMI quote", makes: "Confirmation within 30 seconds", human: "Hands over to a human beyond FAQs", on: "WhatsApp Business API" },
  { id: 6, name: "Briefing Agent", job: "Write the Pickup Card in plain words", gets: "Profile, score, consent level", makes: "One-screen Card with opening line and next best action", human: "Advisor reads it before the call", on: "MotoMind with a language model" },
  { id: 7, name: "Ride Agent", job: "Turn a ride request into a ride", gets: "Ride request, bike calendar", makes: "Confirmed slot and reminders", human: "Dealer confirms the bike is ready", on: "RideNow 2.0" },
  { id: 8, name: "Follow-up Agent", job: "Make sure nobody is forgotten", gets: "Ride completed, no booking yet", makes: "Follow-up within 24 hours, alert to advisor", human: "Advisor sends or edits", on: "RideNow 2.0 and CRM" },
  { id: 9, name: "Learning Agent", job: "Make tomorrow better than today", gets: "Sales from the dealer system", makes: "Coded sale sent to Google and Meta, retrained score", human: "Head of Digital approves budget shifts", on: "Intelligent retargeting" }
];

const STEPS = [
  { n: 1, ph: "SENSE", t: "Discovery", d: "Creator video, ad shown only near the dealer" },
  { n: 2, ph: "SENSE", t: "Town hall", d: "QR scan to WhatsApp" },
  { n: 3, ph: "SENSE", t: "Research", d: "EMI twice, one rival compared" },
  { n: 4, ph: "SENSE", t: "Raises hand", d: "OTP and consent level 3" },
  { n: 5, ph: "THINK", t: "Agents decide", d: "Tier, dealer, Card" },
  { n: 6, ph: "ACT", t: "WhatsApp", d: "Reply in 30 seconds" },
  { n: 7, ph: "ACT", t: "Human call", d: "Within 15 minutes" },
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

const DEMAND = [
  { area: "Andheri East and Powai", lat: 19.115, lng: 72.885, change: "+40%", model: "TrailX 310", r: 2600 },
  { area: "Bandra", lat: 19.06, lng: 72.835, change: "+12%", model: "Nomad 250", r: 1500 },
  { area: "Thane", lat: 19.21, lng: 72.97, change: "+18%", model: "Velocity X310", r: 1900 },
  { area: "Hinjewadi", lat: 18.59, lng: 73.74, change: "+33%", model: "Velocity 200", r: 2300 }
];

const CHANNELS = [
  { n: "Organic and owned", v: 5875 }, { n: "CRM and retargeting", v: 14085 }, { n: "Paid search", v: 20569 },
  { n: "Creator", v: 20833 }, { n: "Social media", v: 21481 }, { n: "Display and video", v: 30508 }
];
