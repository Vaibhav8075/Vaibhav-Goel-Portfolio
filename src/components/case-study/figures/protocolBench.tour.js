// Tour hooks for the protocol bench: steps move the selector, and the motor runs slowed right down.
// The coupling turns; with the top half lifted the rotor bars sweep round, the fan blades turn and the balls
// roll round both bearings. Each time a ball on the drive-end bearing rolls over the damaged spot, a knock
// ring spreads from it.
export function protocolBenchHooks({ figure, geometry, running, bench, kit }) {
  const { iso, pathOf, dotsSvg, ring } = kit;
  const art = figure.querySelector(".iso-svg");
  const spin = Object.fromEntries([...art.querySelectorAll("[data-spin]")].map((group) => [group.dataset.spin, group]));
  const SHAFT = Math.PI; // rad/s on screen, far slower than the real motor
  const CAGE = 0.4; // the ball set goes round slower than the shaft
  const BALLS = 9;
  let turn = 0;
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
  function frame(dt, opened) {
    turn += SHAFT * dt;
    const { axis, coupling } = running;
    spin.coupling.innerHTML = dotsSvg(
      Array.from({ length: 4 }, (_, index) => {
        const angle = turn + (index * Math.PI) / 2;
        const point = [0, 1, 2].map((i) => axis.o[i] + axis.a[i] * coupling[0] + coupling[1] * (Math.cos(angle) * axis.u[i] + Math.sin(angle) * axis.v[i]));
        return iso(point, geometry.P);
      }),
      { size: 0.45 },
    );
    if (opened.motor < 0.02) return;
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
  return {
    start: () => bench.setMode({ tour: false, hover: false }),
    stop: () => bench.setMode({ tour: true, hover: true }),
    step: (step) => step.protocol !== undefined && bench.choose(step.protocol),
    frame,
  };
}
