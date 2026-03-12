import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
  Download,
  TrendingUp
} from "lucide-react";

const ParentReports = () => {
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

  const [children, setChildren] = useState<any[]>([]);
  const [grades, setGrades] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const parents: any[] = await api.get("/parents");
        const p = parents?.[0];
        if (!p) return setLoading(false);
        const kids = await api.get(`/parents/${p._id}/children`);
        setChildren(kids);
        const entries: Record<string, any[]> = {};
        for (const k of kids) {
          entries[k._id] = await api.get(`/parents/${p._id}/children/${k._id}/grades`);
        }
        setGrades(entries);
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
            <h1 className="text-3xl font-bold">Academic Reports</h1>
            <p className="text-muted-foreground">View your children's academic performance</p>
          </div>
          <Button className="shadow-elegant" onClick={async () => {
            try {
              // Fetch all reports and trigger a JSON download as a placeholder export
              const reports = await api.get(`/reports`);
              const blob = new Blob([JSON.stringify(reports, null, 2)], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `all-reports.json`;
              a.click();
              URL.revokeObjectURL(url);
            } catch (e) { console.error(e); }
          }}>
            <Download className="h-4 w-4 mr-2" />
            Download All Reports
          </Button>
        </div>

        {loading && <Card className="p-6">Loading reports...</Card>}
        {!loading && children.map((child) => (
          <Card key={child._id} className="p-6 shadow-elegant hover-lift">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold">{child.name}</h3>
                <p className="text-muted-foreground">Class {child.className}</p>
              </div>
              <Button variant="outline" onClick={async () => {
                try {
                  // Download report card for this child from grades as CSV placeholder
                  const rows = (grades[child._id] || []).map((g: any) => ({
                    Subject: g.subject,
                    Exam: g.examName,
                    Score: g.score,
                    MaxMarks: g.maxMarks || 100,
                    Percentage: g.percentage || Math.round((g.score / (g.maxMarks || 100)) * 100),
                    Grade: g.grade,
                    Date: new Date(g.date).toISOString().slice(0,10)
                  }));
                  const header = Object.keys(rows[0] || { Subject:"", Exam:"", Score:"", MaxMarks:"", Percentage:"", Grade:"", Date:"" }).join(",");
                  const csv = [header, ...rows.map(r => Object.values(r).join(","))].join("\n");
                  const blob = new Blob([csv], { type: "text/csv" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `${child.name}-report-card.csv`;
                  a.click();
                  URL.revokeObjectURL(url);
                } catch (e) { console.error(e); }
              }}>
                <Download className="h-4 w-4 mr-2" />
                Download Report Card
              </Button>
            </div>

            <h4 className="font-semibold text-lg mb-4">Recent Scores</h4>
            <div className="space-y-4">
              {(grades[child._id] || []).map((g: any, idx: number) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{g.subject} - {g.examName}</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl font-bold text-primary">{g.grade}</span>
                      <span className="text-muted-foreground">{g.percentage || Math.round((g.score / (g.maxMarks || 100)) * 100)}%</span>
                    </div>
                  </div>
                  <Progress value={g.percentage || Math.round((g.score / (g.maxMarks || 100)) * 100)} className="h-2" />
                </div>
              ))}
              {(grades[child._id] || []).length === 0 && (
                <div className="p-3 bg-muted rounded-lg">No grades available.</div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default ParentReports;
