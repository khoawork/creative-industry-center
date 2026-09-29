import AboutPage from "../pages/About"
import FounderStory from "../pages/founder-story"
import ProjectsPage from "../pages/Projects"


export const routes = [
  { path: "/", name: "home", page: FounderStory },
  { path: "/founder-stories", name: "founder-story", page: FounderStory },
  { path: "/projects", name: "projects", page: ProjectsPage },
  { path: "/about", name: "about", page: AboutPage },
]

export default routes