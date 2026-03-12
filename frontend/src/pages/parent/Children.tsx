import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  User,
  TrendingUp
} from "lucide-react";

const ParentChildren = () => {
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
  const [loading, setLoading] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState<any | null>(null);
  const [details, setDetails] = useState<{
    attendancePct?: number;
    gpa?: string;
    behavior?: string;
    recentActivities?: any[];
    improvements?: string[];
  }>({});

  useEffect(() => {
    async function load() {
      try {
        const parents: any[] = await api.get("/parents");
        const p = parents?.[0];
        if (!p) return setLoading(false);
        const res = await api.get(`/parents/${p._id}/children`);
        // Preload GPA, attendance, activities and improvements to render directly on cards
        const childrenWithComputed = await Promise.all(
          res.map(async (c: any) => {
            try {
              const grades: any[] = await api.get(`/parents/${p._id}/children/${c._id}/grades`);
              const pct = grades.length
                ? Math.round(
                    grades.reduce((s, g) => s + (g.percentage || Math.round((g.score / (g.maxMarks || 100)) * 100)), 0) /
                      grades.length
                  )
                : 0;
              const gpa = grades.length ? (pct / 20).toFixed(2) : "-"; // simple 5-point scale
              // Attendance summary via students endpoint
              const att = await api.get(`/students/${c._id}/attendance-summary`).catch(() => ({ last30d: { percentage: 0 } }));
              const attendancePct = att?.last30d?.percentage ?? 0;
              // Behavior derived from attendance percentage
              const behavior = attendancePct >= 90 ? "Excellent" : attendancePct >= 75 ? "Good" : "Needs Attention";
              // Activities and improvements
              const assignments: any[] = await api.get(`/parents/${p._id}/children/${c._id}/assignments`).catch(() => []);
              const recentActivities = [
                ...assignments.slice(0, 5).map((a) => ({ type: "Assignment", title: a.title, dueDate: a.dueDate })),
                ...grades.slice(0, 5).map((g) => ({ type: "Exam", title: `${g.subject} - ${g.examName}`, date: g.date, score: g.grade })),
              ];
              const improvementsSet = new Set<string>();
              for (const g of grades) {
                const pr = g.percentage || Math.round((g.score / (g.maxMarks || 100)) * 100);
                if (pr < 60) improvementsSet.add(g.subject);
              }
              const improvements = Array.from(improvementsSet);
              return {
                _id: c._id,
                name: c.name,
                className: c.className,
                class: `Class ${c.className}`,
                rollNo: c.rollNo,
                attendance: `${attendancePct}%` ,
                gpa,
                behavior,
                recentActivities,
                improvements,
              };
            } catch {
              return {
                _id: c._id,
                name: c.name,
                className: c.className,
                class: `Class ${c.className}`,
                rollNo: c.rollNo,
                attendance: "-",
                gpa: "-",
                behavior: "-",
                recentActivities: [],
                improvements: [],
              };
            }
          })
        );
        setChildren(childrenWithComputed);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function openDetails(child: any) {
    setSelectedChild(child);
    setDetailsOpen(true);
    try {
      // Attendance
      const att = await api.get(`/students/${child._id}/attendance-summary`).catch(() => ({ last30d: { percentage: 0 } }));
      const attendancePct = att?.last30d?.percentage ?? 0;
      // Grades
      const parents: any[] = await api.get("/parents");
      const p = parents?.[0];
      const grades: any[] = p ? await api.get(`/parents/${p._id}/children/${child._id}/grades`) : [];
      const pct = grades.length
        ? Math.round(
            grades.reduce((s, g) => s + (g.percentage || Math.round((g.score / (g.maxMarks || 100)) * 100)), 0) / grades.length
          )
        : 0;
      const gpa = grades.length ? (pct / 20).toFixed(2) : "-";
      const behavior = attendancePct >= 90 ? "Excellent" : attendancePct >= 75 ? "Good" : "Needs Attention";
      // Recent activities from assignments and recent exams
      const assignments: any[] = p ? await api.get(`/parents/${p._id}/children/${child._id}/assignments`) : [];
      const recentActivities = [
        ...assignments.slice(0, 5).map((a) => ({ type: "Assignment", title: a.title, dueDate: a.dueDate })),
        ...grades.slice(0, 5).map((g) => ({ type: "Exam", title: `${g.subject} - ${g.examName}`, date: g.date, score: g.grade })),
      ];
      // Areas of improvement: subjects with percentage < 60
      const improvementsSet = new Set<string>();
      for (const g of grades) {
        const pr = g.percentage || Math.round((g.score / (g.maxMarks || 100)) * 100);
        if (pr < 60) improvementsSet.add(g.subject);
      }
      const improvements = Array.from(improvementsSet);
      setDetails({ attendancePct, gpa, behavior, recentActivities, improvements });
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="parent">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Children</h1>
          <p className="text-muted-foreground">View and manage your children's profiles</p>
        </div>

        {loading && (
          <Card className="p-6">Loading children...</Card>
        )}
        {!loading && children.map((child, index) => (
          <Card key={index} className="p-6 shadow-elegant hover-lift">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{child.name}</h3>
                  <p className="text-muted-foreground">{child.class}</p>
                  <p className="text-sm text-muted-foreground">Roll No: {child.rollNo}</p>
                </div>
              </div>
              <Button className="shadow-elegant" onClick={() => openDetails(child)}>View Details</Button>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                <p className="text-sm text-muted-foreground mb-1">Attendance</p>
                <p className="text-2xl font-bold text-success">{child.attendance}</p>
              </div>
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-sm text-muted-foreground mb-1">Current GPA</p>
                <div className="flex items-center">
                  <p className="text-2xl font-bold text-primary">{child.gpa}</p>
                  <TrendingUp className="h-5 w-5 text-success ml-2" />
                </div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Behavior</p>
                <p className="text-2xl font-bold">{child.behavior}</p>
              </div>
              <div className="p-4 bg-warning/10 rounded-lg border border-warning/20">
                <p className="text-sm text-muted-foreground mb-1">Pending Tasks</p>
                <p className="text-2xl font-bold text-warning">3</p>
              </div>
            </div>

            <div className="mt-6 grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-3">Recent Activities</h4>
                <ul className="space-y-2 text-sm">
                  {(child.recentActivities || []).slice(0, 5).map((a: any, i: number) => (
                    <li key={i} className="flex items-center justify-between">
                      <span className="font-medium">{a.type}: {a.title}</span>
                      <span className="text-muted-foreground text-xs">{new Date(a.dueDate || a.date || Date.now()).toDateString()}</span>
                    </li>
                  ))}
                  {(child.recentActivities || []).length === 0 && (
                    <li className="text-sm text-muted-foreground">No recent activities.</li>
                  )}
                </ul>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-3">Areas for Improvement</h4>
                <ul className="space-y-2 text-sm">
                  {(child.improvements || []).slice(0, 6).map((s: string, i: number) => (
                    <li key={i} className="flex items-center space-x-2">
                      <span className="h-2 w-2 rounded-full bg-warning"></span>
                      <span>{s}</span>
                    </li>
                  ))}
                  {(child.improvements || []).length === 0 && (
                    <li className="text-sm text-muted-foreground">No concerns detected.</li>
                  )}
                </ul>
              </div>
            </div>
          </Card>
        ))}

        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Child Details</DialogTitle>
            </DialogHeader>
            {selectedChild && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold">{selectedChild.name}</h3>
                  <p className="text-muted-foreground">Class {selectedChild.className} • Roll No: {selectedChild.rollNo}</p>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-3 bg-success/10 rounded-lg border border-success/20">
                    <p className="text-sm text-muted-foreground mb-1">Attendance (30 days)</p>
                    <p className="text-2xl font-bold text-success">{details.attendancePct ?? 0}%</p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                    <p className="text-sm text-muted-foreground mb-1">Current GPA</p>
                    <p className="text-2xl font-bold text-primary">{details.gpa || "-"}</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Behavior</p>
                    <p className="text-2xl font-bold">{details.behavior || "-"}</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">Recent Activities</h4>
                    <ul className="space-y-2 text-sm">
                      {(details.recentActivities || []).map((a, i) => (
                        <li key={i} className="flex items-center justify-between">
                          <span className="font-medium">{a.type}: {a.title}</span>
                          <span className="text-muted-foreground text-xs">{new Date(a.dueDate || a.date || Date.now()).toDateString()}</span>
                        </li>
                      ))}
                      {(details.recentActivities || []).length === 0 && (
                        <li className="text-sm text-muted-foreground">No recent activities.</li>
                      )}
                    </ul>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">Areas for Improvement</h4>
                    <ul className="space-y-2 text-sm">
                      {(details.improvements || []).map((s, i) => (
                        <li key={i} className="flex items-center space-x-2">
                          <span className="h-2 w-2 rounded-full bg-warning"></span>
                          <span>{s}</span>
                        </li>
                      ))}
                      {(details.improvements || []).length === 0 && (
                        <li className="text-sm text-muted-foreground">No concerns detected.</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default ParentChildren;
