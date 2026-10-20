// Live behaviour of the fire bench: the knob steps through the scenarios, the booth shows what is burning, the
// sensor LEDs light where a reading meets a rule threshold, the lever of the first rule that fires stands up
// and the matching lamp lights. A Wi-Fi packet leaves the board every 2 seconds, as the ESP32 does.
// Returns a cleanup function carrying choose(index) and setMode({ tour, hover }) for a guided tour.
export function mountFireBench(figure, { geometry, scenarios, leds, kit, tour = true, hover = true }) {
  const { iso, lineOnTop, pathOf } = kit;
  const { P, scale, knob, knobR, knobTop, detents, levers } = geometry;
  const stage = figure.querySelector(".iso-stage");
  const svg = stage.querySelector("svg");
  const readout = figure.querySelector("[data-readout]");
  const pointer = svg.querySelector('[data-part="pointer"]');
  const leverLines = [...svg.querySelectorAll("[data-lever]")];
  const leverTips = [...svg.querySelectorAll("[data-lever-tip]")];
  const packetLayer = svg.querySelector("[data-packet]");
  const arcGroup = svg.querySelector('[data-cable="0"]');
  const still = window.matchMedia("(prefers-reduced-motion: reduce)");

  const onCircle = ([cx, cy], radius, angle) => [cx + Math.sin(angle) * radius, cy - Math.cos(angle) * radius];
  const pointerAt = (angle) => lineOnTop(onCircle(knob, -2, angle), onCircle(knob, knobR - 0.3, angle), knobTop, P);
  const RAISED = 1.2; // rad: a lever stands up when its rule fires
  const tipOf = ({ pivot, length }, angle) => [pivot[0], pivot[1] + length * Math.cos(angle), pivot[2] + length * Math.sin(angle)];

  let index = 0;
  let turn = detents[0];
  const raise = levers.map(() => 0);
  let frame = 0;
  let last = 0;
  let clock = 0;
  let sent = 0;
  let tourOn = tour;
  let hoverOn = hover;
  let touring = tourOn && !still.matches;
  let visible = false;
  let idleTimer = 0;

  function apply() {
    const scenario = scenarios[index];
    svg.querySelectorAll("[data-prop]").forEach((group) => group.toggleAttribute("data-show", group.dataset.prop === scenario.id));
    svg.querySelectorAll("[data-lamp]").forEach((lamp) => lamp.toggleAttribute("data-on", lamp.dataset.lamp === scenario.label));
    svg.querySelectorAll("[data-led]").forEach((dot) => dot.toggleAttribute("data-on", Boolean(leds[dot.dataset.led]?.(scenario.reading))));
    if (readout && readout.textContent !== scenario.readout) readout.textContent = scenario.readout;
    stage.setAttribute("aria-valuenow", String(index + 1));
    stage.setAttribute("aria-valuetext", scenario.readout);
  }

  function draw() {
    pointer.setAttribute("d", pointerAt(turn));
    levers.forEach((lever, lane) => {
      const tip = iso(tipOf(lever, raise[lane] * RAISED), P);
      leverLines[lane].setAttribute("d", pathOf([iso(lever.pivot, P), tip]));
      leverTips[lane].setAttribute("cx", tip[0].toFixed(1));
      leverTips[lane].setAttribute("cy", tip[1].toFixed(1));
      leverTips[lane].toggleAttribute("data-on", raise[lane] > 0.5);
    });
  }

  // A packet glides along the Wi-Fi path (whatever the tour has drawn there) with a short fading trail
  function drawPacket(age) {
    const path = arcGroup.querySelector("path");
    if (!path || age > 1.1) {
      packetLayer.innerHTML = "";
      return;
    }
    const length = path.getTotalLength();
    packetLayer.innerHTML = [0, 0.05, 0.1]
      .map((lag, trail) => {
        const t = Math.min(1, Math.max(0, (age - lag) / 1.1));
        const point = path.getPointAtLength(t * length);
        return `<circle class="fb-packet" cx="${point.x.toFixed(1)}" cy="${point.y.toFixed(1)}" r="${((1.3 - trail * 0.35) * scale).toFixed(2)}" opacity="${(1 - trail * 0.35).toFixed(2)}"/>`;
      })
      .join("");
  }

  function tick(now) {
    const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
    last = now;
    const calm = still.matches;
    if (touring) {
      clock += dt;
      if (clock > 3.2) {
        clock = 0;
        index = (index + 1) % scenarios.length;
        apply();
      }
    }
    const aim = detents[index];
    turn = calm ? aim : turn + (aim - turn) * (1 - Math.exp(-dt / 0.12));
    const fired = scenarios[index].rule;
    levers.forEach((_, lane) => {
      const want = lane === fired ? 1 : 0;
      raise[lane] = calm ? want : raise[lane] + (want - raise[lane]) * (1 - Math.exp(-dt / 0.18));
    });
    draw();
    sent += dt;
    if (sent > 2) sent = 0;
    drawPacket(calm ? 2 : sent);
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
