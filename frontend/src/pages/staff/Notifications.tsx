import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  LayoutDashboard,
  ListChecks,
  Calendar,
  Users,
  Settings,
  Bell,
  AlertCircle,
  CheckCircle,
  Info
} from "lucide-react";

const StaffNotifications = () => {
  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/staff/dashboard" },
    { icon: ListChecks, label: "Tasks", path: "/staff/tasks" },
    { icon: Users, label: "Attendance", path: "/staff/attendance" },
    { icon: Calendar, label: "Leave", path: "/staff/leave" },
    { icon: Settings, label: "Settings", path: "/staff/settings" }
  ];

  const [notifications, setNotifications] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const staff: any[] = await api.get("/staff?status=Active");
        const s = staff?.[0];
        if (!s) return;
        const items = await api.get(`/staff/${s._id}/notifications`);
        setNotifications(items);
      } catch (e) { console.error(e); }
    })();
  }, []);

  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="staff">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">Notifications</h1>
            <p className="text-muted-foreground">Operational alerts and updates</p>
          </div>
          <Button variant="outline" onClick={async ()=>{
            try {
              await api.post(`/notifications/mark-all-read`, {});
              setNotifications((list)=> list.map((n:any)=>({ ...n, unread: false })));
            } catch (e) { console.error(e); }
          }}>Mark All as Read</Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 hover-lift">
            <Bell className="h-8 w-8 mb-2 text-primary" />
            <h3 className="text-2xl font-bold mb-2">{notifications.length}</h3>
            <p className="text-muted-foreground">Total</p>
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
            {notifications.map((notification, index) => (
              <div key={index} className={`p-4 rounded-lg border transition-all hover-lift ${notification.unread ? "bg-primary/5 border-primary" : "bg-muted border-transparent"}`} onClick={async ()=>{
                try {
                  setSelected(notification);
                  setOpen(true);
                  if (notification.unread) {
                    await api.post(`/notifications/${notification._id}/read`, {});
                    setNotifications((list)=> list.map((n:any)=> n._id === notification._id ? { ...n, unread: false } : n));
                  }
                } catch (e) { console.error(e); }
              }}>
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-lg ${notification.type === "alert" ? "bg-warning/10" : notification.type === "success" ? "bg-success/10" : "bg-info/10"}`}>
                    {notification.type === "alert" && <AlertCircle className="h-6 w-6 text-warning" />}
                    {notification.type === "success" && <CheckCircle className="h-6 w-6 text-success" />}
                    {notification.type === "info" && <Info className="h-6 w-6 text-info" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-semibold">{notification.title}</p>
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                  </div>
                  {notification.unread && <div className="h-3 w-3 rounded-full bg-primary"></div>}
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

export default StaffNotifications;


