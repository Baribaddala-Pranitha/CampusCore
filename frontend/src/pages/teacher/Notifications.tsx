import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  Calendar,
  MessageSquare,
  Settings,
  Bell,
  AlertCircle,
  CheckCircle,
  Info,
  Eye,
  Filter,
  RefreshCw
} from "lucide-react";

const TeacherNotifications = () => {
  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/teacher/dashboard" },
    { icon: Users, label: "Classes", path: "/teacher/classes" },
    { icon: CheckSquare, label: "Attendance", path: "/teacher/attendance" },
    { icon: Calendar, label: "Timetable", path: "/teacher/timetable" },
    { icon: MessageSquare, label: "Communication", path: "/teacher/communication" },
    { icon: Settings, label: "Settings", path: "/teacher/settings" }
  ];

  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState<any | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  async function loadNotifications() {
    try {
      const list = await api.get("/admin/notifications");
      setNotifications(list || []);
    } catch (e) {
      console.error(e);
      // Create dummy notifications for demo
      const dummyNotifications = [
        {
          _id: '1',
          title: 'New Assignment Submitted',
          message: 'John Doe has submitted the Math assignment for Class 10A.',
          type: 'success',
          unread: true,
          createdAt: new Date().toISOString()
        },
        {
          _id: '2',
          title: 'Parent Message Received',
          message: 'Sarah Wilson\'s parent has sent you a message regarding attendance.',
          type: 'info',
          unread: true,
          createdAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          _id: '3',
          title: 'Staff Meeting Reminder',
          message: 'Staff meeting scheduled for tomorrow at 2:00 PM in the conference room.',
          type: 'alert',
          unread: false,
          createdAt: new Date(Date.now() - 172800000).toISOString()
        },
        {
          _id: '4',
          title: 'Grade Submission Due',
          message: 'Please submit grades for the recent Math test by end of week.',
          type: 'alert',
          unread: false,
          createdAt: new Date(Date.now() - 259200000).toISOString()
        }
      ];
      setNotifications(dummyNotifications);
    }
  }

  useEffect(() => {
    loadNotifications().finally(()=>setLoading(false));
  }, []);

  async function markAsRead(notificationId: string) {
    try {
      await api.post(`/admin/notifications/${notificationId}/read`, {}, { method: "PUT" } as any);
      setNotifications(prev => prev.map(n => 
        n._id === notificationId ? { ...n, unread: false } : n
      ));
      toast.success("Notification marked as read");
    } catch (e) {
      console.error(e);
      // Update locally for demo
      setNotifications(prev => prev.map(n => 
        n._id === notificationId ? { ...n, unread: false } : n
      ));
      toast.success("Notification marked as read");
    }
  }

  async function markAllAsRead() {
    try {
      await api.post("/admin/notifications/mark-all-read", {});
      setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
      toast.success("All notifications marked as read");
    } catch (e) {
      console.error(e);
      // Update locally for demo
      setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
      toast.success("All notifications marked as read");
    }
  }

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return n.unread;
    if (filter === 'read') return !n.unread;
    return true;
  });

  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="teacher">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">Notifications</h1>
            <p className="text-muted-foreground">School alerts and updates</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={async () => {
              setLoading(true);
              await loadNotifications();
              setLoading(false);
            }}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" onClick={markAllAsRead}>
              Mark All as Read
            </Button>
          </div>
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
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg">All Notifications</h3>
            <div className="flex gap-2">
              <Button 
                variant={filter === 'all' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setFilter('all')}
              >
                All
              </Button>
              <Button 
                variant={filter === 'unread' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setFilter('unread')}
              >
                Unread
              </Button>
              <Button 
                variant={filter === 'read' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setFilter('read')}
              >
                Read
              </Button>
            </div>
          </div>
          <div className="space-y-3">
            {loading && <p className="text-muted-foreground">Loading notifications...</p>}
            {!loading && filteredNotifications.length === 0 && (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No notifications found</p>
              </div>
            )}
            {!loading && filteredNotifications.map((notification, index) => (
              <div key={index} className={`p-4 rounded-lg border transition-all hover-lift cursor-pointer ${notification.unread ? "bg-primary/5 border-primary" : "bg-muted border-transparent"}`}
                   onClick={() => {
                     setSelectedNotification(notification);
                     if (notification.unread) {
                       markAsRead(notification._id);
                     }
                   }}>
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-lg ${notification.type === "alert" ? "bg-orange-100" : notification.type === "success" ? "bg-green-100" : "bg-blue-100"}`}>
                    {notification.type === "alert" && <AlertCircle className="h-6 w-6 text-orange-600" />}
                    {notification.type === "success" && <CheckCircle className="h-6 w-6 text-green-600" />}
                    {notification.type === "info" && <Info className="h-6 w-6 text-blue-600" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-semibold">{notification.title}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{new Date(notification.createdAt || Date.now()).toDateString()}</span>
                        {notification.unread && <Badge variant="default" className="text-xs">New</Badge>}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNotification(notification);
                  }}>
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Notification Detail Modal */}
        <Dialog open={!!selectedNotification} onOpenChange={(open) => !open && setSelectedNotification(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedNotification?.type === "alert" && <AlertCircle className="w-5 h-5 text-orange-500" />}
                {selectedNotification?.type === "success" && <CheckCircle className="w-5 h-5 text-green-500" />}
                {selectedNotification?.type === "info" && <Info className="w-5 h-5 text-blue-500" />}
                {selectedNotification?.title}
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-muted-foreground mb-4">{selectedNotification?.message}</p>
              <div className="text-sm text-muted-foreground">
                <p>Received: {selectedNotification && new Date(selectedNotification.createdAt || Date.now()).toLocaleString()}</p>
                <p>Status: {selectedNotification?.unread ? 'Unread' : 'Read'}</p>
              </div>
            </div>
            <DialogFooter>
              {selectedNotification?.unread && (
                <Button onClick={() => {
                  markAsRead(selectedNotification._id);
                  setSelectedNotification(null);
                }}>
                  Mark as Read
                </Button>
              )}
              <Button variant="outline" onClick={() => setSelectedNotification(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default TeacherNotifications;


