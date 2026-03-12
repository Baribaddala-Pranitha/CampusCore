import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Bus,
  FileText,
  Calendar,
  Settings,
  Bell,
  AlertCircle,
  CheckCircle,
  Info,
  X
} from "lucide-react";

const AdminNotifications = () => {
  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
    { icon: Users, label: "Students", path: "/admin/students" },
    { icon: Users, label: "Teachers", path: "/admin/teachers" },
    { icon: BookOpen, label: "Academics", path: "/admin/academics" },
    { icon: Bus, label: "Transport", path: "/admin/transport" },
    { icon: FileText, label: "Reports", path: "/admin/reports" },
    { icon: Calendar, label: "Events", path: "/admin/events" },
    { icon: Settings, label: "Settings", path: "/admin/settings" }
  ];

  const [notifications, setNotifications] = useState<any[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<any | null>(null);

  const refresh = async () => {
    const data = await api.get("/admin/notifications").catch(() => []);
    setNotifications(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    refresh();
  }, []);

  const markAll = async () => {
    await api.post('/admin/notifications/mark-all-read', {});
    refresh();
  };

  const markRead = async (id: string) => {
    await api.post(`/admin/notifications/${id}/read`, {}, { method: 'PUT' as any });
    refresh();
  };

  const handleNotificationClick = async (notification: any) => {
    setSelectedNotification(notification);
    if (notification.unread) {
      await markRead(notification._id);
    }
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">System-wide alerts and updates</p>
          </div>
          <Button variant="outline" onClick={markAll}>Mark All as Read</Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 hover-lift">
            <Bell className="h-8 w-8 mb-2 text-black" />
            <h3 className="text-2xl font-bold mb-2 text-black">{notifications.length}</h3>
            <p className="text-black">Total</p>
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
              <div key={index} className={`p-4 rounded-lg border transition-all hover-lift cursor-pointer ${notification.unread ? "bg-primary/5 border-primary" : "bg-muted border-transparent"}`} onClick={() => handleNotificationClick(notification)}>
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-lg ${notification.type === "alert" ? "bg-warning/10" : notification.type === "success" ? "bg-success/10" : "bg-info/10"}`}>
                    {notification.type === "alert" && <AlertCircle className="h-6 w-6 text-warning" />}
                    {notification.type === "success" && <CheckCircle className="h-6 w-6 text-success" />}
                    {notification.type === "info" && <Info className="h-6 w-6 text-info" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-semibold">{notification.title}</p>
                      <span className="text-xs text-muted-foreground">{new Date(notification.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                  </div>
                  {notification.unread && <div className="h-3 w-3 rounded-full bg-primary"></div>}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Notification Detail Modal */}
        <Dialog open={!!selectedNotification} onOpenChange={(o) => !o && setSelectedNotification(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${selectedNotification?.type === "alert" ? "bg-warning/10" : selectedNotification?.type === "success" ? "bg-success/10" : "bg-info/10"}`}>
                  {selectedNotification?.type === "alert" && <AlertCircle className="h-5 w-5 text-warning" />}
                  {selectedNotification?.type === "success" && <CheckCircle className="h-5 w-5 text-success" />}
                  {selectedNotification?.type === "info" && <Info className="h-5 w-5 text-info" />}
                </div>
                {selectedNotification?.title}
              </DialogTitle>
            </DialogHeader>
            {selectedNotification && (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">
                    {new Date(selectedNotification.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm">{selectedNotification.message}</p>
                </div>
                {selectedNotification.details && (
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <h4 className="font-semibold mb-2">Additional Details:</h4>
                    <p className="text-sm text-muted-foreground">{selectedNotification.details}</p>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedNotification(null)}>
                <X className="w-4 h-4 mr-2" />
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default AdminNotifications;


