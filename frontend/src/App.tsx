import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

// Admin Portal
import AdminDashboard from "./pages/admin/Dashboard";
import StudentsPage from "./pages/admin/Students";
import TeachersPage from "./pages/admin/Teachers";
import AcademicsPage from "./pages/admin/Academics";
import TransportPage from "./pages/admin/Transport";
import FinancePage from "./pages/admin/Finance";
import InfrastructurePage from "./pages/admin/Infrastructure";
import ReportsPage from "./pages/admin/Reports";
import EventsPage from "./pages/admin/Events";
import AdminCommunicationPage from "./pages/admin/Communication";
import AdminSettingsPage from "./pages/admin/Settings";
import AdminNotifications from "./pages/admin/Notifications";

// Teacher Portal
import TeacherDashboard from "./pages/teacher/Dashboard";
import ClassesPage from "./pages/teacher/Classes";
import AttendancePage from "./pages/teacher/Attendance";
import AssignmentsPage from "./pages/teacher/Assignments";
import ExamsPage from "./pages/teacher/Exams";
import TimetablePage from "./pages/teacher/Timetable";
import TeacherCommunicationPage from "./pages/teacher/Communication";
import TeacherSettingsPage from "./pages/teacher/Settings";
import TeacherNotifications from "./pages/teacher/Notifications";

// Student Portal
import StudentDashboard from "./pages/student/Dashboard";
import StudentTimetable from "./pages/student/Timetable";
import StudentAssignments from "./pages/student/Assignments";
import StudentGrades from "./pages/student/Grades";
import StudentFees from "./pages/student/Fees";
import StudentTransport from "./pages/student/Transport";
import StudentCommunication from "./pages/student/Communication";
import StudentSettings from "./pages/student/Settings";
import StudentNotifications from "./pages/student/Notifications";

// Parent Portal
import ParentDashboard from "./pages/parent/Dashboard";
import ParentChildren from "./pages/parent/Children";
import ParentReports from "./pages/parent/Reports";
import ParentFees from "./pages/parent/Fees";
import ParentEvents from "./pages/parent/Events";
import ParentNotifications from "./pages/parent/Notifications";
import ParentCommunication from "./pages/parent/Communication";
import ParentSettings from "./pages/parent/Settings";

// Staff Portal
import StaffDashboard from "./pages/staff/Dashboard";
import StaffTasks from "./pages/staff/Tasks";
import StaffAttendance from "./pages/staff/Attendance";
import StaffPayroll from "./pages/staff/Payroll";
import StaffSettings from "./pages/staff/Settings";
import StaffLeave from "./pages/staff/Leave";
import StaffMaintenance from "./pages/staff/Maintenance";
import StaffNotifications from "./pages/staff/Notifications";

// Transport Portal
import TransportDashboard from "./pages/transport/Dashboard";
import TransportStudents from "./pages/transport/Students";
import TransportRoute from "./pages/transport/Route";
import TransportMaintenance from "./pages/transport/Maintenance";
import TransportSettings from "./pages/transport/Settings";
import TransportAttendance from "./pages/transport/Attendance";
import TransportNotifications from "./pages/transport/Notifications";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Admin Portal Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/students" element={<ProtectedRoute allowedRoles={["admin"]}><StudentsPage /></ProtectedRoute>} />
          <Route path="/admin/teachers" element={<ProtectedRoute allowedRoles={["admin"]}><TeachersPage /></ProtectedRoute>} />
          <Route path="/admin/academics" element={<ProtectedRoute allowedRoles={["admin"]}><AcademicsPage /></ProtectedRoute>} />
          <Route path="/admin/transport" element={<ProtectedRoute allowedRoles={["admin"]}><TransportPage /></ProtectedRoute>} />
          <Route path="/admin/finance" element={<ProtectedRoute allowedRoles={["admin"]}><FinancePage /></ProtectedRoute>} />
          <Route path="/admin/infrastructure" element={<ProtectedRoute allowedRoles={["admin"]}><InfrastructurePage /></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={["admin"]}><ReportsPage /></ProtectedRoute>} />
          <Route path="/admin/events" element={<ProtectedRoute allowedRoles={["admin"]}><EventsPage /></ProtectedRoute>} />
          <Route path="/admin/communication" element={<ProtectedRoute allowedRoles={["admin"]}><AdminCommunicationPage /></ProtectedRoute>} />
          <Route path="/admin/notifications" element={<ProtectedRoute allowedRoles={["admin"]}><AdminNotifications /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={["admin"]}><AdminSettingsPage /></ProtectedRoute>} />

          {/* Teacher Portal Routes */}
          <Route path="/teacher/dashboard" element={<ProtectedRoute allowedRoles={["teacher"]}><TeacherDashboard /></ProtectedRoute>} />
          <Route path="/teacher/classes" element={<ProtectedRoute allowedRoles={["teacher"]}><ClassesPage /></ProtectedRoute>} />
          <Route path="/teacher/attendance" element={<ProtectedRoute allowedRoles={["teacher"]}><AttendancePage /></ProtectedRoute>} />
          <Route path="/teacher/assignments" element={<ProtectedRoute allowedRoles={["teacher"]}><AssignmentsPage /></ProtectedRoute>} />
          <Route path="/teacher/exams" element={<ProtectedRoute allowedRoles={["teacher"]}><ExamsPage /></ProtectedRoute>} />
          <Route path="/teacher/timetable" element={<ProtectedRoute allowedRoles={["teacher"]}><TimetablePage /></ProtectedRoute>} />
          <Route path="/teacher/communication" element={<ProtectedRoute allowedRoles={["teacher"]}><TeacherCommunicationPage /></ProtectedRoute>} />
          <Route path="/teacher/notifications" element={<ProtectedRoute allowedRoles={["teacher"]}><TeacherNotifications /></ProtectedRoute>} />
          <Route path="/teacher/settings" element={<ProtectedRoute allowedRoles={["teacher"]}><TeacherSettingsPage /></ProtectedRoute>} />

          {/* Student Portal Routes */}
          <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={["student"]}><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/timetable" element={<ProtectedRoute allowedRoles={["student"]}><StudentTimetable /></ProtectedRoute>} />
          <Route path="/student/assignments" element={<ProtectedRoute allowedRoles={["student"]}><StudentAssignments /></ProtectedRoute>} />
          <Route path="/student/grades" element={<ProtectedRoute allowedRoles={["student"]}><StudentGrades /></ProtectedRoute>} />
          <Route path="/student/fees" element={<ProtectedRoute allowedRoles={["student"]}><StudentFees /></ProtectedRoute>} />
          <Route path="/student/transport" element={<ProtectedRoute allowedRoles={["student"]}><StudentTransport /></ProtectedRoute>} />
          <Route path="/student/notifications" element={<ProtectedRoute allowedRoles={["student"]}><StudentNotifications /></ProtectedRoute>} />
          <Route path="/student/communication" element={<ProtectedRoute allowedRoles={["student"]}><StudentCommunication /></ProtectedRoute>} />
          <Route path="/student/settings" element={<ProtectedRoute allowedRoles={["student"]}><StudentSettings /></ProtectedRoute>} />

          {/* Parent Portal Routes */}
          <Route path="/parent/dashboard" element={<ProtectedRoute allowedRoles={["parent"]}><ParentDashboard /></ProtectedRoute>} />
          <Route path="/parent/children" element={<ProtectedRoute allowedRoles={["parent"]}><ParentChildren /></ProtectedRoute>} />
          <Route path="/parent/reports" element={<ProtectedRoute allowedRoles={["parent"]}><ParentReports /></ProtectedRoute>} />
          <Route path="/parent/fees" element={<ProtectedRoute allowedRoles={["parent"]}><ParentFees /></ProtectedRoute>} />
          <Route path="/parent/events" element={<ProtectedRoute allowedRoles={["parent"]}><ParentEvents /></ProtectedRoute>} />
          <Route path="/parent/notifications" element={<ProtectedRoute allowedRoles={["parent"]}><ParentNotifications /></ProtectedRoute>} />
          <Route path="/parent/communication" element={<ProtectedRoute allowedRoles={["parent"]}><ParentCommunication /></ProtectedRoute>} />
          <Route path="/parent/settings" element={<ProtectedRoute allowedRoles={["parent"]}><ParentSettings /></ProtectedRoute>} />

          {/* Staff Portal Routes */}
          <Route path="/staff/dashboard" element={<ProtectedRoute allowedRoles={["staff"]}><StaffDashboard /></ProtectedRoute>} />
          <Route path="/staff/tasks" element={<ProtectedRoute allowedRoles={["staff"]}><StaffTasks /></ProtectedRoute>} />
          <Route path="/staff/attendance" element={<ProtectedRoute allowedRoles={["staff"]}><StaffAttendance /></ProtectedRoute>} />
          <Route path="/staff/leave" element={<ProtectedRoute allowedRoles={["staff"]}><StaffLeave /></ProtectedRoute>} />
          <Route path="/staff/maintenance" element={<ProtectedRoute allowedRoles={["staff"]}><StaffMaintenance /></ProtectedRoute>} />
          <Route path="/staff/payroll" element={<ProtectedRoute allowedRoles={["staff"]}><StaffPayroll /></ProtectedRoute>} />
          <Route path="/staff/notifications" element={<ProtectedRoute allowedRoles={["staff"]}><StaffNotifications /></ProtectedRoute>} />
          <Route path="/staff/settings" element={<ProtectedRoute allowedRoles={["staff"]}><StaffSettings /></ProtectedRoute>} />

          {/* Transport Portal Routes */}
          <Route path="/transport/dashboard" element={<ProtectedRoute allowedRoles={["transport"]}><TransportDashboard /></ProtectedRoute>} />
          <Route path="/transport/students" element={<ProtectedRoute allowedRoles={["transport"]}><TransportStudents /></ProtectedRoute>} />
          <Route path="/transport/route" element={<ProtectedRoute allowedRoles={["transport"]}><TransportRoute /></ProtectedRoute>} />
          <Route path="/transport/attendance" element={<ProtectedRoute allowedRoles={["transport"]}><TransportAttendance /></ProtectedRoute>} />
          <Route path="/transport/maintenance" element={<ProtectedRoute allowedRoles={["transport"]}><TransportMaintenance /></ProtectedRoute>} />
          <Route path="/transport/notifications" element={<ProtectedRoute allowedRoles={["transport"]}><TransportNotifications /></ProtectedRoute>} />
          <Route path="/transport/settings" element={<ProtectedRoute allowedRoles={["transport"]}><TransportSettings /></ProtectedRoute>} />

          {/* Catch-all Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
