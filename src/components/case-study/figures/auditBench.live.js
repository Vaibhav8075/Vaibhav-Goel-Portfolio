// Live behaviour of the audit bench. The knob picks who is trying to play which call; that role's key lights, the
// lock opens only when the platform would stream (200), the matching status lamp lights, the waveform moves while
// the call plays and the access log gains a line. Once the retention has passed, the reel is gone and every play
// gets 410, while the permanent file keeps its cards. When the HOD rates the call, the stamp comes down.
// Returns a cleanup function carrying choose(index) and setMode({ tour, hover }) for a guided tour.
export function mountAuditBench(figure, { geometry, scenarios, kit, tour = true, hover = true }) {
  const { lineOnTop, translateAlong } = kit;
  const { P, knob, knobR, knobTop, detents, stampUp, days, wave } = geometry;
  const stage = figure.querySelector(".iso-stage");
  const svg = stage.querySelector("svg");
  const readout = figure.querySelector("[data-readout]");
  const part = (name) => svg.querySelector(`[data-part="${name}"]`);
  const bars = [...svg.querySelectorAll(".ab-bar")];
  const logLines = [...svg.querySelectorAll("[data-line]")];
  const still = window.matchMedia("(prefers-reduced-motion: reduce)");

  const onCircle = ([cx, cy], radius, angle) => [cx + Math.sin(angle) * radius, cy - Math.cos(angle) * radius];
  const pointerAt = (angle) => lineOnTop(onCircle(knob, -1.8, angle), onCircle(knob, knobR - 0.3, angle), knobTop, P);

  let index = 0;
  let turn = detents[0];
  let open = 0;
  let plays = 1;
  let wavePhase = 0;
  let stampClock = 0;
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
    svg.querySelectorAll("[data-key]").forEach((key) => key.toggleAttribute("data-on", key.dataset.key === scenario.role));
    svg.querySelectorAll("[data-status]").forEach((lamp) => lamp.toggleAttribute("data-on", Number(lamp.dataset.status) === scenario.code));
    svg.querySelector("[data-reel]").toggleAttribute("data-gone", scenario.code === 410);
    part("days").setAttribute("d", days[scenario.days]);
    if (scenario.code === 200) plays = (plays % logLines.length) + 1;
    logLines.forEach((line) => line.toggleAttribute("data-show", Number(line.dataset.line) < plays));
    part("mark").toggleAttribute("data-on", scenario.role === "hod" && scenario.code === 200);
    if (readout && readout.textContent !== scenario.readout) readout.textContent = scenario.readout;
    stage.setAttribute("aria-valuenow", String(index + 1));
    stage.setAttribute("aria-valuetext", `${scenario.readout}: ${scenario.note}`);
  }

  function draw() {
    const scenario = scenarios[index];
    part("pointer").setAttribute("d", pointerAt(turn));
    svg.querySelector("[data-shackle]").setAttribute("transform", translateAlong(P, [0, 0, open * 2.4]));
    const playing = scenario.code === 200;
    bars.forEach((bar, lane) => {
      const height = playing ? wave.d * (0.25 + 0.75 * Math.abs(Math.sin(wavePhase * 2.6 + lane * 0.9) * Math.cos(wavePhase * 1.3 + lane * 0.4))) : wave.d * 0.08;
      bar.setAttribute("height", height.toFixed(2));
      bar.setAttribute("y", (wave.y + (wave.d - height) / 2).toFixed(2));
    });
    const stamping = scenario.role === "hod" && playing;
    const down = stamping ? Math.max(0, Math.sin(stampClock * 2.4)) ** 8 : 0;
    part("stamp").setAttribute("transform", translateAlong(P, [0, 0, (1 - down) * stampUp]));
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
    const follow = (value, want, seconds) => (calm ? want : value + (want - value) * (1 - Math.exp(-dt / seconds)));
    turn = follow(turn, detents[index], 0.12);
    open = follow(open, scenarios[index].code === 200 ? 1 : 0, 0.15);
    if (!calm) {
      wavePhase += dt;
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
