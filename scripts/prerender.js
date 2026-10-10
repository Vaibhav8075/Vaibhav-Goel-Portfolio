// Renders every route to static HTML after `vite build`, so each page ships with its content,
// title and description instead of an empty <div id="root">. Also writes 404.html and the sitemap.
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const dist = path.join(root, "dist")
const ssrDir = path.join(root, "dist-ssr")

const template = fs.readFileSync(path.join(dist, "index.html"), "utf-8")
const { render, routes, pageMeta, SITE_URL } = await import(pathToFileURL(path.join(ssrDir, "entry-server.js")).href)

const escapeHtml = (value) =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

function applyMeta(html, meta) {
  const replace = (pattern, replacement) => {
    if (!pattern.test(html)) throw new Error(`prerender: ${pattern} not found in index.html`)
    html = html.replace(pattern, replacement)
  }
  const title = escapeHtml(meta.title)
  const description = escapeHtml(meta.description)
  const url = meta.url ?? `${SITE_URL}/`

  replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
  replace(/(<meta name="title" content=")[^"]*/, `$1${title}`)
  replace(/(<meta name="description" content=")[^"]*/, `$1${description}`)
  replace(/(<link rel="canonical" href=")[^"]*/, `$1${url}`)
  replace(/(<meta property="og:url" content=")[^"]*/, `$1${url}`)
  replace(/(<meta property="og:title" content=")[^"]*/, `$1${title}`)
  replace(/(<meta property="og:description" content=")[^"]*/, `$1${description}`)
  replace(/(<meta name="twitter:title" content=")[^"]*/, `$1${title}`)
  replace(/(<meta name="twitter:description" content=")[^"]*/, `$1${description}`)
  if (!meta.url) html = html.replace("</head>", '  <meta name="robots" content="noindex" />\n  </head>')
  return html
}

// /work/x is written as work/x.html: Vercel serves it at /work/x with cleanUrls (vercel.json),
// and `vite preview` resolves it too, whereas work/x/index.html would need a trailing slash
const pages = [...routes.map((route) => ({ route, file: route === "/" ? "index.html" : `${route.slice(1)}.html` })), { route: "/404", file: "404.html" }]

for (const { route, file } of pages) {
  const html = applyMeta(template.replace('<div id="root"></div>', `<div id="root">${render(route)}</div>`), pageMeta(route))
  const out = path.join(dist, file)
  fs.mkdirSync(path.dirname(out), { recursive: true })
  fs.writeFileSync(out, html)
  console.log(`prerendered ${route.padEnd(36)} -> dist/${file.replaceAll(path.sep, "/")}`)
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((route) => `  <url><loc>${SITE_URL}${route}</loc></url>`).join("\n")}
</urlset>
`
fs.writeFileSync(path.join(dist, "sitemap.xml"), sitemap)
console.log(`wrote sitemap.xml with ${routes.length} urls`)

fs.rmSync(ssrDir, { recursive: true, force: true })
