import { StrictMode } from "react"
import { renderToString } from "react-dom/server"
import App from "./App"
import { setServerPath } from "./lib/router"

export { routes, pageMeta, SITE_URL } from "./data/meta"

export function render(path) {
  setServerPath(path)
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
