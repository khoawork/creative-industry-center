import { Home } from "lucide-react";
import AboutPage from "../pages/About";
import EventActive from "../pages/eventActivePage";
import FounderStory from "../pages/founder-story";
import ProjectsPage from "../pages/Projects";
import HomePage from "../pages/Home/Home";
import RecordHolder from "../pages/RecordHolder/RecordHolder";
import ContactPage from "../pages/ContactPage";
import AwardsPage from "../pages/AwardsPage";
import TrainingPage from "../pages/TrainingPage";
import ForumPage from "../pages/ForumPage";

export const routes = [
  { path: "/", name: "home", page: HomePage },
  { path: "/about", name: "about", page: AboutPage },
  { path: "/stories", name: "stories", page: FounderStory },
  { path: "/projects", name: "projects", page: ProjectsPage },
  { path: "/contact", name: "contact", page: ContactPage },
  { path: "/awards", name: "awards", page: AwardsPage },
  { path: "/events", name: "events", page: EventActive },
  { path: "/records", name: "records", page: RecordHolder },
  { path: "/training", name: "training", page: TrainingPage },
  { path: "/forum", name: "forum", page: ForumPage },
];

export default routes;
