import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";
import AboutPage from "../pages/AboutPage.jsx";
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

const AdminLayout = lazy(() => import("../layout/Admin/AdminLayout.jsx"));
const AdminDashboard = lazy(() => import("../pages/Admin/AdminDashboard.jsx"));
const AdminModulePlaceholder = lazy(
  () => import("../pages/Admin/AdminModulePlaceholder.jsx"),
);
const AdminNotFound = lazy(() => import("../pages/Admin/AdminNotFound.jsx"));
const AdminContact = lazy(() => import("../pages/Admin/AdminContact.jsx"));
const AdminHome = lazy(() => import("../pages/Admin/AdminHome.jsx"));
const FounderAdminPanel = lazy(
  () => import("../components/Admin/Founder/FounderAdminPanel.jsx"),
);
const AdminNavigation = lazy(
  () => import("../pages/Admin/AdminNavigation.jsx"),
);
const AdminCatalog = lazy(() => import("../pages/Admin/AdminCatalog.jsx"));
const AdminAwardPage = lazy(() => import("../pages/Admin/AdminAwardPage.jsx"));
const AdminAbout = lazy(() => import("../pages/Admin/AdminAbout.jsx"));
const AdminEvents = lazy(() => import("../pages/Admin/AdminEvents.jsx"));
const AdminProjects = lazy(() => import("../pages/Admin/AdminProjects.jsx"));
const AdminTraining = lazy(() => import("../pages/Admin/AdminTraining.jsx"));
const AdminLogoFooter = lazy(
  () => import("../pages/Admin/AdminLogoFooter.jsx"),
);
const AdminRecordPage = lazy(() => import("../pages/Admin/AdminRecordPage.jsx"));
const AdminFormsPage = lazy(() => import("../pages/Admin/AdminFormsPage.jsx"));

/* oxlint-enable react/only-export-components */

export const routes = [
  { path: "/", name: "home", page: HomePage },
  { path: "/introduce", name: "introduce", page: AboutPage },
  { path: "/founder", name: "founder", page: FounderStory },
  { path: "/projects", name: "projects", page: ProjectsPage },
  { path: "/contact", name: "contact", page: ContactPage },
  { path: "/awards", name: "awards", page: AwardsPage },
  { path: "/events", name: "events", page: EventActive },
  { path: "/records", name: "records", page: RecordHolder },
  { path: "/trainings", name: "training", page: TrainingPage },
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
      element: (() => {
        switch (item.id) {
          case "contact":
            return <AdminContact />;
          case "home":
            return <AdminHome />;
          case "stories":
            return <FounderAdminPanel />;
          case "projects":
            return <AdminProjects />;
          case "events":
            return <AdminEvents />;
          case "training":
            return <AdminTraining />;
          case "navigation":
            return <AdminNavigation />;
          case "awards":
            return <AdminAwardPage />;
          case "records":
            return <AdminRecordPage />;
          case "logo & footer":
            return <AdminLogoFooter />;
          case "about":
            return <AdminAbout />;
          case "catalog":
            return <AdminCatalog />;
          case "forms":
            return <AdminFormsPage />;
          default:
            return ["events", "awards"].includes(item.id) ? (
              <AdminCatalog defaultTab={item.id} />
            ) : (
              <AdminModulePlaceholder item={item} />
            );
        }
      })(),
    })),
    {
      path: "forms",
      element: <AdminFormsPage />,
    },
    {
      path: "catalog",
      element: <AdminCatalog />,
    },
    {
      path: "messages",
      element: <Navigate to={adminItemsById.contact.path} replace />,
    },
    { path: "*", element: <AdminNotFound /> },
  ],
};

export default routes;