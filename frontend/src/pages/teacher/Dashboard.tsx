import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  BookOpen,
  FileText,
  MessageSquare,
  Calendar,
  Settings,
  Bell,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle,
  Plus,
  Eye
} from "lucide-react";

const TeacherDashboard = () => {
  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/teacher/dashboard" },
    { icon: Users, label: "My Classes", path: "/teacher/classes" },
    { icon: ClipboardCheck, label: "Attendance", path: "/teacher/attendance" },
    { icon: BookOpen, label: "Assignments", path: "/teacher/assignments" },
    { icon: FileText, label: "Exams & Grades", path: "/teacher/exams" },
    { icon: Calendar, label: "Timetable", path: "/teacher/timetable" },
    { icon: MessageSquare, label: "Communication", path: "/teacher/communication" },
    { icon: Settings, label: "Settings", path: "/teacher/settings" }
  ];

  const [stats, setStats] = useState<{ 
    classes: number; 
    students: number; 
    pendingAssignments: number;
    todayAttendance: number;
    upcomingEvents: number;
    unreadNotifications: number;
  }>({ 
    classes: 0, 
    students: 0, 
    pendingAssignments: 0,
    todayAttendance: 0,
    upcomingEvents: 0,
    unreadNotifications: 0
  });
  
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const teachers: any[] = await api.get("/admin/teachers?status=Active");
        const t = teachers?.[0];
        if (!t) return;
        
        const [classes, assignments, events, notificationsData, attendanceData] = await Promise.all([
          api.get(`/admin/teachers/${t._id}/classes`).catch(() => []),
          api.get(`/admin/teachers/${t._id}/assignments`).catch(() => []),
          api.get("/admin/events").catch(() => []),
          api.get("/admin/notifications").catch(() => []),
          api.get(`/admin/teachers/${t._id}/attendance`).catch(() => [])
        ]);
        
        // Calculate stats
        const students = classes.reduce((sum: number, c: any) => sum + (c.studentsCount || 0), 0);
        const pendingAssignments = assignments.filter((a: any) => a.status === "Active").length;
        const todayAttendance = attendanceData.filter((a: any) => {
          const today = new Date().toDateString();
          return new Date(a.date).toDateString() === today;
        }).length;
        const upcomingEvents = events.filter((e: any) => new Date(e.date) > new Date()).length;
        const unreadNotifications = notificationsData.filter((n: any) => !n.read).length;
        
        setStats({ 
          classes: classes.length, 
          students, 
          pendingAssignments,
          todayAttendance,
          upcomingEvents,
          unreadNotifications
        });
        
        // Set recent activities (last 5)
        setRecentActivities(notificationsData.slice(0, 5));
        
        // Set upcoming events (next 3)
        setUpcomingEvents(events
          .filter((e: any) => new Date(e.date) > new Date())
          .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 3)
        );
        
        // Set notifications (last 5)
        setNotifications(notificationsData.slice(0, 5));
        
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <DashboardLayout sidebarItems={sidebarItems} userRole="teacher">
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-muted rounded w-1/2 mb-6"></div>
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="teacher">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
          </div>
          <div className="flex gap-2">
            <Link to="/teacher/attendance">
              <Button className="gradient-primary shadow-elegant">
                <ClipboardCheck className="w-4 h-4 mr-2" />
                Mark Attendance
              </Button>
            </Link>
            <Link to="/teacher/assignments">
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                New Assignment
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-1">{stats.classes}</h3>
                <p className="text-muted-foreground">Assigned Classes</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
          
          <Card className="p-6 hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-1">{stats.students}</h3>
                <p className="text-muted-foreground">Total Students</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
          
          <Card className="p-6 hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-1">{stats.pendingAssignments}</h3>
                <p className="text-muted-foreground">Pending Assignments</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
            <Link to="/teacher/attendance">
              <Button variant="outline" className="w-full justify-start">
                <ClipboardCheck className="w-4 h-4 mr-2" />
                Mark Attendance
              </Button>
            </Link>
            <Link to="/teacher/assignments">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Create Assignment
              </Button>
            </Link>
            <Link to="/teacher/exams">
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="w-4 h-4 mr-2" />
                Enter Grades
              </Button>
            </Link>
            <Link to="/teacher/timetable">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                View Timetable
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
