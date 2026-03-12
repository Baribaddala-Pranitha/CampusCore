import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Progress } from "@/components/ui/progress";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Calendar,
  DollarSign,
  Bus,
  MessageSquare,
  Settings
} from "lucide-react";

const StudentDashboard = () => {
  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/student/dashboard" },
    { icon: Calendar, label: "Timetable", path: "/student/timetable" },
    { icon: BookOpen, label: "Assignments", path: "/student/assignments" },
    { icon: FileText, label: "Grades & Reports", path: "/student/grades" },
    { icon: DollarSign, label: "Fees", path: "/student/fees" },
    { icon: Bus, label: "Transport", path: "/student/transport" },
    { icon: MessageSquare, label: "Communication", path: "/student/communication" },
    { icon: Settings, label: "Settings", path: "/student/settings" }
  ];

  const [stats, setStats] = useState<{ attendance: number; gpa: number; pending: number }>({ attendance: 0, gpa: 0, pending: 0 });

  useEffect(() => {
    async function load() {
      try {
        const students: any[] = await api.get("/admin/students?status=Active");
        const s = students?.[0];
        if (!s) return;
        const [attendance, assignments] = await Promise.all([
          api.get(`/admin/students/${s._id}/attendance-summary`),
          api.get(`/admin/students/${s._id}/assignments`),
        ]);
        const pending = assignments.filter((a: any) => a.status === "Active").length;
        setStats({ attendance: attendance?.last30d?.percentage || 0, gpa: 8.5, pending });
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="student">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Student Dashboard</h1>
        <p className="text-muted-foreground">Track your attendance, grades, and assignments</p>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3 mb-2">
          <a className="inline-flex items-center justify-center h-10 rounded-md accent-button bg-background px-4 text-sm font-medium transition-smooth" href="/student/timetable">View Timetable</a>
          <a className="inline-flex items-center justify-center h-10 rounded-md accent-button bg-background px-4 text-sm font-medium transition-smooth" href="/student/assignments">Assignments</a>
          <a className="inline-flex items-center justify-center h-10 rounded-md accent-button bg-background px-4 text-sm font-medium transition-smooth" href="/student/grades">Grades</a>
          <a className="inline-flex items-center justify-center h-10 rounded-md accent-button bg-background px-4 text-sm font-medium transition-smooth" href="/student/fees">Fees</a>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 hover-lift">
            <h3 className="text-2xl font-bold mb-2">{stats.attendance}%</h3>
            <p className="text-muted-foreground">Attendance</p>
            <div className="mt-3"><Progress value={stats.attendance} /></div>
          </Card>
          <Card className="p-6 hover-lift">
            <h3 className="text-2xl font-bold mb-2">{stats.gpa}</h3>
            <p className="text-muted-foreground">Current GPA</p>
          </Card>
          <Card className="p-6 hover-lift">
            <h3 className="text-2xl font-bold mb-2">{stats.pending}</h3>
            <p className="text-muted-foreground">Pending Assignments</p>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
