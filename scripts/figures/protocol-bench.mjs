// Builds the "same model, stricter test" figure for the PAC-1DCNN case study: a motor test bench
// wired to a classifier whose macro-F1 dial falls as the evaluation protocol gets stricter.
// Drawn with the Anatomy isometric kit (src/lib/iso, MIT). Run: node scripts/figures/protocol-bench.mjs [--preview out.html]
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "../../src/lib/iso/iso-kit.mjs";
import * as G from "../../src/lib/iso/lathe.mjs";
import { PROTOCOLS } from "../../src/components/case-study/figures/protocolBench.data.js";
import { STEPS } from "../../src/components/case-study/figures/protocolBench.steps.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
const WIDTH = 640;
const HEIGHT = 400;

// World units are about 1 px; x and y lie on the bench plate, z points up
const PLATE = { x: -150, y: -64, w: 300, d: 128, r: 8 };
const PLATE_H = 12;
const FOOT_H = 5;

const YB = -30; // bench axis
const ZC = 34; // shaft height
const MOTOR_X = -132;
const MOTOR_R = 22;
const LOAD_R = 16;
const AXIS = G.frameAlong([MOTOR_X, YB, ZC], [1, 0, 0]);
const at3 = (s) => [MOTOR_X + s, YB, ZC];

const SENSORS = [MOTOR_X + 64, MOTOR_X + 20]; // drive end, fan end
const SENSOR_R = 3;
const SENSOR_BASE = ZC + Math.sqrt(MOTOR_R ** 2 - SENSOR_R ** 2);
const SENSOR_TOP = SENSOR_BASE + 8;
const PLUG_TOP = SENSOR_TOP + 2.6;

const INST = { x: 40, y: -6, w: 96, d: 62, r: 4 };
const INST_Z = 3;
const INST_TOP = 21;
const DIAL = [100, 26];
const DIAL_R = 22;
const DIAL_H = 9;
const DIAL_TOP = INST_TOP + DIAL_H;
const KNOB = [58, 40];
const KNOB_R = 6.5;
const KNOB_TOP = INST_TOP + 5;
const PORT = [130, 21];
const PORT_TOP = INST_TOP + 3;

// Signal conditioner between the sensors and the classifier
const COND = { x: 50, y: -58, w: 56, d: 30, r: 3 };
const COND_TOP = 15;
const INPUTS = [[60, -46], [71, -46]];
const OUTPUT = [92, -37];
const SOCKET_TOP = COND_TOP + 3;

// Angles follow the kit: 0 points to -y and grows clockwise seen from above.
// The dial's open arc and the knob's detents both face the viewer.
const deg = (value) => (value * Math.PI) / 180;
const FACING = 145;
const SCALE_FROM = deg(FACING + 45);
const SCALE_SPAN = deg(270);
const DETENTS = [-60, -20, 20, 60].map((offset) => deg(FACING + offset));

const TRAY = { x: -128, y: 4, w: 112, d: 30, r: 3 };
const BEARINGS = [-110, -84, -58, -32].map((x) => [x, TRAY.y + TRAY.d / 2]);

const P = k.fitProjection(
  [...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0), [SENSORS[0], YB, PLUG_TOP + 14], [SENSORS[1], YB, PLUG_TOP + 14]],
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
const arcOnTop = (centre, radius, from, to, z) => k.onTop(Array.from({ length: 9 }, (_, step) => onCircle(centre, radius, from + ((to - from) * step) / 8)), z, P);

function screwsOn(plan, inset, z) {
  const points = k.corners(plan, inset);
  return L(points.map(([x, y]) => k.ring(x, y, 1.8, z, P, 14)).join(""), { tone: "lo" }) + D(points.map(([x, y]) => at([x, y, z])), { size: 0.45 });
}

function plate() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(PLATE, 22))) {
    out.push(S(k.cylinder(x, y, 7, -PLATE_H - FOOT_H, 1.6, P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: "mid" }));
  }
  out.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.6), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: "lo" }));
  out.push(screwsOn(PLATE, 10, 0));
  const strip = { x: -132, y: PLATE.y + PLATE.d - 16, w: 160, d: 7, r: 1 };
  out.push(S(k.slabOf(strip, 0, 0.6, P, 3), { tone: "lo", crease: "none" }));
  const ticks = k.topTicks(strip.x + 4, strip.x + strip.w - 4, 4, 5, strip.y + 0.8, 0.6, [2, 3.6], P);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  out.push(D([at([strip.x + 2, strip.y + 3.5, 0.6]), at([strip.x + strip.w - 2, strip.y + 3.5, 0.6])], { size: 0.45 }));
  return out.join("");
}

function tray() {
  const out = [S(k.slabOf(TRAY, 0, 3, P, 4, 0.6), { tone: "mid" })];
  out.push(L(k.planOutline(k.insetPlan(TRAY, 2.4), 3, P, 4), { tone: "faint" }));
  BEARINGS.forEach(([x, y], index) => {
    out.push(L(k.ring(x, y, 10.4, 3, P, 40), { tone: "faint" }));
    out.push(S(k.cylinder(x, y, 9.4, 3, 3.6, P, 48, 0.4), { tone: "hi", crease: "lo" }));
    out.push(L(k.ring(x, y, 7.6, 6.6, P, 40), { tone: "lo" }));
    out.push(L(k.ring(x, y, 4.6, 6.6, P, 32), { tone: "lo" }));
    out.push(L(k.ring(x, y, 2.6, 6.6, P, 24), { tone: "mid" }));
    const balls = Array.from({ length: 9 }, (_, index) => onCircle([x, y], 6.1, (index / 9) * Math.PI * 2));
    out.push(D(balls.map(([bx, by]) => at([bx, by, 6.6])), { size: 0.9, tone: "mid" }));
    // Healthy, inner-race, ball and outer-race fault, left to right
    const fault = (radius) => `<path class="iso-line" data-tone="red" d="${arcOnTop([x, y], radius, deg(FACING - 26), deg(FACING + 26), 6.6)}" style="stroke-width:1.3"/>`;
    if (index === 1) out.push(fault(4.6));
    if (index === 3) out.push(fault(7.6));
    if (index === 2) {
      const [sx, sy] = at([...balls[4], 6.6]);
      out.push(`<circle cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="1.25" style="fill:var(--anatomy-red)"/>`);
    }
  });
  return out.join("");
}

// The motor is two half shells split at shaft height, so the explainer can lift the top half off and show
// the section underneath: shaft, fan, rotor, stator and the bearing at each end
const HALF = G.frameOf([MOTOR_X, YB, ZC], [1, 0, 0], [0, 1, 0], [0, 0, 1]);
const MOTOR_SEGMENTS = [[0, 12, 18], [12, 70, MOTOR_R], [70, 76, 19], [76, 80, 10]];
const halfDisc = (radius, upper, count = 40) =>
  Array.from({ length: count + 1 }, (_, index) => {
    const angle = (upper ? 0 : Math.PI) + (index / count) * Math.PI;
    return [radius * Math.cos(angle), radius * Math.sin(angle)];
  });
const onShell = (s, radius, angle) => at(G.pointOf(HALF, s, radius, angle));
const shellRibs = (s0, s1, radius, count, from) =>
  Array.from({ length: count }, (_, index) => {
    const angle = from + ((index + 0.5) / count) * Math.PI;
    return { d: k.pathOf([onShell(s0, radius, angle), onShell(s1, radius, angle)]), alpha: G.fadeOf(G.facingOf(HALF, angle, P), [0.1, 0.55]) };
  });
const faceArc = (s, radius, from, count = 20) => k.pathOf(Array.from({ length: count + 1 }, (_, index) => onShell(s, radius, from + (index / count) * Math.PI)));

function motorHalf(upper) {
  const from = upper ? 0 : Math.PI;
  const out = MOTOR_SEGMENTS.map(([s0, s1, radius]) => S(G.prismOf(HALF, halfDisc(radius, upper), s0, s1, P), { tone: "mid" }));
  out.push(k.fadedSvg(shellRibs(14, 68, MOTOR_R, 20, from), { tone: "lo" }));
  out.push(L(G.arcOf(HALF, 14, MOTOR_R, P, { from, to: from + Math.PI }) + G.arcOf(HALF, 68, MOTOR_R, P, { from, to: from + Math.PI }), { tone: "lo" }));
  out.push(D([30, 90, 150].map((angle) => onShell(76, 15, from + deg(angle))), { size: 0.5 }));
  out.push(L(faceArc(80, 6.4, from), { tone: "faint" }));
  return out.join("");
}

// What turns inside the motor, in shaft coordinates (s along the axis from the fan end)
const RUN = { rotor: [24, 58], rotorR: 11.4, fan: 7, fanR: 12.6, feBearing: 14.5, deBearing: 65.5, ballOrbit: 6, ballR: 1.25 };

// Lines on the cut face of the lower half (z = ZC), in shaft coordinates: s along the axis, y across it
function section() {
  const X = (s) => MOTOR_X + s;
  const rect = (s0, s1, y0, y1) => k.onTop([[X(s0), YB + y0], [X(s1), YB + y0], [X(s1), YB + y1], [X(s0), YB + y1]], ZC, P, true);
  const line = (s0, y0, s1, y1) => k.onTop([[X(s0), YB + y0], [X(s1), YB + y1]], ZC, P);
  const both = (draw) => draw(1) + draw(-1);
  const out = [];
  // Housing wall and the end shields that seat the bearings
  out.push(L(both((side) => line(12, side * 19.6, 68, side * 19.6) + line(12, side * 10.6, 12, side * 19.6) + line(68, side * 10.6, 68, side * 19.6)), { tone: "lo" }));
  // Stator with its laminations, rotor with its bars
  out.push(L(both((side) => rect(22, 60, side * 12.6, side * 19.6)), { tone: "mid" }));
  out.push(L(both((side) => Array.from({ length: 12 }, (_, index) => line(24.9 + index * 3, side * 12.6, 24.9 + index * 3, side * 19.6)).join("")), { tone: "faint" }));
  // Bearing rings in section: fan end, then the drive end, which carries the faults in the CWRU recordings.
  // The damaged spot (red) sits where the balls cross the cut, so each pass is a knock you can see.
  for (const [s0, tone] of [[RUN.feBearing - 2.5, "mid"], [RUN.deBearing - 2.5, "hi"]]) {
    out.push(L(both((side) => rect(s0, s0 + 5, side * 7.2, side * 10.6) + rect(s0, s0 + 5, side * 3, side * 4.8)), { tone }));
  }
  out.push(`<path class="iso-line" data-tone="red" d="${line(RUN.deBearing - 1, 7.2, RUN.deBearing + 1, 7.2)}" style="stroke-width:1.3"/>`);
  // The parts that turn stand whole in the open housing: shaft, fan and rotor. Their bars, blades and the
  // bearing balls are slots the explainer redraws every frame as the motor runs.
  out.push(`<g data-spin="balls-fe"></g>`);
  out.push(S(G.prismOf(HALF, halfDisc(3, true, 16), 2, 80, P), { tone: "mid" }));
  out.push(S(G.prismOf(HALF, halfDisc(RUN.fanR, true, 32), RUN.fan - 1, RUN.fan, P), { tone: "mid" }));
  out.push(L(faceArc(RUN.fan, 3.4, 0), { tone: "lo" }));
  out.push(`<g data-spin="fan"></g>`);
  out.push(S(G.prismOf(HALF, halfDisc(RUN.rotorR, true, 40), RUN.rotor[0], RUN.rotor[1], P), { tone: "mid" }));
  out.push(`<g data-spin="rotor"></g><g data-spin="balls-de"></g><g data-spin="knock"></g>`);
  return out.join("");
}

function motorBase(insides) {
  const out = [];
  const bed = { x: MOTOR_X - 4, y: YB - 20, w: 86, d: 40, r: 3 };
  out.push(S(k.slabOf(bed, 0, 6, P, 4, 0.6), { tone: "mid" }));
  out.push(screwsOn(bed, 4.5, 6));
  for (const s of [14, 62]) {
    out.push(S(k.slabOf({ x: MOTOR_X + s - 6, y: YB - 9, w: 12, d: 18, r: 1.5 }, 6, ZC - MOTOR_R - 6, P, 3, 0.4), { tone: "mid" }));
  }
  out.push(motorHalf(false));
  if (insides) out.push(section());
  return out.join("");
}

function sensors() {
  const out = [];
  for (const x of SENSORS) {
    out.push(S(k.cylinder(x, YB, SENSOR_R, SENSOR_BASE, SENSOR_TOP - SENSOR_BASE, P, 24), { tone: "hi", crease: "lo" }));
    out.push(L(k.sideArc(x, YB, SENSOR_R, SENSOR_BASE + 2.2, P, 16), { tone: "faint" }));
    out.push(S(k.cylinder(x, YB, 1.7, SENSOR_TOP, PLUG_TOP - SENSOR_TOP, P, 16), { tone: "mid" }));
  }
  return out.join("");
}

function driveline() {
  const out = [];
  out.push(S(G.disc(80, 92, 3, AXIS, P), { tone: "mid" }));
  out.push(S(G.disc(92, 97.6, 8, AXIS, P), { tone: "mid" }));
  out.push(S(G.disc(97.6, 98.8, 6.6, AXIS, P), { tone: "lo" }));
  out.push(S(G.disc(98.8, 104.4, 8, AXIS, P), { tone: "mid" }));
  out.push(`<g data-spin="coupling">${D(G.dotsOf(AXIS, 104.4, 5.4, 4, P, { all: true }), { size: 0.45 })}</g>`);
  out.push(S(G.disc(104.4, 112, 3, AXIS, P), { tone: "mid" }));
  const stand = { x: MOTOR_X + 116, y: YB - 13, w: 36, d: 26, r: 2 };
  out.push(S(k.slabOf(stand, 0, ZC - LOAD_R, P, 4, 0.6), { tone: "mid" }));
  out.push(screwsOn(stand, 3.5, ZC - LOAD_R));
  const load = G.solidOf([[112, 12], [116, 12], [116, LOAD_R], [156, LOAD_R], [156, 12], [160, 12]], AXIS, P);
  out.push(S(load, { tone: "mid" }));
  out.push(L(G.arcOf(AXIS, 126, LOAD_R, P) + G.arcOf(AXIS, 146, LOAD_R, P), { tone: "faint" }));
  out.push(S(G.disc(160, 164, 5.5, AXIS, P), { tone: "mid" }));
  out.push(k.fadedSvg(G.ribsOf(AXIS, 160, 164, 5.5, 28, P, { fade: [0.1, 0.55] }), { tone: "lo" }));
  return out.join("");
}

// The classifier is an open case under a lid. Inside, a board lays PAC-1DCNN out in the order the signal
// travels, right to left: input (2 channels), the fixed 11-tap filter, stream 1 (kernel 5, five fins) and,
// bypassing the filter, stream 2 (kernel 15, fifteen fins), then fusion, attention and a head with one lamp per class
const CASE_TOP = 11;
const FLOOR = 5.5;
const OPENING = k.insetPlan(INST, 3);
const BOARD_Z = FLOOR + 0.8;
const MODULES = {
  input: { x: 110, y: 14, w: 8, d: 10, r: 1, h: 3 },
  filter: { x: 92, y: 3, w: 12, d: 10, r: 1, h: 3.4 },
  stream1: { x: 74, y: 3, w: 13, d: 10, r: 1, h: 2.6 },
  stream2: { x: 73, y: 24, w: 30, d: 10, r: 1, h: 2.6 },
  fusion: { x: 63, y: 4, w: 7, d: 30, r: 1, h: 3.4 },
  attention: { x: 54, y: 10, w: 6, d: 18, r: 1, h: 2.8 },
  head: { x: 45, y: 7, w: 6, d: 24, r: 1, h: 2.4 },
};
const TRACES = [
  [[110, 17], [107, 17], [107, 8], [104, 8]],
  [[110, 21], [107, 21], [107, 29], [103, 29]],
  [[92, 8], [87, 8]],
  [[74, 8], [70, 8]],
  [[73, 29], [70, 29]],
  [[63, 19], [60, 19]],
  [[54, 19], [51, 19]],
];

function boardModule(name) {
  const plan = MODULES[name];
  const top = BOARD_Z + plan.h;
  const out = [S(k.slabOf(plan, BOARD_Z, plan.h, P, 2, 0.3), { tone: "mid" })];
  const fins = (count, x0, gap, y, depth) => {
    for (let index = 0; index < count; index++) out.push(S(k.slabOf({ x: x0 + index * gap, y, w: 0.8, d: depth, r: 0.2 }, top, 1.4, P, 1), { tone: "hi", crease: "lo" }));
  };
  if (name === "input") out.push(D([at([112.5, 19, top]), at([115.5, 19, top])], { size: 0.7, tone: "hi" }));
  if (name === "filter") out.push(D(Array.from({ length: 11 }, (_, index) => at([93 + index, plan.y + plan.d / 2, top])), { size: 0.38, tone: "hi" }));
  if (name === "stream1") fins(5, 75.6, 2.4, plan.y + 1, plan.d - 2);
  if (name === "stream2") fins(15, 74.6, 1.9, plan.y + 1, plan.d - 2);
  if (name === "fusion") out.push(L(k.planOutline(k.insetPlan(plan, 1.4), top, P, 2), { tone: "faint" }));
  if (name === "attention") {
    out.push(S(k.cylinder(57, 19, 2.2, top, 0.8, P, 24), { tone: "hi", crease: "lo" }));
    out.push(L(k.ring(57, 19, 1.2, top + 0.8, P, 16), { tone: "mid" }));
  }
  if (name === "head") {
    for (const y of [10, 16, 22, 28]) {
      out.push(S(k.cylinder(48, y, 1.3, top, 0.9, P, 16), { tone: "hi", crease: "lo" }));
    }
  }
  return out.join("");
}

function board() {
  const out = [S(k.slabOf(k.insetPlan(OPENING, 1), FLOOR, BOARD_Z - FLOOR, P, 3), { tone: "lo", crease: "none" })];
  for (const trace of TRACES) {
    const d = k.onTop(trace, BOARD_Z, P);
    out.push(L(d, { tone: "lo" }), L(d, { tone: "mid", flow: true }));
  }
  const order = Object.keys(MODULES).sort((a, b) => {
    const centre = (plan) => [plan.x + plan.w / 2, plan.y + plan.d / 2, 0];
    return k.depthOf(centre(MODULES[a]), P) - k.depthOf(centre(MODULES[b]), P);
  });
  for (const name of order) out.push(boardModule(name));
  return out.join("");
}

function instrumentCase(insides) {
  const out = [`<path class="iso-halo" d="${k.haloOf(k.insetPlan(INST, 4), 0, INST_Z, P)}" style="filter:blur(5px)"/>`];
  for (const [x, y] of byDepth(k.corners(INST, 7))) out.push(S(k.cylinder(x, y, 3.4, 0, INST_Z, P, 20), { tone: "lo" }));
  out.push(S(k.slabOf(INST, INST_Z, CASE_TOP - INST_Z, P, 6, 0.6), { tone: "mid" }));
  const front = INST.y + INST.d;
  out.push(`<g transform="${k.sideMatrix([INST.x + INST.w, front], CASE_TOP, P, "right")}">`);
  out.push(L(Array.from({ length: 7 }, (_, index) => k.pathOf(k.ringOf({ x: 10 + index * 6, y: 1.8, w: 2.2, d: 4.6, r: 1 }, 3), true)).join(""), { tone: "lo" }));
  out.push("</g>");
  if (!insides) return out.join("");
  // The cavity, seen through the opening: floor, the two far walls and the board
  const rim =(z) => k.ringOf(OPENING, 3).map(([x, y]) => at([x, y, z]));
  const { x: x0, y: y0 } = OPENING;
  const x1 = OPENING.x + OPENING.w;
  const y1 = OPENING.y + OPENING.d;
  const quad = (points, shade) => `<path class="iso-shade" data-shade="${shade}" d="${k.pathOf(points.map(at), true)}"/>`;
  out.push(`<clipPath id="pb-cavity"><path d="${k.pathOf(rim(CASE_TOP), true)}"/></clipPath><g clip-path="url(#pb-cavity)">`);
  out.push(`<path class="iso-shade" data-shade="0" d="${k.pathOf(rim(FLOOR), true)}"/>`);
  out.push(quad([[x0, y0, CASE_TOP], [x1, y0, CASE_TOP], [x1, y0, FLOOR], [x0, y0, FLOOR]], 1));
  out.push(quad([[x0, y0, CASE_TOP], [x0, y1, CASE_TOP], [x0, y1, FLOOR], [x0, y0, FLOOR]], 2));
  out.push(L(k.segment([x0, y0, FLOOR], [x0, y0, CASE_TOP], P), { tone: "lo" }));
  out.push(board());
  out.push("</g>");
  out.push(L(k.planOutline(OPENING, CASE_TOP, P, 3), { tone: "lo" }));
  return out.join("");
}

function instrumentLid() {
  const out = [S(k.slabOf(INST, CASE_TOP, INST_TOP - CASE_TOP, P, 6, 1.2), { tone: "mid" })];
  out.push(L(k.planOutline(k.insetPlan(INST, 3.4), INST_TOP, P, 6), { tone: "faint" }));
  out.push(screwsOn(INST, 6.5, INST_TOP));
  out.push(socket(PORT, INST_TOP));
  // Label plate on the front face, drawn in the face's plane
  const label = { x: 12, y: 1.6, w: 34, d: 7, r: 1.2 };
  out.push(`<g transform="${k.sideMatrix([INST.x, INST.y + INST.d], INST_TOP, P, "left")}">`);
  out.push(L(k.pathOf(k.ringOf(label, 3), true), { tone: "lo" }));
  out.push(L(`M${label.x + 4} 4.2H${label.x + 26}`, { tone: "lo", free: true }) + L(`M${label.x + 4} 6.6H${label.x + 18}`, { tone: "faint", free: true }));
  out.push(D([[label.x + 2, 5.1], [label.x + label.w - 2, 5.1]], { size: 0.45 }));
  out.push("</g>");
  return out.join("");
}

// Protocol selector: four detents, the k-th marked with k dots
function selector() {
  const out = [];
  const [kx, ky] = KNOB;
  DETENTS.forEach((angle, index) => {
    out.push(L(k.lineOnTop(onCircle(KNOB, KNOB_R + 1.8, angle), onCircle(KNOB, KNOB_R + 4, angle), INST_TOP, P), { tone: "mid" }));
    const dots = Array.from({ length: index + 1 }, (_, dot) => onCircle(KNOB, KNOB_R + 6.2, angle + (dot - index / 2) * 0.16));
    out.push(D(dots.map(([x, y]) => at([x, y, INST_TOP])), { size: 0.5, tone: "mid" }));
  });
  out.push(S(k.cylinder(kx, ky, KNOB_R + 1, INST_TOP, 1.2, P, 32), { tone: "lo" }));
  out.push(S(k.cylinder(kx, ky, KNOB_R, INST_TOP + 1.2, KNOB_TOP - INST_TOP - 1.2, P, 36), { tone: "mid" }));
  out.push(L(k.knurl(kx, ky, KNOB_R, INST_TOP + 1.2, KNOB_TOP, 40, P), { tone: "lo" }));
  return out.join("");
}

// Dial: macro-F1 from 0 to 100 over 270 degrees
function dial() {
  const out = [];
  const [dx, dy] = DIAL;
  out.push(S(k.cylinder(dx, dy, DIAL_R, INST_TOP, DIAL_H, P, 64, 0.8), { tone: "hi", crease: "lo" }));
  out.push(L(k.knurl(dx, dy, DIAL_R, DIAL_TOP - 3.4, DIAL_TOP, 84, P, 0.3), { tone: "lo" }));
  out.push(L(k.sideArc(dx, dy, DIAL_R, DIAL_TOP - 3.4, P, 40), { tone: "faint" }));
  out.push(L(k.ring(dx, dy, DIAL_R - 2.2, DIAL_TOP, P, 64), { tone: "lo" }));
  const ticks = k.radialTicks(dx, dy, DIAL_R - 3, 50, 5, DIAL_TOP, [1.3, 2.9], P, SCALE_FROM, SCALE_SPAN);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  out.push(L(k.lineOnTop(onCircle(DIAL, DIAL_R - 7, SCALE_FROM), onCircle(DIAL, DIAL_R - 3, SCALE_FROM), DIAL_TOP, P), { tone: "hi" }));
  out.push(L(k.ring(dx, dy, 1.8, DIAL_TOP, P, 16), { tone: "mid" }));
  return out.join("");
}

function socket([x, y], z) {
  return (
    L(k.ring(x, y, 3.6, z, P, 20), { tone: "lo" }) +
    S(k.cylinder(x, y, 2.6, z, 3, P, 20), { tone: "mid" }) +
    L(k.ring(x, y, 1.2, z + 3, P, 12), { tone: "lo" })
  );
}

function conditioner() {
  const out = [`<path class="iso-halo" d="${k.haloOf(k.insetPlan(COND, 3), 0, 2, P)}" style="filter:blur(5px)"/>`];
  out.push(S(k.slabOf(COND, 0, COND_TOP, P, 4, 0.8), { tone: "mid", inner: L(k.sideSeam(COND, 4, P, 4), { tone: "faint" }) }));
  out.push(L(k.planOutline(k.insetPlan(COND, 2.6), COND_TOP, P, 4), { tone: "faint" }));
  out.push(screwsOn(COND, 4.6, COND_TOP));
  for (const input of INPUTS) out.push(socket(input, COND_TOP));
  out.push(socket(OUTPUT, COND_TOP));
  out.push(D([at([87, -50, COND_TOP]), at([91.5, -50, COND_TOP])], { size: 0.8, tone: "hi", pulse: true }));
  return out.join("");
}

// A cable leaves its plug straight up, arches over and drops straight into its socket
function cable(from, to, rise, drop) {
  const c1 = [from[0], from[1], from[2] + rise];
  const c2 = [to[0], to[1], to[2] + drop];
  const points = Array.from({ length: 41 }, (_, step) => {
    const t = step / 40;
    const u = 1 - t;
    return [0, 1, 2].map((axis) => u * u * u * from[axis] + 3 * u * u * t * c1[axis] + 3 * u * t * t * c2[axis] + t * t * t * to[axis]);
  }).map(at);
  return k.wireSvg(points[0], points[40], { via: points.slice(1, 40), tone: "lo", size: 1 }) + L(k.pathOf(points), { tone: "mid", flow: true });
}

// How far the explainer lifts the motor's top half and the classifier's lid. `end` is the cable end
// that rides on the lifted part (0 = from, 1 = to), so the cable can be redrawn as it stretches.
const LIFTS = { motor: 30, lid: 52 };
const CABLES = [
  ...SENSORS.map((x, index) => ({ from: [x, YB, PLUG_TOP], to: [...INPUTS[index], SOCKET_TOP], rise: 30 + index * 6, drop: 50 + index * 6, lift: "motor", end: 0 })),
  { from: [...OUTPUT, SOCKET_TOP], to: [...PORT, PORT_TOP], rise: 7, drop: 12, lift: "lid", end: 1 },
];
const cableGroup = (index) => `<g data-zone="cables" data-cable="${index}">${cable(CABLES[index].from, CABLES[index].to, CABLES[index].rise, CABLES[index].drop)}</g>`;

export const needleAt = (value) => {
  const angle = SCALE_FROM + (value / 100) * SCALE_SPAN;
  return k.lineOnTop(onCircle(DIAL, -3.6, angle), onCircle(DIAL, DIAL_R - 4.2, angle), DIAL_TOP + 0.2, P);
};
export const pointerAt = (angle) => k.lineOnTop(onCircle(KNOB, -2.2, angle), onCircle(KNOB, KNOB_R - 0.3, angle), KNOB_TOP, P);

// The site ships the closed bench; the explainer also draws the insides it lifts the covers off
const makeSvg = (insides) => k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label:
    "A motor test bench on a plate: a motor with vibration sensors at its drive end and fan end, a coupling and a load unit, and a tray of four bearings marked healthy, inner-race, ball and outer-race fault. Two cables run to a classifier with a four-position test-protocol selector and a dial that reads macro-F1. As the selector moves to stricter protocols, the needle falls from 99.9 to 35.1.",
  body: [
    zone("base", plate()),
    zone("motor", motorBase(insides)),
    zone("motor", motorHalf(true), "motor"),
    zone("sensors", sensors(), "motor"),
    zone("load", driveline()),
    zone("conditioner", conditioner()),
    cableGroup(0),
    cableGroup(1),
    zone("tray", tray()),
    zone("instrument", instrumentCase(insides)),
    zone("instrument", instrumentLid(), "lid"),
    cableGroup(2),
    zone("selector", selector() + `<path data-part="pointer" class="iso-line" data-tone="hi" data-free="start" d="${pointerAt(DETENTS[0])}" style="stroke-width:1"/>`, "lid"),
    zone("dial", dial() + `<path data-part="needle" class="iso-line" data-tone="lit" data-free="start" d="${needleAt(PROTOCOLS[0].f1)}" style="stroke-width:1.1"/>`, "lid"),
  ],
});
// The site figure carries the insides too: its guided tour lifts the covers off
const svg = makeSvg(true);

const GEOMETRY = { P, dial: DIAL, dialR: DIAL_R, dialTop: DIAL_TOP, scaleFrom: SCALE_FROM, scaleSpan: SCALE_SPAN, knob: KNOB, knobR: KNOB_R, knobTop: KNOB_TOP, detents: DETENTS, lifts: LIFTS, cables: CABLES };
// What the guided tour animates as the motor runs
const RUNNING = { ...RUN, x0: MOTOR_X, yb: YB, zc: ZC, view: G.viewOf(P), scale: G.scaleOf(P), axis: AXIS, coupling: [104.4, 5.4] };

writeFileSync(
  join(ROOT, "src/components/case-study/figures/protocolBench.generated.js"),
  `// Generated by scripts/figures/protocol-bench.mjs. Do not edit by hand.\nexport const svg = ${JSON.stringify(svg)};\nexport const geometry = ${JSON.stringify(GEOMETRY)};\nexport const running = ${JSON.stringify(RUNNING)};\n`,
);
console.log(`svg ${(svg.length / 1024).toFixed(1)} KB`);

// Optional standalone pages, no server needed: --preview <file> (the card alone) or --explain <file> (card + guided walkthrough)
const KEYS = [
  { mark: "lit", label: "Needle: PAC-1DCNN's clean macro-F1" },
  { mark: "raised", label: "Selector: four test protocols" },
  { mark: "red", label: "Tray: healthy, inner-race, ball and outer-race bearings; red marks the damage" },
];
const kitSource = () => readFileSync(join(ROOT, "src/lib/iso/iso-kit.mjs"), "utf8").replace(/^export /gm, "");
const liveSource = () => readFileSync(join(ROOT, "src/components/case-study/figures/protocolBench.live.js"), "utf8").replace(/^import .*$/gm, "").replace(/^export /gm, "");
const card = (hint, art) =>
  k.plateHtml({
    fig: "Fig 1",
    title: "Same model, stricter test",
    hint,
    readout: PROTOCOLS[0].readout,
    keys: KEYS,
    body: `<div class="iso-stage" tabindex="0" role="slider" aria-label="Test protocol" aria-valuemin="1" aria-valuemax="4" aria-valuenow="1">${art}</div>`,
  });

const PAGE_CSS = readFileSync(join(ROOT, "scripts/figures/explainer.css"), "utf8");
const TOUR_CSS = readFileSync(join(ROOT, "src/components/case-study/figures/protocolBench.tour.css"), "utf8");
const tourSource = () => readFileSync(join(ROOT, "src/components/case-study/figures/protocolBench.tour.js"), "utf8").replace(/^export /gm, "");
const BOOT = `
const figure = document.querySelector(".iso-figure");
const bench = mountProtocolBench(figure, { geometry, protocols: PROTOCOLS, lineOnTop, tour: false, hover: false });
const kit = { iso, pathOf, wireSvg, lineSvg, dotsSvg, ring, translateAlong, screenRise };
mountTour({ figure, panel: document.querySelector(".pb-tour"), geometry, running: RUNNING, steps: STEPS, bench, kit, keys: document }).start(0);
`;

function writePage(file, guide) {
  const data = `const PROTOCOLS = ${JSON.stringify(PROTOCOLS)};\nconst geometry = ${JSON.stringify(GEOMETRY)};\n`;
  if (!guide) {
    const script = `${kitSource()}\n${data}${liveSource()}\nmountProtocolBench(document.querySelector(".iso-figure"), { geometry, protocols: PROTOCOLS, lineOnTop });`;
    writeFileSync(file, k.pageHtml({ title: "Protocol bench", theme: "dark", body: card("Hover or use arrow keys", svg), script, width: 720 }));
    return;
  }
  const guidePanel = `<aside class="pb-tour" aria-live="polite"><span class="pb-count"></span><h2 class="pb-title"></h2><p class="pb-text"></p><div class="pb-bar"><span></span></div><div class="pb-controls"><button type="button" data-back>Back</button><button type="button" data-play>Pause</button><button type="button" data-next>Next</button></div><div class="pb-dots"></div><p class="pb-note">Sources: the project README tables (regenerated from results/) and its case study.</p></aside>`;
  const intro = `<header class="ex-head"><h1>How the PAC-1DCNN project works</h1><p>A guided walk round a drawn test bench. It plays by itself; use Back and Next, the dots, or the arrow keys to go at your own pace. Every number on the dial is a saved result from the project.</p></header>`;
  const figure = card("Click it, then arrow keys move the selector", svg).replace('<figure class="iso-figure">', '<figure class="iso-figure pb-figure">');
  const body = `<style>${TOUR_CSS}${PAGE_CSS}</style><div class="ex">${intro}<div class="ex-grid">${figure}${guidePanel}</div></div>`;
  const script = `${kitSource()}\n${data}const STEPS = ${JSON.stringify(STEPS)};\nconst RUNNING = ${JSON.stringify(RUNNING)};\n${liveSource()}\n${tourSource()}\n${BOOT}`;
  const page = k.pageHtml({ title: "PAC-1DCNN explained", theme: "dark", body, script, width: 1280 });
  writeFileSync(file, page.replace('<main class="iso-page">', '<main class="iso-page" style="width:auto;margin:0">'));
}

for (const [flag, guide] of [["--preview", false], ["--explain", true]]) {
  const index = process.argv.indexOf(flag);
  if (index > 0) {
    writePage(process.argv[index + 1], guide);
    console.log(flag.slice(2), process.argv[index + 1]);
  }
}
