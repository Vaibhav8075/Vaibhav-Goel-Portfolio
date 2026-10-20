// Live behaviour of the protocol bench figure: the selector knob steps through the four protocols
// and the dial needle follows the matching macro-F1 on a damped spring. Returns a cleanup function.
export function mountProtocolBench(figure, { geometry, protocols, lineOnTop }) {
  const { P, dial, dialR, dialTop, scaleFrom, scaleSpan, knob, knobR, knobTop, detents } = geometry;
  const stage = figure.querySelector(".iso-stage");
  const svg = stage.querySelector("svg");
  const needle = svg.querySelector('[data-part="needle"]');
  const pointer = svg.querySelector('[data-part="pointer"]');
  const readout = figure.querySelector("[data-readout]");
  const still = window.matchMedia("(prefers-reduced-motion: reduce)");

  const onCircle = ([cx, cy], radius, angle) => [cx + Math.sin(angle) * radius, cy - Math.cos(angle) * radius];
  const needleAt = (value) => {
    const angle = scaleFrom + (value / 100) * scaleSpan;
    return lineOnTop(onCircle(dial, -3.6, angle), onCircle(dial, dialR - 4.2, angle), dialTop + 0.2, P);
  };
  const pointerAt = (angle) => lineOnTop(onCircle(knob, -2.2, angle), onCircle(knob, knobR - 0.3, angle), knobTop, P);

  let index = 0;
  let value = protocols[0].f1;
  let rate = 0;
  let turn = detents[0];
  let frame = 0;
  let last = 0;
  let clock = 0;
  let touring = !still.matches;
  let visible = false;
  let idleTimer = 0;

  function say() {
    const protocol = protocols[index];
    if (readout && readout.textContent !== protocol.readout) readout.textContent = protocol.readout;
    stage.setAttribute("aria-valuenow", String(index + 1));
    stage.setAttribute("aria-valuetext", `${protocol.name}, ${protocol.data}: macro-F1 ${protocol.f1}%`);
  }

  function draw() {
    needle.setAttribute("d", needleAt(value));
    pointer.setAttribute("d", pointerAt(turn));
  }

  function tick(now) {
    const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
    last = now;
    const calm = still.matches;
    if (touring) {
      clock += dt;
      if (clock > 2.8) {
        clock = 0;
        index = (index + 1) % protocols.length;
        say();
      }
    }
    const want = protocols[index].f1;
    const aim = detents[index];
    if (calm) {
      value = want;
      rate = 0;
      turn = aim;
    } else {
      turn += (aim - turn) * (1 - Math.exp(-dt / 0.12));
      if (Math.abs(aim - turn) < 1e-4) turn = aim;
      // A gauge movement: stiff enough to arrive in about a second, damped just under critical
      const stiffness = 38;
      const damping = 2 * Math.sqrt(stiffness) * 0.82;
      for (let step = 0; step < 4; step++) {
        rate += ((want - value) * stiffness - rate * damping) * (dt / 4);
        value += rate * (dt / 4);
      }
      if (Math.abs(want - value) < 0.01 && Math.abs(rate) < 0.01) {
        value = want;
        rate = 0;
      }
    }
    draw();
    const settled = !touring && value === want && rate === 0 && turn === aim;
    frame = visible && !settled ? requestAnimationFrame(tick) : 0;
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
      say();
    }
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      touring = !still.matches;
      clock = 0;
      run();
    }, 4500);
    run();
  };

  const onMove = (event) => {
    if (event.pointerType === "touch") return;
    const box = svg.getBoundingClientRect();
    const share = Math.min(0.999, Math.max(0, (event.clientX - box.left) / box.width));
    choose(Math.floor(share * protocols.length));
  };
  const onDown = (event) => {
    if (event.pointerType === "touch") choose((index + 1) % protocols.length);
  };
  const onKey = (event) => {
    let next = null;
    if (event.key === "ArrowRight" || event.key === "ArrowUp") next = Math.min(protocols.length - 1, index + 1);
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") next = Math.max(0, index - 1);
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = protocols.length - 1;
    if (next === null) return;
    event.preventDefault();
    choose(next);
  };
  const onMotion = () => {
    touring = !still.matches;
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
  say();
  draw();

  return () => {
    observer.disconnect();
    cancelAnimationFrame(frame);
    clearTimeout(idleTimer);
    stage.removeEventListener("pointermove", onMove);
    stage.removeEventListener("pointerdown", onDown);
    stage.removeEventListener("keydown", onKey);
    still.removeEventListener("change", onMotion);
  };
}
