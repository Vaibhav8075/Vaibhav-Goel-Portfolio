import { useSyncExternalStore } from "react"
import { scrollToSection } from "./scroll"

// Pre-rendering sets the path being rendered; in the browser the URL is the source of truth
let serverPath = "/"

export function setServerPath(path) {
  serverPath = path
}

const normalize = (path) => (path.length > 1 ? path.replace(/\/+$/, "") : path)

if (typeof window !== "undefined") {
  // Route changes swap the whole page, so restore scroll positions ourselves (see App)
  history.scrollRestoration = "manual"
  window.addEventListener("pagehide", () => {
    history.replaceState({ ...history.state, scrollY: window.scrollY }, "")
  })
}

function subscribe(onChange) {
  window.addEventListener("popstate", onChange)
  window.addEventListener("pushstate", onChange)
  return () => {
    window.removeEventListener("popstate", onChange)
    window.removeEventListener("pushstate", onChange)
  }
}

const getSnapshot = () => normalize(window.location.pathname)
const getServerSnapshot = () => (typeof window === "undefined" ? serverPath : getSnapshot())

export function usePathname() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export function navigate(to) {
  const url = new URL(to, window.location.href)

  if (normalize(url.pathname) === getSnapshot()) {
    if (url.hash) scrollToSection(url.hash.slice(1))
    return
  }

  // Remember where we were so Back returns to the same spot
  history.replaceState({ ...history.state, scrollY: window.scrollY }, "")
  history.pushState({ scrollY: 0 }, "", url.pathname + url.hash)
  window.dispatchEvent(new Event("pushstate"))
}

export function goToSection(id) {
  navigate(`/#${id}`)
}
