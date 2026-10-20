// Guided walkthrough shared by the case-study figures. Each step dims every part except its zones
// ([data-zone]), glides the camera in, and may lift one part open ([data-lift]) while the cables that end on
// it stretch. Figure-specific behaviour comes in through hooks: start, stop, step(step, index) and
// frame(dt, opened), which runs every animation frame while the tour is active.
// Kit functions arrive in `kit`, so the same code runs in React and in a standalone explainer page.
export function mountTour({ figure, panel, geometry, steps, kit, keys = panel, hooks = {} }) {
  const { iso, pathOf, wireSvg, lineSvg, translateAlong, screenRise } = kit;
  const art = figure.querySelector(".iso-svg");
  const zones = [...art.querySelectorAll("[data-zone]")];
  const find = (selector) => panel.querySelector(selector);
  const count = find(".tour-count");
  const title = find(".tour-title");
  const text = find(".tour-text");
  const bar = find(".tour-bar span");
  const back = find("[data-back]");
  const next = find("[data-next]");
  const play = find("[data-play]");
  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const dots = steps.map((step, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Step ${index + 1}: ${step.title}`);
    dot.addEventListener("click", () => show(index));
    find(".tour-dots").append(dot);
    return dot;
  });
  let at = 0;
  let timer = 0;
  let playing = false;
  let active = false;
  // Long enough to read the step at a relaxed pace
  const dwell = (step) => Math.max(8, step.text.split(/\s+/).length * 0.33 + 4) * 1000;

  // Camera: the viewBox glides in on the lit parts and back out. Strokes don't scale, so close-ups stay crisp.
  const base = art.viewBox.baseVal;
  const home = [base.x, base.y, base.width, base.height];
  let view = [...home];
  let glide = 0;
  function frameFor(names, open) {
    if (!names.length) return home;
    // Measured on screen and mapped back to SVG units, so zones drawn under a transform frame correctly
    const toArt = art.getScreenCTM().inverse();
    const boxes = zones
      .filter((zone) => names.includes(zone.dataset.zone))
      .map((zone) => {
        const rect = zone.getBoundingClientRect();
        const a = new DOMPoint(rect.left, rect.top).matrixTransform(toArt);
        const b = new DOMPoint(rect.right, rect.bottom).matrixTransform(toArt);
        return { x: a.x, y: a.y, width: b.x - a.x, height: b.y - a.y };
      });
    const x0 = Math.min(...boxes.map((box) => box.x));
    // Leave room above for a part that is about to lift open
    const y0 = Math.min(...boxes.map((box) => box.y)) - (open ? screenRise(geometry.lifts[open], geometry.P) : 0);
    const x1 = Math.max(...boxes.map((box) => box.x + box.width));
    const y1 = Math.max(...boxes.map((box) => box.y + box.height));
    const aspect = home[2] / home[3];
    const width = Math.min(Math.max((x1 - x0) * 1.35, (y1 - y0) * 1.35 * aspect, home[2] * 0.42), home[2]);
    const height = width / aspect;
    const cx = Math.min(Math.max((x0 + x1) / 2, home[0] + width / 2), home[0] + home[2] - width / 2);
    const cy = Math.min(Math.max((y0 + y1) / 2, home[1] + height / 2), home[1] + home[3] - height / 2);
    return [cx - width / 2, cy - height / 2, width, height];
  }
  function moveCamera(target) {
    cancelAnimationFrame(glide);
    const from = [...view];
    const started = performance.now();
    const calm = reduced();
    const step = (now) => {
      const t = calm ? 1 : Math.min(1, (now - started) / 1100);
      const ease = t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
      view = from.map((value, index) => value + (target[index] - value) * ease);
      art.setAttribute("viewBox", view.map((value) => value.toFixed(2)).join(" "));
      if (t < 1) glide = requestAnimationFrame(step);
    };
    glide = requestAnimationFrame(step);
  }

  // Opening: a part's groups rise straight up and the cables that end on it are redrawn, so they stretch
  // instead of coming loose. One part is open at a time, and it opens once the camera has arrived.
  const lifted = {};
  art.querySelectorAll("[data-lift]").forEach((group) => (lifted[group.dataset.lift] ??= []).push(group));
  const cableGroups = [...art.querySelectorAll("[data-cable]")];
  const share = Object.fromEntries(Object.keys(lifted).map((name) => [name, 0]));
  const goal = { ...share };
  let openFrame = 0;
  let openTimer = 0;
  // A cable is a wire with flowing signal; a "dotted" one (a radio link) is a dotted path
  function cableMarkup({ from, to, rise, drop, style }) {
    const c1 = [from[0], from[1], from[2] + rise];
    const c2 = [to[0], to[1], to[2] + drop];
    const points = Array.from({ length: 41 }, (_, index) => {
      const t = index / 40;
      const u = 1 - t;
      return [0, 1, 2].map((axis) => u * u * u * from[axis] + 3 * u * u * t * c1[axis] + 3 * u * t * t * c2[axis] + t * t * t * to[axis]);
    }).map((point) => iso(point, geometry.P));
    if (style === "dotted") return lineSvg(pathOf(points), { tone: "faint", dotted: true });
    return wireSvg(points[0], points[40], { via: points.slice(1, 40), tone: "lo", size: 1 }) + lineSvg(pathOf(points), { tone: "mid", flow: true });
  }
  function placeParts() {
    for (const name of Object.keys(lifted)) {
      const transform = translateAlong(geometry.P, [0, 0, geometry.lifts[name] * share[name]]);
      lifted[name].forEach((group) => group.setAttribute("transform", transform));
    }
    for (const group of cableGroups) {
      const spec = geometry.cables[Number(group.dataset.cable)];
      if (!spec.lift) continue;
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
      const calm = reduced();
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

  // The figure's own animation (hooks.frame) runs every frame while the tour is active
  let loopFrame = 0;
  let loopLast = 0;
  function loop(now) {
    const dt = loopLast ? Math.min((now - loopLast) / 1000, 1 / 30) : 0;
    loopLast = now;
    hooks.frame?.(dt, share);
    loopFrame = active && !reduced() ? requestAnimationFrame(loop) : 0;
  }

  function show(index) {
    at = index;
    const step = steps[index];
    if (step.zones.length) {
      art.setAttribute("data-focus", "");
      zones.forEach((zone) => zone.toggleAttribute("data-on", step.zones.includes(zone.dataset.zone)));
    } else {
      art.removeAttribute("data-focus");
      zones.forEach((zone) => zone.removeAttribute("data-on"));
    }
    moveCamera(frameFor(step.zones, step.open));
    openOnly(step.open);
    hooks.step?.(step, index);
    if (reduced()) setTimeout(() => hooks.frame?.(0, share), 1100);
    count.textContent = `Step ${index + 1} of ${steps.length}`;
    title.textContent = step.title;
    text.textContent = step.text;
    back.disabled = index === 0;
    next.textContent = index === steps.length - 1 ? "Start again" : "Next";
    dots.forEach((dot, other) => (other === index ? dot.setAttribute("aria-current", "step") : dot.removeAttribute("aria-current")));
    restart();
  }
  function restart() {
    clearTimeout(timer);
    bar.style.transition = "none";
    bar.style.width = "0";
    play.textContent = playing ? "Pause" : "Play";
    if (!playing || !active) return;
    const ms = dwell(steps[at]);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        bar.style.transition = `width ${ms}ms linear`;
        bar.style.width = "100%";
      }),
    );
    timer = setTimeout(() => {
      if (at < steps.length - 1) show(at + 1);
      else {
        playing = false;
        restart();
      }
    }, ms);
  }

  const forward = () => show(at < steps.length - 1 ? at + 1 : 0);
  const onBack = () => show(Math.max(0, at - 1));
  const onPlay = () => {
    playing = !playing;
    if (playing && at === steps.length - 1) show(0);
    else restart();
  };
  const onKey = (event) => {
    if (!active || event.target.closest?.(".iso-stage")) return;
    if (event.key === "ArrowRight") forward();
    else if (event.key === "ArrowLeft") onBack();
    else if (event.key === " " && !event.target.closest?.("button")) {
      event.preventDefault();
      onPlay();
    }
  };
  back.addEventListener("click", onBack);
  next.addEventListener("click", forward);
  play.addEventListener("click", onPlay);
  keys.addEventListener("keydown", onKey);

  function start(index = 0, autoplay = !reduced()) {
    active = true;
    playing = autoplay;
    hooks.start?.();
    cancelAnimationFrame(loopFrame);
    loopLast = 0;
    loopFrame = requestAnimationFrame(loop);
    show(index);
  }
  function stop() {
    active = false;
    playing = false;
    clearTimeout(timer);
    cancelAnimationFrame(loopFrame);
    art.removeAttribute("data-focus");
    zones.forEach((zone) => zone.removeAttribute("data-on"));
    moveCamera(home);
    openOnly(null);
    hooks.stop?.();
  }
  function destroy() {
    stop();
    cancelAnimationFrame(glide);
    cancelAnimationFrame(openFrame);
    clearTimeout(openTimer);
    back.removeEventListener("click", onBack);
    next.removeEventListener("click", forward);
    play.removeEventListener("click", onPlay);
    keys.removeEventListener("keydown", onKey);
    dots.forEach((dot) => dot.remove());
  }
  return { start, stop, destroy };
}
