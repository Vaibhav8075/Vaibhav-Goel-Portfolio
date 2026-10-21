// Live behaviour of the call bench. The reel turns while the call plays; the first comb whose keywords are in the
// call drops onto the strip and raises its flag; the gauge reads the keyword sentiment; the stamp comes down on
// account and card numbers; the AI arm reviews the transcript, or parks when the AI is unavailable and the gate
// lets the rule result through. Returns a cleanup function carrying choose(index) and setMode({ tour, hover }).
export function mountCallBench(figure, { geometry, scenarios, kit, tour = true, hover = true }) {
  const { iso, lineOnTop, pathOf, translateAlong, ring, segment } = kit;
  const { P, knob, knobR, knobTop, detents, reel, reelR, reelTop, gauge, gaugeR, gaugeTop, sentiment, combRaised, combX, flagZ, flagY, stampUp, arm, strip, gate } = geometry;
  const stage = figure.querySelector(".iso-stage");
  const svg = stage.querySelector("svg");
  const readout = figure.querySelector("[data-readout]");
  const part = (name) => svg.querySelector(`[data-part="${name}"]`);
  const combs = [...svg.querySelectorAll("[data-comb]")];
  const flags = [...svg.querySelectorAll("[data-flag]")];
  const still = window.matchMedia("(prefers-reduced-motion: reduce)");

  const onCircle = ([cx, cy], radius, angle) => [cx + Math.sin(angle) * radius, cy - Math.cos(angle) * radius];
  const pointerAt = (angle) => lineOnTop(onCircle(knob, -2, angle), onCircle(knob, knobR - 0.3, angle), knobTop, P);
  const needleAt = (angle) => lineOnTop(onCircle(gauge, -1.6, angle), onCircle(gauge, gaugeR - 1.4, angle), gaugeTop + 0.2, P);
  const spokesAt = (turn) => [0, 1, 2].map((spoke) => lineOnTop(onCircle(reel, 2.6, turn + (spoke * 2 * Math.PI) / 3), onCircle(reel, reelR - 0.6, turn + (spoke * 2 * Math.PI) / 3), reelTop, P)).join("");
  // The arm's tip: over the strip's end while reviewing, folded up over its mast when parked
  const reviewTip = [strip.x, strip.y, strip.z + 7];
  const parkedTip = [arm.pivot[0], arm.pivot[1] - 4, arm.pivot[2] + 18];
  const mix = (a, b, t) => a.map((value, axis) => value + (b[axis] - value) * t);

  let index = 0;
  let turn = detents[0];
  let reelTurn = 0;
  let needle = sentiment.Neutral;
  let review = 1;
  let flap = 0;
  let stampClock = 0;
  const raise = combs.map(() => 1);
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
    part("intent").textContent = scenario.intent.label.toUpperCase();
    part("source").textContent = scenario.ai ? "RULES · TO AI REVIEW" : "AI UNAVAILABLE · RULES STAND";
    svg.querySelectorAll("[data-lamp]").forEach((lamp) => {
      const [group, label] = lamp.dataset.lamp.split(":");
      lamp.toggleAttribute("data-on", (group === "priority" ? scenario.priority : scenario.risk) === label);
    });
    svg.querySelector("[data-mask]").toggleAttribute("data-show", Boolean(scenario.masked.account || scenario.masked.card));
    svg.querySelector(".cb-offline").toggleAttribute("data-on", !scenario.ai);
    if (readout && readout.textContent !== scenario.readout) readout.textContent = scenario.readout;
    stage.setAttribute("aria-valuenow", String(index + 1));
    stage.setAttribute("aria-valuetext", `${scenario.name}: ${scenario.readout}`);
  }

  function draw() {
    part("pointer").setAttribute("d", pointerAt(turn));
    part("spokes").setAttribute("d", spokesAt(reelTurn));
    part("sentiment").setAttribute("d", needleAt(needle));
    combs.forEach((group, lane) => {
      group.setAttribute("transform", translateAlong(P, [0, 0, raise[lane] * combRaised]));
      // The flag rises on its pole when the comb drops, a pennant at the top
      const x = combX[lane];
      const top = flagZ + (1 - raise[lane]) * 6;
      const pennant = raise[lane] < 0.9 ? pathOf([iso([x, flagY, top], P), iso([x, flagY - 3.2, top - 1.1], P), iso([x, flagY, top - 2.2], P)], true) : "";
      flags[lane].setAttribute("d", segment([x, flagY, flagZ], [x, flagY, top], P) + pennant);
    });
    const stampDown = scenarios[index].masked.account || scenarios[index].masked.card ? Math.max(0, Math.sin(stampClock * 3.4)) ** 6 : 0;
    part("stamp").setAttribute("transform", translateAlong(P, [0, 0, (1 - stampDown) * stampUp]));
    const tip = mix(parkedTip, reviewTip, review);
    part("arm").setAttribute("d", pathOf([iso(arm.pivot, P), iso(tip, P)]));
    part("lens").setAttribute("d", ring(tip[0], tip[1], arm.lens, tip[2], P, 24));
    part("flap").setAttribute("d", lineOnTop(gate, onCircle(gate, 6, flap), 9.6, P));
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
    needle = follow(needle, sentiment[scenario.sentiment.label], 0.25);
    review = follow(review, scenario.ai ? 1 : 0, 0.3);
    flap = follow(flap, scenario.ai ? 0 : Math.PI / 2, 0.2);
    combs.forEach((_, lane) => {
      raise[lane] = follow(raise[lane], lane === scenario.intent.comb ? 0 : 1, 0.18);
    });
    if (!calm) {
      reelTurn += dt * 2.2;
      stampClock += dt;
    }
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
