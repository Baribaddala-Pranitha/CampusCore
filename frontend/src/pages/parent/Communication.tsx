import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Send
} from "lucide-react";

const ParentCommunication = () => {
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

  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const parents: any[] = await api.get("/parents");
        const p = parents?.[0];
        if (!p) return setLoading(false);
        const res = await api.get(`/parents/${p._id}/messages`);
        setMessages(res.map((m: any) => ({
          from: m.from,
          subject: m.subject,
          message: m.body,
          time: new Date(m.createdAt || Date.now()).toDateString(),
          unread: m.unread,
        })));
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
        <div>
          <h1 className="text-3xl font-bold text-black">
            Communication
          </h1>
          <p className="text-muted-foreground">Connect with teachers and school administration</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 hover-lift">
            <MessageSquare className="h-8 w-8 mb-2 text-primary" />
            <h3 className="text-2xl font-bold mb-2">5</h3>
            <p className="text-muted-foreground">Unread Messages</p>
          </Card>
          <Card className="p-6 hover-lift">
            <Send className="h-8 w-8 mb-2 text-success" />
            <h3 className="text-2xl font-bold mb-2">12</h3>
            <p className="text-muted-foreground">Total Conversations</p>
          </Card>
          <Card className="p-6 hover-lift">
            <Users className="h-8 w-8 mb-2 text-info" />
            <h3 className="text-2xl font-bold mb-2">8</h3>
            <p className="text-muted-foreground">Active Contacts</p>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 shadow-elegant">
            <h3 className="font-semibold text-lg mb-6">Recent Messages</h3>
            <div className="space-y-3">
              {loading && <p className="text-muted-foreground">Loading messages...</p>}
              {!loading && messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border cursor-pointer hover-lift ${
                    msg.unread ? "bg-primary/5 border-primary" : "bg-muted border-transparent"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-semibold">{msg.from}</p>
                    <span className="text-xs text-muted-foreground">{msg.time}</span>
                  </div>
                  <p className="text-sm font-medium mb-1">{msg.subject}</p>
                  <p className="text-sm text-muted-foreground">{msg.message}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 shadow-elegant">
            <h3 className="font-semibold text-lg mb-6">Send Message</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Child</label>
                <Input placeholder="Select child" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">To</label>
                <Input placeholder="Select teacher or admin" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Subject</label>
                <Input placeholder="Enter subject" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Message</label>
                <Textarea placeholder="Type your message here..." rows={6} />
              </div>
              <Button className="w-full shadow-elegant">
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ParentCommunication;
