import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  LayoutDashboard,
  Users,
  FileText,
  DollarSign,
  Calendar,
  MessageSquare,
  Bell,
  Settings
} from "lucide-react";

const ParentDashboard = () => {
  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/parent/dashboard" },
    { icon: Users, label: "My Children", path: "/parent/children" },
    { icon: FileText, label: "Academic Reports", path: "/parent/reports" },
    { icon: DollarSign, label: "Fee Payments", path: "/parent/fees" },
    { icon: Calendar, label: "Events", path: "/parent/events" },
    { icon: Bell, label: "Notifications", path: "/parent/notifications" },
    { icon: MessageSquare, label: "Communication", path: "/parent/communication" },
    { icon: Settings, label: "Settings", path: "/parent/settings" }
  ];

  const [summary, setSummary] = useState<{ childrenCount: number; pendingFees: number; unreadMessages: number }>({ childrenCount: 0, pendingFees: 0, unreadMessages: 0 });

  useEffect(() => {
    async function load() {
      try {
        const parents: any[] = await api.get("/parents");
        const p = parents?.[0];
        if (!p) return;
        const s = await api.get(`/parents/${p._id}/summary`);
        setSummary(s);
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="parent">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Parent Dashboard</h1>
        <p className="text-muted-foreground">Monitor your child's progress and school activities</p>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3 mb-2">
          <a className="inline-flex items-center justify-center h-10 rounded-md accent-button bg-background px-4 text-sm font-medium transition-smooth" href="/parent/children">My Children</a>
          <a className="inline-flex items-center justify-center h-10 rounded-md accent-button bg-background px-4 text-sm font-medium transition-smooth" href="/parent/reports">Academic Reports</a>
          <a className="inline-flex items-center justify-center h-10 rounded-md accent-button bg-background px-4 text-sm font-medium transition-smooth" href="/parent/fees">Fees</a>
          <a className="inline-flex items-center justify-center h-10 rounded-md accent-button bg-background px-4 text-sm font-medium transition-smooth" href="/parent/communication">Communication</a>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 hover-lift">
            <h3 className="text-2xl font-bold mb-2">{summary.childrenCount}</h3>
            <p className="text-muted-foreground">Children</p>
          </Card>
          <Card className="p-6 hover-lift">
            <h3 className="text-2xl font-bold mb-2">₹{summary.pendingFees?.toLocaleString?.("en-IN") || summary.pendingFees}</h3>
            <p className="text-muted-foreground">Pending Fees</p>
          </Card>
          <Card className="p-6 hover-lift">
            <h3 className="text-2xl font-bold mb-2">{summary.unreadMessages}</h3>
            <p className="text-muted-foreground">Unread Messages</p>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ParentDashboard;
