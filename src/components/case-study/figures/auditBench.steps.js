// Guided tour of the audit bench. `zones` light those parts (none = the whole bench), `open` lifts the audio
// bay's lid, `scenario` sets who is trying to play which call. Access and expiry follow recordings.py and
// scheduler/tasks.py; the AI facts follow groq_service.py.
const ACCESS = ["keys", "bay", "cabinet", "printer"];

export const STEPS = [
  {
    title: "What this bench is about",
    zones: [],
    scenario: 0,
    text: "Built during a software engineering internship at DCM Shriram and running on the company's Ubuntu server: one place for the QA and customer-service teams to audit calls, score them, collect agents' self-evaluations and HOD ratings, and keep a permanent feedback trail, while keeping the recordings themselves private.",
  },
  {
    title: "The AI first pass",
    zones: ["groq", "lines"],
    text: "When an admin uploads a recording, Groq's whisper-large-v3 transcribes it and llama-3.3-70b-versatile scores it: call quality from 0 to 100 against DCM's five rubrics (caller identification, professionalism, delivery, ticket raising and outcome, the five lamps), customer satisfaction from 0 to 100, sentiment from -1 to 1, plus topics, keywords, issues and coaching suggestions.",
  },
  {
    title: "The records cabinet",
    zones: ["cabinet", "bay", "drawer"],
    text: "The cabinet keeps two very different things. The audio itself sits in a locked bay on top. Everything written about the call (the transcript, the AI analysis, the agent's self-evaluation and the HOD's rating) goes in the drawer below, which is never emptied. Calls are also tagged with the ISO week they were uploaded, for weekly reports.",
  },
  {
    title: "Inside the audio bay",
    zones: ["bay"],
    open: "bay",
    scenario: 0,
    text: "Lifting the lid shows the recording's reel. Its path is never handed to the browser: the player asks the backend to stream it, the backend checks who is asking first, and the browser receives the audio as an authenticated blob that WaveSurfer draws as a waveform.",
  },
  {
    title: "Three roles, three keys",
    zones: ["keys"],
    text: "Everyone signs in and carries a JWT; passwords are stored as bcrypt hashes. Admins create audits and design the self-evaluation form (yes/no, 1-5 ratings and free text), agents fill it in, and HODs add a compliance rating. The lit key is the role trying to play the call.",
  },
  {
    title: "An admin plays a call",
    zones: ACCESS,
    scenario: 0,
    text: "Admins can play any call. The lock opens, the waveform moves, the 200 lamp lights, and the play is written to the access log with the user and their address.",
  },
  {
    title: "An agent plays their own call",
    zones: ACCESS,
    scenario: 1,
    text: "An agent can always hear their own calls, so the lock opens for them too and the play is logged.",
  },
  {
    title: "An agent tries a colleague's call",
    zones: ACCESS,
    scenario: 2,
    text: "Agents can see that a colleague's audit exists, but the backend refuses to stream someone else's audio: 403, access denied. The lock stays shut and nothing is logged. Permission is checked before anything else.",
  },
  {
    title: "The HOD rates the call",
    zones: ["keys", "bay", "desk", "board"],
    scenario: 3,
    text: "HODs can play any call. After listening and reading the agent's self-evaluation, the HOD stamps a compliance rating with comments. Ratings and self-evaluations roll up into scorecards and the leaderboard on the board.",
  },
  {
    title: "Audio that does not pile up",
    zones: ["cabinet", "bay", "drawer"],
    scenario: 4,
    text: "Each recording expires after a number of days that admins can change (7 in the example settings, the red mark on the dial). A scheduler job runs every day at 2 AM and deletes expired audio from disk, and a weekly Sunday job removes stray files. After that, any play gets 410, recording expired, but the drawer keeps every card.",
  },
  {
    title: "From SQLite to production",
    zones: ["server", "lines"],
    text: "It started on SQLite (the cartridge in front of the rack). A migration script copied every table into PostgreSQL and re-synced the sequences. In production, Nginx serves the React build and proxies the API to FastAPI, which runs under Uvicorn as a systemd service, with PostgreSQL behind it.",
  },
];
