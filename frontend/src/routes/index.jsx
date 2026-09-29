import AboutPage from "../pages/About"
import EventActive from "../pages/eventActivePage"
import FounderStory from "../pages/founder-story"
import ProjectsPage from "../pages/Projects"


export const routes = [
  { path: "/", name: "home", page: FounderStory },
  { path: "/founder-stories", name: "founder-story", page: FounderStory },
  { path: "/projects", name: "projects", page: ProjectsPage },
  { path: "/about", name: "about", page: AboutPage },
  { path: "/event-active", name: "event-active", page: EventActive },
]

export default routes