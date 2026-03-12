import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  BookOpen,
  FileText,
  MessageSquare,
  Calendar,
  Settings,
  Send
} from "lucide-react";

const CommunicationPage = () => {
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

  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  async function loadMessages() {
    const res = await api.get("/admin/messages");
    setMessages(res);
  }

  useEffect(() => {
    loadMessages().finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="teacher">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Communication</h1>
          <p className="text-muted-foreground">Connect with parents and admin</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Send Message</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">To</label>
                <Input placeholder="Select recipient..." value={to} onChange={e=>setTo(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Subject</label>
                <Input placeholder="Enter subject..." value={subject} onChange={e=>setSubject(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Message</label>
                <Textarea placeholder="Type your message..." className="min-h-[150px]" value={body} onChange={e=>setBody(e.target.value)} />
              </div>
              <Button className="w-full gradient-primary" onClick={async ()=>{
                if (!to || !subject || !body) return;
                await api.post("/admin/messages", { from: "Teacher", to, subject, body, unread: true });
                setTo(""); setSubject(""); setBody("");
                await loadMessages();
              }}>
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Recent Messages</h3>
            <div className="space-y-3">
              {loading && <p className="text-muted-foreground">Loading messages...</p>}
              {!loading && messages.map((message, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 hover:border-primary/50 transition-smooth cursor-pointer ${
                    message.unread ? "bg-primary/5 border-primary/20" : "bg-muted/30 border-transparent"
                  }`}
                  onClick={async ()=>{
                    if (message._id && message.unread) {
                      await api.post(`/admin/messages/${message._id}/read`, {}, { method: "PUT" } as any);
                      await loadMessages();
                    }
                    alert(`${message.subject}\n\n${message.body}`);
                  }}
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
                  <p className="text-xs text-muted-foreground">{new Date(message.createdAt || Date.now()).toDateString()}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CommunicationPage;
