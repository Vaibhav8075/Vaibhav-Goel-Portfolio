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
function frameFor(names) {
  if (!names.length) return home;
  const boxes = zones.filter((zone) => names.includes(zone.dataset.zone)).map((zone) => zone.getBBox());
  const x0 = Math.min(...boxes.map((box) => box.x));
  const y0 = Math.min(...boxes.map((box) => box.y));
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
  moveCamera(frameFor(step.zones));
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
