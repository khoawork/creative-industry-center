import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";
import AboutPage from "../pages/About";
import EventActive from "../pages/eventActivePage";
import FounderStory from "../pages/founder-story";
import ProjectsPage from "../pages/Projects";
import HomePage from "../pages/Home/Home";
import RecordHolder from "../pages/RecordHolder/RecordHolder";
import ContactPage from "../pages/ContactPage";
import AwardsPage from "../pages/AwardsPage";
import ForumPage from "../pages/ForumPage";
import AdminLoading from "../components/Admin/AdminLoading.jsx";
import TrainingPage from "../pages/Training/index.jsx";
import {
  adminItemsById,
  adminModules,
} from "../config/Admin/adminNavigation.js";
import { adminRoot } from "../config/Admin/adminPaths.js";
import {
  adminDemoUser,
  adminUnreadCount,
} from "../data/Admin/adminDashboardData.js";

/* oxlint-disable react/only-export-components -- Route configuration exports objects; lazy components are internal route elements. */
const AdminLayout = lazy(() => import("../layout/Admin/AdminLayout.jsx"));
const AdminDashboard = lazy(() => import("../pages/Admin/AdminDashboard.jsx"));
const AdminModulePlaceholder = lazy(
  () => import("../pages/Admin/AdminModulePlaceholder.jsx"),
);
const AdminNotFound = lazy(() => import("../pages/Admin/AdminNotFound.jsx"));
const AdminContact = lazy(() => import("../pages/Admin/AdminContact.jsx"));
const AdminHome = lazy(() => import("../pages/Admin/AdminHome.jsx"));
/* oxlint-enable react/only-export-components */

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

export const adminRoute = {
  path: adminRoot,
  element: (
    <Suspense fallback={<AdminLoading />}>
      <AdminLayout user={adminDemoUser} unreadCount={adminUnreadCount} />
    </Suspense>
  ),
  children: [
    { index: true, element: <AdminDashboard /> },
    ...adminModules.map((item) => ({
      path: item.path.slice(adminRoot.length + 1),
      element:
        item.id === "contact" ? (
          <AdminContact />
        ) : item.id === "home" ? (
          <AdminHome />
        ) : (
          <AdminModulePlaceholder item={item} />
        ),
    })),
    {
      path: "messages",
      element: <Navigate to={adminItemsById.contact.path} replace />,
    },
    { path: "*", element: <AdminNotFound /> },
  ],
};

export default routes;
