// Ported from Vaibhav8075/Audict-audio-Technology: the checks in stream_recording() (backend/routes/recordings.py),
// in the order it runs them, and the expiry job in backend/scheduler/tasks.py.

// Retention in the example settings (RECORDING_EXPIRY_DAYS=7); admins can change it from the settings page
export const RETENTION_DAYS = 7;

// Permission is checked before expiry: an employee may only play their own calls (403), an expired recording is
// gone for everyone (410), and every successful play is written to the access log
export function streamStatus({ role, own, days }) {
  if (role === "agent" && !own) return { code: 403, note: "Access denied" };
  if (days >= RETENTION_DAYS) return { code: 410, note: "Recording has expired and been deleted" };
  return { code: 200, note: "Streams, and the play is logged" };
}

export const SCENARIOS = [
  { id: "admin", name: "Admin plays a call", role: "admin", own: false, days: 2 },
  { id: "own", name: "Agent plays their own call", role: "agent", own: true, days: 2 },
  { id: "other", name: "Agent tries a colleague's call", role: "agent", own: false, days: 2 },
  { id: "hod", name: "HOD reviews and rates", role: "hod", own: false, days: 2 },
  { id: "expired", name: `Day ${RETENTION_DAYS + 1}: audio expired`, role: "admin", own: false, days: RETENTION_DAYS + 1 },
].map((scenario) => {
  const status = streamStatus(scenario);
  return { ...scenario, ...status, readout: `${scenario.name} · ${status.code}` };
});
