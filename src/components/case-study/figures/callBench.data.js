// Ported from main.py in Vaibhav8075/Financial-Technology: detect_intent, detect_sentiment,
// calculate_priority, calculate_risk and extract_numbers. The figure computes every rule outcome with these.

// Intent keywords, checked in this order; the first group with a match wins
export const INTENTS = [
  { label: "Customer Complaint", words: ["complaint", "issue", "problem", "frustrated", "unacceptable"] },
  { label: "Withdrawal Request", words: ["withdraw", "withdrawal", "cash", "blocking"] },
  { label: "Loan Inquiry", words: ["loan", "emi", "interest", "mortgage"] },
  { label: "Deposit Request", words: ["deposit", "add money"] },
];

export function detectIntent(text) {
  const t = text.toLowerCase();
  const comb = INTENTS.findIndex((group) => group.words.some((word) => t.includes(word)));
  return comb >= 0 ? { comb, label: INTENTS[comb].label, confidence: "High" } : { comb: -1, label: "General Inquiry", confidence: "Low" };
}

export function detectSentiment(text) {
  const t = text.toLowerCase();
  if (["angry", "frustrated", "annoyed", "bad", "unacceptable"].some((word) => t.includes(word))) return { label: "Negative", score: -0.7 };
  if (["happy", "satisfied", "thank you"].some((word) => t.includes(word))) return { label: "Positive", score: 0.6 };
  return { label: "Neutral", score: 0 };
}

export const priorityOf = (intent, sentiment) => (sentiment.label === "Negative" || intent.label === "Customer Complaint" ? "High" : "Medium");
export const riskOf = (sentiment) => (sentiment.label === "Negative" ? "High" : "Low");

// Account (9-14 digits) and card (16 digits) numbers are masked to their last four digits
export function maskNumbers(text) {
  const account = text.match(/\b\d{9,14}\b/);
  const card = text.match(/\b\d{16}\b/);
  return { account: account ? `****${account[0].slice(-4)}` : null, card: card ? `**** **** **** ${card[0].slice(-4)}` : null };
}

// Example calls. With the AI reviewer available its verified intent and priority become the final decision
// (what it answers cannot be known in advance, so the figure does not invent it); when it is unavailable,
// empty, unparseable or errors, the rule-based result stands.
export const SCENARIOS = [
  { id: "withdraw", name: "Cash withdrawal", text: "I want to withdraw 20,000 in cash from account 123456789012", ai: true },
  { id: "complaint", name: "Angry complaint", text: "This is unacceptable, my card 4111111111111111 was blocked again", ai: true },
  { id: "loan", name: "Loan question", text: "What is the interest on a home loan? Thank you", ai: true },
  { id: "general", name: "General question", text: "Hello, what are your branch timings on Saturday", ai: true },
  { id: "fallback", name: "AI unavailable", text: "This is unacceptable, my card 4111111111111111 was blocked again", ai: false },
].map((scenario) => {
  const intent = detectIntent(scenario.text);
  const sentiment = detectSentiment(scenario.text);
  const priority = priorityOf(intent, sentiment);
  const risk = riskOf(sentiment);
  const masked = maskNumbers(scenario.text);
  const route = scenario.ai ? "to AI review" : "fallback: rules stand";
  return { ...scenario, intent, sentiment, priority, risk, masked, readout: `${intent.label} · ${priority} · ${route}` };
});
