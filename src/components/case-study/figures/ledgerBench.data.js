// Ported from Vaibhav8075/Agentic-Ledger: _spoof_reason() and the PUBACK branch in mock_backend/main.py, and
// plan_supplier_payment() in agents/guardrails.py. The figure computes every outcome with these.

// The four Spoof Guard gates, in the order the sandbox checks them; the first that fails is the verdict
export const GATES = [
  { name: "On the gateway", fails: (c) => !c.onGateway, reason: "Transaction does not exist on the Paytm gateway" },
  { name: "This merchant's Soundbox", fails: (c) => !c.sameDevice, reason: "Receipt belongs to a different merchant's Soundbox (replayed)" },
  { name: "Recent", fails: (c) => !c.recent, reason: "Older than the verification window (re-used receipt)" },
  { name: "Amount matches", fails: (c) => c.screenAmount !== c.gatewayAmount, reason: "Screen amount differs from what the gateway received" },
];

export function verifyClaim(claim) {
  const gate = GATES.findIndex((check) => check.fails(claim));
  if (gate >= 0) return { gate, verdict: "SPOOF_DETECTED", lamp: "SPOOF", note: GATES[gate].reason };
  if (!claim.puback) return { gate: -1, verdict: "AUDIO_DELAYED", lamp: "DELAYED", note: "Genuine payment, Soundbox audio delayed by network lag" };
  return { gate: -1, verdict: "VERIFIED_DELIVERED", lamp: "VERIFIED", note: "Genuine payment, Soundbox announced it" };
}

// The demo merchant's ledger at 16:00, from _seed_merchants() in the sandbox
export const LEDGER = { balance: 6000, emi: 3000, advanceLimit: 5000 };

// Deterministic payment plan: never touches the EMI reserve. `floor` is the conservative forecast of tonight's
// sales (0.761 x the LSTM forecast); the README's demo shows it covers the ₹1,500 gap for the ₹4,500 bill.
export function planPayment({ balance, emi, advanceLimit }, due, floor) {
  const safeNow = Math.max(0, balance - emi);
  if (due <= safeNow) return { decision: "PAY_FROM_BALANCE", settle: due, advance: 0, unpaid: 0 };
  const shortfall = due - safeNow;
  if (shortfall <= Math.min(floor, advanceLimit)) return { decision: "PAY_WITH_ADVANCE", settle: safeNow, advance: shortfall, unpaid: 0 };
  return { decision: "PARTIAL_PAYMENT", settle: safeNow, advance: 0, unpaid: due - safeNow };
}

const inr = (value) => `₹${value.toLocaleString("en-IN")}`;

// Payment claims use example values; the ₹4,500 bill is the README's demo. The ₹2,500 and ₹12,000 bills are
// examples whose outcome does not depend on the forecast (they fit the balance, or exceed the advance limit).
export const SCENARIOS = [
  { id: "heard", kind: "claim", name: "Genuine payment", claim: { onGateway: true, sameDevice: true, recent: true, screenAmount: 250, gatewayAmount: 250, puback: true } },
  { id: "delayed", kind: "claim", name: "Audio lost on 2G", claim: { onGateway: true, sameDevice: true, recent: true, screenAmount: 250, gatewayAmount: 250, puback: false } },
  { id: "fake", kind: "claim", name: "Fake payment app", claim: { onGateway: false, sameDevice: true, recent: true, screenAmount: 250, gatewayAmount: 0, puback: false } },
  { id: "edited", kind: "claim", name: "Edited amount", claim: { onGateway: true, sameDevice: true, recent: true, screenAmount: 2500, gatewayAmount: 250, puback: true } },
  { id: "small", kind: "bill", name: "₹2,500 bill", due: 2500 },
  { id: "demo", kind: "bill", name: "₹4,500 bill", due: 4500, floor: 1500 },
  { id: "large", kind: "bill", name: "₹12,000 bill", due: 12000 },
].map((scenario) => {
  if (scenario.kind === "claim") {
    const result = verifyClaim(scenario.claim);
    const label = { VERIFIED: "verified", DELAYED: "audio delayed", SPOOF: "spoof" }[result.lamp];
    return { ...scenario, ...result, readout: `${scenario.name} · ${result.gate >= 0 ? `gate ${result.gate + 1}` : "4 gates"} · ${label}` };
  }
  // A floor of at least the shortfall stands in for the forecast where the outcome needs it (the demo)
  const plan = planPayment(LEDGER, scenario.due, scenario.floor ?? 0);
  const parts = [plan.settle && `${inr(plan.settle)} now`, plan.advance && `${inr(plan.advance)} advance`, plan.unpaid && `${inr(plan.unpaid)} deferred`].filter(Boolean);
  return { ...scenario, plan, readout: `${scenario.name} · ${parts.join(" + ")}` };
});
