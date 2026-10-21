// Builds the "locked audio, permanent records" figure for the Call Audit Platform case study: the Groq unit that
// transcribes and scores, a records cabinet with a locked audio bay and a permanent file, the role keys, the
// access log, the HOD's rating stamp and the server rack.
// Drawn with the Anatomy isometric kit (src/lib/iso, MIT). Run: node scripts/figures/audit-bench.mjs [--preview f] [--explain f]
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "../../src/lib/iso/iso-kit.mjs";
import * as G from "../../src/lib/iso/lathe.mjs";
import { RETENTION_DAYS, SCENARIOS } from "../../src/components/case-study/figures/auditBench.data.js";
import { STEPS } from "../../src/components/case-study/figures/auditBench.steps.js";
import { inline, kitSource, writeExplainer } from "./explainer.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
const WIDTH = 640;
const HEIGHT = 400;

// Same plate and camera as the other case-study figures, so they share a scale
const PLATE = { x: -150, y: -64, w: 300, d: 128, r: 8 };
const PLATE_H = 12;
const FOOT_H = 5;

// Groq unit, back left: speech to text and the scoring model, with the five DCM rubric lamps
const GROQ = { x: -142, y: -58, w: 50, d: 36, r: 3 };
const GROQ_TOP = 22;
const RUBRIC_Y = [-53, -48, -43, -38, -33];

// Records cabinet, centre: the audio bay on top (a case under a lid, the tour lifts it), the expiry dial, the
// status lamps, the waveform window on the front face and the permanent-file drawer pulled out below it
const CAB = { x: -76, y: -44, w: 72, d: 60, r: 4 };
const CAB_TOP = 30;
const BAY = { x: -70, y: -38, w: 34, d: 28, r: 2 };
const BAY_CASE = CAB_TOP + 7;
const BAY_TOP = BAY_CASE + 2.4;
const BAY_OPEN = k.insetPlan(BAY, 2.4);
const BAY_FLOOR = CAB_TOP + 1;
const REEL = [BAY.x + BAY.w / 2, BAY.y + BAY.d / 2];
const LOCK = [BAY.x + BAY.w / 2, BAY.y + BAY.d];
const DIAL = [-20, -24];
const DIAL_R = 8;
const DIAL_TOP = CAB_TOP + 3;
const STATUS = [
  { code: 200, at: [-62, 6] },
  { code: 403, at: [-52, 6] },
  { code: 410, at: [-42, 6] },
];
const DRAWER = { x: -70, y: CAB.y + CAB.d - 4, w: 46, d: 20, r: 1.5 };
const DRAWER_Z = 4;
const DRAWER_TOP = 13;
const WAVE = { x: 44, y: 6, w: 22, d: 12 };

// Role keys, front left; access log printer, HOD desk and server rack on the right
const RACK = { x: -142, y: 18, w: 52, d: 18, r: 2 };
const RACK_TOP = 8;
const KEYS = [
  { role: "admin", at: [-130, 27] },
  { role: "hod", at: [-116, 27] },
  { role: "agent", at: [-102, 27] },
];
const PRINTER = { x: 6, y: -14, w: 20, d: 16, r: 2 };
const PRINTER_TOP = 12;
const DESK = { x: 34, y: 4, w: 48, d: 34, r: 3 };
const DESK_TOP = 12;
const CARD = { x: 44, y: 12, w: 22, d: 16, r: 0.6 };
const STAMP = [56, 20];
const BOARD = { x: 34, y: -46, w: 54, d: 4, r: 1 };
const BOARD_TOP = 40;
const SERVER = { x: 104, y: -54, w: 34, d: 30, r: 2 };
const LIFTS = { bay: 22 };

const deg = (value) => (value * Math.PI) / 180;
const FACING = 145;
const DAY_FROM = deg(FACING + 40);
const DAY_SPAN = deg(280);
// The knob sits on the key rack: one detent per scenario
const KNOB = [-84, 27];
const KNOB_R = 4.6;
const KNOB_TOP = RACK_TOP + 4;
const DETENTS = Array.from({ length: SCENARIOS.length }, (_, index) => deg(FACING - 70 + (index * 140) / (SCENARIOS.length - 1)));

const P = k.fitProjection(
  [...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0), [BAY.x, BAY.y, BAY_TOP + 26], [BOARD.x + BOARD.w, BOARD.y, BOARD_TOP], [SERVER.x, SERVER.y, 50]],
  WIDTH,
  HEIGHT,
  { pad: 26, azimuth: 55 },
);

const at = (point) => k.iso(point, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const byDepth = (points) => [...points].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));
const onCircle = ([cx, cy], radius, angle) => [cx + Math.sin(angle) * radius, cy - Math.cos(angle) * radius];
const zone = (name, markup, lift) => `<g data-zone="${name}"${lift ? ` data-lift="${lift}"` : ""}>${markup}</g>`;
const scale = G.scaleOf(P);

function screwsOn(plan, inset, z) {
  const points = k.corners(plan, inset);
  return L(points.map(([x, y]) => k.ring(x, y, 1.8, z, P, 14)).join(""), { tone: "lo" }) + D(points.map(([x, y]) => at([x, y, z])), { size: 0.45 });
}
const slots = (count, x0, gap, y, w, d) => L(Array.from({ length: count }, (_, index) => k.pathOf(k.ringOf({ x: x0 + index * gap, y, w, d, r: Math.min(w, d) / 2.2 }, 3), true)).join(""), { tone: "lo" });
const halo = (plan) => `<path class="iso-halo" d="${k.haloOf(k.insetPlan(plan, 3), 0, 2, P)}" style="filter:blur(5px)"/>`;
const box = (plan, z0, z1, tone = "mid", bevel = 0.8) => S(k.slabOf(plan, z0, z1 - z0, P, 3, bevel), { tone });
const lamp = ([x, y], z, cls, key) =>
  [S(k.cylinder(x, y, 3, z, 1, P, 24), { tone: "lo" }), S(k.cylinder(x, y, 2.3, z + 1, 1.4, P, 24), { tone: "hi", crease: "lo" }), `<path class="${cls}" ${key} d="${k.ring(x, y, 2.3, z + 2.4, P, 28)}"/>`].join("");

function plate() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(PLATE, 22))) {
    out.push(S(k.cylinder(x, y, 7, -PLATE_H - FOOT_H, 1.6, P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: "mid" }));
  }
  out.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.6), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: "lo" }));
  out.push(screwsOn(PLATE, 10, 0));
  return out.join("");
}

function groq() {
  const out = [halo(GROQ), S(k.slabOf(GROQ, 0, GROQ_TOP, P, 4, 1), { tone: "mid", inner: L(k.sideSeam(GROQ, 5, P, 4), { tone: "faint" }) })];
  out.push(L(k.planOutline(k.insetPlan(GROQ, 3), GROQ_TOP, P, 4), { tone: "faint" }));
  out.push(`<g transform="${k.sideMatrix([GROQ.x + GROQ.w, GROQ.y + GROQ.d], GROQ_TOP, P, "right")}">${slots(5, 5, 5, 4, 2, 9)}</g>`);
  // Speech-to-text module: a waveform plate
  const stt = { x: GROQ.x + 5, y: GROQ.y + 5, w: 20, d: 26, r: 1 };
  out.push(box(stt, GROQ_TOP, GROQ_TOP + 1.6));
  [3, 6, 9, 5, 8, 4, 7, 3].forEach((height, bar) => {
    out.push(S(k.slabOf({ x: stt.x + 3 + bar * 2, y: stt.y + 13 - height / 2, w: 1, d: height, r: 0.3 }, GROQ_TOP + 1.6, 0.6, P, 1), { tone: "hi", crease: "lo" }));
  });
  // Scoring module: five rubric lamps (caller identification, professionalism, delivery, ticket raising, outcome)
  const llm = { x: GROQ.x + 29, y: GROQ.y + 5, w: 16, d: 26, r: 1 };
  out.push(box(llm, GROQ_TOP, GROQ_TOP + 1.6));
  RUBRIC_Y.forEach((y, index) => {
    out.push(L(k.planOutline({ x: llm.x + 2.4, y: y - 0.9, w: 7, d: 1.8, r: 0.8 }, GROQ_TOP + 1.6, P, 2), { tone: "lo" }));
    out.push(`<circle class="ab-rubric" data-rubric="${index}" cx="${at([llm.x + 12.4, y, GROQ_TOP + 1.6])[0].toFixed(1)}" cy="${at([llm.x + 12.4, y, GROQ_TOP + 1.6])[1].toFixed(1)}" r="${(1 * scale).toFixed(2)}"/>`);
  });
  return out.join("");
}

// Cabinet body, status lamps, expiry dial and waveform window
export const dayNeedle = (days) => {
  const angle = DAY_FROM + (Math.min(days, RETENTION_DAYS + 1) / (RETENTION_DAYS + 1)) * DAY_SPAN;
  return k.lineOnTop(onCircle(DIAL, -1.6, angle), onCircle(DIAL, DIAL_R - 1.8, angle), DIAL_TOP + 0.2, P);
};
function cabinet() {
  const out = [halo(CAB), S(k.slabOf(CAB, 0, CAB_TOP, P, 6, 1.2), { tone: "mid", inner: L(k.sideSeam(CAB, 8, P, 6), { tone: "faint" }) })];
  out.push(L(k.planOutline(k.insetPlan(CAB, 3.4), CAB_TOP, P, 6), { tone: "faint" }));
  out.push(screwsOn(CAB, 5, CAB_TOP));
  // Waveform window on the front face, where WaveSurfer draws the call while it plays
  out.push(`<g transform="${k.sideMatrix([CAB.x, CAB.y + CAB.d], CAB_TOP, P, "left")}">${L(k.pathOf(k.ringOf({ x: WAVE.x - 2, y: WAVE.y - 2, w: WAVE.w + 4, d: WAVE.d + 4, r: 1.2 }, 3), true), { tone: "lo" })}<g data-wave="">${Array.from({ length: 11 }, (_, bar) => `<rect class="ab-bar" x="${(WAVE.x + bar * 2).toFixed(1)}" y="${WAVE.y}" width="1.1" height="${WAVE.d}"/>`).join("")}</g></g>`);
  out.push(`<g transform="${k.sideMatrix([CAB.x + CAB.w, CAB.y + CAB.d], CAB_TOP, P, "right")}">${slots(6, 8, 6, 6, 2, 10)}</g>`);
  for (const { code, at: spot } of STATUS) out.push(lamp(spot, CAB_TOP, "ab-glow", `data-status="${code}"`));
  // Expiry dial: days since upload, with the retention mark
  const [dx, dy] = DIAL;
  out.push(S(k.cylinder(dx, dy, DIAL_R, CAB_TOP, 3, P, 48, 0.6), { tone: "hi", crease: "lo" }));
  out.push(L(k.ring(dx, dy, DIAL_R - 1.2, DIAL_TOP, P, 48), { tone: "lo" }));
  const ticks = k.radialTicks(dx, dy, DIAL_R - 1.4, RETENTION_DAYS + 1, RETENTION_DAYS, DIAL_TOP, [1, 2.2], P, DAY_FROM, DAY_SPAN);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  const mark = DAY_FROM + (RETENTION_DAYS / (RETENTION_DAYS + 1)) * DAY_SPAN;
  out.push(`<path class="iso-line" data-tone="red" d="${k.lineOnTop(onCircle(DIAL, DIAL_R - 4, mark), onCircle(DIAL, DIAL_R - 1.4, mark), DIAL_TOP, P)}" style="stroke-width:1.2"/>`);
  out.push(L(k.ring(dx, dy, 1.2, DIAL_TOP, P, 12), { tone: "mid" }));
  out.push(`<path data-part="days" class="iso-line" data-tone="lit" data-free="start" d="${dayNeedle(2)}" style="stroke-width:1.1"/>`);
  return out.join("");
}

// Audio bay: an open case on the cabinet top holding the recording's reel, under a lid with the lock
function bayCase() {
  const out = [S(k.slabOf(BAY, CAB_TOP, BAY_CASE - CAB_TOP, P, 3, 0.4), { tone: "mid" })];
  const rim = (z) => k.ringOf(BAY_OPEN, 3).map(([x, y]) => at([x, y, z]));
  const { x: x0, y: y0 } = BAY_OPEN;
  const x1 = BAY_OPEN.x + BAY_OPEN.w;
  const y1 = BAY_OPEN.y + BAY_OPEN.d;
  const quad = (points, shade) => `<path class="iso-shade" data-shade="${shade}" d="${k.pathOf(points.map(at), true)}"/>`;
  out.push(`<clipPath id="ab-bay"><path d="${k.pathOf(rim(BAY_CASE), true)}"/></clipPath><g clip-path="url(#ab-bay)">`);
  out.push(`<path class="iso-shade" data-shade="0" d="${k.pathOf(rim(BAY_FLOOR), true)}"/>`);
  out.push(quad([[x0, y0, BAY_CASE], [x1, y0, BAY_CASE], [x1, y0, BAY_FLOOR], [x0, y0, BAY_FLOOR]], 1));
  out.push(quad([[x0, y0, BAY_CASE], [x0, y1, BAY_CASE], [x0, y1, BAY_FLOOR], [x0, y0, BAY_FLOOR]], 2));
  const [rx, ry] = REEL;
  out.push(`<g data-reel="">${S(k.cylinder(rx, ry, 9, BAY_FLOOR, 0.8, P, 40, 0.3), { tone: "hi", crease: "lo" })}${S(k.cylinder(rx, ry, 6.4, BAY_FLOOR + 0.8, 1.6, P, 36), { tone: "lo" })}${S(k.cylinder(rx, ry, 9, BAY_FLOOR + 2.4, 0.8, P, 40, 0.3), { tone: "hi", crease: "lo" })}${L(k.ring(rx, ry, 2, BAY_FLOOR + 3.2, P, 16), { tone: "lo" })}</g>`);
  out.push("</g>");
  out.push(L(k.planOutline(BAY_OPEN, BAY_CASE, P, 3), { tone: "lo" }));
  return out.join("");
}
function bayLid() {
  const out = [S(k.slabOf(BAY, BAY_CASE, BAY_TOP - BAY_CASE, P, 3, 0.6), { tone: "mid" })];
  out.push(L(k.planOutline(k.insetPlan(BAY, 2.4), BAY_TOP, P, 3), { tone: "faint" }));
  // Padlock on the lid's front edge; the live code lifts its shackle when a play is allowed
  const [lx, ly] = LOCK;
  out.push(S(k.slabOf({ x: lx - 3.4, y: ly - 3, w: 6.8, d: 3, r: 0.8 }, BAY_TOP, 4, P, 2, 0.4), { tone: "hi", crease: "lo" }));
  out.push(L(k.ring(lx, ly - 1.5, 0.7, BAY_TOP + 4, P, 10), { tone: "lo" }));
  const shackle = G.arcOf(G.frameOf([lx, ly - 1.5, BAY_TOP + 4], [0, 1, 0], [1, 0, 0], [0, 0, 1]), 0, 2.2, P, { from: 0, to: Math.PI, least: -1 });
  out.push(`<g data-shackle="">${L(shackle, { tone: "hi", free: true })}</g>`);
  return out.join("");
}

// Permanent file: a drawer pulled out of the cabinet's front, holding cards that never expire
function drawer() {
  const out = [S(k.slabOf(DRAWER, DRAWER_Z, 1.4, P, 2), { tone: "lo" })];
  out.push(S(k.slabOf({ x: DRAWER.x, y: DRAWER.y, w: 1.4, d: DRAWER.d, r: 0.3 }, DRAWER_Z + 1.4, DRAWER_TOP - DRAWER_Z - 1.4, P, 1), { tone: "mid" }));
  out.push(S(k.slabOf({ x: DRAWER.x, y: DRAWER.y, w: DRAWER.w, d: 1.4, r: 0.3 }, DRAWER_Z + 1.4, DRAWER_TOP - DRAWER_Z - 1.4, P, 1), { tone: "mid" }));
  // Index cards standing in the drawer: transcript, AI analysis, self-evaluation, HOD rating
  for (let index = 0; index < 4; index++) {
    const x = DRAWER.x + 6 + index * 9;
    out.push(S(k.slabOf({ x, y: DRAWER.y + 3, w: 1, d: DRAWER.d - 6, r: 0.2 }, DRAWER_Z + 1.4, 8 - index * 0.6, P, 1), { tone: "hi", crease: "lo" }));
  }
  out.push(S(k.slabOf({ x: DRAWER.x + DRAWER.w - 1.4, y: DRAWER.y, w: 1.4, d: DRAWER.d, r: 0.3 }, DRAWER_Z + 1.4, DRAWER_TOP - DRAWER_Z - 1.4, P, 1), { tone: "mid" }));
  const front = { x: DRAWER.x - 1, y: DRAWER.y + DRAWER.d - 1.6, w: DRAWER.w + 2, d: 1.6, r: 0.4 };
  out.push(S(k.slabOf(front, DRAWER_Z, DRAWER_TOP - DRAWER_Z + 1, P, 2, 0.4), { tone: "mid" }));
  out.push(`<g transform="${k.sideMatrix([front.x, front.y + front.d], DRAWER_TOP + 1, P, "left")}">${L(k.pathOf(k.ringOf({ x: 18, y: 3, w: 12, d: 3, r: 1.4 }, 3), true), { tone: "lo" })}</g>`);
  return out.join("");
}

// Role keys on a rack, with the scenario knob; the live code lights the key in use
export const pointerAt = (angle) => k.lineOnTop(onCircle(KNOB, -1.8, angle), onCircle(KNOB, KNOB_R - 0.3, angle), KNOB_TOP, P);
function rack() {
  const out = [halo(RACK), S(k.slabOf(RACK, 0, RACK_TOP, P, 3, 0.6), { tone: "mid" })];
  out.push(L(k.planOutline(k.insetPlan(RACK, 2.4), RACK_TOP, P, 3), { tone: "faint" }));
  // Three key heads (round for admin, square for HOD, a hexagon for the agent) on short posts
  KEYS.forEach(({ role, at: [x, y] }, index) => {
    out.push(S(k.cylinder(x, y, 1, RACK_TOP, 3, P, 12), { tone: "mid" }));
    const head = index === 0 ? k.circleRing(x, y, 3.2, 28) : index === 1 ? k.ringOf({ x: x - 3, y: y - 3, w: 6, d: 6, r: 0.8 }, 2) : Array.from({ length: 6 }, (_, side) => onCircle([x, y], 3.4, (side * Math.PI) / 3));
    out.push(`<g class="ab-key" data-key="${role}">${S(k.extrude(head, RACK_TOP + 3, 1.6, P), { tone: "hi", crease: "lo" })}${L(k.ring(x, y, 1, RACK_TOP + 4.6, P, 12), { tone: "lo" })}</g>`);
  });
  const [kx, ky] = KNOB;
  DETENTS.forEach((angle) => out.push(L(k.lineOnTop(onCircle(KNOB, KNOB_R + 1.4, angle), onCircle(KNOB, KNOB_R + 3, angle), RACK_TOP, P), { tone: "mid" })));
  out.push(S(k.cylinder(kx, ky, KNOB_R + 0.8, RACK_TOP, 1, P, 28), { tone: "lo" }));
  out.push(S(k.cylinder(kx, ky, KNOB_R, RACK_TOP + 1, KNOB_TOP - RACK_TOP - 1, P, 28), { tone: "mid" }));
  out.push(L(k.knurl(kx, ky, KNOB_R, RACK_TOP + 1, KNOB_TOP, 30, P), { tone: "lo" }));
  out.push(`<path data-part="pointer" class="iso-line" data-tone="hi" data-free="start" d="${pointerAt(DETENTS[0])}" style="stroke-width:1"/>`);
  return out.join("");
}

// Access log: a small printer whose paper gains a line for every play
function printer() {
  const out = [halo(PRINTER), box(PRINTER, 0, PRINTER_TOP, "mid", 0.8)];
  out.push(L(k.planOutline({ x: PRINTER.x + 3, y: PRINTER.y + 2.4, w: PRINTER.w - 6, d: 2, r: 0.9 }, PRINTER_TOP, P, 3), { tone: "lo" }));
  const paper = { x: PRINTER.x + 4, y: PRINTER.y - 9, w: PRINTER.w - 8, d: 12, r: 0.3 };
  out.push(S(k.slabOf(paper, PRINTER_TOP, 0.3, P, 1), { tone: "hi", crease: "lo" }));
  out.push(`<g data-log="">${Array.from({ length: 5 }, (_, line) => `<path class="iso-line ab-log" data-tone="lo" data-line="${line}" data-free="both" d="${k.lineOnTop([paper.x + 1.6, paper.y + paper.d - 2 - line * 2], [paper.x + paper.w - 2 - (line % 2) * 2, paper.y + paper.d - 2 - line * 2], PRINTER_TOP + 0.3, P)}"/>`).join("")}</g>`);
  out.push(D([at([PRINTER.x + PRINTER.w - 3, PRINTER.y + PRINTER.d - 3, PRINTER_TOP])], { size: 0.8, tone: "hi", pulse: true }));
  return out.join("");
}

// HOD desk: a QA card and the rating stamp, which comes down when the HOD rates the call
function desk() {
  const out = [halo(DESK), box(DESK, 0, DESK_TOP, "mid", 1)];
  out.push(L(k.planOutline(k.insetPlan(DESK, 3), DESK_TOP, P, 3), { tone: "faint" }));
  out.push(S(k.slabOf(CARD, DESK_TOP, 0.4, P, 1), { tone: "hi", crease: "lo" }));
  [0, 1, 2].forEach((line) => out.push(L(k.lineOnTop([CARD.x + 2, CARD.y + 3 + line * 2.6], [CARD.x + 14 - line * 3, CARD.y + 3 + line * 2.6], DESK_TOP + 0.4, P), { tone: "lo", free: true })));
  out.push(`<path class="ab-mark" data-part="mark" d="${k.ring(STAMP[0], STAMP[1], 3, DESK_TOP + 0.45, P, 24)}"/>`);
  return out.join("");
}
const STAMP_UP = 10;
const stampTool = () => {
  const [sx, sy] = STAMP;
  return [
    S(k.cylinder(sx, sy, 3.6, DESK_TOP + 0.4, 1.6, P, 28), { tone: "lo" }),
    S(k.cylinder(sx, sy, 1.4, DESK_TOP + 2, 6, P, 16), { tone: "mid" }),
    S(k.cylinder(sx, sy, 2.6, DESK_TOP + 8, 3, P, 24, 0.4), { tone: "hi", crease: "lo" }),
  ].join("");
};

// Scorecard board behind the desk: agents' averages as bars
function board() {
  const out = [S(k.slabOf(BOARD, 0, BOARD_TOP, P, 2, 0.6), { tone: "mid" })];
  for (const x of [BOARD.x + 6, BOARD.x + BOARD.w - 6]) out.push(S(k.slabOf({ x: x - 3, y: BOARD.y - 4, w: 6, d: 12, r: 1 }, 0, 2, P, 2), { tone: "lo" }));
  const face = BOARD.y + BOARD.d;
  out.push(`<g transform="${k.sideMatrix([BOARD.x, face], BOARD_TOP, P, "left")}">${L(k.pathOf(k.ringOf({ x: 4, y: 4, w: BOARD.w - 8, d: 30, r: 1 }, 3), true), { tone: "lo" })}${[22, 30, 16, 26, 19].map((length, bar) => `<rect class="ab-score" x="8" y="${(8 + bar * 5).toFixed(1)}" width="${length}" height="2.6" rx="0.6"/>`).join("")}</g>`);
  return out.join("");
}

// Server rack, back right: Nginx, FastAPI under systemd and PostgreSQL, with the SQLite cartridge it replaced
function server() {
  const out = [halo(SERVER)];
  [[0, 14], [14, 28], [28, 44]].forEach(([z0, z1], unit) => {
    out.push(S(k.slabOf(SERVER, z0, z1 - z0, P, 2, 0.6), { tone: "mid", inner: L(k.sideSeam(SERVER, z0 + 0.6, P, 2), { tone: "faint" }) }));
    out.push(`<g transform="${k.sideMatrix([SERVER.x, SERVER.y + SERVER.d], z1, P, "left")}">${slots(4, 4, 4, 3, 2, z1 - z0 - 6)}</g>`);
    out.push(D(Array.from({ length: 3 }, (_, dot) => at([SERVER.x + SERVER.w - 4 - dot * 2.4, SERVER.y + SERVER.d, z1 - 3])), { size: 0.6, tone: unit === 2 ? "hi" : "mid", pulse: unit === 2 }));
  });
  out.push(L(k.planOutline(k.insetPlan(SERVER, 2), 44, P, 2), { tone: "faint" }));
  const cart = { x: SERVER.x + 6, y: SERVER.y + SERVER.d + 6, w: 10, d: 7, r: 1 };
  out.push(S(k.slabOf(cart, 0, 2.6, P, 2, 0.4), { tone: "lo", crease: "faint" }));
  out.push(L(k.planOutline(k.insetPlan(cart, 1.4), 2.6, P, 2), { tone: "faint" }));
  return out.join("");
}

// Data lines: the Groq unit's transcript and scores into the cabinet, the cabinet's records into the database
function cable(from, to, rise, drop) {
  const c1 = [from[0], from[1], from[2] + rise];
  const c2 = [to[0], to[1], to[2] + drop];
  const points = Array.from({ length: 41 }, (_, index) => {
    const t = index / 40;
    const u = 1 - t;
    return [0, 1, 2].map((axis) => u * u * u * from[axis] + 3 * u * u * t * c1[axis] + 3 * u * t * t * c2[axis] + t * t * t * to[axis]);
  }).map(at);
  return k.wireSvg(points[0], points[40], { via: points.slice(1, 40), tone: "lo", size: 1 }) + L(k.pathOf(points), { tone: "mid", flow: true });
}
const socket = ([x, y], z) => L(k.ring(x, y, 3.2, z, P, 20), { tone: "lo" }) + S(k.cylinder(x, y, 2.3, z, 2.6, P, 18), { tone: "mid" });

const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label:
    "A call-audit bench. A Groq unit with a speech-to-text plate and five rubric lamps feeds a records cabinet. On the cabinet sit a locked audio bay holding the recording's reel, an expiry dial with the retention mark, and lamps for 200, 403 and 410; a waveform window is on its front and a drawer of permanent record cards is pulled out below. A rack holds keys for admin, HOD and agent; an access-log printer, an HOD desk with a rating stamp, a scorecard board and a server rack stand to the right.",
  body: [
    zone("base", plate()),
    zone("groq", groq() + socket([GROQ.x + GROQ.w - 5, GROQ.y + GROQ.d - 4], GROQ_TOP)),
    zone("server", server() + socket([SERVER.x + 5, SERVER.y + 5], 44)),
    zone("board", board()),
    zone("cabinet", cabinet()),
    zone("bay", bayCase()),
    zone("bay", bayLid(), "bay"),
    zone("lines", cable([GROQ.x + GROQ.w - 5, GROQ.y + GROQ.d - 4, GROQ_TOP + 2.6], [CAB.x + 6, CAB.y + 6, CAB_TOP], 14, 16) + cable([CAB.x + CAB.w - 6, CAB.y + 6, CAB_TOP], [SERVER.x + 5, SERVER.y + 5, 46.6], 14, 12)),
    zone("printer", printer()),
    zone("drawer", drawer()),
    zone("desk", desk()),
    zone("desk", `<g data-part="stamp">${stampTool()}</g>`),
    zone("keys", rack()),
  ],
});

const GEOMETRY = { P, scale, knob: KNOB, knobR: KNOB_R, knobTop: KNOB_TOP, detents: DETENTS, stampUp: STAMP_UP, retention: RETENTION_DAYS, wave: { y: WAVE.y, d: WAVE.d }, lifts: LIFTS, cables: [] };
// Day needle paths for the live code, which cannot import the build helpers
GEOMETRY.days = Object.fromEntries([...new Set(SCENARIOS.map((scenario) => scenario.days))].map((days) => [days, dayNeedle(days)]));

writeFileSync(
  join(ROOT, "src/components/case-study/figures/auditBench.generated.js"),
  `// Generated by scripts/figures/audit-bench.mjs. Do not edit by hand.\nexport const svg = ${JSON.stringify(svg)};\nexport const geometry = ${JSON.stringify(GEOMETRY)};\n`,
);
console.log(`svg ${(svg.length / 1024).toFixed(1)} KB`);
for (const scenario of SCENARIOS) console.log(`  ${scenario.readout}`);

const LEGEND = [
  { mark: "lit", label: "Key: the role trying to play the call" },
  { mark: "red", label: "Dial: days since upload; red is the retention limit" },
  { mark: "raised", label: "Drawer: records kept permanently" },
];
const card = (hint) =>
  k.plateHtml({
    fig: "Fig 1",
    title: "Locked audio, permanent records",
    hint,
    readout: SCENARIOS[0].readout,
    keys: LEGEND,
    body: `<div class="iso-stage" tabindex="0" role="slider" aria-label="Scenario" aria-valuemin="1" aria-valuemax="${SCENARIOS.length}" aria-valuenow="1">${svg}</div>`,
  });
const data = `const geometry = ${JSON.stringify(GEOMETRY)};\nconst STEPS = ${JSON.stringify(STEPS)};`;
const CSS = "auditBench.css";
const previewAt = process.argv.indexOf("--preview");
if (previewAt > 0) {
  const script = [kitSource(), data, inline("auditBench.data.js"), inline("auditBench.live.js"), `mountAuditBench(document.querySelector(".iso-figure"), { geometry, scenarios: SCENARIOS, kit: { lineOnTop, translateAlong } });`].join("\n");
  writeFileSync(process.argv[previewAt + 1], k.pageHtml({ title: "Audit bench", theme: "dark", body: `<style>${inline(CSS)}</style>${card("Hover or use arrow keys")}`, script, width: 720 }));
  console.log("preview", process.argv[previewAt + 1]);
}
const explainAt = process.argv.indexOf("--explain");
if (explainAt > 0) {
  writeExplainer({
    file: process.argv[explainAt + 1],
    title: "Call Audit Platform explained",
    heading: "How the Call Audit Platform works",
    intro: "A guided walk round a drawn call-audit bench. It plays by itself; use Back and Next, the dots, or the arrow keys to go at your own pace. Every access result follows the platform's own streaming checks.",
    card: `<style>${inline(CSS)}</style>` + card("Click it, then arrow keys change the scenario"),
    note: "Sources: backend/routes/recordings.py (access checks), backend/scheduler/tasks.py (expiry), backend/groq_service.py (models, rubrics), backend/models.py, and the README.",
    data,
    modules: ["auditBench.data.js", "auditBench.live.js", "tour.js"],
    boot: `const figure = document.querySelector(".iso-figure");
const bench = mountAuditBench(figure, { geometry, scenarios: SCENARIOS, kit, tour: false, hover: false });
const hooks = { step: (step) => step.scenario !== undefined && bench.choose(step.scenario) };
mountTour({ figure, panel: document.querySelector(".tour-panel"), geometry, steps: STEPS, kit, keys: document, hooks }).start(0);`,
  });
  console.log("explain", process.argv[explainAt + 1]);
}
