import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  FileText,
  DollarSign,
  Bus,
  MessageSquare,
  Settings,
  Bell,
  AlertCircle,
  CheckCircle,
  Info
} from "lucide-react";

const StudentNotifications = () => {
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

  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const students: any[] = await api.get("/admin/students?status=Active");
        const s = students?.[0];
        if (!s) return setLoading(false);
        const res = await api.get(`/admin/students/${s._id}/notifications`);
        setNotifications(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="student">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">Notifications</h1>
            <p className="text-muted-foreground">Stay updated with alerts and announcements</p>
          </div>
          <Button variant="outline">Mark All as Read</Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 hover-lift">
            <Bell className="h-8 w-8 mb-2 text-primary" />
            <h3 className="text-2xl font-bold mb-2">{notifications.length}</h3>
            <p className="text-muted-foreground">Total Notifications</p>
          </Card>
          <Card className="p-6 hover-lift">
            <AlertCircle className="h-8 w-8 mb-2 text-warning" />
            <h3 className="text-2xl font-bold mb-2">{notifications.filter(n => n.unread).length}</h3>
            <p className="text-muted-foreground">Unread</p>
          </Card>
          <Card className="p-6 hover-lift">
            <CheckCircle className="h-8 w-8 mb-2 text-success" />
            <h3 className="text-2xl font-bold mb-2">{notifications.filter(n => !n.unread).length}</h3>
            <p className="text-muted-foreground">Acknowledged</p>
          </Card>
        </div>

        <Card className="p-6 shadow-elegant">
          <h3 className="font-semibold text-lg mb-6">All Notifications</h3>
          <div className="space-y-3">
            {loading && <p className="text-muted-foreground">Loading notifications...</p>}
            {!loading && notifications.map((notification, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border cursor-pointer transition-all hover-lift ${
                  notification.unread ? "bg-primary/5 border-primary" : "bg-muted border-transparent"
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-lg ${
                    notification.type === "alert" ? "bg-warning/10" :
                    notification.type === "success" ? "bg-success/10" :
                    "bg-info/10"
                  }`}>
                    {notification.type === "alert" && <AlertCircle className="h-6 w-6 text-warning" />}
                    {notification.type === "success" && <CheckCircle className="h-6 w-6 text-success" />}
                    {notification.type === "info" && <Info className="h-6 w-6 text-info" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-semibold">{notification.title}</p>
                      <span className="text-xs text-muted-foreground">{new Date(notification.createdAt || Date.now()).toDateString()}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                  </div>
                  {notification.unread && <div className="h-3 w-3 rounded-full bg-primary"></div>}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentNotifications;


