// Live behaviour of the ledger bench. For a payment claim the token rolls down Spoof Guard's rail, each gate it
// passes lifts its shutter, and it stops at the first gate that fails or reaches the lamps; a delivered payment
// makes the Soundbox ring. For a supplier bill the notes the plan pays move from the drawer (and the advance
// tray) into the supplier's crate, and the maker-checker key turns. Returns a cleanup function carrying
// choose(index) and setMode({ tour, hover }) for a guided tour.
export function mountLedgerBench(figure, { geometry, scenarios, kit, tour = true, hover = true }) {
  const { lineOnTop, translateAlong } = kit;
  const { P, knob, knobR, knobTop, detents, key, keyTop, gateX, tokenHome, tokenEnd, note } = geometry;
  const stage = figure.querySelector(".iso-stage");
  const svg = stage.querySelector("svg");
  const readout = figure.querySelector("[data-readout]");
  const pointer = svg.querySelector('[data-part="pointer"]');
  const keyLine = svg.querySelector('[data-part="key"]');
  const screen = svg.querySelector('[data-part="screen"]');
  const tokenGroup = svg.querySelector('[data-part="token"]');
  const gates = [...svg.querySelectorAll("[data-gate]")];
  const shutters = [...svg.querySelectorAll("[data-shutter]")];
  const still = window.matchMedia("(prefers-reduced-motion: reduce)");

  const onCircle = ([cx, cy], radius, angle) => [cx + Math.sin(angle) * radius, cy - Math.cos(angle) * radius];
  const pointerAt = (angle) => lineOnTop(onCircle(knob, -2, angle), onCircle(knob, knobR - 0.3, angle), knobTop, P);
  const keyAt = (angle) => lineOnTop(onCircle(key, -1.6, angle), onCircle(key, 2.7, angle), keyTop, P);
  const inr = (value) => `₹${value.toLocaleString("en-IN")}`;

  let index = 0;
  let turn = detents[0];
  let tokenX = tokenHome;
  let keyTurn = 0;
  const lift = gates.map(() => 0);
  let frame = 0;
  let last = 0;
  let clock = 0;
  let tourOn = tour;
  let hoverOn = hover;
  let touring = tourOn && !still.matches;
  let visible = false;
  let idleTimer = 0;

  const targetX = (scenario) => (scenario.kind !== "claim" ? tokenHome : scenario.gate >= 0 ? gateX[scenario.gate] - 6 : tokenEnd);
  const showStacks = (name, count) => svg.querySelectorAll(`[data-stacks="${name}"] [data-slot]`).forEach((slot) => slot.toggleAttribute("data-show", Number(slot.dataset.slot) < count));

  function apply() {
    const scenario = scenarios[index];
    const claim = scenario.kind === "claim";
    svg.querySelectorAll("[data-line]").forEach((line) => line.toggleAttribute("data-on", line.dataset.line === scenario.kind));
    screen.textContent = claim ? inr(scenario.claim.screenAmount) : "";
    const plan = scenario.plan ?? { settle: 0, advance: 0 };
    showStacks("avail", (3000 - plan.settle) / note);
    showStacks("advance", plan.advance / note);
    showStacks("crate", Math.min(10, (plan.settle + plan.advance) / note));
    svg.querySelector("[data-check]").toggleAttribute("data-on", !claim);
    svg.querySelectorAll("[data-lamp]").forEach((lamp) => lamp.removeAttribute("data-on"));
    svg.querySelector("[data-sound]").removeAttribute("data-on");
    if (readout && readout.textContent !== scenario.readout) readout.textContent = scenario.readout;
    stage.setAttribute("aria-valuenow", String(index + 1));
    stage.setAttribute("aria-valuetext", scenario.readout);
  }

  function draw() {
    const scenario = scenarios[index];
    pointer.setAttribute("d", pointerAt(turn));
    keyLine.setAttribute("d", keyAt(keyTurn));
    tokenGroup.setAttribute("transform", translateAlong(P, [tokenX - tokenHome, 0, 0]));
    // Keep the token in depth order among the gates: drawn after the gates behind it, before those in front
    const ahead = gates.find((group, lane) => gateX[lane] > tokenX + 1);
    const anchor = ahead ?? gates[gates.length - 1].nextSibling;
    if (tokenGroup.nextSibling !== anchor) svg.insertBefore(tokenGroup, anchor);
    shutters.forEach((shutter, lane) => {
      shutter.setAttribute("transform", translateAlong(P, [0, 0, lift[lane] * 5]));
      shutter.style.opacity = String(1 - lift[lane] * 0.8);
    });
    // Verdict once the token has arrived
    const arrived = scenario.kind === "claim" && Math.abs(tokenX - targetX(scenario)) < 0.6;
    svg.querySelectorAll("[data-lamp]").forEach((lamp) => lamp.toggleAttribute("data-on", arrived && lamp.dataset.lamp === scenario.lamp));
    svg.querySelector("[data-sound]").toggleAttribute("data-on", arrived && scenario.verdict === "VERIFIED_DELIVERED");
  }

  function tick(now) {
    const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
    last = now;
    const calm = still.matches;
    if (touring) {
      clock += dt;
      if (clock > 3.4) {
        clock = 0;
        index = (index + 1) % scenarios.length;
        apply();
      }
    }
    const scenario = scenarios[index];
    const follow = (value, want, seconds) => (calm ? want : value + (want - value) * (1 - Math.exp(-dt / seconds)));
    turn = follow(turn, detents[index], 0.12);
    keyTurn = follow(keyTurn, scenario.kind === "bill" ? Math.PI / 2 : 0, 0.2);
    const want = targetX(scenario);
    // The token rolls at a steady pace, then settles
    const step = 60 * dt;
    tokenX = calm ? want : Math.abs(want - tokenX) <= step ? want : tokenX + Math.sign(want - tokenX) * step;
    gateX.forEach((x, lane) => {
      const passes = scenario.kind === "claim" && (scenario.gate < 0 || lane < scenario.gate);
      const open = passes && tokenX > x - 9 ? 1 : 0;
      lift[lane] = follow(lift[lane], open, 0.1);
    });
    draw();
    const settled = !touring && tokenX === want && Math.abs(turn - detents[index]) < 1e-3;
    frame = visible && !calm && !settled ? requestAnimationFrame(tick) : 0;
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
