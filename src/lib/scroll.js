let lenis = null

export function setLenis(instance) {
  lenis = instance
}

export function scrollToSection(id) {
  const target = document.getElementById(id)
  if (!target) return

  if (lenis) {
    lenis.scrollTo(target)
  } else {
    target.scrollIntoView({ behavior: "smooth" })
  }
  history.replaceState(null, "", `#${id}`)
}

// Freeze page scrolling behind modal UI
export function setScrollLocked(locked) {
  if (lenis) {
    if (locked) lenis.stop()
    else lenis.start()
  }
  document.documentElement.style.overflow = locked ? "hidden" : ""
}
