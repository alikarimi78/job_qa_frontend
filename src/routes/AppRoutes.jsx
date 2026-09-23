/** The route tree: the login and error pages are public; everything else sits inside the main layout behind sign-in, and the management and settings sections also require an admin role. */
import { Navigate, Route, Routes } from "react-router-dom";
import { ADMIN_ROLES, ROLES } from "@constants/roles";
import AdminLayout from "@pages/AdminLayout/AdminLayout";
import DashboardPage from "@pages/Dashboard/DashboardPage";
import LoginPage from "@pages/Login/LoginPage";
import MainLayout from "@pages/MainLayout/MainLayout";
import ManageJobsLayout from "@pages/ManageJobs/ManageJobsLayout";
import JobListPage from "@pages/ManageJobs/JobList/JobListPage";
import SuggestionReviewsPage from "@pages/ManageJobs/SuggestionReviews/SuggestionReviewsPage";
import NotFoundPage from "@pages/NotFound/NotFoundPage";
import SearchPage from "@pages/Search/SearchPage";
import AccountsPage from "@pages/Settings/Accounts/AccountsPage";
import OrganizationsPage from "@pages/Settings/Organizations/OrganizationsPage";
import SettingsIndexRedirect from "@pages/Settings/SettingsIndexRedirect";
import SettingsLayout from "@pages/Settings/SettingsLayout";
import SuggestionsPage from "@pages/Suggestions/SuggestionsPage";
import UnauthorizedPage from "@pages/Unauthorized/UnauthorizedPage";
import LandingRedirect from "./LandingRedirect";
import { LEGACY_REDIRECTS } from "./legacyRedirects";
import { PATHS } from "./paths";
import ProtectedRoute from "./ProtectedRoute";

const adminSection = (
  <ProtectedRoute roles={ADMIN_ROLES}>
    <AdminLayout />
  </ProtectedRoute>
);

export default function AppRoutes() {
  return (
    <Routes>
      <Route path={PATHS.login} element={<LoginPage />} />
      <Route path={PATHS.unauthorized} element={<UnauthorizedPage />} />

      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path={PATHS.root} element={<LandingRedirect />} />
        <Route path={PATHS.search} element={<SearchPage />} />
        <Route path={PATHS.suggestions} element={<SuggestionsPage />} />

        <Route path={PATHS.manage} element={adminSection}>
          <Route index element={<Navigate to={PATHS.dashboard} replace />} />
          <Route path={PATHS.dashboard} element={<DashboardPage />} />
          <Route path={PATHS.manageJobs} element={<ManageJobsLayout />}>
            <Route index element={<JobListPage />} />
            <Route path={PATHS.suggestionReviews} element={<SuggestionReviewsPage />} />
          </Route>
        </Route>

        <Route path={PATHS.settings} element={adminSection}>
          <Route element={<SettingsLayout />}>
            <Route index element={<SettingsIndexRedirect />} />
            <Route
              path={PATHS.organizations}
              element={
                <ProtectedRoute roles={[ROLES.superAdmin]}>
                  <OrganizationsPage />
                </ProtectedRoute>
              }
            />
            <Route path={PATHS.accounts} element={<AccountsPage />} />
          </Route>
        </Route>

        {LEGACY_REDIRECTS.map(({ from, to }) => (
          <Route key={from} path={from} element={<Navigate to={to} replace />} />
        ))}
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
