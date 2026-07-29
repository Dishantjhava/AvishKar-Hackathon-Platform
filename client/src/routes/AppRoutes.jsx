import { Routes, Route } from "react-router-dom";

import Home                  from "../pages/Home";
import Login                 from "../pages/Login";
import Signup                from "../pages/Signup";
import HackathonListing      from "../pages/HackathonListing";
import HackathonDetails      from "../pages/HackathonDetails";
import Leaderboard           from "../pages/Leaderboard";
import AcceptInvite          from "../pages/AcceptInvite";
import NotFound              from "../pages/NotFound";
import Dashboard              from "../pages/Dashboard";
import Profile               from "../pages/Profile";
import TeamPage              from "../pages/TeamPage";
import SubmissionPage        from "../pages/SubmissionPage";

import AdminDashboard        from "../pages/dashboards/AdminDashboard";
import OrganizerDashboard    from "../pages/dashboards/OrganizerDashboard";
import ParticipantDashboard  from "../pages/dashboards/ParticipantDashboard";
import JudgeDashboard        from "../pages/dashboards/JudgeDashboard";

import MainLayout            from "../layouts/MainLayout";
import DashboardLayout       from "../layouts/DashboardLayout";
import ProtectedRoute        from "./ProtectedRoute";
import { ROLES }             from "../utils/constants";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/"                         element={<Home />} />
        <Route path="/hackathons"               element={<HackathonListing />} />
        <Route path="/hackathons/:id"           element={<HackathonDetails />} />
        <Route path="/login"                    element={<Login />} />
        <Route path="/signup"                   element={<Signup />} />
        <Route path="/leaderboard/:hackathonId" element={<Leaderboard />} />
        <Route path="/invite/:token"            element={<AcceptInvite />} />
      </Route>

      <Route element={<MainLayout />}>
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/team"
          element={
            <ProtectedRoute allowedRoles={[ROLES.PARTICIPANT]}>
              <TeamPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/team/:id"
          element={
            <ProtectedRoute allowedRoles={[ROLES.PARTICIPANT]}>
              <TeamPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/submit/:hackathonId"
          element={
            <ProtectedRoute allowedRoles={[ROLES.PARTICIPANT]}>
              <SubmissionPage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route element={<DashboardLayout />}>
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/organizer"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
              <OrganizerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/participant"
          element={
            <ProtectedRoute allowedRoles={[ROLES.PARTICIPANT]}>
              <ParticipantDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/judge"
          element={
            <ProtectedRoute allowedRoles={[ROLES.JUDGE]}>
              <JudgeDashboard />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
