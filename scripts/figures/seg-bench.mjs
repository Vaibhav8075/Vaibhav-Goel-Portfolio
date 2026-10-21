// Builds the "every pixel sorted" figure for the Road Scene Segmentation case study: a road diorama seen by a
// camera, the segmentation unit with its two model cartridges and speed dial, and six class cylinders filled to
// each class's measured test IoU.
// Drawn with the Anatomy isometric kit (src/lib/iso, MIT). Run: node scripts/figures/seg-bench.mjs [--preview f] [--explain f]
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "../../src/lib/iso/iso-kit.mjs";
import * as G from "../../src/lib/iso/lathe.mjs";
import { CLASSES, SCENARIOS } from "../../src/components/case-study/figures/segBench.data.js";
import { STEPS } from "../../src/components/case-study/figures/segBench.steps.js";
import { inline, kitSource, writeExplainer } from "./explainer.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
const WIDTH = 640;
const HEIGHT = 400;

// Same plate and camera as the other case-study figures, so they share a scale
const PLATE = { x: -150, y: -64, w: 300, d: 128, r: 8 };
const PLATE_H = 12;
const FOOT_H = 5;

// Road diorama, back left, and the camera that looks at it
const DIO = { x: -142, y: -58, w: 66, d: 52, r: 2 };
const DIO_TOP = 2.4;
const CAM = [-64, -4];
const LENS_Z = 25;

// Segmentation unit, centre: a case under a lid; on the lid the two model cartridges, the speed dial and the knob
const SEG = { x: -52, y: -46, w: 54, d: 48, r: 4 };
const SEG_Z = 3;
const SEG_CASE = 14;
const SEG_TOP = 26;
const SEG_OPEN = k.insetPlan(SEG, 3);
const SEG_FLOOR = 5.5;
const CARTS = [{ id: "deeplab", x: -44 }, { id: "segformer", x: -26 }];
const CART_RAISE = 6;
const DIAL = [-12, -16];
const DIAL_R = 7;
const DIAL_TOP = SEG_TOP + 3;
const MS_MAX = 40;
const KNOB = [-12, 0];
const KNOB_R = 4.4;
const KNOB_TOP = SEG_TOP + 4;
const CHUTE = [SEG.x + SEG.w, SEG.y + SEG.d / 2, 12];
const LIFTS = { unit: 30 };

// Six class cylinders on a rack, right, in front of a scale board; 40 units of height is 100% IoU
const RACK = { x: 12, y: -10, w: 132, d: 26, r: 2 };
const RACK_TOP = 3;
const BOARD = { x: 12, y: -12, w: 132, d: 2.4, r: 0.6 };
const BOARD_TOP = 50;
const TUBE_X = [24, 46, 68, 90, 112, 134].map((x) => x - 2);
const TUBE_Y = 4;
const TUBE_R = 7;
const FULL = 40;
const TUBE_TOP = RACK_TOP + FULL + 2;

const deg = (value) => (value * Math.PI) / 180;
const FACING = 145;
const DETENTS = [deg(FACING - 40), deg(FACING + 40)];
const MS_FROM = deg(FACING + 40);
const MS_SPAN = deg(280);

const P = k.fitProjection(
  [...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0), [SEG.x, SEG.y, SEG_TOP + 34], [BOARD.x + BOARD.w, BOARD.y, BOARD_TOP], [DIO.x, DIO.y, 32]],
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
const strip = (plan, z) => L(k.planOutline(plan, z, P, 1), { tone: "lo" });

function plate() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(PLATE, 22))) {
    out.push(S(k.cylinder(x, y, 7, -PLATE_H - FOOT_H, 1.6, P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: "mid" }));
  }
  out.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.6), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: "lo" }));
  out.push(screwsOn(PLATE, 10, 0));
  const ruler = { x: -132, y: PLATE.y + PLATE.d - 18, w: 130, d: 7, r: 1 };
  out.push(S(k.slabOf(ruler, 0, 0.6, P, 3), { tone: "lo", crease: "none" }));
  const ticks = k.topTicks(ruler.x + 4, ruler.x + ruler.w - 4, 4, 5, ruler.y + 0.8, 0.6, [2, 3.6], P);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  out.push(D([at([ruler.x + 2, ruler.y + 3.5, 0.6]), at([ruler.x + ruler.w - 2, ruler.y + 3.5, 0.6])], { size: 0.45 }));
  return out.join("");
}

// The street: a building, the road with lane dashes and a crossing, a kerbed sidewalk, a car and a sign
function diorama() {
  const out = [halo(DIO), S(k.slabOf(DIO, 0, DIO_TOP, P, 3, 0.6), { tone: "lo" })];
  const building = { x: DIO.x + 2, y: DIO.y + 2, w: 22, d: 14, r: 0.8 };
  out.push(S(k.slabOf(building, DIO_TOP, 28, P, 2, 0.6), { tone: "mid" }));
  out.push(`<g transform="${k.sideMatrix([building.x, building.y + building.d], DIO_TOP + 28, P, "left")}">${slots(3, 3, 6.4, 4, 3.2, 4)}${slots(3, 3, 6.4, 11, 3.2, 4)}${slots(3, 3, 6.4, 18, 3.2, 4)}</g>`);
  const road = { x: DIO.x + 2, y: DIO.y + 18, w: DIO.w - 4, d: 18, r: 0.6 };
  out.push(S(k.slabOf(road, DIO_TOP, 0.4, P, 1), { tone: "mid", crease: "none" }));
  for (let dash = 0; dash < 5; dash++) out.push(strip({ x: road.x + 4 + dash * 12, y: road.y + road.d / 2 - 0.5, w: 6, d: 1, r: 0.4 }, DIO_TOP + 0.4));
  for (let stripe = 0; stripe < 5; stripe++) out.push(strip({ x: road.x + road.w - 14, y: road.y + 1.5 + stripe * 3.2, w: 10, d: 1.6, r: 0.3 }, DIO_TOP + 0.4));
  const kerb = { x: DIO.x + 2, y: road.y + road.d, w: DIO.w - 4, d: 10, r: 0.6 };
  out.push(S(k.slabOf(kerb, DIO_TOP, 2.2, P, 1, 0.3), { tone: "mid" }));
  // Car: body, cabin and four wheels on axles across the road
  const car = { x: road.x + 6, y: road.y + 3, w: 18, d: 8, r: 1.5 };
  const AXLE = (x) => G.frameAlong([x, car.y - 0.6, DIO_TOP + 2.4], [0, 1, 0]);
  for (const x of [car.x + 4, car.x + car.w - 4]) out.push(S(G.disc(0, 1.2, 2.2, AXLE(x), P), { tone: "lo" }));
  out.push(S(k.slabOf(car, DIO_TOP + 1.4, 4, P, 3, 0.4), { tone: "hi", crease: "lo" }));
  out.push(S(k.slabOf(k.insetPlan({ ...car, x: car.x + 4, w: 10 }, 0.8), DIO_TOP + 5.4, 3, P, 3, 0.4), { tone: "hi", crease: "lo" }));
  const AXLE_FRONT = (x) => G.frameAlong([x, car.y + car.d - 0.6, DIO_TOP + 2.4], [0, 1, 0]);
  for (const x of [car.x + 4, car.x + car.w - 4]) out.push(S(G.disc(0, 1.2, 2.2, AXLE_FRONT(x), P), { tone: "lo" }));
  // Sign: a post and a plate on the sidewalk
  const [px, py] = [kerb.x + 36, kerb.y + 5];
  out.push(S(k.cylinder(px, py, 0.7, DIO_TOP + 2.2, 16, P, 10), { tone: "mid" }));
  out.push(S(k.slabOf({ x: px - 3.2, y: py - 0.6, w: 6.4, d: 1.2, r: 0.3 }, DIO_TOP + 14, 6, P, 1), { tone: "hi", crease: "lo" }));
  out.push(`<g transform="${k.sideMatrix([px - 3.2, py + 0.6], DIO_TOP + 20, P, "left")}">${L(k.pathOf([[3.2, 1], [5.6, 5], [0.8, 5]], true), { tone: "lo" })}</g>`);
  return out.join("");
}

function camera() {
  const [cx, cy] = CAM;
  const out = [S(k.cylinder(cx, cy, 4.4, 0, 1.6, P, 24), { tone: "lo" }), S(k.cylinder(cx, cy, 1.1, 1.6, LENS_Z - 5, P, 12), { tone: "mid" })];
  out.push(S(k.slabOf({ x: cx - 5, y: cy - 4, w: 10, d: 8, r: 1 }, LENS_Z - 3.6, 7.2, P, 2, 0.5), { tone: "mid" }));
  const LENS = G.frameAlong([cx - 5, cy, LENS_Z], [-1, 0, 0]);
  out.push(S(G.disc(0, 4, 2.6, LENS, P), { tone: "hi", crease: "lo" }));
  return out.join("");
}

// Segmentation unit: an open case with the model inside (3 input channels in, 6 class maps out) under a lid
function unitCase() {
  const out = [halo(SEG)];
  for (const [x, y] of byDepth(k.corners(SEG, 6))) out.push(S(k.cylinder(x, y, 3, 0, SEG_Z, P, 16), { tone: "lo" }));
  out.push(S(k.slabOf(SEG, SEG_Z, SEG_CASE - SEG_Z, P, 4, 0.6), { tone: "mid" }));
  out.push(`<g transform="${k.sideMatrix([SEG.x + SEG.w, SEG.y + SEG.d], SEG_CASE, P, "right")}">${slots(5, 6, 5, 2.4, 2, 5.4)}</g>`);
  const rim = (z) => k.ringOf(SEG_OPEN, 3).map(([x, y]) => at([x, y, z]));
  const { x: x0, y: y0 } = SEG_OPEN;
  const x1 = SEG_OPEN.x + SEG_OPEN.w;
  const y1 = SEG_OPEN.y + SEG_OPEN.d;
  const quad = (points, shade) => `<path class="iso-shade" data-shade="${shade}" d="${k.pathOf(points.map(at), true)}"/>`;
  out.push(`<clipPath id="sb-cavity"><path d="${k.pathOf(rim(SEG_CASE), true)}"/></clipPath><g clip-path="url(#sb-cavity)">`);
  out.push(`<path class="iso-shade" data-shade="0" d="${k.pathOf(rim(SEG_FLOOR), true)}"/>`);
  out.push(quad([[x0, y0, SEG_CASE], [x1, y0, SEG_CASE], [x1, y0, SEG_FLOOR], [x0, y0, SEG_FLOOR]], 1));
  out.push(quad([[x0, y0, SEG_CASE], [x0, y1, SEG_CASE], [x0, y1, SEG_FLOOR], [x0, y0, SEG_FLOOR]], 2));
  // Input: red, green and blue channel plates
  ["red", "green", "blue"].forEach((channel, index) => {
    out.push(`<g class="sb-channel" data-channel="${channel}">${S(k.slabOf({ x: SEG.x + 6 + index * 2.2, y: SEG.y + 10, w: 1.2, d: 26, r: 0.3 }, SEG_FLOOR, 6, P, 1), { tone: "hi", crease: "lo" })}</g>`);
  });
  // Encoder down to small, rich features, decoder back up to full size
  [24, 18, 12, 8].forEach((depth, stage) => out.push(S(k.slabOf({ x: SEG.x + 15 + stage * 3.6, y: SEG.y + 24 - depth / 2, w: 2.6, d: depth, r: 0.4 }, SEG_FLOOR, 2 + stage * 0.8, P, 1), { tone: "mid", crease: "lo" })));
  [8, 12, 18, 24].forEach((depth, stage) => out.push(S(k.slabOf({ x: SEG.x + 30.4 + stage * 3.6, y: SEG.y + 24 - depth / 2, w: 2.6, d: depth, r: 0.4 }, SEG_FLOOR, 4.4 - stage * 0.8, P, 1), { tone: "mid", crease: "lo" })));
  // Output: six class maps, one per class
  CLASSES.forEach((cls, index) => {
    out.push(`<g class="sb-map" style="--class:${cls.colour}">${S(k.slabOf({ x: SEG.x + 45 + index * 1.2, y: SEG.y + 10, w: 0.8, d: 26, r: 0.2 }, SEG_FLOOR, 6, P, 1), { tone: "hi", crease: "lo" })}</g>`);
  });
  out.push("</g>");
  out.push(L(k.planOutline(SEG_OPEN, SEG_CASE, P, 3), { tone: "lo" }));
  // Output chute on the right face, where sorted pixels leave
  out.push(S(G.disc(0, 4, 3, G.frameAlong([SEG.x + SEG.w, CHUTE[1], CHUTE[2]], [1, 0, 0]), P), { tone: "mid" }));
  return out.join("");
}

export const msNeedle = (ms) => {
  const angle = MS_FROM + (ms / MS_MAX) * MS_SPAN;
  return k.lineOnTop(onCircle(DIAL, -1.4, angle), onCircle(DIAL, DIAL_R - 1.6, angle), DIAL_TOP + 0.2, P);
};
export const pointerAt = (angle) => k.lineOnTop(onCircle(KNOB, -1.8, angle), onCircle(KNOB, KNOB_R - 0.3, angle), KNOB_TOP, P);
function unitLid() {
  const out = [S(k.slabOf(SEG, SEG_CASE, SEG_TOP - SEG_CASE, P, 4, 1), { tone: "mid" })];
  out.push(L(k.planOutline(k.insetPlan(SEG, 3), SEG_TOP, P, 4), { tone: "faint" }));
  out.push(screwsOn(SEG, 4.6, SEG_TOP));
  // mIoU window on the front face
  out.push(`<g transform="${k.sideMatrix([SEG.x, SEG.y + SEG.d], SEG_TOP, P, "left")}">${L(k.pathOf(k.ringOf({ x: 6, y: 3, w: 26, d: 7, r: 1 }, 3), true), { tone: "lo" })}<text class="sb-display" data-part="miou" x="8.6" y="8.2" font-size="4.2">0.825 mIoU</text></g>`);
  // Cartridge holder: a slot for each model
  for (const cart of CARTS) out.push(L(k.planOutline({ x: cart.x - 1, y: -43, w: 16, d: 10, r: 1 }, SEG_TOP, P, 3), { tone: "lo" }));
  // Speed dial: forward pass per 512x1024 image, 0 to 40 ms
  const [dx, dy] = DIAL;
  out.push(S(k.cylinder(dx, dy, DIAL_R, SEG_TOP, 3, P, 40, 0.5), { tone: "hi", crease: "lo" }));
  out.push(L(k.ring(dx, dy, DIAL_R - 1, DIAL_TOP, P, 40), { tone: "lo" }));
  const ticks = k.radialTicks(dx, dy, DIAL_R - 1.2, 8, 4, DIAL_TOP, [1, 2], P, MS_FROM, MS_SPAN);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  out.push(L(k.ring(dx, dy, 1, DIAL_TOP, P, 12), { tone: "mid" }));
  out.push(`<path data-part="ms" class="iso-line" data-tone="lit" data-free="start" d="${msNeedle(21)}" style="stroke-width:1"/>`);
  // Model knob: DeepLabV3+ or SegFormer-B2
  const [kx, ky] = KNOB;
  DETENTS.forEach((angle) => out.push(L(k.lineOnTop(onCircle(KNOB, KNOB_R + 1.4, angle), onCircle(KNOB, KNOB_R + 3, angle), SEG_TOP, P), { tone: "mid" })));
  out.push(S(k.cylinder(kx, ky, KNOB_R + 0.8, SEG_TOP, 1, P, 28), { tone: "lo" }));
  out.push(S(k.cylinder(kx, ky, KNOB_R, SEG_TOP + 1, KNOB_TOP - SEG_TOP - 1, P, 28), { tone: "mid" }));
  out.push(L(k.knurl(kx, ky, KNOB_R, SEG_TOP + 1, KNOB_TOP, 30, P), { tone: "lo" }));
  out.push(`<path data-part="pointer" class="iso-line" data-tone="hi" data-free="start" d="${pointerAt(DETENTS[0])}" style="stroke-width:1"/>`);
  return out.join("");
}
// Model cartridges, drawn seated; the live code raises the one not in use. DeepLabV3+ carries the three ASPP
// dilation rings (6, 12, 18); SegFormer-B2 its four-stage pyramid.
function cartridge({ id, x }) {
  const plan = { x, y: -42, w: 14, d: 8, r: 1 };
  const out = [S(k.slabOf(plan, SEG_TOP, 5, P, 3, 0.5), { tone: "hi", crease: "lo" })];
  const top = SEG_TOP + 5;
  if (id === "deeplab") out.push(L([1.2, 2.2, 3.2].map((radius) => k.ring(x + 7, -38, radius, top, P, 24)).join(""), { tone: "lo" }));
  else out.push(L([0, 1, 2, 3].map((stage) => k.planOutline({ x: x + 1.4 + stage * 1.4, y: -40.6 + stage * 0.7, w: 11.2 - stage * 2.8, d: 5.2 - stage * 1.4, r: 0.4 }, top, P, 2)).join(""), { tone: "lo" }));
  return `<g data-cart="${id}">${out.join("")}</g>`;
}

// Class cylinders: a rack, a scale board with 10% ticks, and per class a liquid (redrawn by the live code) inside
// a glass outline, with a colour disc at its foot
const towards = k.towardViewer(P);
const silhouette = (x, y, radius) => [[x - towards[1] * radius, y + towards[0] * radius], [x + towards[1] * radius, y - towards[0] * radius]];
function rack() {
  const out = [halo(RACK), S(k.slabOf(RACK, 0, RACK_TOP, P, 3, 0.6), { tone: "mid" })];
  out.push(S(k.slabOf(BOARD, RACK_TOP, BOARD_TOP - RACK_TOP, P, 2, 0.4), { tone: "mid" }));
  // Level lines across the board's face every 10%, brighter at 50% and 100%
  const face = BOARD.y + BOARD.d;
  const level = (share) => {
    const v = BOARD_TOP - (RACK_TOP + share * FULL);
    return `M2 ${v.toFixed(2)}H${(BOARD.w - 2).toFixed(2)}`;
  };
  const minor = [1, 2, 3, 4, 6, 7, 8, 9].map((tenth) => level(tenth / 10)).join("");
  out.push(`<g transform="${k.sideMatrix([BOARD.x, face], BOARD_TOP, P, "left")}">${L(minor, { tone: "faint" })}${L(level(0.5) + level(1), { tone: "lo" })}</g>`);
  // End posts the level lines run between
  for (const x of [BOARD.x, BOARD.x + BOARD.w - 2]) out.push(S(k.slabOf({ x, y: face - 0.4, w: 2, d: 1.4, r: 0.3 }, RACK_TOP, BOARD_TOP - RACK_TOP, P, 1), { tone: "mid" }));
  return out.join("");
}
function tube(index) {
  const x = TUBE_X[index];
  const out = [];
  out.push(S(k.cylinder(x, TUBE_Y, TUBE_R + 1.2, RACK_TOP, 1.2, P, 32), { tone: "lo" }));
  out.push(`<g class="sb-liquid" data-liquid="${index}" style="--class:${CLASSES[index].colour}"></g>`);
  const [a, b] = silhouette(x, TUBE_Y, TUBE_R);
  out.push(L(k.segment([a[0], a[1], RACK_TOP + 1.2], [a[0], a[1], TUBE_TOP], P) + k.segment([b[0], b[1], RACK_TOP + 1.2], [b[0], b[1], TUBE_TOP], P), { tone: "mid" }));
  out.push(L(k.ring(x, TUBE_Y, TUBE_R, TUBE_TOP, P, 40) + k.sideArc(x, TUBE_Y, TUBE_R, RACK_TOP + 1.2, P, 32), { tone: "mid" }));
  out.push(`<g class="sb-swatch" style="--class:${CLASSES[index].colour}">${S(k.cylinder(x, TUBE_Y + TUBE_R + 4.2, 1.8, RACK_TOP, 0.6, P, 16), { tone: "hi" })}</g>`);
  return out.join("");
}

const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label:
    "A segmentation bench. A camera on a stand looks at a road diorama with a building, a road with lane dashes and a crossing, a sidewalk, a car and a sign. A segmentation unit carries two model cartridges, DeepLabV3+ and SegFormer-B2, a speed dial and an mIoU window; inside it three colour channels go in and six class maps come out. Sorted pixels fly from its chute into six glass cylinders, one per class, each filled to that class's measured test IoU.",
  body: [
    zone("base", plate()),
    zone("scene", diorama()),
    zone("unit", unitCase()),
    zone("unit", unitLid(), "unit"),
    ...CARTS.map((cart) => zone("models", cartridge(cart), "unit")),
    zone("camera", camera()),
    zone("bins", rack()),
    ...TUBE_X.map((_, index) => zone("bins", tube(index))),
    `<g data-zone="bins" data-beads=""></g>`,
  ],
});

const GEOMETRY = {
  P,
  scale,
  knob: KNOB,
  knobR: KNOB_R,
  knobTop: KNOB_TOP,
  detents: DETENTS,
  cartRaise: CART_RAISE,
  needles: Object.fromEntries(SCENARIOS.map((scenario) => [scenario.ms, msNeedle(scenario.ms)])),
  msFrom: MS_FROM,
  msSpan: MS_SPAN,
  msMax: MS_MAX,
  dial: DIAL,
  dialR: DIAL_R,
  dialTop: DIAL_TOP,
  tubes: TUBE_X.map((x) => [x, TUBE_Y]),
  tubeR: TUBE_R,
  floor: RACK_TOP + 1.2,
  full: FULL,
  chute: [CHUTE[0] + 4, CHUTE[1], CHUTE[2]],
  tubeTop: TUBE_TOP,
  lifts: LIFTS,
  cables: [],
};

writeFileSync(
  join(ROOT, "src/components/case-study/figures/segBench.generated.js"),
  `// Generated by scripts/figures/seg-bench.mjs. Do not edit by hand.\nexport const svg = ${JSON.stringify(svg)};\nexport const geometry = ${JSON.stringify(GEOMETRY)};\n`,
);
console.log(`svg ${(svg.length / 1024).toFixed(1)} KB`);
for (const scenario of SCENARIOS) console.log(`  ${scenario.readout}`);

const KEYS = [
  { mark: "raised", label: "Cylinders: one per class, filled to its test IoU" },
  { mark: "lit", label: "Dial: forward pass per image, 0 to 40 ms" },
  { mark: "dotted", label: "Pixels: sorted from the chute into their class" },
];
const card = (hint) =>
  k.plateHtml({
    fig: "Fig 1",
    title: "Every pixel sorted",
    hint,
    readout: SCENARIOS[0].readout,
    keys: KEYS,
    body: `<div class="iso-stage" tabindex="0" role="slider" aria-label="Model" aria-valuemin="1" aria-valuemax="${SCENARIOS.length}" aria-valuenow="1">${svg}</div>`,
  });
const data = `const geometry = ${JSON.stringify(GEOMETRY)};\nconst STEPS = ${JSON.stringify(STEPS)};`;
const CSS = "segBench.css";
const previewAt = process.argv.indexOf("--preview");
if (previewAt > 0) {
  const script = [kitSource(), data, inline("segBench.data.js"), inline("segBench.live.js"), `mountSegBench(document.querySelector(".iso-figure"), { geometry, scenarios: SCENARIOS, classes: CLASSES, kit: { iso, lineOnTop, translateAlong, cylinder, solidSvg } });`].join("\n");
  writeFileSync(process.argv[previewAt + 1], k.pageHtml({ title: "Segmentation bench", theme: "dark", body: `<style>${inline(CSS)}</style>${card("Hover or use arrow keys")}`, script, width: 720 }));
  console.log("preview", process.argv[previewAt + 1]);
}
const explainAt = process.argv.indexOf("--explain");
if (explainAt > 0) {
  writeExplainer({
    file: process.argv[explainAt + 1],
    title: "Road Scene Segmentation explained",
    heading: "How the Road Scene Segmentation project works",
    intro: "A guided walk round a drawn segmentation bench. It plays by itself; use Back and Next, the dots, or the arrow keys to go at your own pace. Every level in the cylinders is a measured test result from the project.",
    card: `<style>${inline(CSS)}</style>` + card("Click it, then arrow keys switch the model"),
    note: "Sources: the project README (splits, models, results), config.py (classes and colours) and the case study.",
    data,
    modules: ["segBench.data.js", "segBench.live.js", "tour.js"],
    boot: `const figure = document.querySelector(".iso-figure");
const bench = mountSegBench(figure, { geometry, scenarios: SCENARIOS, classes: CLASSES, kit, tour: false, hover: false });
const hooks = { step: (step) => step.scenario !== undefined && bench.choose(step.scenario) };
mountTour({ figure, panel: document.querySelector(".tour-panel"), geometry, steps: STEPS, kit, keys: document, hooks }).start(0);`,
  });
  console.log("explain", process.argv[explainAt + 1]);
}
