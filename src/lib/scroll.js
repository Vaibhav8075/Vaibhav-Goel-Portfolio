let lenis = null

export function setLenis(instance) {
  lenis = instance
}

export function scrollToSection(id) {
  const target = document.getElementById(id)
  if (!target) return

  if (lenis) {
    // Re-measure first: after a route change Lenis may still clamp to the old page height
    lenis.resize()
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

// Jump without animation, e.g. when a new page replaces the old one
export function scrollToY(y) {
  if (lenis) {
    lenis.resize()
    lenis.scrollTo(y, { immediate: true, force: true })
  } else {
    window.scrollTo(0, y)
  }
}

export function smoothScrollTo(y) {
  if (lenis) lenis.scrollTo(y)
  else window.scrollTo({ top: y, behavior: "smooth" })
}
