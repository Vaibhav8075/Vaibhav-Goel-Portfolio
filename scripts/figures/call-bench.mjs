// Builds the "rules first, AI review" figure for the Banking Call Intelligence case study: a call-analysis line
// from the API intake and the Whisper transcriber, along a belt under four keyword combs, a sentiment gauge and
// the masking stamp, to the AI reviewer, the fallback gate and the results cabinet.
// Drawn with the Anatomy isometric kit (src/lib/iso, MIT). Run: node scripts/figures/call-bench.mjs [--preview f] [--explain f]
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "../../src/lib/iso/iso-kit.mjs";
import * as G from "../../src/lib/iso/lathe.mjs";
import { SCENARIOS } from "../../src/components/case-study/figures/callBench.data.js";
import { STEPS } from "../../src/components/case-study/figures/callBench.steps.js";
import { inline, kitSource, writeExplainer } from "./explainer.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
const WIDTH = 640;
const HEIGHT = 400;

// Same plate and camera as the other case-study figures, so they share a scale
const PLATE = { x: -150, y: -64, w: 300, d: 128, r: 8 };
const PLATE_H = 12;
const FOOT_H = 5;

// API intake, back left: an API-key lock, the rate-limit window and the tape reel of the uploaded call
const INTAKE = { x: -142, y: -54, w: 38, d: 38, r: 3 };
const INTAKE_TOP = 18;
const REEL = [-124, -37];
const REEL_R = 11;
const LOCK = [-110, -23];

// Whisper transcriber: a case under a lid; inside, the model the tour lifts the lid to show
const WH = { x: -96, y: -58, w: 38, d: 36, r: 3 };
const WH_Z = 3;
const WH_CASE = 13;
const WH_TOP = 24;
const WH_OPEN = k.insetPlan(WH, 2.6);
const WH_FLOOR = 5.5;

// The belt, front centre: the transcript strip runs left to right under the combs, gauge and stamp
const BELT = { x: -104, y: 6, w: 162, d: 20, r: 2 };
const BELT_TOP = 6;
const STRIP = { x: -100, y: 10, w: 154, d: 12, r: 0.4 };
const STRIP_TOP = BELT_TOP + 0.4;
const COMB_X = [-80, -58, -36, -14];
const COMB_RAISED = 9;
const GAUGE = [6, -6];
const GAUGE_R = 6.5;
const GAUGE_TOP = 18;
const STAMP_X = 28;
const STAMP_UP = 12;

// Decision end, right: the AI reviewer arm, the fallback gate and the results cabinet with its lamps, display
// and scenario knob
const ARM_BASE = [66, -24];
const GATE = [72, 2];
const RC = { x: 84, y: -46, w: 58, d: 56, r: 4 };
const RC_TOP = 20;
const KNOB = [128, -30];
const KNOB_R = 5.5;
const KNOB_TOP = RC_TOP + 4.5;
const LAMPS = [
  { group: "priority", label: "High", at: [96, -32] },
  { group: "priority", label: "Medium", at: [104, -32] },
  { group: "risk", label: "High", at: [96, -20] },
  { group: "risk", label: "Low", at: [104, -20] },
];
const LIFTS = { whisper: 34 };

const deg = (value) => (value * Math.PI) / 180;
const FACING = 145;
const DETENTS = Array.from({ length: SCENARIOS.length }, (_, index) => deg(FACING - 75 + (index * 150) / (SCENARIOS.length - 1)));
// Sentiment gauge: negative, neutral, positive across the top of its face
const SENTIMENT_ANGLE = { Negative: deg(FACING + 120), Neutral: deg(FACING + 180), Positive: deg(FACING + 240) };

const P = k.fitProjection(
  [...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0), [WH.x, WH.y, 70], [RC.x + RC.w, RC.y, 50], [-40, 0, 62]],
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
const faceText = (corner, z, face, x, y, text, size, cls, part) =>
  `<g transform="${k.sideMatrix(corner, z, P, face)}"><text class="${cls}"${part ? ` data-part="${part}"` : ""} x="${x}" y="${y}" font-size="${size}">${text}</text></g>`;

function plate() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(PLATE, 22))) {
    out.push(S(k.cylinder(x, y, 7, -PLATE_H - FOOT_H, 1.6, P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: "mid" }));
  }
  out.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.6), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: "lo" }));
  out.push(screwsOn(PLATE, 10, 0));
  const strip = { x: -132, y: PLATE.y + PLATE.d - 18, w: 150, d: 7, r: 1 };
  out.push(S(k.slabOf(strip, 0, 0.6, P, 3), { tone: "lo", crease: "none" }));
  const ticks = k.topTicks(strip.x + 4, strip.x + strip.w - 4, 4, 5, strip.y + 0.8, 0.6, [2, 3.6], P);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  out.push(D([at([strip.x + 2, strip.y + 3.5, 0.6]), at([strip.x + strip.w - 2, strip.y + 3.5, 0.6])], { size: 0.45 }));
  return out.join("");
}

function intake() {
  const out = [halo(INTAKE)];
  out.push(S(k.slabOf(INTAKE, 0, INTAKE_TOP, P, 4, 1), { tone: "mid", inner: L(k.sideSeam(INTAKE, 5, P, 4), { tone: "faint" }) }));
  out.push(L(k.planOutline(k.insetPlan(INTAKE, 3), INTAKE_TOP, P, 4), { tone: "faint" }));
  out.push(screwsOn(INTAKE, 4.5, INTAKE_TOP));
  // Rate-limit window on the front face: 10 uploads a minute per IP
  out.push(`<g transform="${k.sideMatrix([INTAKE.x, INTAKE.y + INTAKE.d], INTAKE_TOP, P, "left")}">${L(k.pathOf(k.ringOf({ x: 6, y: 4, w: 22, d: 7, r: 1 }, 3), true), { tone: "lo" })}</g>`);
  out.push(faceText([INTAKE.x, INTAKE.y + INTAKE.d], INTAKE_TOP, "left", 8.4, 9.2, "10/min", 4.2, "cb-display"));
  // API-key lock: a cylinder with a keyhole
  const [lx, ly] = LOCK;
  out.push(S(k.cylinder(lx, ly, 4.4, INTAKE_TOP, 1.2, P, 28), { tone: "lo" }));
  out.push(S(k.cylinder(lx, ly, 3.4, INTAKE_TOP + 1.2, 2.4, P, 28), { tone: "hi", crease: "lo" }));
  out.push(L(k.ring(lx, ly - 0.6, 0.8, INTAKE_TOP + 3.6, P, 12) + k.lineOnTop([lx, ly - 0.2], [lx, ly + 1.4], INTAKE_TOP + 3.6, P), { tone: "lo" }));
  // Tape reel with the uploaded call: flanges, hub, and spokes the live code turns
  const [rx, ry] = REEL;
  out.push(S(k.cylinder(rx, ry, 2.4, INTAKE_TOP, 2, P, 16), { tone: "mid" }));
  out.push(S(k.cylinder(rx, ry, REEL_R, INTAKE_TOP + 2, 0.8, P, 48, 0.3), { tone: "mid" }));
  out.push(S(k.cylinder(rx, ry, REEL_R - 3, INTAKE_TOP + 2.8, 2, P, 40), { tone: "lo", crease: "faint" }));
  out.push(S(k.cylinder(rx, ry, REEL_R, INTAKE_TOP + 4.8, 0.8, P, 48, 0.3), { tone: "hi", crease: "lo" }));
  out.push(L(k.ring(rx, ry, 2.6, INTAKE_TOP + 5.6, P, 16), { tone: "lo" }));
  out.push(`<path data-part="spokes" class="iso-line" data-tone="lo" d="${spokesAt(0)}"/>`);
  return out.join("");
}
export const spokesAt = (turn) => [0, 1, 2].map((index) => k.lineOnTop(onCircle(REEL, 2.6, turn + (index * 2 * Math.PI) / 3), onCircle(REEL, REEL_R - 0.6, turn + (index * 2 * Math.PI) / 3), INTAKE_TOP + 5.6, P)).join("");

// Whisper: open case with the model inside (spectrogram plate, six encoder and six decoder layers), under a lid
function whisperCase() {
  const out = [halo(WH)];
  for (const [x, y] of byDepth(k.corners(WH, 6))) out.push(S(k.cylinder(x, y, 2.8, 0, WH_Z, P, 16), { tone: "lo" }));
  out.push(S(k.slabOf(WH, WH_Z, WH_CASE - WH_Z, P, 4, 0.6), { tone: "mid" }));
  out.push(`<g transform="${k.sideMatrix([WH.x + WH.w, WH.y + WH.d], WH_CASE, P, "right")}">${slots(5, 6, 5, 2, 2, 5)}</g>`);
  // Exit slot on the front face where the transcript comes out onto the belt
  out.push(`<g transform="${k.sideMatrix([WH.x, WH.y + WH.d], WH_CASE, P, "left")}">${L(k.pathOf(k.ringOf({ x: 24, y: 4.4, w: 10, d: 1.6, r: 0.7 }, 3), true), { tone: "lo" })}</g>`);
  const rim = (z) => k.ringOf(WH_OPEN, 3).map(([x, y]) => at([x, y, z]));
  const { x: x0, y: y0 } = WH_OPEN;
  const x1 = WH_OPEN.x + WH_OPEN.w;
  const y1 = WH_OPEN.y + WH_OPEN.d;
  const quad = (points, shade) => `<path class="iso-shade" data-shade="${shade}" d="${k.pathOf(points.map(at), true)}"/>`;
  out.push(`<clipPath id="cb-cavity"><path d="${k.pathOf(rim(WH_CASE), true)}"/></clipPath><g clip-path="url(#cb-cavity)">`);
  out.push(`<path class="iso-shade" data-shade="0" d="${k.pathOf(rim(WH_FLOOR), true)}"/>`);
  out.push(quad([[x0, y0, WH_CASE], [x1, y0, WH_CASE], [x1, y0, WH_FLOOR], [x0, y0, WH_FLOOR]], 1));
  out.push(quad([[x0, y0, WH_CASE], [x0, y1, WH_CASE], [x0, y1, WH_FLOOR], [x0, y0, WH_FLOOR]], 2));
  out.push(L(k.segment([x0, y0, WH_FLOOR], [x0, y0, WH_CASE], P), { tone: "lo" }));
  // Spectrogram plate: 30 s of audio as a grid of log-Mel bins
  const spec = { x: WH.x + 4, y: WH.y + 5, w: 9, d: 22, r: 0.5 };
  out.push(S(k.slabOf(spec, WH_FLOOR, 1.2, P, 1), { tone: "mid" }));
  out.push(D(k.dotGrid(spec.x + 1.5, spec.y + 1.5, 4, 11, 1.9, WH_FLOOR + 1.2, P), { size: 0.35, tone: "hi" }));
  // Encoder and decoder: six thin layers each
  for (const [x0l, tone] of [[WH.x + 15, "hi"], [WH.x + 25, "mid"]]) {
    for (let layer = 0; layer < 6; layer++) {
      out.push(S(k.slabOf({ x: x0l, y: WH.y + 6, w: 7, d: 20, r: 0.5 }, WH_FLOOR + layer * 1.1, 0.8, P, 1), { tone, crease: "lo" }));
    }
  }
  out.push("</g>");
  out.push(L(k.planOutline(WH_OPEN, WH_CASE, P, 3), { tone: "lo" }));
  return out.join("");
}
function whisperLid() {
  const out = [S(k.slabOf(WH, WH_CASE, WH_TOP - WH_CASE, P, 4, 1), { tone: "mid" })];
  out.push(L(k.planOutline(k.insetPlan(WH, 3), WH_TOP, P, 4), { tone: "faint" }));
  out.push(screwsOn(WH, 4, WH_TOP));
  // Microphone grille and a listening ring
  out.push(D(k.dotGrid(WH.x + 9, WH.y + 9, 6, 6, 1.9, WH_TOP, P), { size: 0.35, tone: "lo" }));
  out.push(L(k.ring(WH.x + 26, WH.y + 24, 3.4, WH_TOP, P, 24), { tone: "lo" }));
  out.push(`<path class="cb-listen" d="${k.ring(WH.x + 26, WH.y + 24, 2, WH_TOP, P, 20)}"/>`);
  return out.join("");
}

// The belt and the transcript strip; its "words" flow left to right
function belt() {
  const out = [halo(BELT)];
  out.push(S(k.slabOf(BELT, 0, BELT_TOP, P, 3, 0.6), { tone: "mid" }));
  for (const x of [BELT.x + 3, BELT.x + BELT.w - 3]) out.push(L(k.ring(x, BELT.y + 2.6, 1.4, BELT_TOP, P, 12) + k.ring(x, BELT.y + BELT.d - 2.6, 1.4, BELT_TOP, P, 12), { tone: "lo" }));
  out.push(S(k.slabOf(STRIP, BELT_TOP, 0.4, P, 1), { tone: "hi", crease: "lo" }));
  for (const y of [STRIP.y + 2.2, STRIP.y + 4, STRIP.y + 5.8]) {
    out.push(L(k.lineOnTop([STRIP.x + 1, y], [STRIP.x + STRIP.w - 1, y], STRIP_TOP, P), { tone: "lo", flow: true, free: true }));
  }
  // Masked numbers: black bars that appear on the strip after the stamp
  out.push(`<g data-mask="">${S(k.slabOf({ x: STAMP_X + 4, y: STRIP.y + 1.4, w: 14, d: 2, r: 0.3 }, STRIP_TOP, 0.3, P, 1), { tone: "lo", crease: "none" })}</g>`);
  return out.join("");
}

// A keyword comb on a bridge: it drops onto the strip (and its flag rises) when its words are in the call
function comb(x, index) {
  const out = [];
  for (const y of [BELT.y + 0.4, BELT.y + BELT.d - 0.4]) out.push(S(k.cylinder(x, y, 1.3, BELT_TOP, 18, P, 12), { tone: "mid" }));
  out.push(S(k.slabOf({ x: x - 2, y: BELT.y - 1, w: 4, d: BELT.d + 2, r: 0.7 }, BELT_TOP + 18, 1.6, P, 2, 0.3), { tone: "mid" }));
  out.push(D(Array.from({ length: index + 1 }, (_, dot) => at([x - 1.2 + dot * 0.8, BELT.y - 0.2, BELT_TOP + 19.6])), { size: 0.4, tone: "mid" }));
  out.push(D([at([x, BELT.y + BELT.d / 2, BELT_TOP + 19.6])], { size: 0.7, tone: "hi" }));
  // The comb itself, drawn at its lowered pose and lifted by the live code
  const teeth = Array.from({ length: 9 }, (_, tooth) => k.segment([x, STRIP.y + 0.8 + tooth * 1.3, STRIP_TOP + 3.2], [x, STRIP.y + 0.8 + tooth * 1.3, STRIP_TOP + 0.5], P)).join("");
  out.push(`<g data-comb="${index}">${S(k.slabOf({ x: x - 1.6, y: STRIP.y - 0.6, w: 3.2, d: STRIP.d + 1.2, r: 0.4 }, STRIP_TOP + 3.2, 2, P, 2), { tone: "hi", crease: "lo" })}${L(teeth, { tone: "mid" })}</g>`);
  out.push(`<path data-flag="${index}" class="iso-line" data-tone="hi" d="${k.segment([x, BELT.y + BELT.d / 2, BELT_TOP + 19.6], [x, BELT.y + BELT.d / 2, BELT_TOP + 19.6], P)}" style="stroke-width:1.2"/>`);
  return out.join("");
}

export const needleAt = (angle) => k.lineOnTop(onCircle(GAUGE, -1.6, angle), onCircle(GAUGE, GAUGE_R - 1.4, angle), GAUGE_TOP + 0.2, P);
function gauge() {
  const [gx, gy] = GAUGE;
  const out = [S(k.cylinder(gx, gy, 2.4, 0, GAUGE_TOP - 4, P, 16), { tone: "mid" })];
  out.push(S(k.cylinder(gx, gy, GAUGE_R, GAUGE_TOP - 4, 4, P, 40, 0.5), { tone: "hi", crease: "lo" }));
  out.push(L(k.ring(gx, gy, GAUGE_R - 1, GAUGE_TOP, P, 40), { tone: "lo" }));
  const ticks = k.radialTicks(gx, gy, GAUGE_R - 1.2, 2, 1, GAUGE_TOP, [1.2, 1.8], P, SENTIMENT_ANGLE.Negative, SENTIMENT_ANGLE.Positive - SENTIMENT_ANGLE.Negative);
  out.push(L(ticks.major, { tone: "mid" }));
  out.push(L(k.ring(gx, gy, 1.2, GAUGE_TOP, P, 12), { tone: "mid" }));
  out.push(`<path data-part="sentiment" class="iso-line" data-tone="lit" data-free="start" d="${needleAt(SENTIMENT_ANGLE.Neutral)}" style="stroke-width:1"/>`);
  return out.join("");
}

// Masking stamp: a press on a bridge whose head comes down on the numbers
function stampFrame() {
  const out = [];
  for (const y of [BELT.y + 0.4, BELT.y + BELT.d - 0.4]) out.push(S(k.cylinder(STAMP_X, y, 1.3, BELT_TOP, 22, P, 14), { tone: "mid" }));
  out.push(S(k.slabOf({ x: STAMP_X - 2.4, y: BELT.y - 1, w: 4.8, d: BELT.d + 2, r: 0.8 }, BELT_TOP + 22, 2.4, P, 2, 0.4), { tone: "mid" }));
  return out.join("");
}
const stampHead = () => S(k.slabOf({ x: STAMP_X - 2, y: STRIP.y - 0.4, w: 4, d: STRIP.d + 0.8, r: 0.5 }, STRIP_TOP + 0.4, 4, P, 2, 0.3), { tone: "hi", crease: "lo" });

// AI reviewer: a base, a mast and an arm whose lens hangs over the strip while it reviews, drawn by the live code
function aiBase() {
  const [ax, ay] = ARM_BASE;
  return [
    S(k.cylinder(ax, ay, 5.4, 0, 2, P, 32), { tone: "lo" }),
    S(k.cylinder(ax, ay, 3.2, 2, 22, P, 24), { tone: "mid" }),
    S(k.cylinder(ax, ay, 4, 24, 3, P, 24, 0.4), { tone: "hi", crease: "lo" }),
    `<path class="cb-offline" d="${k.ring(ax, ay, 1.6, 27, P, 16)}"/>`,
  ].join("");
}
export const ARM = { pivot: [ARM_BASE[0], ARM_BASE[1], 25.5], length: 22, lens: 3.2 };

// Fallback gate: a flap that sends the AI's verdict, or the rules' result, into the cabinet
function gateBox() {
  const [gx, gy] = GATE;
  return [
    S(k.slabOf({ x: gx - 5, y: gy - 9, w: 10, d: 18, r: 1.5 }, 0, 8, P, 3, 0.5), { tone: "mid" }),
    L(k.planOutline({ x: gx - 3.4, y: gy - 7.4, w: 6.8, d: 14.8, r: 1 }, 8, P, 3), { tone: "lo" }),
    S(k.cylinder(gx, gy, 1.4, 8, 1.6, P, 14), { tone: "mid" }),
    D([at([gx, gy, 9.6])], { size: 0.6, tone: "hi" }),
    `<path data-part="flap" class="iso-line" data-tone="hi" d="${k.lineOnTop([gx, gy], [gx, gy - 6], 9.6, P)}" style="stroke-width:1.3"/>`,
  ].join("");
}

export const pointerAt = (angle) => k.lineOnTop(onCircle(KNOB, -2, angle), onCircle(KNOB, KNOB_R - 0.3, angle), KNOB_TOP, P);
function cabinet() {
  const out = [halo(RC)];
  out.push(S(k.slabOf(RC, 0, RC_TOP, P, 6, 1), { tone: "mid", inner: L(k.sideSeam(RC, 6, P, 6), { tone: "faint" }) }));
  out.push(L(k.planOutline(k.insetPlan(RC, 3.4), RC_TOP, P, 6), { tone: "faint" }));
  out.push(screwsOn(RC, 6, RC_TOP));
  // Display window on the front face: the final intent and where it came from
  out.push(`<g transform="${k.sideMatrix([RC.x, RC.y + RC.d], RC_TOP, P, "left")}">${L(k.pathOf(k.ringOf({ x: 4, y: 3, w: 48, d: 11, r: 1.2 }, 3), true), { tone: "lo" })}</g>`);
  out.push(faceText([RC.x, RC.y + RC.d], RC_TOP, "left", 6.4, 8.2, "WITHDRAWAL REQUEST", 3.6, "cb-display", "intent"));
  out.push(faceText([RC.x, RC.y + RC.d], RC_TOP, "left", 6.4, 12.2, "RULES · TO AI REVIEW", 2.6, "cb-display cb-dim", "source"));
  // Priority and risk lamps, the intake port and the scenario knob
  for (const { group, label, at: [x, y] } of LAMPS) {
    out.push(S(k.cylinder(x, y, 3, RC_TOP, 1, P, 24), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 2.3, RC_TOP + 1, 1.4, P, 24), { tone: "hi", crease: "lo" }));
    out.push(`<path class="cb-glow" data-lamp="${group}:${label}" d="${k.ring(x, y, 2.3, RC_TOP + 2.4, P, 28)}"/>`);
  }
  const [kx, ky] = KNOB;
  DETENTS.forEach((angle) => out.push(L(k.lineOnTop(onCircle(KNOB, KNOB_R + 1.6, angle), onCircle(KNOB, KNOB_R + 3.4, angle), RC_TOP, P), { tone: "mid" })));
  out.push(S(k.cylinder(kx, ky, KNOB_R + 1, RC_TOP, 1.2, P, 32), { tone: "lo" }));
  out.push(S(k.cylinder(kx, ky, KNOB_R, RC_TOP + 1.2, KNOB_TOP - RC_TOP - 1.2, P, 32), { tone: "mid" }));
  out.push(L(k.knurl(kx, ky, KNOB_R, RC_TOP + 1.2, KNOB_TOP, 36, P), { tone: "lo" }));
  out.push(`<path data-part="pointer" class="iso-line" data-tone="hi" data-free="start" d="${pointerAt(DETENTS[0])}" style="stroke-width:1"/>`);
  return out.join("");
}

// The transcript leaves Whisper's front slot and slides down a chute onto the start of the belt
function chute() {
  const top = { x: WH.x + 22, y: WH.y + WH.d, w: 12, d: 1.2, r: 0.3 };
  const from = [WH.x + 28, WH.y + WH.d + 0.6, WH_CASE - 4.4];
  const to = [STRIP.x + 6, STRIP.y + STRIP.d / 2, STRIP_TOP + 0.2];
  const mid = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2 + 4, (from[2] + to[2]) / 2 + 3];
  return S(k.slabOf(top, WH_CASE - 6, 2.4, P, 1), { tone: "lo" }) + k.wireSvg(at(from), at(to), { via: [at(mid)], tone: "lo", size: 0.8 }) + L(k.pathOf([at(from), at(mid), at(to)]), { tone: "hi", flow: true });
}

// The call's audio runs from the reel into Whisper as a tape
function tape() {
  const from = at([REEL[0] + REEL_R - 0.4, REEL[1] + 2, INTAKE_TOP + 3.8]);
  const to = at([WH.x, WH.y + 12, WH_CASE - 4]);
  const mid = at([(REEL[0] + REEL_R + WH.x) / 2, REEL[1] + 6, INTAKE_TOP + 8]);
  return k.wireSvg(from, to, { via: [mid], tone: "lo", size: 0.8 }) + L(k.pathOf([from, mid, to]), { tone: "mid", flow: true });
}

const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label:
    "A call-analysis line. An intake box with an API-key lock and a rate-limit window carries the call's tape reel, which feeds a Whisper transcriber. Its transcript runs along a belt under four keyword combs, past a sentiment gauge and a masking stamp, to an AI reviewer arm and a fallback gate in front of a results cabinet with priority and risk lamps and a display.",
  body: [
    zone("base", plate()),
    zone("whisper", whisperCase()),
    zone("whisper", whisperLid(), "whisper"),
    zone("intake", intake()),
    zone("intake", tape()),
    zone("whisper", chute()),
    zone("ai", aiBase()),
    zone("results", cabinet()),
    zone("belt", belt()),
    ...COMB_X.map((x, index) => zone("combs", comb(x, index))),
    zone("gauge", gauge()),
    zone("stamp", stampFrame() + `<g data-part="stamp">${stampHead()}</g>`),
    zone("gate", gateBox()),
    `<g data-zone="ai"><path data-part="arm" class="iso-line" data-tone="hi" d="" style="stroke-width:1.6"/><path data-part="lens" class="cb-lens" d=""/></g>`,
  ],
});

const GEOMETRY = {
  P,
  scale,
  knob: KNOB,
  knobR: KNOB_R,
  knobTop: KNOB_TOP,
  detents: DETENTS,
  reel: REEL,
  reelR: REEL_R,
  reelTop: INTAKE_TOP + 5.6,
  gauge: GAUGE,
  gaugeR: GAUGE_R,
  gaugeTop: GAUGE_TOP,
  sentiment: SENTIMENT_ANGLE,
  combRaised: COMB_RAISED,
  combX: COMB_X,
  flagZ: BELT_TOP + 19.6,
  flagY: BELT.y + BELT.d / 2,
  stampUp: STAMP_UP,
  arm: ARM,
  strip: { x: STRIP.x + STRIP.w - 8, y: STRIP.y + STRIP.d / 2, z: STRIP_TOP },
  gate: GATE,
  lifts: LIFTS,
  cables: [],
};

writeFileSync(
  join(ROOT, "src/components/case-study/figures/callBench.generated.js"),
  `// Generated by scripts/figures/call-bench.mjs. Do not edit by hand.\nexport const svg = ${JSON.stringify(svg)};\nexport const geometry = ${JSON.stringify(GEOMETRY)};\n`,
);
console.log(`svg ${(svg.length / 1024).toFixed(1)} KB`);
for (const scenario of SCENARIOS) console.log(`  ${scenario.readout}`);

const KEYS = [
  { mark: "raised", label: "Combs: the four intent rules, checked in order" },
  { mark: "lit", label: "Gauge: the sentiment the keywords give" },
  { mark: "dashed", label: "Gate: AI verdict, or the rules if the AI fails" },
];
const card = (hint) =>
  k.plateHtml({
    fig: "Fig 1",
    title: "Rules first, AI review",
    hint,
    readout: SCENARIOS[0].readout,
    keys: KEYS,
    body: `<div class="iso-stage" tabindex="0" role="slider" aria-label="Scenario" aria-valuemin="1" aria-valuemax="${SCENARIOS.length}" aria-valuenow="1">${svg}</div>`,
  });
const data = `const geometry = ${JSON.stringify(GEOMETRY)};\nconst STEPS = ${JSON.stringify(STEPS)};`;
const CSS = "callBench.css";
const previewAt = process.argv.indexOf("--preview");
if (previewAt > 0) {
  const script = [kitSource(), data, inline("callBench.data.js"), inline("callBench.live.js"), `mountCallBench(document.querySelector(".iso-figure"), { geometry, scenarios: SCENARIOS, kit: { iso, lineOnTop, pathOf, translateAlong, ring, segment } });`].join("\n");
  writeFileSync(process.argv[previewAt + 1], k.pageHtml({ title: "Call bench", theme: "dark", body: `<style>${inline(CSS)}</style>${card("Hover or use arrow keys")}`, script, width: 720 }));
  console.log("preview", process.argv[previewAt + 1]);
}
const explainAt = process.argv.indexOf("--explain");
if (explainAt > 0) {
  writeExplainer({
    file: process.argv[explainAt + 1],
    title: "Banking Call Intelligence explained",
    heading: "How the Banking Call Intelligence project works",
    intro: "A guided walk along a drawn call-analysis line. It plays by itself; use Back and Next, the dots, or the arrow keys to go at your own pace. Every rule result is computed with the project's own keyword rules.",
    card: `<style>${inline(CSS)}</style>` + card("Click it, then arrow keys change the call"),
    note: "Sources: main.py (rules, masking, AI verification, auth and rate limits), the README, and Whisper's published model design.",
    data,
    modules: ["callBench.data.js", "callBench.live.js", "tour.js"],
    boot: `const figure = document.querySelector(".iso-figure");
const bench = mountCallBench(figure, { geometry, scenarios: SCENARIOS, kit: { ...kit, segment }, tour: false, hover: false });
const hooks = { step: (step) => step.scenario !== undefined && bench.choose(step.scenario) };
mountTour({ figure, panel: document.querySelector(".tour-panel"), geometry, steps: STEPS, kit, keys: document, hooks }).start(0);`,
  });
  console.log("explain", process.argv[explainAt + 1]);
}
