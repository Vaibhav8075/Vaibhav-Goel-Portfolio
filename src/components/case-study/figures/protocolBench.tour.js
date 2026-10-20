// Guided walkthrough of the protocol bench. Each step dims every part except its zones, glides the camera in,
// may lift a cover open and may move the selector, while the motor runs slowed right down. Kit functions arrive
// in `kit`, so the same code runs in the React figure and in the standalone explainer page.
export function mountTour({ figure, panel, geometry, running, steps, bench, kit, keys = panel }) {
  const { iso, pathOf, wireSvg, lineSvg, dotsSvg, ring, translateAlong, screenRise } = kit;
  const art = figure.querySelector(".iso-svg");
  const zones = [...art.querySelectorAll("[data-zone]")];
  const find = (selector) => panel.querySelector(selector);
  const count = find(".pb-count");
  const title = find(".pb-title");
  const text = find(".pb-text");
  const bar = find(".pb-bar span");
  const back = find("[data-back]");
  const next = find("[data-next]");
  const play = find("[data-play]");
  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const dots = steps.map((step, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Step ${index + 1}: ${step.title}`);
    dot.addEventListener("click", () => show(index));
    find(".pb-dots").append(dot);
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
    const boxes = zones.filter((zone) => names.includes(zone.dataset.zone)).map((zone) => zone.getBBox());
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

  // Opening: a part's groups ([data-lift]) rise straight up and the cables that end on it are redrawn, so they
  // stretch instead of coming loose. One part is open at a time, and it opens once the camera has arrived.
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
    const points = Array.from({ length: 41 }, (_, index) => {
      const t = index / 40;
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

  // The motor runs, slowed right down: the coupling turns, and with the top half lifted the rotor bars sweep
  // round, the fan blades turn and the balls roll round both bearings. Each time a ball on the drive-end
  // bearing rolls over the damaged spot, a knock ring spreads from it.
  const spin = Object.fromEntries([...art.querySelectorAll("[data-spin]")].map((group) => [group.dataset.spin, group]));
  const SHAFT = Math.PI; // rad/s on screen, far slower than the real motor
  const CAGE = 0.4; // the ball set goes round slower than the shaft
  const BALLS = 9;
  let turn = 0;
  let runLast = 0;
  let runFrame = 0;
  const knocks = [];
  const smooth = (value, lo, hi) => {
    const t = Math.min(1, Math.max(0, (value - lo) / (hi - lo)));
    return t * t * (3 - 2 * t);
  };
  const onRing = (s, radius, angle) => iso([running.x0 + s, running.yb + radius * Math.cos(angle), running.zc + radius * Math.sin(angle)], geometry.P);
  const facingOf = (angle) => Math.cos(angle) * running.view[1] + Math.sin(angle) * running.view[2];
  const faded = (d, alpha, tone) => (alpha > 0.02 ? `<path class="iso-line" data-tone="${tone}" d="${d}" opacity="${alpha.toFixed(2)}"/>` : "");
  function ballsAt(s, phase) {
    return Array.from({ length: BALLS }, (_, index) => phase + (index / BALLS) * Math.PI * 2)
      .filter((angle) => Math.sin(angle) > -0.15)
      .sort((a, b) => facingOf(a) - facingOf(b))
      .map((angle) => {
        const [cx, cy] = onRing(s, running.ballOrbit, angle);
        const alpha = smooth(Math.sin(angle), -0.15, 0.2);
        return `<circle class="pb-ball" cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${(running.ballR * running.scale).toFixed(2)}" opacity="${alpha.toFixed(2)}"/>`;
      })
      .join("");
  }
  function drawRunning(dt) {
    const { axis, coupling } = running;
    spin.coupling.innerHTML = dotsSvg(
      Array.from({ length: 4 }, (_, index) => {
        const angle = turn + (index * Math.PI) / 2;
        const point = [0, 1, 2].map((i) => axis.o[i] + axis.a[i] * coupling[0] + coupling[1] * (Math.cos(angle) * axis.u[i] + Math.sin(angle) * axis.v[i]));
        return iso(point, geometry.P);
      }),
      { size: 0.45 },
    );
    if (share.motor < 0.02) return;
    const [r0, r1] = running.rotor;
    let bars = "";
    for (let index = 0; index < 18; index++) {
      const angle = (turn + (index / 18) * Math.PI * 2) % (Math.PI * 2);
      if (Math.sin(angle) <= 0) continue;
      const alpha = smooth(facingOf(angle), 0.02, 0.45) * smooth(Math.sin(angle), 0, 0.3);
      bars += faded(pathOf([onRing(r0, running.rotorR, angle), onRing(r1, running.rotorR, angle)]), alpha, "mid");
    }
    spin.rotor.innerHTML = bars;
    let blades = "";
    for (let index = 0; index < 6; index++) {
      const angle = (turn + (index / 6) * Math.PI * 2) % (Math.PI * 2);
      if (Math.sin(angle) <= 0) continue;
      blades += faded(pathOf([onRing(running.fan, 3.4, angle), onRing(running.fan, running.fanR - 0.4, angle)]), smooth(Math.sin(angle), 0, 0.25), "mid");
    }
    spin.fan.innerHTML = blades;
    const cage = turn * CAGE;
    spin["balls-fe"].innerHTML = ballsAt(running.feBearing, cage);
    spin["balls-de"].innerHTML = ballsAt(running.deBearing, cage);
    // A ball reaches the damaged spot (angle 0) once every 1/BALLS of a cage turn
    const gap = (Math.PI * 2) / BALLS;
    if (dt > 0 && Math.floor(cage / gap) !== Math.floor((cage - CAGE * SHAFT * dt) / gap)) knocks.push(0);
    for (let index = knocks.length - 1; index >= 0; index--) {
      knocks[index] += dt;
      if (knocks[index] > 0.7) knocks.splice(index, 1);
    }
    const [kx, ky] = [running.x0 + running.deBearing, running.yb + 7.2];
    spin.knock.innerHTML = knocks.map((age) => faded(ring(kx, ky, 1.5 + age * 16, running.zc, geometry.P, 32), 1 - age / 0.7, "red")).join("");
  }
  function runMotor(now) {
    const dt = runLast ? Math.min((now - runLast) / 1000, 1 / 30) : 0;
    runLast = now;
    turn += SHAFT * dt;
    drawRunning(dt);
    runFrame = active && !reduced() ? requestAnimationFrame(runMotor) : 0;
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
    if (step.protocol !== undefined) bench.choose(step.protocol);
    if (reduced()) setTimeout(() => drawRunning(0), 1100);
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
    bench.setMode({ tour: false, hover: false });
    cancelAnimationFrame(runFrame);
    runLast = 0;
    runFrame = requestAnimationFrame(runMotor);
    show(index);
  }
  function stop() {
    active = false;
    playing = false;
    clearTimeout(timer);
    cancelAnimationFrame(runFrame);
    art.removeAttribute("data-focus");
    zones.forEach((zone) => zone.removeAttribute("data-on"));
    moveCamera(home);
    openOnly(null);
    bench.setMode({ tour: true, hover: true });
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
