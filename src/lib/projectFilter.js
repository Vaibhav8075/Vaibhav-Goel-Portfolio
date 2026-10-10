import { createContext, useContext } from "react"

// filter is null (show everything) or { type: "domain" | "tech", value: string }
export const ProjectFilterContext = createContext({ filter: null, setFilter: () => {} })

export function useProjectFilter() {
  return useContext(ProjectFilterContext)
}

export function matchesFilter(project, filter) {
  if (!filter) return true
  if (filter.type === "domain") return project.domains.includes(filter.value)
  return project.tech.includes(filter.value)
}
