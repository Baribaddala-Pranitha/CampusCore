import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Calendar,
  DollarSign,
  Bus,
  MessageSquare,
  Settings,
  Download,
  CheckCircle,
  Clock
} from "lucide-react";

const StudentAssignments = () => {
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

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const students: any[] = await api.get("/admin/students?status=Active");
        const s = students?.[0];
        if (!s) return setLoading(false);
        const res = await api.get(`/admin/students/${s._id}/assignments`);
        setItems(res);
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Assignments</h1>
            <p className="text-muted-foreground">View, download, and submit your assignments</p>
          </div>
          <Button variant="outline" className="shadow-elegant">
            <Download className="h-4 w-4 mr-2" />
            Download All
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {loading && <p className="text-muted-foreground">Loading assignments...</p>}
          {!loading && items.length === 0 && <p className="text-muted-foreground">No assignments.</p>}
          {items.map((a, i) => (
            <Card key={i} className="p-6 hover-lift">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm text-muted-foreground">{a.subject}</p>
                  <h3 className="text-xl font-semibold">{a.title}</h3>
                </div>
                <span className="text-sm font-medium">Due: {new Date(a.dueDate).toDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                  a.status === "Completed" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                }`}>
                  {a.status === "Completed" ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                  <span className="capitalize">{a.status}</span>
                </div>
                {a.status === "Completed" ? (
                  <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" /> View</Button>
                ) : (
                  <Button size="sm" className="shadow-elegant">Submit</Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentAssignments;



