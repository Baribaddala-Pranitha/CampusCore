import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";
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
  Send,
  Bell,
  Mail
} from "lucide-react";

const CommunicationPage = () => {
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

  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [isAnnounceOpen, setIsAnnounceOpen] = useState(false);
  const [announcement, setAnnouncement] = useState<any>({ title: "", message: "", type: "info" });
  const [messageForm, setMessageForm] = useState<any>({ to: "Admin", subject: "", body: "", from: "Admin", unread: true });
  const [isAllOpen, setIsAllOpen] = useState(false);
  const [allMessages, setAllMessages] = useState<any[]>([]);

  const refresh = async () => {
    const msgs = await api.get("/admin/messages").catch(() => []);
    setRecentMessages(Array.isArray(msgs) ? msgs.slice(0,5) : []);
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Communication Center</h1>
            <p className="text-muted-foreground">Send announcements and manage messages</p>
          </div>
          <Button className="gradient-primary shadow-elegant" onClick={() => setIsAnnounceOpen(true)}>
            <Bell className="w-4 h-4 mr-2" />
            Send Announcement
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="p-6 hover-lift">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mb-3">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-1">{recentMessages.length}</h3>
            <p className="text-sm text-muted-foreground">Recent Messages</p>
          </Card>
          <Card className="p-6 hover-lift">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center mb-3">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-1">{recentMessages.filter(m => m.unread).length}</h3>
            <p className="text-sm text-muted-foreground">Unread Messages</p>
          </Card>
          <Card className="p-6 hover-lift">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-3">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-1">—</h3>
            <p className="text-sm text-muted-foreground">Announcements Sent</p>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Send New Message</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Recipient</label>
                <Input placeholder="Enter recipient" value={messageForm.to} onChange={(e) => setMessageForm({ ...messageForm, to: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Subject</label>
                <Input placeholder="Enter subject..." value={messageForm.subject} onChange={(e) => setMessageForm({ ...messageForm, subject: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Message</label>
                <Textarea placeholder="Type your message..." className="min-h-[150px]" value={messageForm.body} onChange={(e) => setMessageForm({ ...messageForm, body: e.target.value })} />
              </div>
              <Button className="w-full gradient-primary" onClick={async () => { await api.post('/admin/messages', messageForm); setMessageForm({ to: "Admin", subject: "", body: "", from: "Admin", unread: true }); refresh(); }}>
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Recent Messages</h3>
            <div className="space-y-3">
              {recentMessages.map((message, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 hover:border-primary/50 transition-smooth cursor-pointer ${
                    message.unread ? "bg-primary/5 border-primary/20" : "bg-muted/30 border-transparent"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{message.from}</p>
                      <p className="text-sm text-muted-foreground mt-1">{message.subject}</p>
                    </div>
                    {message.unread && (
                      <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1"></span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{new Date(message.createdAt).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={async () => { const all = await api.get('/admin/messages/all').catch(() => []); setAllMessages(all); setIsAllOpen(true); }}>View All Messages</Button>
          </Card>
        </div>
      </div>
      <Dialog open={isAnnounceOpen} onOpenChange={setIsAnnounceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Announcement</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Title" value={announcement.title} onChange={(e) => setAnnouncement({ ...announcement, title: e.target.value })} />
            <Input placeholder="Type (info/alert/success)" value={announcement.type} onChange={(e) => setAnnouncement({ ...announcement, type: e.target.value })} />
            <Textarea placeholder="Message" value={announcement.message} onChange={(e) => setAnnouncement({ ...announcement, message: e.target.value })} />
          </div>
          <DialogFooter>
            <Button onClick={async () => { await api.post('/admin/notifications', { ...announcement, unread: true }); setIsAnnounceOpen(false); setAnnouncement({ title: "", message: "", type: "info" }); }}>Send</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAllOpen} onOpenChange={setIsAllOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>All Messages</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-[60vh] overflow-auto">
            {allMessages.map((m, idx) => (
              <div key={idx} className="p-3 bg-muted/30 rounded">
                <div className="flex justify-between"><span className="font-medium">{m.from}</span><span className="text-xs text-muted-foreground">{new Date(m.createdAt).toLocaleString()}</span></div>
                <div className="text-sm">{m.subject}</div>
                <div className="text-xs text-muted-foreground">{m.body}</div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsAllOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default CommunicationPage;
