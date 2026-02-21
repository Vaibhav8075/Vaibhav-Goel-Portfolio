export const theme = {
  colors: {
    primary: "#f97316",
    primaryLight: "#fb923c",
    primaryDark: "#ea580c",
    bg: "#0a0a0a",
    bgElevated: "#141414",
    surface: "rgba(20, 20, 20, 0.75)",
    border: "rgba(249, 115, 22, 0.2)",
    borderHover: "rgba(249, 115, 22, 0.4)",
    text: "rgba(255, 255, 255, 0.9)",
    textMuted: "rgba(255, 255, 255, 0.7)",
  },
  spacing: {
    section: "clamp(4rem, 10vw, 8rem)",
    card: "clamp(2rem, 5vw, 4rem)",
    gap: "1.5rem",
  },
  layout: {
    maxWidth: "1200px",
    maxWidthNarrow: "640px",
    borderRadius: "16px",
    borderRadiusLg: "24px",
  },
  font: {
    heading: "clamp(2rem, 5vw, 3rem)",
    subheading: "clamp(1.25rem, 2vw, 1.5rem)",
    body: "1.05rem",
  },
}

export const scrollToSection = (id) => {
  document.querySelector(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
}
