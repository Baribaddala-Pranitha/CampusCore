import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
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
  Download,
  BarChart3,
  PieChart,
  TrendingUp
} from "lucide-react";

const ReportsPage = () => {
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

  const [reports, setReports] = useState<any[]>([]);
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [newReport, setNewReport] = useState<any>({ title: "", type: "Custom", data: {} });

  useEffect(() => {
    api.get("/admin/reports").then(setReports).catch(() => setReports([]));
  }, []);

  const refresh = async () => {
    const list = await api.get("/admin/reports");
    setReports(list);
  };

  const generateReport = async () => {
    await api.post("/admin/reports/generate", newReport);
    setIsGenerateOpen(false);
    setNewReport({ title: "", type: "Custom", data: {} });
    refresh();
  };

  const downloadReport = (report: any) => {
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${report.title.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Reports & Analytics</h1>
            <p className="text-muted-foreground">Generate and download comprehensive reports</p>
          </div>
          <Button className="gradient-primary shadow-elegant" onClick={() => setIsGenerateOpen(true)}>
            <TrendingUp className="w-4 h-4 mr-2" />
            Custom Report
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report, index) => (
            <Card key={index} className="p-6 hover-lift">
              <div className={`w-12 h-12 bg-gradient-to-br ${report.color || 'from-blue-500 to-cyan-600'} rounded-xl flex items-center justify-center mb-4`}>
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">{report.title}</h3>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-medium">
                  {report.type}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(report.lastGenerated).toDateString()}
                </span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => downloadReport(report)}>
                  <Download className="w-3 h-3 mr-1" />
                  Download
                </Button>
                <Button size="sm" className="flex-1" onClick={() => setIsGenerateOpen(true)}>Generate</Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Dynamic report stats */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Quick Stats</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-3xl font-bold text-primary mb-2">{reports.length}</div>
              <p className="text-sm text-muted-foreground">Reports Available</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-3xl font-bold text-primary mb-2">{Array.from(new Set(reports.map(r => r.type))).length}</div>
              <p className="text-sm text-muted-foreground">Templates</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-3xl font-bold text-primary mb-2">{reports.filter(r => new Date(r.lastGenerated) > new Date(Date.now() - 30*24*60*60*1000)).length}</div>
              <p className="text-sm text-muted-foreground">Generated in 30 days</p>
            </div>
          </div>
        </Card>

        {/* Generate Report Modal */}
        <Dialog open={isGenerateOpen} onOpenChange={setIsGenerateOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate Custom Report</DialogTitle>
            </DialogHeader>
            <div className="grid md:grid-cols-2 gap-3">
              <Input placeholder="Title" value={newReport.title} onChange={(e) => setNewReport({ ...newReport, title: e.target.value })} />
              <Input placeholder="Type" value={newReport.type} onChange={(e) => setNewReport({ ...newReport, type: e.target.value })} />
            </div>
            <DialogFooter>
              <Button onClick={generateReport}>Generate</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default ReportsPage;
