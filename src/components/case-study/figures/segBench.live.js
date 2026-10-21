// Live behaviour of the segmentation bench. The knob picks the model: its cartridge seats in the unit, the other
// lifts out, the speed dial moves to that model's forward-pass time, and each class cylinder fills to that model's
// measured test IoU. Coloured pixels keep flying from the chute into their class's cylinder.
// Returns a cleanup function carrying choose(index) and setMode({ tour, hover }) for a guided tour.
export function mountSegBench(figure, { geometry, scenarios, classes, kit, tour = true, hover = true }) {
  const { iso, lineOnTop, translateAlong, cylinder, solidSvg } = kit;
  const { P, scale, knob, knobR, knobTop, detents, cartRaise, msFrom, msSpan, msMax, dial, dialR, dialTop, tubes, tubeR, floor, full, chute, tubeTop } = geometry;
  const stage = figure.querySelector(".iso-stage");
  const svg = stage.querySelector("svg");
  const readout = figure.querySelector("[data-readout]");
  const part = (name) => svg.querySelector(`[data-part="${name}"]`);
  const liquids = [...svg.querySelectorAll("[data-liquid]")];
  const carts = [...svg.querySelectorAll("[data-cart]")];
  const beads = svg.querySelector("[data-beads]");
  const still = window.matchMedia("(prefers-reduced-motion: reduce)");

  const onCircle = ([cx, cy], radius, angle) => [cx + Math.sin(angle) * radius, cy - Math.cos(angle) * radius];
  const pointerAt = (angle) => lineOnTop(onCircle(knob, -1.8, angle), onCircle(knob, knobR - 0.3, angle), knobTop, P);
  const needleAt = (ms) => {
    const angle = msFrom + (ms / msMax) * msSpan;
    return lineOnTop(onCircle(dial, -1.4, angle), onCircle(dial, dialR - 1.6, angle), dialTop + 0.2, P);
  };

  let index = 0;
  let turn = detents[0];
  let ms = scenarios[0].ms;
  const level = [...scenarios[0].iou];
  const seat = scenarios.map((_, model) => (model === 0 ? 0 : 1));
  let flight = 0;
  let frame = 0;
  let last = 0;
  let clock = 0;
  let tourOn = tour;
  let hoverOn = hover;
  let touring = tourOn && !still.matches;
  let visible = false;
  let idleTimer = 0;

  function apply() {
    const scenario = scenarios[index];
    part("miou").textContent = `${scenario.miou.toFixed(3)} mIoU`;
    carts.forEach((cart) => cart.toggleAttribute("data-on", cart.dataset.cart === scenario.id));
    if (readout && readout.textContent !== scenario.readout) readout.textContent = scenario.readout;
    stage.setAttribute("aria-valuenow", String(index + 1));
    stage.setAttribute("aria-valuetext", `${scenario.name}: ${scenario.miou.toFixed(3)} mIoU, ${scenario.ms} ms per image`);
  }

  function drawBeads() {
    const count = 18;
    let markup = "";
    for (let bead = 0; bead < count; bead++) {
      const lane = bead % classes.length;
      const t = (flight * 0.45 + bead / count) % 1;
      const [tx, ty] = tubes[lane];
      const from = chute;
      const to = [tx, ty, tubeTop + 1];
      const apex = Math.max(from[2], to[2]) + 14;
      const point = [from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t, (1 - t) * (1 - t) * from[2] + 2 * (1 - t) * t * apex + t * t * to[2]];
      const [sx, sy] = iso(point, P);
      const fade = Math.min(1, t * 6, (1 - t) * 6);
      markup += `<circle class="sb-bead" cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="${(0.9 * scale).toFixed(2)}" style="fill:${classes[lane].colour}" opacity="${fade.toFixed(2)}"/>`;
    }
    beads.innerHTML = markup;
  }

  function draw() {
    part("pointer").setAttribute("d", pointerAt(turn));
    part("ms").setAttribute("d", needleAt(ms));
    carts.forEach((cart, model) => cart.setAttribute("transform", translateAlong(P, [0, 0, seat[model] * cartRaise])));
    liquids.forEach((group, lane) => {
      const [x, y] = tubes[lane];
      group.innerHTML = solidSvg(cylinder(x, y, tubeR - 0.7, floor, (full * level[lane]) / 100, P, 32), { tone: "hi", crease: "lo" });
    });
    drawBeads();
  }

  function tick(now) {
    const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
    last = now;
    const calm = still.matches;
    if (touring) {
      clock += dt;
      if (clock > 3.6) {
        clock = 0;
        index = (index + 1) % scenarios.length;
        apply();
      }
    }
    const scenario = scenarios[index];
    const follow = (value, want, seconds) => (calm ? want : value + (want - value) * (1 - Math.exp(-dt / seconds)));
    turn = follow(turn, detents[index], 0.12);
    ms = follow(ms, scenario.ms, 0.3);
    scenario.iou.forEach((value, lane) => {
      level[lane] = follow(level[lane], value, 0.35);
    });
    seat.forEach((value, model) => {
      seat[model] = follow(value, model === index ? 0 : 1, 0.2);
    });
    if (!calm) flight += dt;
    draw();
    frame = visible && !calm ? requestAnimationFrame(tick) : 0;
  }

  const run = () => {
    if (!frame && visible) {
      last = 0;
      frame = requestAnimationFrame(tick);
    }
  };
  const choose = (next) => {
    touring = false;
    if (next !== index) {
      index = next;
      apply();
    }
    clearTimeout(idleTimer);
    if (tourOn) {
      idleTimer = setTimeout(() => {
        touring = !still.matches;
        clock = 0;
        run();
      }, 4500);
    }
    run();
    if (still.matches) requestAnimationFrame(tick);
  };

  const onMove = (event) => {
    if (!hoverOn || event.pointerType === "touch") return;
    const box = svg.getBoundingClientRect();
    const share = Math.min(0.999, Math.max(0, (event.clientX - box.left) / box.width));
    choose(Math.floor(share * scenarios.length));
  };
  const onDown = (event) => {
    if (hoverOn && event.pointerType === "touch") choose((index + 1) % scenarios.length);
  };
  const onKey = (event) => {
    let next = null;
    if (event.key === "ArrowRight" || event.key === "ArrowUp") next = Math.min(scenarios.length - 1, index + 1);
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") next = Math.max(0, index - 1);
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = scenarios.length - 1;
    if (next === null) return;
    event.preventDefault();
    choose(next);
  };
  const onMotion = () => {
    touring = tourOn && !still.matches;
    run();
  };
  const setMode = (mode) => {
    tourOn = mode.tour;
    hoverOn = mode.hover;
    clearTimeout(idleTimer);
    touring = tourOn && !still.matches;
    run();
  };

  stage.addEventListener("pointermove", onMove);
  stage.addEventListener("pointerdown", onDown);
  stage.addEventListener("keydown", onKey);
  still.addEventListener("change", onMotion);
  const observer = new IntersectionObserver(
    (entries) => {
      visible = entries[entries.length - 1].isIntersecting;
      if (visible) run();
    },
    { rootMargin: "120px 0px" },
  );
  observer.observe(stage);
  apply();
  draw();

  const stop = () => {
    observer.disconnect();
    cancelAnimationFrame(frame);
    clearTimeout(idleTimer);
    stage.removeEventListener("pointermove", onMove);
    stage.removeEventListener("pointerdown", onDown);
    stage.removeEventListener("keydown", onKey);
    still.removeEventListener("change", onMotion);
  };
  stop.choose = (next) => choose(next);
  stop.setMode = setMode;
  return stop;
}
