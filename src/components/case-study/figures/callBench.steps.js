// Guided tour of the call bench. `zones` light those parts (none = the whole line), `open` lifts Whisper's lid,
// `scenario` sets the call. Rules, masking, AI verification, auth and rate limits follow main.py; the Whisper
// facts follow its published model design.
const LINE = ["belt", "combs", "gauge", "stamp", "ai", "gate", "results"];

export const STEPS = [
  {
    title: "What this line is about",
    zones: [],
    scenario: 0,
    text: "Banks handle thousands of calls a day, and what each caller wants, how urgent it is and how risky it is stays locked in the audio. This project turns a recorded call into a structured result: a keyword rule engine decides first, and an AI reviewer then checks and explains the decision.",
  },
  {
    title: "The intake",
    zones: ["intake"],
    text: "A call is uploaded from the React dashboard to a FastAPI backend. The lock stands for its API key: every request must carry a valid X-API-Key header. The window shows the rate limit, 10 uploads a minute per IP address (and 30 result checks a minute).",
  },
  {
    title: "Whisper transcribes",
    zones: ["whisper", "intake"],
    text: "The call's audio runs into OpenAI's Whisper speech-to-text model (the base size), which writes out the full transcript. The request returns once the call has been transcribed and analysed; the dashboard then fetches the result by its ID.",
  },
  {
    title: "Inside Whisper",
    zones: ["whisper"],
    open: "whisper",
    text: "Whisper reads audio in 30-second windows, turns each into a log-Mel spectrogram (the grid of dots), and passes it through a Transformer encoder and decoder that writes the text. The base model has 6 layers in each and about 74 million parameters.",
  },
  {
    title: "Four keyword combs",
    zones: ["belt", "combs"],
    text: "The transcript runs under four combs, checked in order: complaint words (complaint, issue, problem, frustrated, unacceptable), then withdrawal (withdraw, cash, blocking), loan (loan, EMI, interest, mortgage) and deposit (deposit, add money). The first comb whose words appear drops and decides the intent; if none matches, it is a general inquiry, marked low confidence.",
  },
  {
    title: "Sentiment, priority and risk",
    zones: ["gauge", "results"],
    text: "The gauge reads sentiment from words like angry, frustrated or unacceptable (negative) and happy, satisfied or thank you (positive). A negative call, or any complaint, gets High priority; everything else is Medium. Risk is High exactly when the sentiment is negative.",
  },
  {
    title: "Masking numbers",
    zones: ["stamp", "belt"],
    text: "The stamp comes down on account numbers (9 to 14 digits) and card numbers (16 digits), which are stored only as their last four digits. Phone numbers and the full transcript are kept as they are, so masking those too is a natural next step.",
  },
  {
    title: "The AI reviewer",
    zones: ["ai", "gate"],
    text: "A Backboard assistant running GPT-4o reads the transcript together with the rule results and returns a verified intent, a verified priority and its reasoning. When it answers with both fields, its verified intent and priority become the final decision.",
  },
  {
    title: "A cash withdrawal",
    zones: LINE,
    scenario: 0,
    text: "\"I want to withdraw 20,000 in cash from account 123456789012\": the withdrawal comb drops, the sentiment is neutral, so priority is Medium and risk Low, and the account number is masked to ****9012 before the AI reviews it.",
  },
  {
    title: "An angry complaint",
    zones: LINE,
    scenario: 1,
    text: "\"This is unacceptable, my card was blocked again\": the complaint comb is checked first and drops, \"unacceptable\" makes the sentiment negative, so priority and risk are both High, and the card number is masked to its last four digits.",
  },
  {
    title: "A loan question",
    zones: LINE,
    scenario: 2,
    text: "\"What is the interest on a home loan? Thank you\": the loan comb drops and \"thank you\" reads as positive, so the call is a Medium-priority, low-risk loan inquiry.",
  },
  {
    title: "A general question",
    zones: LINE,
    scenario: 3,
    text: "\"What are your branch timings on Saturday\": no comb matches, so the rules call it a general inquiry with low confidence, which is exactly where the AI reviewer's second look helps most.",
  },
  {
    title: "When the AI is unavailable",
    zones: ["ai", "gate", "results"],
    scenario: 4,
    text: "If the AI service is not configured, returns nothing, returns something that is not valid JSON, or errors, the arm parks, the gate lets the rule result through, and the call still gets a complete, explainable answer. The rule-based result is also stored next to the AI's for every call, so each decision can be audited.",
  },
];
