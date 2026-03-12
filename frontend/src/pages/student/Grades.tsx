import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useEffect, useMemo, useState } from "react";
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
  TrendingUp
} from "lucide-react";

const StudentGrades = () => {
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

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const students: any[] = await api.get("/admin/students?status=Active");
        const s = students?.[0];
        if (!s) return setLoading(false);
        const res = await api.get(`/admin/students/${s._id}/grades`);
        setResults(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const subjectAggregates = useMemo(() => {
    const bySubject: Record<string, { total: number; count: number; grade: string } > = {};
    for (const r of results) {
      if (!bySubject[r.subject]) bySubject[r.subject] = { total: 0, count: 0, grade: r.grade };
      bySubject[r.subject].total += r.percentage || (r.score / (r.maxMarks || 100)) * 100;
      bySubject[r.subject].count += 1;
      bySubject[r.subject].grade = r.grade;
    }
    return Object.entries(bySubject).map(([name, v]) => ({ name, grade: v.grade, percentage: Math.round(v.total / v.count), trend: "up" }));
  }, [results]);

  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="student">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Grades & Reports</h1>
            <p className="text-muted-foreground">Track your academic performance</p>
          </div>
          <Button className="shadow-elegant">
            <Download className="h-4 w-4 mr-2" />
            Download Report Card
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 hover-lift gradient-primary text-white">
            <h3 className="text-2xl font-bold mb-2">8.5</h3>
            <p className="text-white/90">Current GPA</p>
          </Card>
          <Card className="p-6 hover-lift">
            <h3 className="text-2xl font-bold mb-2 text-success">95%</h3>
            <p className="text-muted-foreground">Overall Attendance</p>
          </Card>
          <Card className="p-6 hover-lift">
            <h3 className="text-2xl font-bold mb-2 text-primary">12th</h3>
            <p className="text-muted-foreground">Class Rank</p>
          </Card>
        </div>

        <Card className="p-6 shadow-elegant">
          <h3 className="font-semibold text-lg mb-6">Subject-wise Performance</h3>
          <div className="space-y-6">
            {loading && <p className="text-muted-foreground">Loading grades...</p>}
            {!loading && subjectAggregates.map((subject, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <span className="font-semibold">{subject.name}</span>
                    {subject.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-success" />
                    ) : (
                      <TrendingUp className="h-4 w-4 text-destructive rotate-180" />
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl font-bold text-primary">{subject.grade}</span>
                    <span className="text-muted-foreground">{subject.percentage}%</span>
                  </div>
                </div>
                <Progress value={subject.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 hover-lift">
            <h3 className="font-semibold text-lg mb-4">Recent Test Scores</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-semibold">Math Unit Test</p>
                  <p className="text-sm text-muted-foreground">Chapter 8-10</p>
                </div>
                <span className="text-xl font-bold text-success">94%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-semibold">Science Practical</p>
                  <p className="text-sm text-muted-foreground">Lab Experiment</p>
                </div>
                <span className="text-xl font-bold text-primary">88%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-semibold">English Essay</p>
                  <p className="text-sm text-muted-foreground">Literary Analysis</p>
                </div>
                <span className="text-xl font-bold text-success">92%</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover-lift">
            <h3 className="font-semibold text-lg mb-4">Achievements</h3>
            <div className="space-y-3">
              <div className="p-3 bg-success/10 rounded-lg border border-success/20">
                <p className="font-semibold text-success">Perfect Attendance Award</p>
                <p className="text-sm text-muted-foreground">First Semester 2024</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                <p className="font-semibold text-primary">Honor Roll Student</p>
                <p className="text-sm text-muted-foreground">Academic Excellence</p>
              </div>
              <div className="p-3 bg-warning/10 rounded-lg border border-warning/20">
                <p className="font-semibold text-warning">Science Fair Winner</p>
                <p className="text-sm text-muted-foreground">2nd Place - Physics</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentGrades;
