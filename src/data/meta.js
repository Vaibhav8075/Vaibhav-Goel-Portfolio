import { projects } from "./content"
import { caseStudies } from "./caseStudies"

export const SITE_URL = "https://www.vaibhavgoel.dev"

const HOME = {
  title: "Vaibhav Goel | Software Engineer",
  description: "Software engineer specializing in machine learning pipelines, distributed backend architectures, and high-performance frontend interfaces.",
}

export const caseStudyPath = (id) => `/work/${id}`

export function caseStudyId(path) {
  const match = path.match(/^\/work\/([^/]+)$/)
  return match && caseStudies[match[1]] ? match[1] : null
}

// Every path that has a real page; used for pre-rendering and the sitemap
export const routes = ["/", ...projects.filter((project) => caseStudies[project.id]).map((project) => caseStudyPath(project.id))]

// Title, description and canonical URL for a path (null url: not a real page)
export function pageMeta(path) {
  if (path === "/") return { ...HOME, url: `${SITE_URL}/` }

  const id = caseStudyId(path)
  if (id) {
    const project = projects.find((p) => p.id === id)
    return {
      title: `${caseStudies[id].name}: Case Study | Vaibhav Goel`,
      description: `${project.tagline} ${project.description}`,
      url: `${SITE_URL}${path}`,
    }
  }

  return { title: "Page not found | Vaibhav Goel", description: HOME.description, url: null }
}
