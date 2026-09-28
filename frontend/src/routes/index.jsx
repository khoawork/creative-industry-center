import EventActive from "../pages/eventActivePage"
import FounderStory from "../pages/founder-story"


export const routes = [
  { path: "/", name: "home", page: FounderStory },
  { path: "/founder-stories", name: "founder-story", page: FounderStory },
  { path: "/event-active", name: "event-active", page: EventActive },
]

export default routes