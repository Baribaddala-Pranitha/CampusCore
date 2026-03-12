import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  LayoutDashboard,
  Users,
  FileText,
  DollarSign,
  Calendar,
  Bell,
  MessageSquare,
  Settings,
  AlertCircle,
  CheckCircle,
  Info
} from "lucide-react";

const ParentNotifications = () => {
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

  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const parents: any[] = await api.get("/parents");
        const p = parents?.[0];
        if (!p) return setLoading(false);
        const res = await api.get(`/parents/${p._id}/notifications`);
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
    <DashboardLayout sidebarItems={sidebarItems} userRole="parent">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-black">
              Notifications
            </h1>
            <p className="text-muted-foreground">Stay updated with important alerts</p>
          </div>
          <Button variant="outline" onClick={async () => {
            try {
              await api.post(`/notifications/mark-all-read`, {});
              setNotifications((items) => items.map((n) => ({ ...n, unread: false })));
            } catch (e) { console.error(e); }
          }}>Mark All as Read</Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 hover-lift">
            <Bell className="h-8 w-8 mb-2 text-primary" />
            <h3 className="text-2xl font-bold mb-2">8</h3>
            <p className="text-muted-foreground">Total Notifications</p>
          </Card>
          <Card className="p-6 hover-lift">
            <AlertCircle className="h-8 w-8 mb-2 text-warning" />
            <h3 className="text-2xl font-bold mb-2">2</h3>
            <p className="text-muted-foreground">Unread Messages</p>
          </Card>
          <Card className="p-6 hover-lift">
            <CheckCircle className="h-8 w-8 mb-2 text-success" />
            <h3 className="text-2xl font-bold mb-2">6</h3>
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
                  notification.unread
                    ? "bg-primary/5 border-primary"
                    : "bg-muted border-transparent"
                }`}
              onClick={async () => {
                try {
                  setSelected(notification);
                  setOpen(true);
                  if (notification.unread) {
                    await api.post(`/notifications/${notification._id}/read`, {});
                    setNotifications((items) => items.map((n) => n._id === notification._id ? { ...n, unread: false } : n));
                  }
                } catch (e) { console.error(e); }
              }}
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
                  {notification.unread && (
                    <div className="h-3 w-3 rounded-full bg-primary"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selected?.title || "Notification"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{new Date(selected?.createdAt || Date.now()).toLocaleString()}</p>
              <p>{selected?.message}</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default ParentNotifications;
