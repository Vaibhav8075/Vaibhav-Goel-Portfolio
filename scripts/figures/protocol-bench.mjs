// Builds the "same model, stricter test" figure for the PAC-1DCNN case study: a motor test bench
// wired to a classifier whose macro-F1 dial falls as the evaluation protocol gets stricter.
// Drawn with the Anatomy isometric kit (src/lib/iso, MIT). Run: node scripts/figures/protocol-bench.mjs [--preview out.html]
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "../../src/lib/iso/iso-kit.mjs";
import * as G from "../../src/lib/iso/lathe.mjs";
import { PROTOCOLS } from "../../src/components/case-study/figures/protocolBench.data.js";

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
  for (const [x, y] of BEARINGS) {
    out.push(L(k.ring(x, y, 10.4, 3, P, 40), { tone: "faint" }));
    out.push(S(k.cylinder(x, y, 9.4, 3, 3.6, P, 48, 0.4), { tone: "hi", crease: "lo" }));
    out.push(L(k.ring(x, y, 7.6, 6.6, P, 40), { tone: "lo" }));
    out.push(L(k.ring(x, y, 4.6, 6.6, P, 32), { tone: "lo" }));
    out.push(L(k.ring(x, y, 2.6, 6.6, P, 24), { tone: "mid" }));
    const balls = Array.from({ length: 9 }, (_, index) => onCircle([x, y], 6.1, (index / 9) * Math.PI * 2));
    out.push(D(balls.map(([bx, by]) => at([bx, by, 6.6])), { size: 0.9, tone: "mid" }));
  }
  return out.join("");
}

function motor() {
  const out = [];
  const bed = { x: MOTOR_X - 4, y: YB - 20, w: 86, d: 40, r: 3 };
  out.push(S(k.slabOf(bed, 0, 6, P, 4, 0.6), { tone: "mid" }));
  out.push(screwsOn(bed, 4.5, 6));
  for (const s of [14, 62]) {
    out.push(S(k.slabOf({ x: MOTOR_X + s - 6, y: YB - 9, w: 12, d: 18, r: 1.5 }, 6, ZC - MOTOR_R - 6, P, 3, 0.4), { tone: "mid" }));
  }
  const body = G.solidOf([[0, 18], [12, 18], [12, MOTOR_R], [70, MOTOR_R], [70, 19], [76, 19], [76, 10], [80, 10]], AXIS, P);
  out.push(S(body, { tone: "mid" }));
  out.push(k.fadedSvg(G.ribsOf(AXIS, 14, 68, MOTOR_R, 40, P, { fade: [0.1, 0.55], seams: true }), { tone: "lo" }));
  out.push(D(G.dotsOf(AXIS, 76, 15, 6, P, { all: true }), { size: 0.5 }));
  out.push(L(G.circleOf(AXIS, 80, 6.4, P, 32), { tone: "faint" }));
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
  out.push(D(G.dotsOf(AXIS, 104.4, 5.4, 4, P, { all: true }), { size: 0.45 }));
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

function instrument() {
  const out = [`<path class="iso-halo" d="${k.haloOf(k.insetPlan(INST, 4), 0, INST_Z, P)}" style="filter:blur(5px)"/>`];
  for (const [x, y] of byDepth(k.corners(INST, 7))) out.push(S(k.cylinder(x, y, 3.4, 0, INST_Z, P, 20), { tone: "lo" }));
  out.push(S(k.slabOf(INST, INST_Z, INST_TOP - INST_Z, P, 6, 1.2), { tone: "mid", inner: L(k.sideSeam(INST, INST_Z + 4, P, 6), { tone: "faint" }) }));
  out.push(L(k.planOutline(k.insetPlan(INST, 3.4), INST_TOP, P, 6), { tone: "faint" }));
  out.push(screwsOn(INST, 6.5, INST_TOP));
  out.push(socket(PORT, INST_TOP));
  // Label plate on the front face and vent slots on the side face, drawn in each face's plane
  const front = INST.y + INST.d;
  const label = { x: 12, y: 4, w: 34, d: 8, r: 1.2 };
  out.push(`<g transform="${k.sideMatrix([INST.x, front], INST_TOP, P, "left")}">`);
  out.push(L(k.pathOf(k.ringOf(label, 3), true), { tone: "lo" }));
  out.push(L(`M${label.x + 4} 6.6H${label.x + 26}`, { tone: "lo", free: true }) + L(`M${label.x + 4} 9.2H${label.x + 18}`, { tone: "faint", free: true }));
  out.push(D([[label.x + 2, 8], [label.x + label.w - 2, 8]], { size: 0.45 }));
  out.push("</g>");
  out.push(`<g transform="${k.sideMatrix([INST.x + INST.w, front], INST_TOP, P, "right")}">`);
  out.push(L(Array.from({ length: 7 }, (_, index) => k.pathOf(k.ringOf({ x: 10 + index * 6, y: 4, w: 2.2, d: 8, r: 1 }, 3), true)).join(""), { tone: "lo" }));
  out.push("</g>");
  // Protocol selector: four detents, the k-th marked with k dots
  const [kx, ky] = KNOB;
  DETENTS.forEach((angle, index) => {
    out.push(L(k.lineOnTop(onCircle(KNOB, KNOB_R + 1.8, angle), onCircle(KNOB, KNOB_R + 4, angle), INST_TOP, P), { tone: "mid" }));
    const dots = Array.from({ length: index + 1 }, (_, dot) => onCircle(KNOB, KNOB_R + 6.2, angle + (dot - index / 2) * 0.16));
    out.push(D(dots.map(([x, y]) => at([x, y, INST_TOP])), { size: 0.5, tone: "mid" }));
  });
  out.push(S(k.cylinder(kx, ky, KNOB_R + 1, INST_TOP, 1.2, P, 32), { tone: "lo" }));
  out.push(S(k.cylinder(kx, ky, KNOB_R, INST_TOP + 1.2, KNOB_TOP - INST_TOP - 1.2, P, 36), { tone: "mid" }));
  out.push(L(k.knurl(kx, ky, KNOB_R, INST_TOP + 1.2, KNOB_TOP, 40, P), { tone: "lo" }));
  // Dial: macro-F1 from 0 to 100 over 270 degrees
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

const sensorCables = () =>
  SENSORS.map((x, index) => cable([x, YB, PLUG_TOP], [...INPUTS[index], SOCKET_TOP], 30 + index * 6, 50 + index * 6)).join("");
const signalCable = () => cable([...OUTPUT, SOCKET_TOP], [...PORT, PORT_TOP], 7, 12);

export const needleAt = (value) => {
  const angle = SCALE_FROM + (value / 100) * SCALE_SPAN;
  return k.lineOnTop(onCircle(DIAL, -3.6, angle), onCircle(DIAL, DIAL_R - 4.2, angle), DIAL_TOP + 0.2, P);
};
export const pointerAt = (angle) => k.lineOnTop(onCircle(KNOB, -2.2, angle), onCircle(KNOB, KNOB_R - 0.3, angle), KNOB_TOP, P);

const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label:
    "A motor test bench on a plate: a motor with vibration sensors at its drive end and fan end, a coupling and a load unit, and a tray of spare bearings. Two cables run to a classifier with a four-position test-protocol selector and a dial that reads macro-F1. As the selector moves to stricter protocols, the needle falls from 99.9 to 35.1.",
  body: [
    plate(),
    motor(),
    driveline(),
    conditioner(),
    sensorCables(),
    tray(),
    instrument(),
    signalCable(),
    `<path data-part="pointer" class="iso-line" data-tone="hi" data-free="start" d="${pointerAt(DETENTS[0])}" style="stroke-width:1"/>`,
    `<path data-part="needle" class="iso-line" data-tone="lit" data-free="start" d="${needleAt(PROTOCOLS[0].f1)}" style="stroke-width:1.1"/>`,
  ],
});

const GEOMETRY = { P, dial: DIAL, dialR: DIAL_R, dialTop: DIAL_TOP, scaleFrom: SCALE_FROM, scaleSpan: SCALE_SPAN, knob: KNOB, knobR: KNOB_R, knobTop: KNOB_TOP, detents: DETENTS };

writeFileSync(
  join(ROOT, "src/components/case-study/figures/protocolBench.generated.js"),
  `// Generated by scripts/figures/protocol-bench.mjs. Do not edit by hand.\nexport const svg = ${JSON.stringify(svg)};\nexport const geometry = ${JSON.stringify(GEOMETRY)};\n`,
);
console.log(`svg ${(svg.length / 1024).toFixed(1)} KB`);

const previewAt = process.argv.indexOf("--preview");
if (previewAt > 0) {
  const live = readFileSync(join(ROOT, "src/components/case-study/figures/protocolBench.live.js"), "utf8").replace(/^import .*$/gm, "").replace(/^export /gm, "");
  const data = `const PROTOCOLS = ${JSON.stringify(PROTOCOLS)};`;
  const body = k.plateHtml({
    fig: "Fig 1",
    title: "Same model, stricter test",
    hint: "Hover or use arrow keys",
    readout: PROTOCOLS[0].readout,
    keys: [{ mark: "lit", label: "Needle: PAC-1DCNN clean macro-F1" }, { mark: "raised", label: "Selector: four test protocols" }],
    caption: "Preview",
    body: `<div class="iso-stage" tabindex="0">${svg}</div>`,
  });
  const kit = readFileSync(join(ROOT, "src/lib/iso/iso-kit.mjs"), "utf8").replace(/^export /gm, "");
  const script = `${kit}\n${data}\nconst geometry = ${JSON.stringify(GEOMETRY)};\n${live}\nmountProtocolBench(document.querySelector(".iso-figure"), { geometry, protocols: PROTOCOLS, lineOnTop });`;
  writeFileSync(process.argv[previewAt + 1], k.pageHtml({ title: "Protocol bench", theme: "dark", body, script, width: 720 }));
  console.log("preview", process.argv[previewAt + 1]);
}
