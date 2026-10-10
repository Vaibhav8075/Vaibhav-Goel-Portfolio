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
