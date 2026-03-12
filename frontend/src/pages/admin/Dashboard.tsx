import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Bus,
  DollarSign,
  Building,
  FileText,
  Calendar,
  MessageSquare,
  Settings,
  TrendingUp,
  TrendingDown,
  UserPlus,
  AlertCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const AdminDashboard = () => {
  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
    { icon: Users, label: "Students", path: "/admin/students" },
    { icon: GraduationCap, label: "Teachers", path: "/admin/teachers" },
    { icon: BookOpen, label: "Academics", path: "/admin/academics" },
    { icon: Bus, label: "Transport", path: "/admin/transport" },
    { icon: DollarSign, label: "Finance", path: "/admin/finance" },
    { icon: Building, label: "Infrastructure", path: "/admin/infrastructure" },
    { icon: FileText, label: "Reports", path: "/admin/reports" },
    { icon: Calendar, label: "Events", path: "/admin/events" },
    { icon: MessageSquare, label: "Communication", path: "/admin/communication" },
    { icon: Settings, label: "Settings", path: "/admin/settings" }
  ];

  const [summary, setSummary] = useState<any | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    api.get("/admin/dashboard/summary").then(setSummary).catch(() => setSummary(null));
    api.get("/admin/events").then((e) => setEvents(e.slice(0,5))).catch(() => setEvents([]));
    api.get("/admin/notifications").then((n) => setActivities(n.slice(0,5))).catch(() => setActivities([]));
  }, []);

  const downloadDashboardReport = () => {
    const payload = {
      generatedAt: new Date().toISOString(),
      summary,
      events,
      activities
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dashboard-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
          </div>
          <Button className="gradient-primary shadow-elegant" onClick={downloadDashboardReport}>
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[ 
            summary ? { label: "Total Students", value: String(summary.studentsCount), change: "", trend: "neutral", icon: Users, color: "from-blue-500 to-cyan-600" } : null,
            summary ? { label: "Total Teachers", value: String(summary.teachersCount), change: "", trend: "neutral", icon: GraduationCap, color: "from-purple-500 to-pink-600" } : null,
            summary ? { label: "Active Buses", value: String(summary.busesActive), change: "", trend: "neutral", icon: Bus, color: "from-orange-500 to-amber-600" } : null,
            summary ? { label: "Pending Fees", value: `₹${summary.pendingFees.toLocaleString()}`, change: "", trend: "down", icon: AlertCircle, color: "from-red-500 to-pink-600" } : null,
          ].filter(Boolean).map((stat: any, index: number) => (
            <Card key={index} className="p-6 hover-lift animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-elegant`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  stat.trend === "up" ? "text-green-600" : stat.trend === "down" ? "text-red-600" : "text-muted-foreground"
                }`}>
                  {stat.trend === "up" ? <TrendingUp className="w-4 h-4" /> : stat.trend === "down" ? <TrendingDown className="w-4 h-4" /> : null}
                  {stat.change}
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Recent Activities
            </h3>
            <div className="space-y-4">
              {activities.map((n: any, index: number) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth">
                  <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{n.title}</p>
                    <p className="text-sm text-muted-foreground truncate">{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Upcoming Events */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Upcoming Events
            </h3>
            <div className="space-y-3">
              {events.map((event, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth">
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-muted-foreground">{new Date(event.date).toDateString()}</p>
                  </div>
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                    {event.type}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
