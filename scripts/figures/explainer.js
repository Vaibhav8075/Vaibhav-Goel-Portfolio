// Guide for the explainer page, inlined after the kit, the data (PROTOCOLS, geometry, STEPS) and the live module.
// Each step dims every part of the figure except its zones and may move the selector.
const figure = document.querySelector(".iso-figure");
const bench = mountProtocolBench(figure, { geometry, protocols: PROTOCOLS, lineOnTop, tour: false, hover: false });
const art = figure.querySelector(".iso-svg");
const zones = [...art.querySelectorAll("[data-zone]")];
const $ = (selector) => document.querySelector(selector);
const count = $(".ex-count");
const title = $(".ex-title");
const text = $(".ex-text");
const bar = $(".ex-bar span");
const back = $("[data-back]");
const next = $("[data-next]");
const play = $("[data-play]");
const dots = STEPS.map((step, index) => {
  const dot = document.createElement("button");
  dot.type = "button";
  dot.setAttribute("aria-label", `Step ${index + 1}: ${step.title}`);
  dot.addEventListener("click", () => show(index));
  $(".ex-dots").append(dot);
  return dot;
});
let at = 0;
let timer = 0;
let playing = !matchMedia("(prefers-reduced-motion: reduce)").matches;
// Long enough to read the step at a relaxed pace
const dwell = (step) => Math.max(8, step.text.split(/\s+/).length * 0.33 + 4) * 1000;

// The camera glides in on the lit parts and back out for the whole bench. Lines keep their width
// (non-scaling strokes), so a close-up stays as crisp as the overview.
const FULL = art.viewBox.baseVal;
const home = [FULL.x, FULL.y, FULL.width, FULL.height];
let view = [...home];
let glide = 0;
function frameFor(names, open) {
  if (!names.length) return home;
  const boxes = zones.filter((zone) => names.includes(zone.dataset.zone)).map((zone) => zone.getBBox());
  const x0 = Math.min(...boxes.map((box) => box.x));
  // Leave room above for a part that is about to lift open
  const y0 = Math.min(...boxes.map((box) => box.y)) - (open ? screenRise(geometry.lifts[open], geometry.P) : 0);
  const x1 = Math.max(...boxes.map((box) => box.x + box.width));
  const y1 = Math.max(...boxes.map((box) => box.y + box.height));
  const aspect = home[2] / home[3];
  let width = Math.max((x1 - x0) * 1.35, (y1 - y0) * 1.35 * aspect, home[2] * 0.42);
  width = Math.min(width, home[2]);
  const height = width / aspect;
  const cx = Math.min(Math.max((x0 + x1) / 2, home[0] + width / 2), home[0] + home[2] - width / 2);
  const cy = Math.min(Math.max((y0 + y1) / 2, home[1] + height / 2), home[1] + home[3] - height / 2);
  return [cx - width / 2, cy - height / 2, width, height];
}
function moveCamera(target) {
  cancelAnimationFrame(glide);
  const from = [...view];
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const started = performance.now();
  const step = (now) => {
    const t = still ? 1 : Math.min(1, (now - started) / 1100);
    const ease = t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
    view = from.map((value, index) => value + (target[index] - value) * ease);
    art.setAttribute("viewBox", view.map((value) => value.toFixed(2)).join(" "));
    if (t < 1) glide = requestAnimationFrame(step);
  };
  glide = requestAnimationFrame(step);
}

// Opening a part: its groups ([data-lift]) rise straight up and the cables that end on it are redrawn,
// so they stretch instead of coming loose. Only one part is open at a time; it opens once the camera has arrived.
const lifted = {};
art.querySelectorAll("[data-lift]").forEach((group) => (lifted[group.dataset.lift] ??= []).push(group));
const cableGroups = [...art.querySelectorAll("[data-cable]")];
const share = Object.fromEntries(Object.keys(lifted).map((name) => [name, 0]));
const goal = { ...share };
let openFrame = 0;
let openTimer = 0;
function cableMarkup({ from, to, rise, drop }) {
  const c1 = [from[0], from[1], from[2] + rise];
  const c2 = [to[0], to[1], to[2] + drop];
  const points = Array.from({ length: 41 }, (_, step) => {
    const t = step / 40;
    const u = 1 - t;
    return [0, 1, 2].map((axis) => u * u * u * from[axis] + 3 * u * u * t * c1[axis] + 3 * u * t * t * c2[axis] + t * t * t * to[axis]);
  }).map((point) => iso(point, geometry.P));
  return wireSvg(points[0], points[40], { via: points.slice(1, 40), tone: "lo", size: 1 }) + lineSvg(pathOf(points), { tone: "mid", flow: true });
}
function placeParts() {
  for (const name of Object.keys(lifted)) {
    const transform = translateAlong(geometry.P, [0, 0, geometry.lifts[name] * share[name]]);
    lifted[name].forEach((group) => group.setAttribute("transform", transform));
  }
  for (const group of cableGroups) {
    const spec = geometry.cables[Number(group.dataset.cable)];
    const ends = [[...spec.from], [...spec.to]];
    ends[spec.end][2] += geometry.lifts[spec.lift] * share[spec.lift];
    group.innerHTML = cableMarkup({ ...spec, from: ends[0], to: ends[1] });
  }
}
function animateParts() {
  cancelAnimationFrame(openFrame);
  let last = 0;
  const step = (now) => {
    const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
    last = now;
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let moving = false;
    for (const name of Object.keys(share)) {
      share[name] = calm ? goal[name] : share[name] + (goal[name] - share[name]) * (1 - Math.exp(-dt / 0.3));
      if (Math.abs(goal[name] - share[name]) < 0.002) share[name] = goal[name];
      else moving = true;
    }
    placeParts();
    if (moving) openFrame = requestAnimationFrame(step);
  };
  openFrame = requestAnimationFrame(step);
}
function openOnly(name) {
  clearTimeout(openTimer);
  for (const other of Object.keys(goal)) goal[other] = 0;
  animateParts();
  if (name) {
    openTimer = setTimeout(() => {
      goal[name] = 1;
      animateParts();
    }, 1000);
  }
}

function show(index) {
  at = index;
  const step = STEPS[index];
  if (step.zones.length) {
    art.setAttribute("data-focus", "");
    zones.forEach((zone) => zone.toggleAttribute("data-on", step.zones.includes(zone.dataset.zone)));
  } else {
    art.removeAttribute("data-focus");
    zones.forEach((zone) => zone.removeAttribute("data-on"));
  }
  moveCamera(frameFor(step.zones, step.open));
  openOnly(step.open);
  if (step.protocol !== undefined) bench.choose(step.protocol);
  count.textContent = `Step ${index + 1} of ${STEPS.length}`;
  title.textContent = step.title;
  text.textContent = step.text;
  back.disabled = index === 0;
  next.textContent = index === STEPS.length - 1 ? "Start again" : "Next";
  dots.forEach((dot, other) => (other === index ? dot.setAttribute("aria-current", "step") : dot.removeAttribute("aria-current")));
  restart();
}

function restart() {
  clearTimeout(timer);
  bar.style.transition = "none";
  bar.style.width = "0";
  play.textContent = playing ? "Pause" : "Play";
  if (!playing) return;
  const ms = dwell(STEPS[at]);
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      bar.style.transition = `width ${ms}ms linear`;
      bar.style.width = "100%";
    }),
  );
  timer = setTimeout(() => {
    if (at < STEPS.length - 1) show(at + 1);
    else {
      playing = false;
      restart();
    }
  }, ms);
}

const forward = () => show(at < STEPS.length - 1 ? at + 1 : 0);
back.addEventListener("click", () => show(Math.max(0, at - 1)));
next.addEventListener("click", forward);
play.addEventListener("click", () => {
  playing = !playing;
  if (playing && at === STEPS.length - 1) show(0);
  else restart();
});
document.addEventListener("keydown", (event) => {
  if (event.target.closest?.(".iso-stage, button")) return;
  if (event.key === "ArrowRight") forward();
  else if (event.key === "ArrowLeft") show(Math.max(0, at - 1));
  else if (event.key === " ") {
    event.preventDefault();
    play.click();
  }
});
show(0);
