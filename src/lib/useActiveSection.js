import { useEffect, useState } from "react"

// Returns the id of the section crossing the middle of the viewport, or null (e.g. over the hero)
export default function useActiveSection(ids) {
  const [active, setActive] = useState(null)

  useEffect(() => {
    const visible = new Set()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        }
        setActive(ids.find((id) => visible.has(id)) ?? null)
      },
      { rootMargin: "-45% 0px -50% 0px" },
    )

    for (const id of ids) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [ids])

  return active
}
