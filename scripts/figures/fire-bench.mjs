// Builds the "rules before the forest" figure for the IoT Fire Detection case study: a test booth, the
// ESP32-S3 sensor board, and a decision unit whose four rule levers can override the Random Forest.
// Drawn with the Anatomy isometric kit (src/lib/iso, MIT). Run: node scripts/figures/fire-bench.mjs [--preview f] [--explain f]
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "../../src/lib/iso/iso-kit.mjs";
import * as G from "../../src/lib/iso/lathe.mjs";
import { SCENARIOS } from "../../src/components/case-study/figures/fireBench.data.js";
import { STEPS } from "../../src/components/case-study/figures/fireBench.steps.js";
import { inline, kitSource, writeExplainer } from "./explainer.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
const WIDTH = 640;
const HEIGHT = 400;

// World units are about 1 px; x and y lie on the bench plate, z points up. Same plate and camera as Fig 1
// of the 1D-CNN study, so the figures share a scale.
const PLATE = { x: -150, y: -64, w: 300, d: 128, r: 8 };
const PLATE_H = 12;
const FOOT_H = 5;

// Test booth, back left: an open booth with a burner whose load changes with the scenario
const BOOTH = { x: -140, y: -58, w: 72, d: 58, r: 2 };
const WALL_TOP = 44;
const BURNER = [-100, -26];
const BURNER_TOP = 6;

// Breadboard with the ESP32-S3 and its five sensors, front centre
const BB = { x: -58, y: 6, w: 80, d: 44, r: 2 };
const BB_TOP = 7;
const PCB_TOP = BB_TOP + 1.2;
const ESP = { x: -30, y: 20, w: 44, d: 16, r: 1 };
const ESP_TOP = BB_TOP + 1.6;
const CAN = { x: -24, y: 22.5, w: 20, d: 11, r: 0.6 };
const BOARD_SCALE = 1.25;
const BOARD_ANCHOR = [BB.x + BB.w / 2, BB.y + BB.d / 2, 0];
const scaled = (point) => point.map((value, axis) => BOARD_ANCHOR[axis] + BOARD_SCALE * (value - BOARD_ANCHOR[axis]));
const ANTENNA = scaled([0, 28, ESP_TOP]);

// Decision unit, right: a case under a lid. On the lid: four rule levers, three lamps, the scenario knob and
// the Wi-Fi antenna. Inside: the forest, fed by five input rails
const DEC = { x: 40, y: -46, w: 96, d: 84, r: 4 };
const DEC_Z = 3;
const CASE_TOP = 14;
const LID_TOP = 24;
const FLOOR = 5.5;
const OPENING = k.insetPlan(DEC, 3);
const LEVERS = [58, 74, 90, 106].map((x) => ({ pivot: [x, -32, LID_TOP + 1.6], length: 10 }));
const LAMPS = [
  { label: "NORMAL", at: [60, 22] },
  { label: "WARNING", at: [80, 22] },
  { label: "FIRE", at: [100, 22] },
];
const KNOB = [122, 10];
const KNOB_R = 6;
const KNOB_TOP = LID_TOP + 4.5;
const MAST = [128, -38];
const MAST_TOP = LID_TOP + 18;
const LIFTS = { lid: 46 };

const deg = (value) => (value * Math.PI) / 180;
const FACING = 145;
const DETENTS = [-60, -20, 20, 60].map((offset) => deg(FACING + offset));

const P = k.fitProjection(
  [...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0), [BOOTH.x, BOOTH.y, WALL_TOP], [MAST[0], MAST[1], MAST_TOP + 30], [-40, 0, 76]],
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
// The sensor board is drawn at bench size and enlarged about its base centre, so it reads at 1x. A uniform
// scale of the world about a point is the same as scaling the picture about that point's projection.
const boardZone = (name, markup) => {
  const [cx, cy] = at(BOARD_ANCHOR);
  return `<g data-zone="${name}" transform="translate(${cx.toFixed(2)} ${cy.toFixed(2)}) scale(${BOARD_SCALE}) translate(${(-cx).toFixed(2)} ${(-cy).toFixed(2)})">${markup}</g>`;
};
const scale = G.scaleOf(P);

function screwsOn(plan, inset, z) {
  const points = k.corners(plan, inset);
  return L(points.map(([x, y]) => k.ring(x, y, 1.8, z, P, 14)).join(""), { tone: "lo" }) + D(points.map(([x, y]) => at([x, y, z])), { size: 0.45 });
}
const slots = (count, x0, gap, y, w, d) => L(Array.from({ length: count }, (_, index) => k.pathOf(k.ringOf({ x: x0 + index * gap, y, w, d, r: Math.min(w, d) / 2.2 }, 3), true)).join(""), { tone: "lo" });

function plate() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(PLATE, 22))) {
    out.push(S(k.cylinder(x, y, 7, -PLATE_H - FOOT_H, 1.6, P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: "mid" }));
  }
  out.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.6), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: "lo" }));
  out.push(screwsOn(PLATE, 10, 0));
  const strip = { x: -140, y: PLATE.y + PLATE.d - 16, w: 74, d: 7, r: 1 };
  out.push(S(k.slabOf(strip, 0, 0.6, P, 3), { tone: "lo", crease: "none" }));
  const ticks = k.topTicks(strip.x + 4, strip.x + strip.w - 4, 4, 5, strip.y + 0.8, 0.6, [2, 3.6], P);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  out.push(D([at([strip.x + 2, strip.y + 3.5, 0.6]), at([strip.x + strip.w - 2, strip.y + 3.5, 0.6])], { size: 0.45 }));
  return out.join("");
}

// A teardrop flame standing on a point, in screen space so it always faces the viewer
function flamePath([bx, by], width, height) {
  const f = (n) => n.toFixed(1);
  return `M${f(bx)} ${f(by)}C${f(bx - width)} ${f(by - height * 0.32)} ${f(bx - width * 0.35)} ${f(by - height * 0.78)} ${f(bx)} ${f(by - height)}C${f(bx + width * 0.35)} ${f(by - height * 0.78)} ${f(bx + width)} ${f(by - height * 0.32)} ${f(bx)} ${f(by)}Z`;
}
// A wisp of smoke or steam rising from a point: a gentle S in screen space, drawn bottom to top so the flow
// dashes move upward
function wisp([bx, by], height, sway, phase) {
  const points = Array.from({ length: 13 }, (_, index) => {
    const t = index / 12;
    return [bx + Math.sin(t * Math.PI * 1.6 + phase) * sway * t, by - t * height];
  });
  return k.pathOf(points);
}

function booth() {
  const out = [];
  out.push(S(k.slabOf(BOOTH, 0, 3, P, 4, 0.6), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(BOOTH, 3), 3, P, 4), { tone: "faint" }));
  out.push(S(k.slabOf({ x: BOOTH.x, y: BOOTH.y, w: BOOTH.w, d: 3, r: 0.5 }, 3, WALL_TOP - 3, P, 2, 0.4), { tone: "mid" }));
  out.push(S(k.slabOf({ x: BOOTH.x, y: BOOTH.y + 3, w: 3, d: BOOTH.d - 3, r: 0.5 }, 3, WALL_TOP - 3, P, 2, 0.4), { tone: "mid" }));
  // Extractor hood over the burner, carried on the back wall
  out.push(S(k.slabOf({ x: BOOTH.x + 3, y: BOOTH.y + 3, w: BOOTH.w - 3, d: 16, r: 1 }, WALL_TOP - 5, 3, P, 2, 0.5), { tone: "mid" }));
  out.push(D(k.dotGrid(BOOTH.x + 14, BOOTH.y + 7.5, 12, 3, 3.6, WALL_TOP - 2, P), { size: 0.35, tone: "lo" }));
  // Extractor vents on the back wall and an inspection hatch on the side wall
  out.push(`<g transform="${k.sideMatrix([BOOTH.x, BOOTH.y + 3], WALL_TOP, P, "left")}">${slots(6, 34, 5, 17, 2.2, 9)}</g>`);
  out.push(`<g transform="${k.sideMatrix([BOOTH.x + 3, BOOTH.y + BOOTH.d], WALL_TOP, P, "right")}">${L(k.pathOf(k.ringOf({ x: 12, y: 18, w: 22, d: 20, r: 1.5 }, 3), true), { tone: "lo" })}${D([[30, 28]], { size: 0.7 })}</g>`);
  const [cx, cy] = BURNER;
  out.push(S(k.cylinder(cx, cy, 13, 3, BURNER_TOP - 3, P, 48, 0.6), { tone: "mid" }));
  out.push(L(k.ring(cx, cy, 10.5, BURNER_TOP, P, 40) + k.ring(cx, cy, 4, BURNER_TOP, P, 24), { tone: "lo" }));
  out.push(L([0, 1, 2, 3].map((index) => k.lineOnTop(onCircle(BURNER, 4, deg(45 + index * 90)), onCircle(BURNER, 10.5, deg(45 + index * 90)), BURNER_TOP, P)).join(""), { tone: "lo" }));
  // What sits on the burner, one set per scenario; the live code shows the current one
  const pan = [
    S(k.cylinder(cx, cy, 9.5, BURNER_TOP, 4, P, 40, 0.4), { tone: "hi", crease: "lo" }),
    L(k.ring(cx, cy, 8.2, BURNER_TOP + 4, P, 40), { tone: "lo" }),
    S(k.slabOf({ x: cx + 9, y: cy - 1.2, w: 12, d: 2.4, r: 1 }, BURNER_TOP + 2.4, 1.2, P, 2), { tone: "mid" }),
  ].join("");
  const log = [
    S(k.slabOf({ x: cx - 8, y: cy - 4, w: 16, d: 8, r: 2.4 }, BURNER_TOP, 5, P, 4, 0.4), { tone: "lo", crease: "faint" }),
    `<g class="fb-ember">${[[-4, -1], [1, 1.5], [4.5, -0.5]].map(([dx, dy]) => `<circle cx="${at([cx + dx, cy + dy, BURNER_TOP + 5])[0].toFixed(1)}" cy="${at([cx + dx, cy + dy, BURNER_TOP + 5])[1].toFixed(1)}" r="0.9" style="fill:var(--anatomy-red)"/>`).join("")}</g>`,
  ].join("");
  const candle = [
    S(k.cylinder(cx, cy, 2.6, BURNER_TOP, 8, P, 24), { tone: "hi", crease: "lo" }),
    L(k.segment([cx, cy, BURNER_TOP + 8], [cx, cy, BURNER_TOP + 9.4], P), { tone: "mid" }),
  ].join("");
  const base = at([cx, cy, BURNER_TOP + 9.2]);
  const flame = `<path class="fb-flame" d="${flamePath(base, 2.6 * scale, 15 * scale)}" style="fill:var(--anatomy-red);opacity:.85"/><path class="fb-flame fb-core" d="${flamePath([base[0], base[1] - 0.6], 1.1 * scale, 7 * scale)}" style="fill:var(--anatomy-lit);opacity:.8"/>`;
  const rising = (from, height, tone) =>
    [-0.8, 0.4, 1.4].map((phase, index) => L(wisp([from[0] + (index - 1) * 2.2 * scale, from[1]], height * scale, 2.2 * scale, phase), { tone, flow: true, free: true })).join("");
  out.push(`<g data-prop="cooking">${pan}${rising(at([cx, cy, BURNER_TOP + 4]), 26, "faint")}</g>`);
  out.push(`<g data-prop="smoulder">${log}${rising(at([cx, cy, BURNER_TOP + 5]), 30, "mid")}</g>`);
  out.push(`<g data-prop="flame">${candle}${flame}</g>`);
  return out.join("");
}

// One sensor module: a small PCB on the breadboard, its part, and a status LED that lights when the reading
// meets a rule threshold
function led(id, [x, y]) {
  const [sx, sy] = at([x, y, PCB_TOP + 0.5]);
  return S(k.cylinder(x, y, 0.8, PCB_TOP, 0.5, P, 12), { tone: "lo" }) + `<circle class="fb-led" data-led="${id}" cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="${(0.9 * scale).toFixed(2)}"/>`;
}
const pcb = (plan) => S(k.slabOf(plan, BB_TOP, PCB_TOP - BB_TOP, P, 2, 0.3), { tone: "mid" });

function breadboard() {
  const out = [`<path class="iso-halo" d="${k.haloOf(k.insetPlan(BB, 3), 0, 2, P)}" style="filter:blur(5px)"/>`];
  for (const [x, y] of byDepth(k.corners(BB, 4))) out.push(S(k.cylinder(x, y, 2.4, 0, 2, P, 16), { tone: "lo" }));
  out.push(S(k.slabOf(BB, 2, BB_TOP - 2, P, 4, 0.6), { tone: "mid" }));
  // Power rails along the front edge and a field of contact holes
  out.push(L(k.planOutline({ x: BB.x + 3, y: BB.y + BB.d - 6.9, w: BB.w - 6, d: 0.8, r: 0.4 }, BB_TOP, P, 2) + k.planOutline({ x: BB.x + 3, y: BB.y + BB.d - 2.9, w: BB.w - 6, d: 0.8, r: 0.4 }, BB_TOP, P, 2), { tone: "lo" }));
  out.push(D(k.dotGrid(BB.x + 6, BB.y + BB.d - 5.4, 27, 2, 2.6, BB_TOP, P), { size: 0.3, tone: "faint" }));
  // Empty header for the PMS7003 particulate sensor, still to be fitted
  for (let index = 0; index < 8; index++) {
    const x = -10 + index * 2.6;
    out.push(S(k.slabOf({ x, y: 40, w: 1.9, d: 3, r: 0.3 }, BB_TOP, 1.6, P, 1), { tone: "lo", crease: "faint" }));
  }
  out.push(D(Array.from({ length: 8 }, (_, index) => at([-10 + index * 2.6 + 0.95, 41.5, BB_TOP + 1.6])), { size: 0.35, tone: "faint" }));
  return out.join("");
}

function esp32() {
  const out = [S(k.slabOf(ESP, BB_TOP, ESP_TOP - BB_TOP, P, 2, 0.3), { tone: "mid" })];
  const pins = (y) => Array.from({ length: 9 }, (_, index) => at([ESP.x + 2 + index * 2.54, y, ESP_TOP]));
  out.push(D([...pins(ESP.y + 1.2), ...pins(ESP.y + ESP.d - 1.2)], { size: 0.4, tone: "mid" }));
  out.push(S(k.slabOf({ x: ESP.x - 3, y: ESP.y + 5.5, w: 4, d: 5, r: 0.4 }, ESP_TOP, 1.8, P, 1), { tone: "mid" }));
  out.push(S(k.slabOf(CAN, ESP_TOP, 2, P, 2, 0.4), { tone: "hi", crease: "lo" }));
  out.push(L(k.planOutline(k.insetPlan(CAN, 1.2), ESP_TOP + 2, P, 2), { tone: "faint" }));
  // Printed antenna: a meander trace beyond the module can
  const meander = [[CAN.x + CAN.w, CAN.y + CAN.d - 1]];
  for (let index = 0; index <= 6; index++) {
    const x = CAN.x + CAN.w + 1 + index * 1.2;
    meander.push([x, index % 2 ? CAN.y + 1 : CAN.y + CAN.d - 1], [x, index % 2 ? CAN.y + CAN.d - 1 : CAN.y + 1]);
  }
  out.push(L(k.onTop(meander, ESP_TOP, P), { tone: "lo" }));
  out.push(D([at([...meander[meander.length - 1], ESP_TOP])], { size: 0.5, tone: "mid" }));
  return out.join("");
}

function sensors() {
  const out = { mq7: [], dht22: [], flame: [], pir: [], ldr: [] };
  // MQ-7 carbon monoxide: a mesh can
  out.mq7.push(pcb({ x: -54, y: 9, w: 12, d: 12, r: 0.6 }), led("mq7", [-52.4, 10.6]));
  out.mq7.push(S(k.cylinder(-48, 15, 4.4, PCB_TOP, 5, P, 32), { tone: "hi", crease: "lo" }));
  out.mq7.push(D(k.dotGrid(-50.4, 12.6, 4, 4, 1.6, PCB_TOP + 5, P), { size: 0.3, tone: "lo" }));
  // DHT22 temperature and humidity: a grilled box
  out.dht22.push(pcb({ x: -55, y: 30, w: 11, d: 15, r: 0.6 }), led("dht22", [-53.4, 43.4]));
  out.dht22.push(S(k.slabOf({ x: -54, y: 31, w: 9, d: 10, r: 0.6 }, PCB_TOP, 9, P, 2, 0.4), { tone: "hi", crease: "lo" }));
  out.dht22.push(`<g transform="${k.sideMatrix([-45, 41], PCB_TOP + 9, P, "right")}">${slots(4, 1.6, 2.2, 1.6, 1, 5.6)}</g>`);
  // Five-channel IR flame sensor: a bar of five LEDs
  out.flame.push(pcb({ x: -40, y: 8, w: 24, d: 7, r: 0.6 }), led("flame", [-17.6, 13.4]));
  for (const x of [-37, -32.5, -28, -23.5, -19]) {
    out.flame.push(S(k.cylinder(x, 10.4, 1.3, PCB_TOP, 2.6, P, 16), { tone: "hi", crease: "lo" }));
  }
  // PIR motion sensor: a stepped dome
  out.pir.push(pcb({ x: -12, y: 8, w: 11, d: 11, r: 0.6 }), led("pir", [-2.6, 17.4]));
  for (const [r, z, h] of [[4.6, PCB_TOP, 1.2], [3.8, PCB_TOP + 1.2, 1.4], [2.6, PCB_TOP + 2.6, 1]]) {
    out.pir.push(S(k.cylinder(-6.5, 13.5, r, z, h, P, 32), { tone: "hi", crease: "lo" }));
  }
  // LDR light sensor: a small disc with its squiggle
  out.ldr.push(pcb({ x: 2, y: 9, w: 8, d: 9, r: 0.6 }), led("ldr", [8.4, 16.4]));
  out.ldr.push(S(k.cylinder(5.6, 12.8, 2, PCB_TOP, 0.8, P, 20), { tone: "hi", crease: "lo" }));
  out.ldr.push(L(k.onTop([[3.62, 12.8], [4.4, 12.2], [5, 13.4], [5.6, 12], [6.2, 13.4], [6.8, 12.2], [7.58, 12.8]], PCB_TOP + 0.8, P), { tone: "lo" }));
  return Object.fromEntries(Object.entries(out).map(([name, parts]) => [name, parts.join("")]));
}

// Jumper wires from each sensor to the ESP32's header pins, arched a little above the board
function jumpers() {
  const wire = (from, to) => {
    const mid = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2, Math.max(from[2], to[2]) + 3.2];
    return k.wireSvg(at(from), at(to), { via: [at(mid)], tone: "lo", size: 0.7 });
  };
  return [
    wire([-42, 12, PCB_TOP], [-27.5, ESP.y + 1.2, ESP_TOP]),
    wire([-24, 15, PCB_TOP], [-20, ESP.y + 1.2, ESP_TOP]),
    wire([-6.5, 19, PCB_TOP], [-12.4, ESP.y + 1.2, ESP_TOP]),
    wire([4, 18, PCB_TOP], [-7.3, ESP.y + 1.2, ESP_TOP]),
    wire([-45, 38, PCB_TOP], [-27.5, ESP.y + ESP.d - 1.2, ESP_TOP]),
  ].join("");
}

// Decision unit: case with the forest inside, under a lid
const RAILS = [46.6, 26.6, 13.8, 6.8, 6.2]; // feature importance (%) reported in the README
function forest() {
  const out = [S(k.slabOf({ x: 64, y: -40, w: 66, d: 70, r: 1 }, FLOOR, 0.8, P, 2), { tone: "lo", crease: "none" })];
  let y = -38;
  for (const share of RAILS) {
    const d = share * 0.22;
    out.push(S(k.slabOf({ x: 46, y, w: 18, d, r: Math.min(0.6, d / 3) }, FLOOR, 1.6, P, 2), { tone: "mid" }));
    y += d + 2;
  }
  // Thirty trees, each standing for ten of the 300 in the README's model
  const trees = [];
  for (let col = 0; col < 6; col++) for (let row = 0; row < 5; row++) trees.push([70 + col * 11, -34 + row * 14]);
  for (const [x, y0] of byDepth(trees)) {
    const z = FLOOR + 0.8;
    out.push(S(k.cylinder(x, y0, 0.7, z, 1.6, P, 8), { tone: "lo" }));
    out.push(S(k.cylinder(x, y0, 3.2, z + 1.6, 1.8, P, 16), { tone: "hi", crease: "lo" }));
    out.push(S(k.cylinder(x, y0, 2.3, z + 3.4, 1.8, P, 12), { tone: "hi", crease: "lo" }));
    out.push(S(k.cylinder(x, y0, 1.3, z + 5.2, 1.8, P, 10), { tone: "hi", crease: "lo" }));
  }
  return out.join("");
}

function decisionCase() {
  const out = [`<path class="iso-halo" d="${k.haloOf(k.insetPlan(DEC, 4), 0, DEC_Z, P)}" style="filter:blur(5px)"/>`];
  for (const [x, y] of byDepth(k.corners(DEC, 7))) out.push(S(k.cylinder(x, y, 3.4, 0, DEC_Z, P, 20), { tone: "lo" }));
  out.push(S(k.slabOf(DEC, DEC_Z, CASE_TOP - DEC_Z, P, 6, 0.6), { tone: "mid" }));
  out.push(`<g transform="${k.sideMatrix([DEC.x + DEC.w, DEC.y + DEC.d], CASE_TOP, P, "right")}">${slots(9, 12, 6, 2.2, 2.2, 6)}</g>`);
  const rim = (z) => k.ringOf(OPENING, 3).map(([x, y]) => at([x, y, z]));
  const { x: x0, y: y0 } = OPENING;
  const x1 = OPENING.x + OPENING.w;
  const y1 = OPENING.y + OPENING.d;
  const quad = (points, shade) => `<path class="iso-shade" data-shade="${shade}" d="${k.pathOf(points.map(at), true)}"/>`;
  out.push(`<clipPath id="fb-cavity"><path d="${k.pathOf(rim(CASE_TOP), true)}"/></clipPath><g clip-path="url(#fb-cavity)">`);
  out.push(`<path class="iso-shade" data-shade="0" d="${k.pathOf(rim(FLOOR), true)}"/>`);
  out.push(quad([[x0, y0, CASE_TOP], [x1, y0, CASE_TOP], [x1, y0, FLOOR], [x0, y0, FLOOR]], 1));
  out.push(quad([[x0, y0, CASE_TOP], [x0, y1, CASE_TOP], [x0, y1, FLOOR], [x0, y0, FLOOR]], 2));
  out.push(L(k.segment([x0, y0, FLOOR], [x0, y0, CASE_TOP], P), { tone: "lo" }));
  out.push(forest());
  out.push("</g>");
  out.push(L(k.planOutline(OPENING, CASE_TOP, P, 3), { tone: "lo" }));
  return out.join("");
}

function decisionLid() {
  const out = [S(k.slabOf(DEC, CASE_TOP, LID_TOP - CASE_TOP, P, 6, 1.2), { tone: "mid" })];
  out.push(L(k.planOutline(k.insetPlan(DEC, 3.4), LID_TOP, P, 6), { tone: "faint" }));
  out.push(screwsOn(DEC, 6.5, LID_TOP));
  const label = { x: 10, y: 2, w: 34, d: 6.5, r: 1.2 };
  out.push(`<g transform="${k.sideMatrix([DEC.x, DEC.y + DEC.d], LID_TOP, P, "left")}">`);
  out.push(L(k.pathOf(k.ringOf(label, 3), true), { tone: "lo" }));
  out.push(L(`M${label.x + 4} 4.4H${label.x + 26}`, { tone: "lo", free: true }) + L(`M${label.x + 4} 6.6H${label.x + 18}`, { tone: "faint", free: true }));
  out.push(D([[label.x + 2, 5.3], [label.x + label.w - 2, 5.3]], { size: 0.45 }));
  out.push("</g>");
  return out.join("");
}

// The four rules, checked in order: a slot plate, a pivot and a lever that stands up when its rule fires.
// Rule n is marked with n dots.
export const leverTip = ({ pivot, length }, angle) => [pivot[0], pivot[1] + length * Math.cos(angle), pivot[2] + length * Math.sin(angle)];
function rules() {
  const out = [];
  LEVERS.forEach((lever, index) => {
    const [px, py] = lever.pivot;
    const plate = { x: px - 3.4, y: py - 4, w: 6.8, d: 16, r: 1 };
    out.push(S(k.slabOf(plate, LID_TOP, 0.6, P, 2), { tone: "lo", crease: "faint" }));
    out.push(L(k.planOutline({ x: px - 1, y: py + 1.6, w: 2, d: 9.6, r: 0.9 }, LID_TOP + 0.6, P, 3), { tone: "faint" }));
    out.push(D(Array.from({ length: index + 1 }, (_, dot) => at([px - 1.8 + dot * 1.2, py - 2.6, LID_TOP + 0.6])), { size: 0.4, tone: "mid" }));
    out.push(S(k.cylinder(px, py, 1.6, LID_TOP + 0.6, 1.6, P, 16), { tone: "mid" }));
  });
  LEVERS.forEach((lever, index) => {
    const tip = at(leverTip(lever, 0));
    out.push(`<path data-lever="${index}" class="iso-line" data-tone="hi" d="${k.pathOf([at(lever.pivot), tip])}" style="stroke-width:1.3"/>`);
    out.push(`<circle data-lever-tip="${index}" class="fb-tip" cx="${tip[0].toFixed(1)}" cy="${tip[1].toFixed(1)}" r="${(1.3 * scale).toFixed(2)}"/>`);
  });
  return out.join("");
}

function lamps() {
  return LAMPS.map(({ label, at: [x, y] }) =>
    [
      S(k.cylinder(x, y, 5, LID_TOP, 1.2, P, 32), { tone: "lo" }),
      S(k.cylinder(x, y, 3.8, LID_TOP + 1.2, 2, P, 32), { tone: "hi", crease: "lo" }),
      `<path class="fb-glow" data-lamp="${label}" d="${k.ring(x, y, 3.8, LID_TOP + 3.2, P, 40)}"/>`,
    ].join(""),
  ).join("");
}

export const pointerAt = (angle) => k.lineOnTop(onCircle(KNOB, -2, angle), onCircle(KNOB, KNOB_R - 0.3, angle), KNOB_TOP, P);
function selector() {
  const out = [];
  const [kx, ky] = KNOB;
  DETENTS.forEach((angle, index) => {
    out.push(L(k.lineOnTop(onCircle(KNOB, KNOB_R + 1.8, angle), onCircle(KNOB, KNOB_R + 4, angle), LID_TOP, P), { tone: "mid" }));
    const dots = Array.from({ length: index + 1 }, (_, dot) => onCircle(KNOB, KNOB_R + 6.2, angle + (dot - index / 2) * 0.16));
    out.push(D(dots.map(([x, y]) => at([x, y, LID_TOP])), { size: 0.5, tone: "mid" }));
  });
  out.push(S(k.cylinder(kx, ky, KNOB_R + 1, LID_TOP, 1.2, P, 32), { tone: "lo" }));
  out.push(S(k.cylinder(kx, ky, KNOB_R, LID_TOP + 1.2, KNOB_TOP - LID_TOP - 1.2, P, 36), { tone: "mid" }));
  out.push(L(k.knurl(kx, ky, KNOB_R, LID_TOP + 1.2, KNOB_TOP, 40, P), { tone: "lo" }));
  out.push(`<path data-part="pointer" class="iso-line" data-tone="hi" data-free="start" d="${pointerAt(DETENTS[0])}" style="stroke-width:1"/>`);
  return out.join("");
}

function mast() {
  const [x, y] = MAST;
  return [
    S(k.cylinder(x, y, 2.4, LID_TOP, 1.4, P, 20), { tone: "lo" }),
    S(k.cylinder(x, y, 0.9, LID_TOP + 1.4, MAST_TOP - LID_TOP - 1.4, P, 12), { tone: "mid" }),
    S(k.cylinder(x, y, 1.8, MAST_TOP, 2, P, 16), { tone: "hi", crease: "lo" }),
  ].join("");
}

// Wi-Fi: one JSON reading every 2 seconds, from the board's antenna to the decision unit's mast. The tour
// redraws it as the lid lifts, and the live code sends a packet along it.
const CABLES = [{ from: ANTENNA, to: [MAST[0], MAST[1], MAST_TOP + 2], rise: 58, drop: 30, lift: "lid", end: 1, style: "dotted" }];
function arc({ from, to, rise, drop }) {
  const c1 = [from[0], from[1], from[2] + rise];
  const c2 = [to[0], to[1], to[2] + drop];
  const points = Array.from({ length: 41 }, (_, index) => {
    const t = index / 40;
    const u = 1 - t;
    return [0, 1, 2].map((axis) => u * u * u * from[axis] + 3 * u * u * t * c1[axis] + 3 * u * t * t * c2[axis] + t * t * t * to[axis]);
  }).map(at);
  return L(k.pathOf(points), { tone: "faint", dotted: true });
}

const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label:
    "A fire-detection bench. In an open test booth a burner holds a pan, a smouldering log or a candle flame. A breadboard carries an ESP32-S3 with five sensors (MQ-7 carbon monoxide, DHT22 temperature and humidity, a five-LED flame sensor, a PIR motion dome and an LDR) and an empty header for a PMS7003. A dotted Wi-Fi path runs to a decision unit with four rule levers, three lamps for normal, warning and fire, and a scenario knob; inside it stands a forest of small trees fed by five input rails.",
  body: [
    zone("base", plate()),
    zone("booth", booth()),
    boardZone("board", breadboard() + jumpers()),
    boardZone("esp32", esp32()),
    ...Object.entries(sensors()).map(([name, markup]) => boardZone(name, markup)),
    zone("decider", decisionCase()),
    zone("decider", decisionLid(), "lid"),
    zone("rules", rules(), "lid"),
    zone("mast", mast(), "lid"),
    zone("lamps", lamps(), "lid"),
    zone("selector", selector(), "lid"),
    `<g data-zone="wifi" data-cable="0">${arc(CABLES[0])}</g>`,
    `<g data-zone="wifi" data-packet=""></g>`,
  ],
});

const GEOMETRY = { P, scale, knob: KNOB, knobR: KNOB_R, knobTop: KNOB_TOP, detents: DETENTS, levers: LEVERS, lifts: LIFTS, cables: CABLES };

writeFileSync(
  join(ROOT, "src/components/case-study/figures/fireBench.generated.js"),
  `// Generated by scripts/figures/fire-bench.mjs. Do not edit by hand.\nexport const svg = ${JSON.stringify(svg)};\nexport const geometry = ${JSON.stringify(GEOMETRY)};\n`,
);
console.log(`svg ${(svg.length / 1024).toFixed(1)} KB`);
for (const scenario of SCENARIOS) console.log(`  ${scenario.readout}`);

// Optional standalone pages: --preview <file> (the card alone) or --explain <file> (card + guided tour)
const KEYS = [
  { mark: "raised", label: "Levers: the four safety rules, checked before the forest" },
  { mark: "red", label: "Lamps: normal, warning, fire" },
  { mark: "dotted", label: "Wi-Fi: one reading every 2 seconds" },
];
const card = (hint) =>
  k.plateHtml({
    fig: "Fig 1",
    title: "Rules before the forest",
    hint,
    readout: SCENARIOS[0].readout,
    keys: KEYS,
    body: `<div class="iso-stage" tabindex="0" role="slider" aria-label="Scenario" aria-valuemin="1" aria-valuemax="4" aria-valuenow="1">${svg}</div>`,
  });
const data = `const geometry = ${JSON.stringify(GEOMETRY)};\nconst STEPS = ${JSON.stringify(STEPS)};`;
const FIRE_CSS = "fireBench.css";
const previewAt = process.argv.indexOf("--preview");
if (previewAt > 0) {
  const script = [kitSource(), data, inline("fireBench.data.js"), inline("fireBench.live.js"), `mountFireBench(document.querySelector(".iso-figure"), { geometry, scenarios: SCENARIOS, leds: LEDS, kit: { iso, lineOnTop, pathOf } });`].join("\n");
  const css = inline(FIRE_CSS);
  writeFileSync(process.argv[previewAt + 1], k.pageHtml({ title: "Fire bench", theme: "dark", body: `<style>${css}</style>${card("Hover or use arrow keys")}`, script, width: 720 }));
  console.log("preview", process.argv[previewAt + 1]);
}
const explainAt = process.argv.indexOf("--explain");
if (explainAt > 0) {
  writeExplainer({
    file: process.argv[explainAt + 1],
    title: "IoT Fire Detection explained",
    heading: "How the IoT Fire Detection project works",
    intro: "A guided walk round a drawn fire-detection bench. It plays by itself; use Back and Next, the dots, or the arrow keys to go at your own pace. The rules are copied from the receiver code; the model's numbers are the ones reported in the README.",
    card: `<style>${inline(FIRE_CSS)}</style>` + card("Click it, then arrow keys change the scenario"),
    note: "Sources: sensor_receiver.py (rules, inputs), the project README (model, dataset, results) and the case study.",
    data,
    modules: ["fireBench.data.js", "fireBench.live.js", "tour.js"],
    boot: `const figure = document.querySelector(".iso-figure");
const bench = mountFireBench(figure, { geometry, scenarios: SCENARIOS, leds: LEDS, kit, tour: false, hover: false });
const hooks = { step: (step) => step.scenario !== undefined && bench.choose(step.scenario) };
mountTour({ figure, panel: document.querySelector(".tour-panel"), geometry, steps: STEPS, kit, keys: document, hooks }).start(0);`,
  });
  console.log("explain", process.argv[explainAt + 1]);
}
