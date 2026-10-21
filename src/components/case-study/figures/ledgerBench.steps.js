// Guided tour of the ledger bench. `zones` light those parts (none = the whole bench), `open` lifts the EMI
// reserve's lid, `scenario` sets the event. Checks and plans follow mock_backend/main.py and agents/guardrails.py;
// forecaster numbers follow models/metrics.json.
const CLAIM = ["counter", "lines", "supervisor", "rail"];
const BILL = ["supervisor", "ledger", "lines", "drawer", "crate"];

export const STEPS = [
  {
    title: "What this bench is about",
    zones: [],
    scenario: 0,
    text: "A multi-agent assistant for small Paytm merchants, built for the Phinite × Paytm Agent Labs Buildathon. It handles two moments where trust in digital payments breaks: a customer says they have paid but the Soundbox stays silent, and a supplier wants paying at 4 PM while tomorrow's loan EMI still has to be covered.",
  },
  {
    title: "The counter",
    zones: ["counter"],
    scenario: 0,
    text: "The Soundbox announces each payment the merchant receives. The customer's phone shows the amount they claim to have paid. On a weak 2G link a genuine announcement can arrive seconds late, and fraudsters use exactly that moment with fake payment apps, old receipts, or a real receipt with the amount edited.",
  },
  {
    title: "One supervisor",
    zones: ["supervisor", "lines"],
    text: "Every event enters through one supervisor: payment claims, supplier bills and settlement taps. It routes each one to the right worker and records every outcome for an audit trail. The knob shows which kind of event is being handled.",
  },
  {
    title: "Spoof Guard's four gates",
    zones: ["rail"],
    scenario: 0,
    text: "A claim is genuine only if it passes four checks in order: the payment exists on the gateway, it went to this Soundbox's merchant, it is recent, and the amount matches the customer's screen. The token stops at the first gate that fails.",
  },
  {
    title: "A genuine payment",
    zones: CLAIM,
    scenario: 0,
    text: "All four gates lift and the Soundbox confirms it heard the payment (an MQTT acknowledgement, a PUBACK, came back). Verdict: verified, and the Soundbox announces it.",
  },
  {
    title: "Audio lost on 2G",
    zones: CLAIM,
    scenario: 1,
    text: "The payment passes all four gates, but no PUBACK came back over the weak link, so the Soundbox never spoke. Instead of letting the merchant wonder, the agent sends \"payment received, audio delayed\".",
  },
  {
    title: "A fake payment app",
    zones: CLAIM,
    scenario: 2,
    text: "The screen looks right, but the transaction does not exist on the gateway, so the first gate stays shut. The merchant gets a fraud alert: do not hand over the goods.",
  },
  {
    title: "An edited amount",
    zones: CLAIM,
    scenario: 3,
    text: "A real receipt, but the screen shows ₹2,500 while the gateway received ₹250. The first three gates lift and the fourth, amount matches, stays shut.",
  },
  {
    title: "The Supplier Ledger",
    zones: ["ledger", "supervisor", "lines"],
    scenario: 5,
    text: "A supplier's bill arrives on WhatsApp. The press masks card, Aadhaar, phone, bank account, PAN, IFSC and UPI numbers (the black bars), then extracts the total, vendor, invoice number, deadline and quantities. Any amount it extracts that is not in the message text is rejected.",
  },
  {
    title: "The drawer and its locked reserve",
    zones: ["drawer"],
    open: "vault",
    scenario: 5,
    text: "At 4 PM the merchant has ₹6,000 of today's collections still unsettled, and a ₹3,000 loan EMI comes out of the next morning's settlement. That ₹3,000 sits in the locked compartment and is never touched, so only ₹3,000 can be paid now. Each stack stands for ₹500.",
  },
  {
    title: "A bill that fits",
    zones: BILL,
    scenario: 4,
    text: "A ₹2,500 bill fits inside the ₹3,000 above the reserve, so it is paid from the balance and the EMI stays covered.",
  },
  {
    title: "The ₹4,500 bill",
    zones: BILL,
    scenario: 5,
    text: "The project's demo: ₹4,500 is more than the ₹3,000 that is safe. The plan pays ₹3,000 now and covers the ₹1,500 gap with a short advance, allowed only because the gap fits both the pre-approved limit (₹5,000) and the conservative forecast of tonight's sales, which repay it in the next settlement batch.",
  },
  {
    title: "A bill too big to cover",
    zones: BILL,
    scenario: 6,
    text: "For ₹12,000 the gap is ₹9,000, more than the ₹5,000 advance limit, so no advance is offered. The plan pays the safe ₹3,000 and tells the merchant how much to defer.",
  },
  {
    title: "The forecast behind the advance",
    zones: ["drawer"],
    scenario: 5,
    text: "A PyTorch LSTM predicts sales from 4 PM to midnight from the last three days' morning and evening sales and today's morning, scaled by the merchant's recent daily average. The plan uses a conservative floor, 0.761 × the forecast. On held-out test days the LSTM's error was 16.9% (MAPE) against 20.2% for the best simple baseline, and actual sales met the floor on 88.7% of days. The training data is synthetic, with a simulated morning/evening split, so this shows the pipeline works, not how real merchants would fare.",
  },
  {
    title: "Checked twice, paid once",
    zones: ["drawer", "crate"],
    scenario: 5,
    text: "Before anything is paid, an independent checker recomputes the plan and turns its key only if it agrees and never eats into the reserve. Each payout is signed with HMAC-SHA256 over the exact bytes and a timestamp, carries one order ID and idempotency key on every retry, and after a bank timeout the system asks for the order's status before resending, so the supplier is paid exactly once.",
  },
];
