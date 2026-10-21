// Builds the "trust at the counter" figure for the Agentic Ledger case study: a shop counter with a Soundbox,
// the supervisor that routes each event, Spoof Guard's four gates and the EMI-safe cash drawer.
// Drawn with the Anatomy isometric kit (src/lib/iso, MIT). Run: node scripts/figures/ledger-bench.mjs [--preview f] [--explain f]
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "../../src/lib/iso/iso-kit.mjs";
import * as G from "../../src/lib/iso/lathe.mjs";
import { SCENARIOS } from "../../src/components/case-study/figures/ledgerBench.data.js";
import { STEPS } from "../../src/components/case-study/figures/ledgerBench.steps.js";
import { inline, kitSource, writeExplainer } from "./explainer.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
const WIDTH = 640;
const HEIGHT = 400;

// Same plate and camera as the other case-study figures, so they share a scale
const PLATE = { x: -150, y: -64, w: 300, d: 128, r: 8 };
const PLATE_H = 12;
const FOOT_H = 5;

// Shop counter, left: the Soundbox and the customer's phone
const COUNTER = { x: -142, y: -30, w: 56, d: 66, r: 3 };
const COUNTER_TOP = 20;
const SOUNDBOX = [-124, -10];
const PHONE = { x: -118, y: 12, w: 24, d: 14, r: 2 };

// Supervisor, back centre-left: every event enters here and the knob shows which kind it is
const SUP = { x: -72, y: -58, w: 42, d: 34, r: 3 };
const SUP_TOP = 22;
const KNOB = [-51, -41];
const KNOB_R = 5.5;
const KNOB_TOP = SUP_TOP + 4.5;

// Spoof Guard, front centre: a rail with four gates and the verdict lamps at its end
const RAIL = { x: -76, y: 8, w: 106, d: 18, r: 2 };
const RAIL_TOP = 4;
const GATE_X = [-56, -32, -8, 16];
const TOKEN_Y = RAIL.y + RAIL.d / 2;
const TOKEN_HOME = -68;
const TOKEN_END = 26;
const LAMP_PANEL = { x: 34, y: 6, w: 12, d: 26, r: 2 };
const LAMP_TOP = 8;
const LAMPS = [
  { label: "VERIFIED", at: [40, 11] },
  { label: "DELAYED", at: [40, 19] },
  { label: "SPOOF", at: [40, 27] },
];

// Supplier Ledger, back centre: a bill under the masking press
const TRAY = { x: -22, y: -58, w: 48, d: 30, r: 2 };
const TRAY_TOP = 6;
const SHEET = { x: -16, y: -54, w: 30, d: 22, r: 0.6 };

// Liquidity Engine, right: a cash drawer with the balance, the locked EMI reserve and the advance tray,
// the maker-checker key, and the supplier's crate in front
const DRAWER = { x: 50, y: -48, w: 90, d: 58, r: 4 };
const DRAWER_TOP = 16;
const AVAIL = { x: 56, y: -42, w: 24, d: 44, r: 2 };
const RESERVE = { x: 84, y: -42, w: 24, d: 44, r: 2 };
const ADVANCE = { x: 112, y: -42, w: 22, d: 44, r: 2 };
const LID_TOP = DRAWER_TOP + 2.4;
const CRATE = { x: 66, y: 24, w: 46, d: 26, r: 2 };
const CRATE_TOP = 12;
const KEY = [128, 2];
const LIFTS = { vault: 22 };
// Each stack of notes stands for ₹500
const NOTE = 500;
const STACK_R = 3;
const stackSlots = (plan, cols, rows) => {
  const out = [];
  for (let row = 0; row < rows; row++) for (let col = 0; col < cols; col++) out.push([plan.x + 6 + col * ((plan.w - 12) / Math.max(1, cols - 1)), plan.y + 6 + row * ((plan.d - 12) / Math.max(1, rows - 1))]);
  return out;
};
const AVAIL_SLOTS = stackSlots(AVAIL, 2, 3);
const RESERVE_SLOTS = stackSlots(RESERVE, 2, 3);
const ADVANCE_SLOTS = stackSlots(ADVANCE, 2, 5);
const CRATE_SLOTS = stackSlots({ x: CRATE.x + 2, y: CRATE.y + 2, w: CRATE.w - 4, d: CRATE.d - 4 }, 5, 2);

const deg = (value) => (value * Math.PI) / 180;
const FACING = 145;
const DETENTS = Array.from({ length: SCENARIOS.length }, (_, index) => deg(FACING - 90 + (index * 180) / (SCENARIOS.length - 1)));

const P = k.fitProjection(
  [...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0), [SOUNDBOX[0], SOUNDBOX[1], 70], [TRAY.x, TRAY.y, 40], [-40, 0, 70]],
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
const socket = ([x, y], z) => L(k.ring(x, y, 3.2, z, P, 20), { tone: "lo" }) + S(k.cylinder(x, y, 2.3, z, 2.6, P, 18), { tone: "mid" }) + L(k.ring(x, y, 1, z + 2.6, P, 12), { tone: "lo" });
const halo = (plan) => `<path class="iso-halo" d="${k.haloOf(k.insetPlan(plan, 3), 0, 2, P)}" style="filter:blur(5px)"/>`;
const labelPlate = (corner, face, z, plan) =>
  `<g transform="${k.sideMatrix(corner, z, P, face)}">${L(k.pathOf(k.ringOf(plan, 3), true), { tone: "lo" })}${L(`M${plan.x + 4} ${plan.y + 2.6}H${plan.x + plan.w - 8}`, { tone: "lo", free: true })}${L(`M${plan.x + 4} ${plan.y + 4.8}H${plan.x + plan.w - 14}`, { tone: "faint", free: true })}${D([[plan.x + 2, plan.y + plan.d / 2], [plan.x + plan.w - 2, plan.y + plan.d / 2]], { size: 0.45 })}</g>`;

function plate() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(PLATE, 22))) {
    out.push(S(k.cylinder(x, y, 7, -PLATE_H - FOOT_H, 1.6, P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: "mid" }));
  }
  out.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.6), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: "lo" }));
  out.push(screwsOn(PLATE, 10, 0));
  const strip = { x: -70, y: PLATE.y + PLATE.d - 16, w: 96, d: 7, r: 1 };
  out.push(S(k.slabOf(strip, 0, 0.6, P, 3), { tone: "lo", crease: "none" }));
  const ticks = k.topTicks(strip.x + 4, strip.x + strip.w - 4, 4, 5, strip.y + 0.8, 0.6, [2, 3.6], P);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  out.push(D([at([strip.x + 2, strip.y + 3.5, 0.6]), at([strip.x + strip.w - 2, strip.y + 3.5, 0.6])], { size: 0.45 }));
  return out.join("");
}

function counter() {
  const out = [halo(COUNTER)];
  out.push(S(k.slabOf(COUNTER, 0, COUNTER_TOP, P, 4, 1), { tone: "mid", inner: L(k.sideSeam(COUNTER, 4, P, 4), { tone: "faint" }) }));
  out.push(L(k.planOutline(k.insetPlan(COUNTER, 3), COUNTER_TOP, P, 4), { tone: "faint" }));
  out.push(labelPlate([COUNTER.x, COUNTER.y + COUNTER.d], "left", COUNTER_TOP, { x: 10, y: 5, w: 34, d: 7, r: 1.2 }));
  // QR standee behind the Soundbox
  out.push(S(k.slabOf({ x: -134, y: -24, w: 18, d: 2.4, r: 0.5 }, COUNTER_TOP, 22, P, 2, 0.3), { tone: "mid" }));
  const finder = (x, y) => k.pathOf(k.ringOf({ x, y, w: 3, d: 3, r: 0.3 }, 1), true);
  out.push(`<g transform="${k.sideMatrix([-134, -21.6], COUNTER_TOP + 22, P, "left")}">${L(k.pathOf(k.ringOf({ x: 3, y: 3, w: 12, d: 12, r: 0.6 }, 2), true), { tone: "lo" })}${L(finder(4.4, 4.4) + finder(10.6, 4.4) + finder(4.4, 10.6), { tone: "mid" })}${D([[9.5, 9.5], [11.5, 11.5], [9.5, 12.5], [12.5, 9.5], [8, 12.5]], { size: 0.4, tone: "mid" })}</g>`);
  // Soundbox: a squat speaker with a grille and a status ring
  const [sx, sy] = SOUNDBOX;
  out.push(S(k.cylinder(sx, sy, 9, COUNTER_TOP, 3, P, 40, 0.5), { tone: "lo" }));
  out.push(S(k.cylinder(sx, sy, 7.5, COUNTER_TOP + 3, 14, P, 40, 0.8), { tone: "hi", crease: "lo", inner: L(k.sideArc(sx, sy, 7.5, COUNTER_TOP + 12, P, 32), { tone: "faint" }) }));
  out.push(L(k.ring(sx, sy, 5.8, COUNTER_TOP + 17, P, 32), { tone: "lo" }));
  out.push(D(k.dotGrid(sx - 3.6, sy - 3.6, 5, 5, 1.8, COUNTER_TOP + 17, P), { size: 0.35, tone: "lo" }));
  out.push(`<path class="lb-ring" data-sound="" d="${k.ring(sx, sy, 7.6, COUNTER_TOP + 12.4, P, 40)}"/>`);
  // The customer's phone, screen up, showing the amount it claims was paid
  out.push(S(k.slabOf(PHONE, COUNTER_TOP, 1.4, P, 3, 0.4), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(PHONE, 1.2), COUNTER_TOP + 1.4, P, 3), { tone: "lo" }));
  const screen = k.topMatrix([PHONE.x + PHONE.w / 2, PHONE.y + PHONE.d / 2 + 1.4], COUNTER_TOP + 1.4, P, "x");
  out.push(`<text class="lb-screen" data-part="screen" transform="${screen}" font-size="4.2" text-anchor="middle">₹250</text>`);
  out.push(socket([-96, -20], COUNTER_TOP));
  return out.join("");
}

export const pointerAt = (angle) => k.lineOnTop(onCircle(KNOB, -2, angle), onCircle(KNOB, KNOB_R - 0.3, angle), KNOB_TOP, P);
function supervisor() {
  const out = [halo(SUP)];
  out.push(S(k.slabOf(SUP, 0, SUP_TOP, P, 4, 1), { tone: "mid", inner: L(k.sideSeam(SUP, 5, P, 4), { tone: "faint" }) }));
  out.push(L(k.planOutline(k.insetPlan(SUP, 3), SUP_TOP, P, 4), { tone: "faint" }));
  out.push(screwsOn(SUP, 4.5, SUP_TOP));
  out.push(`<g transform="${k.sideMatrix([SUP.x + SUP.w, SUP.y + SUP.d], SUP_TOP, P, "right")}">${slots(6, 6, 4.6, 5, 2, 9)}</g>`);
  // Intake slot and the event-kind knob, one detent per scenario
  out.push(L(k.planOutline({ x: SUP.x + 6, y: SUP.y + 6, w: 12, d: 3, r: 1.4 }, SUP_TOP, P, 3), { tone: "lo" }));
  const [kx, ky] = KNOB;
  DETENTS.forEach((angle) => {
    out.push(L(k.lineOnTop(onCircle(KNOB, KNOB_R + 1.6, angle), onCircle(KNOB, KNOB_R + 3.4, angle), SUP_TOP, P), { tone: "mid" }));
  });
  out.push(S(k.cylinder(kx, ky, KNOB_R + 1, SUP_TOP, 1.2, P, 32), { tone: "lo" }));
  out.push(S(k.cylinder(kx, ky, KNOB_R, SUP_TOP + 1.2, KNOB_TOP - SUP_TOP - 1.2, P, 32), { tone: "mid" }));
  out.push(L(k.knurl(kx, ky, KNOB_R, SUP_TOP + 1.2, KNOB_TOP, 36, P), { tone: "lo" }));
  out.push(`<path data-part="pointer" class="iso-line" data-tone="hi" data-free="start" d="${pointerAt(DETENTS[0])}" style="stroke-width:1"/>`);
  for (const port of [[-38, -48], [-38, -36], [-62, -30]]) out.push(socket(port, SUP_TOP));
  return out.join("");
}

// Spoof Guard's rail. A gate's shutter stands open (raised) unless its check fails; the token stops in front
// of the failing gate or rolls through to the lamps.
const SHUTTER_H = 9;
function rail() {
  const out = [halo(RAIL)];
  out.push(S(k.slabOf(RAIL, 0, RAIL_TOP, P, 4, 0.8), { tone: "mid" }));
  out.push(L(k.planOutline({ x: RAIL.x + 4, y: TOKEN_Y - 3.6, w: RAIL.w - 8, d: 7.2, r: 3.4 }, RAIL_TOP, P, 4), { tone: "lo" }));
  out.push(socket([RAIL.x + 6, RAIL.y + 3.4], RAIL_TOP));
  GATE_X.forEach((x, index) => {
    out.push(D(Array.from({ length: index + 1 }, (_, dot) => at([x - 1.8 + dot * 1.2, RAIL.y + RAIL.d - 1.8, RAIL_TOP])), { size: 0.4, tone: "mid" }));
  });
  return out.join("");
}
function gate(x, index) {
  const out = [];
  for (const y of [RAIL.y + 1.6, RAIL.y + RAIL.d - 1.6]) out.push(S(k.cylinder(x, y, 1.3, RAIL_TOP, 15, P, 14), { tone: "mid" }));
  out.push(S(k.slabOf({ x: x - 1.6, y: RAIL.y + 0.2, w: 3.2, d: RAIL.d - 0.4, r: 0.6 }, RAIL_TOP + 15, 1.6, P, 2, 0.3), { tone: "mid" }));
  // The shutter is drawn closed and lifted open by the live code
  out.push(`<g data-shutter="${index}">${S(k.slabOf({ x: x - 0.6, y: RAIL.y + 2.9, w: 1.2, d: RAIL.d - 5.8, r: 0.3 }, RAIL_TOP, SHUTTER_H, P, 1), { tone: "hi", crease: "lo" })}</g>`);
  return out.join("");
}
function lampsPanel() {
  const out = [S(k.slabOf(LAMP_PANEL, 0, LAMP_TOP, P, 3, 0.6), { tone: "mid" })];
  for (const { label, at: [x, y] } of LAMPS) {
    out.push(S(k.cylinder(x, y, 3.4, LAMP_TOP, 1, P, 24), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 2.6, LAMP_TOP + 1, 1.6, P, 24), { tone: "hi", crease: "lo" }));
    out.push(`<path class="lb-glow" data-lamp="${label}" d="${k.ring(x, y, 2.6, LAMP_TOP + 2.6, P, 32)}"/>`);
  }
  return out.join("");
}
const token = () => S(k.cylinder(TOKEN_HOME, TOKEN_Y, 3.6, RAIL_TOP, 2.4, P, 32, 0.4), { tone: "hi", crease: "lo", lit: true }) + L(k.ring(TOKEN_HOME, TOKEN_Y, 2, RAIL_TOP + 2.4, P, 20), { tone: "lo" });

function ledger() {
  const out = [halo(TRAY)];
  out.push(S(k.slabOf(TRAY, 0, TRAY_TOP, P, 3, 0.6), { tone: "mid" }));
  out.push(S(k.slabOf(SHEET, TRAY_TOP, 0.6, P, 1), { tone: "hi", crease: "lo" }));
  // Bill lines; the masked ones (card, phone, account, UPI ID) carry a black bar
  const lineZ = TRAY_TOP + 0.6;
  [0, 1, 2, 3, 4, 5].forEach((row) => {
    const y = SHEET.y + 3.2 + row * 3.2;
    const len = [24, 18, 22, 14, 20, 10][row];
    out.push(L(k.lineOnTop([SHEET.x + 3, y], [SHEET.x + 3 + len, y], lineZ, P), { tone: "lo", free: true }));
    if (row === 1 || row === 3 || row === 4) out.push(S(k.slabOf({ x: SHEET.x + 8, y: y - 1, w: len - 6, d: 2, r: 0.3 }, lineZ, 0.3, P, 1), { tone: "lo", crease: "none" }));
  });
  // The masking press: a bridge on two posts with its head over the sheet
  for (const x of [SHEET.x - 3, SHEET.x + SHEET.w + 3]) out.push(S(k.cylinder(x, SHEET.y + 11, 1.4, TRAY_TOP, 18, P, 14), { tone: "mid" }));
  out.push(S(k.slabOf({ x: SHEET.x - 4.6, y: SHEET.y + 8, w: SHEET.w + 9.2, d: 6, r: 1 }, TRAY_TOP + 18, 2.4, P, 2, 0.4), { tone: "mid" }));
  out.push(S(k.slabOf({ x: SHEET.x + 9, y: SHEET.y + 7, w: 12, d: 8, r: 0.6 }, TRAY_TOP + 12, 6, P, 2, 0.4), { tone: "hi", crease: "lo" }));
  out.push(socket([TRAY.x + TRAY.w - 5, TRAY.y + 5], TRAY_TOP));
  out.push(socket([TRAY.x + TRAY.w - 5, TRAY.y + TRAY.d - 5], TRAY_TOP));
  return out.join("");
}

const stack = ([x, y], z, count, style) => S(k.cylinder(x, y, STACK_R, z, count * 0.9, P, 20, 0.3), style) + L(k.sideArc(x, y, STACK_R, z + count * 0.45, P, 16), { tone: "faint" });
function drawer() {
  const out = [halo(DRAWER)];
  out.push(S(k.slabOf(DRAWER, 0, DRAWER_TOP, P, 6, 1), { tone: "mid", inner: L(k.sideSeam(DRAWER, 6, P, 6), { tone: "faint" }) }));
  out.push(`<g transform="${k.sideMatrix([DRAWER.x, DRAWER.y + DRAWER.d], DRAWER_TOP, P, "left")}">${L(k.pathOf(k.ringOf({ x: 30, y: 9, w: 30, d: 4, r: 2 }, 3), true), { tone: "lo" })}</g>`);
  for (const plan of [AVAIL, RESERVE, ADVANCE]) out.push(L(k.planOutline(plan, DRAWER_TOP, P, 3), { tone: "lo" }));
  // Today's balance above the reserve: six stacks of ₹500
  out.push(`<g data-stacks="avail">${byDepth(AVAIL_SLOTS).map((slot) => `<g data-slot="${AVAIL_SLOTS.indexOf(slot)}">${stack(slot, DRAWER_TOP, 6, { tone: "hi", crease: "lo" })}</g>`).join("")}</g>`);
  // The reserve holds tomorrow's ₹3,000 EMI under a locked lid
  out.push(byDepth(RESERVE_SLOTS).map((slot) => stack(slot, DRAWER_TOP, 2, { tone: "mid", crease: "lo" })).join(""));
  // Advance tray: room for the ₹5,000 limit, ten slots; the live code fills what the plan uses
  out.push(L(ADVANCE_SLOTS.map(([x, y]) => k.ring(x, y, STACK_R, DRAWER_TOP, P, 20)).join(""), { tone: "faint" }));
  out.push(`<g data-stacks="advance">${byDepth(ADVANCE_SLOTS).map((slot) => `<g data-slot="${ADVANCE_SLOTS.indexOf(slot)}">${stack(slot, DRAWER_TOP, 4, { tone: "hi", crease: "lo", lit: true })}</g>`).join("")}</g>`);
  out.push(socket([DRAWER.x + 6, DRAWER.y + 6], DRAWER_TOP));
  return out.join("");
}
function vault() {
  const out = [S(k.slabOf(k.insetPlan(RESERVE, -1.2), DRAWER_TOP, LID_TOP - DRAWER_TOP, P, 3, 0.6), { tone: "mid" })];
  out.push(L(k.planOutline(k.insetPlan(RESERVE, 1.6), LID_TOP, P, 3), { tone: "faint" }));
  // Padlock on the lid's front edge
  const [px, py] = [RESERVE.x + RESERVE.w / 2, RESERVE.y + RESERVE.d - 4];
  out.push(S(k.slabOf({ x: px - 3, y: py - 2, w: 6, d: 4, r: 0.8 }, LID_TOP, 3, P, 2, 0.4), { tone: "hi", crease: "lo" }));
  out.push(L(G.arcOf(G.frameOf([px, py, LID_TOP + 3], [0, 1, 0], [1, 0, 0], [0, 0, 1]), 0, 2, P, { from: 0, to: Math.PI, least: -1 }), { tone: "hi" }));
  return out.join("");
}
function checker() {
  const [x, y] = KEY;
  return [
    S(k.cylinder(x, y, 4, DRAWER_TOP, 1.2, P, 24), { tone: "lo" }),
    S(k.cylinder(x, y, 3, DRAWER_TOP + 1.2, 2.4, P, 24), { tone: "hi", crease: "lo" }),
    `<path data-part="key" class="iso-line" data-tone="hi" data-free="start" d="${k.lineOnTop(onCircle(KEY, -1.6, 0), onCircle(KEY, 2.7, 0), DRAWER_TOP + 3.6, P)}" style="stroke-width:1.2"/>`,
    `<path class="lb-glow lb-check" data-check="" d="${k.ring(x - 7, y, 1.6, DRAWER_TOP, P, 20)}"/>`,
    S(k.cylinder(x - 7, y, 1.6, DRAWER_TOP, 0.4, P, 16), { tone: "lo" }),
  ].join("");
}
function crate() {
  const out = [halo(CRATE)];
  const wall = 1.6;
  out.push(S(k.slabOf(CRATE, 0, 1.6, P, 3), { tone: "lo" }));
  out.push(S(k.slabOf({ x: CRATE.x, y: CRATE.y, w: CRATE.w, d: wall, r: 0.4 }, 1.6, CRATE_TOP - 1.6, P, 2), { tone: "mid" }));
  out.push(S(k.slabOf({ x: CRATE.x, y: CRATE.y + wall, w: wall, d: CRATE.d - wall, r: 0.4 }, 1.6, CRATE_TOP - 1.6, P, 2), { tone: "mid" }));
  // Notes paid to the supplier land here
  out.push(`<g data-stacks="crate">${byDepth(CRATE_SLOTS).map((slot) => `<g data-slot="${CRATE_SLOTS.indexOf(slot)}">${stack(slot, 1.6, 6, { tone: "hi", crease: "lo" })}</g>`).join("")}</g>`);
  out.push(S(k.slabOf({ x: CRATE.x + CRATE.w - wall, y: CRATE.y + wall, w: wall, d: CRATE.d - wall, r: 0.4 }, 1.6, CRATE_TOP - 1.6, P, 2), { tone: "mid" }));
  out.push(S(k.slabOf({ x: CRATE.x, y: CRATE.y + CRATE.d - wall, w: CRATE.w, d: wall, r: 0.4 }, 1.6, CRATE_TOP - 1.6, P, 2), { tone: "mid", inner: L(k.sideSeam({ x: CRATE.x, y: CRATE.y + CRATE.d - wall, w: CRATE.w, d: wall, r: 0.4 }, 6.8, P, 2), { tone: "faint" }) }));
  return out.join("");
}

// Event lines between the stations: claims run counter -> supervisor -> rail, bills supervisor -> ledger -> drawer
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
const TOP = 2.6;
const LINES = {
  claim: [
    cable([-96, -20, COUNTER_TOP + TOP], [-62, -30, SUP_TOP + TOP], 14, 16),
    cable([-38, -36, SUP_TOP + TOP], [RAIL.x + 6, RAIL.y + 3.4, RAIL_TOP + TOP], 12, 22),
  ],
  bill: [
    cable([-38, -48, SUP_TOP + TOP], [TRAY.x + TRAY.w - 5, TRAY.y + 5, TRAY_TOP + TOP], 10, 18),
    cable([TRAY.x + TRAY.w - 5, TRAY.y + TRAY.d - 5, TRAY_TOP + TOP], [DRAWER.x + 6, DRAWER.y + 6, DRAWER_TOP + TOP], 12, 14),
  ],
};

const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label:
    "A merchant's counter bench. On the counter sit a Soundbox and the customer's phone. A supervisor box routes each event: payment claims to Spoof Guard, a rail with four gates and three verdict lamps, and supplier bills to the Supplier Ledger's masking press and on to a cash drawer. The drawer holds today's balance, the next morning's EMI in a locked compartment and an advance tray, with a maker-checker key and the supplier's crate in front.",
  body: [
    zone("base", plate()),
    zone("supervisor", supervisor()),
    zone("ledger", ledger()),
    zone("counter", counter()),
    `<g data-zone="lines" data-line="claim">${LINES.claim[0]}</g>`,
    zone("drawer", drawer()),
    zone("drawer", vault(), "vault"),
    zone("drawer", checker()),
    `<g data-zone="lines" data-line="bill">${LINES.bill.join("")}</g>`,
    zone("rail", rail()),
    // The token sits among the gates in depth order; the live code moves it between them as it travels
    `<g data-zone="rail" data-part="token">${token()}</g>`,
    ...GATE_X.map((x, index) => `<g data-zone="rail" data-gate="${index}">${gate(x, index)}</g>`),
    zone("rail", lampsPanel()),
    `<g data-zone="lines" data-line="claim">${LINES.claim[1]}</g>`,
    zone("crate", crate()),
  ],
});

const GEOMETRY = {
  P,
  scale,
  knob: KNOB,
  knobR: KNOB_R,
  knobTop: KNOB_TOP,
  detents: DETENTS,
  key: KEY,
  keyTop: DRAWER_TOP + 3.6,
  gateX: GATE_X,
  tokenHome: TOKEN_HOME,
  tokenEnd: TOKEN_END,
  shutterH: SHUTTER_H,
  note: NOTE,
  lifts: LIFTS,
  cables: [],
};

writeFileSync(
  join(ROOT, "src/components/case-study/figures/ledgerBench.generated.js"),
  `// Generated by scripts/figures/ledger-bench.mjs. Do not edit by hand.\nexport const svg = ${JSON.stringify(svg)};\nexport const geometry = ${JSON.stringify(GEOMETRY)};\n`,
);
console.log(`svg ${(svg.length / 1024).toFixed(1)} KB`);
for (const scenario of SCENARIOS) console.log(`  ${scenario.readout}`);

// Optional standalone pages: --preview <file> (the card alone) or --explain <file> (card + guided tour)
const KEYS = [
  { mark: "raised", label: "Gates: Spoof Guard's four checks, in order" },
  { mark: "lit", label: "Notes: ₹500 a stack; the EMI reserve stays locked" },
  { mark: "dashed", label: "Event lines: claims to the gates, bills to the drawer" },
];
const card = (hint) =>
  k.plateHtml({
    fig: "Fig 1",
    title: "Trust at the counter",
    hint,
    readout: SCENARIOS[0].readout,
    keys: KEYS,
    body: `<div class="iso-stage" tabindex="0" role="slider" aria-label="Scenario" aria-valuemin="1" aria-valuemax="${SCENARIOS.length}" aria-valuenow="1">${svg}</div>`,
  });
const data = `const geometry = ${JSON.stringify(GEOMETRY)};\nconst STEPS = ${JSON.stringify(STEPS)};`;
const CSS = "ledgerBench.css";
const previewAt = process.argv.indexOf("--preview");
if (previewAt > 0) {
  const script = [kitSource(), data, inline("ledgerBench.data.js"), inline("ledgerBench.live.js"), `mountLedgerBench(document.querySelector(".iso-figure"), { geometry, scenarios: SCENARIOS, kit: { iso, lineOnTop, pathOf, translateAlong } });`].join("\n");
  writeFileSync(process.argv[previewAt + 1], k.pageHtml({ title: "Ledger bench", theme: "dark", body: `<style>${inline(CSS)}</style>${card("Hover or use arrow keys")}`, script, width: 720 }));
  console.log("preview", process.argv[previewAt + 1]);
}
const explainAt = process.argv.indexOf("--explain");
if (explainAt > 0) {
  writeExplainer({
    file: process.argv[explainAt + 1],
    title: "Agentic Ledger explained",
    heading: "How the Agentic Ledger project works",
    intro: "A guided walk round a drawn merchant's counter. It plays by itself; use Back and Next, the dots, or the arrow keys to go at your own pace. Every verdict and payment plan is computed with the project's own rules.",
    card: `<style>${inline(CSS)}</style>` + card("Click it, then arrow keys change the scenario"),
    note: "Sources: mock_backend/main.py (spoof checks), agents/guardrails.py (payment plan, signing), models/metrics.json and the README.",
    data,
    modules: ["ledgerBench.data.js", "ledgerBench.live.js", "tour.js"],
    boot: `const figure = document.querySelector(".iso-figure");
const bench = mountLedgerBench(figure, { geometry, scenarios: SCENARIOS, kit, tour: false, hover: false });
const hooks = { step: (step) => step.scenario !== undefined && bench.choose(step.scenario) };
mountTour({ figure, panel: document.querySelector(".tour-panel"), geometry, steps: STEPS, kit, keys: document, hooks }).start(0);`,
  });
  console.log("explain", process.argv[explainAt + 1]);
}
