// Writes a standalone explainer page for a figure: the card on the left, the guided-tour panel on the right,
// with the kit and the figure's modules inlined so the file opens straight from disk.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "../../src/lib/iso/iso-kit.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
const FIGURES = join(ROOT, "src/components/case-study/figures");
const read = (path) => readFileSync(path, "utf8");
// Inline an ES module: drop its imports and exports, so its functions become plain declarations
export const inline = (file) => read(join(FIGURES, file)).replace(/^import .*$/gm, "").replace(/^export /gm, "");
export const kitSource = () => read(join(ROOT, "src/lib/iso/iso-kit.mjs")).replace(/^export /gm, "");

export const TOUR_PANEL = (note) =>
  `<aside class="tour-panel" aria-live="polite"><span class="tour-count"></span><h2 class="tour-title"></h2><p class="tour-text"></p><div class="tour-bar"><span></span></div><div class="tour-controls"><button type="button" data-back>Back</button><button type="button" data-play>Pause</button><button type="button" data-next>Next</button></div><div class="tour-dots"></div><p class="tour-note">${note}</p></aside>`;

export const KIT_NAMES = "{ iso, pathOf, wireSvg, lineSvg, dotsSvg, ring, translateAlong, screenRise, lineOnTop, onTop, segment }";

export function writeExplainer({ file, title, heading, intro, card, note, data, modules, boot }) {
  const css = read(join(FIGURES, "tour.css")) + read(join(ROOT, "scripts/figures/explainer.css"));
  const figure = card.replace('<figure class="iso-figure">', '<figure class="iso-figure tour-figure">');
  const body = `<style>${css}</style><div class="ex"><header class="ex-head"><h1>${heading}</h1><p>${intro}</p></header><div class="ex-grid">${figure}${TOUR_PANEL(note)}</div></div>`;
  const script = [kitSource(), data, ...modules.map(inline), `const kit = ${KIT_NAMES};`, boot].join("\n");
  const page = k.pageHtml({ title, theme: "dark", body, script, width: 1280 });
  writeFileSync(file, page.replace('<main class="iso-page">', '<main class="iso-page" style="width:auto;margin:0">'));
}
