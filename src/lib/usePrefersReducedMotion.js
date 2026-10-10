import useMediaQuery from "./useMediaQuery"

// Unlike Framer's useReducedMotion, this reports false during server rendering and hydration,
// so pre-rendered HTML matches the first client render
export default function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)")
}
