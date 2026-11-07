# AstraConnect demo

AstraConnect is a clickable prototype of the agentic digital-to-dealer engine proposed by Team ChampsGrid (IIM Mumbai) for the TVS RiDE marketing case "From Scroll to Sale". AstraMoto, every person, every dealer and every figure in this demo is fictitious. The agents are simulated in the browser, and no real customer data is collected.

## What the demo shows

The demo follows one buyer from a creator video to a confirmed sale in eleven steps. The engine works in four stages: SENSE, THINK, ACT and LEARN.

1. SENSE. Rohan in Andheri East watches a creator video and sees an ad that names a dealer near him.
2. SENSE. He scans a QR code at a Ride Circle town hall and lands in WhatsApp.
3. SENSE. He runs the EMI calculator twice and compares one rival bike.
4. SENSE. He raises his hand with an OTP and gives consent level 3.
5. THINK. The Score-and-Route Agent rates him and picks the dealer, and the Card Agent writes a Pickup Card.
6. ACT. The Nudge Agent replies on WhatsApp within 30 seconds.
7. ACT. A human calls within 15 minutes, already knowing his context. In showroom hours the dealer advisor is offered the lead first; after 5 minutes the Rider Desk takes it.
8. ACT. He takes a test ride on a confirmed bike.
9. ACT. The Nudge Agent follows up within 24 hours.
10. ACT. The dealer closes the sale.
11. LEARN. The coded sale goes back to Google and Meta, and the Control Tower updates RoMI.

A second persona, Neha in Hinjewadi, Pune, runs the same flow for a Velocity 200. A third persona, Imran in Thane, asks at 2 pm while the showroom is open: the dealer advisor is busy, misses the 5-minute window, and the Rider Desk catches the lead.

## Tabs

- Live demo: the customer's phone, the Rider Desk console, the agent activity log and the dealer advisor's phone, side by side.
- Journey: all eleven steps with the agent, the data used and the time limit for each.
- AI agents: the five agents (Capture, Score-and-Route, Card, Nudge and Learning) and what each one does. Only the Card Agent uses a language model.
- Routing map: leads by pincode from AstraMoto's own data, dealers, the route from the buyer to the chosen dealer, and one area with no dealer nearby.
- Control Tower: contact speed (target 55% within 15 minutes), advisor context, test rides, cost per extra sale against the ₹15,422 hurdle, the RoMI gauge and the three attribution ledgers.

## How to run it

Open `index.html` in a browser, choose a persona and press "Play journey". You can also click through the steps by hand. The OTP in the demo is 1234.

For a two-screen video, open the page in two tabs. The tabs stay in sync through the browser's BroadcastChannel. You can also open a single panel on its own:

- `index.html?view=customer` shows only the customer's phone.
- `index.html?view=desk` shows only the Rider Desk.
- `index.html?view=advisor` shows only the dealer advisor's phone.
- Add `&p=neha` or `&p=imran` to start with another persona.

One real second equals one demo minute, so the 15-minute call timer runs out in 15 seconds.

## Files

- `index.html` holds the page layout.
- `style.css` holds the styling.
- `data.js` holds the personas, agents, steps, dealers and demand data.
- `app.js` holds the state, the agent simulation, the autoplay script and the rendering.

The map uses Leaflet 1.9.4 and OpenStreetMap tiles, loaded from a CDN. Everything else is plain HTML, CSS and JavaScript with no build step.

## Credits

Built for the TVS RiDE marketing case competition, Round 2, by Team ChampsGrid, IIM Mumbai. Map data comes from OpenStreetMap contributors, and maps are drawn with Leaflet.
