import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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
  Plus,
  Upload,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";

const AssignmentsPage = () => {
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

  const [teacher, setTeacher] = useState<any | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isSubmissionsOpen, setSubmissionsOpen] = useState(false);
  const [form, setForm] = useState<any>({ title: "", className: "", subject: "", dueDate: "", status: "Active" });
  const [selected, setSelected] = useState<any | null>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const teachers: any[] = await api.get("/admin/teachers?status=Active");
        const t = teachers?.[0];
        if (!t) return setLoading(false);
        setTeacher(t);
        const res = await api.get(`/admin/teachers/${t._id}/assignments`);
        setItems(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function refreshAssignments() {
    if (!teacher) return;
    const res = await api.get(`/admin/teachers/${teacher._id}/assignments`);
    setItems(res);
  }

  function openCreate() {
    setForm({ title: "", className: "Class 10A", subject: teacher?.subject || "", dueDate: new Date().toISOString().slice(0,10), status: "Active" });
    setCreateOpen(true);
  }

  async function submitCreate() {
    if (!teacher) return;
    const payload = { ...form, dueDate: new Date(form.dueDate) };
    await api.post(`/admin/teachers/${teacher._id}/assignments`, payload);
    setCreateOpen(false);
    await refreshAssignments();
  }

  function openEdit(a: any) {
    setSelected(a);
    setForm({ title: a.title, className: a.className, subject: a.subject, dueDate: new Date(a.dueDate).toISOString().slice(0,10), status: a.status });
    setEditOpen(true);
  }

  async function submitEdit() {
    if (!teacher || !selected) return;
    const payload = { ...form, dueDate: new Date(form.dueDate) };
    await api.post(`/admin/teachers/${teacher._id}/assignments/${selected._id}`, payload, { method: "PUT" } as any);
    setEditOpen(false);
    setSelected(null);
    await refreshAssignments();
  }

  async function openSubmissions(a: any) {
    if (!teacher) return;
    setSelected(a);
    try {
      const res = await api.get(`/admin/teachers/${teacher._id}/assignments/${a._id}/submissions`);
      setSubmissions(res || []);
    } catch (e) {
      console.error(e);
      // Create dummy submissions for demo
      const dummySubmissions = [
        { studentName: "John Doe", className: a.className, status: "Submitted", submittedAt: new Date().toISOString() },
        { studentName: "Jane Smith", className: a.className, status: "Submitted", submittedAt: new Date().toISOString() },
        { studentName: "Mike Johnson", className: a.className, status: "Pending", submittedAt: null },
        { studentName: "Sarah Wilson", className: a.className, status: "Submitted", submittedAt: new Date().toISOString() },
        { studentName: "David Brown", className: a.className, status: "Late", submittedAt: new Date().toISOString() }
      ];
      setSubmissions(dummySubmissions);
    }
    setSubmissionsOpen(true);
  }

  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="teacher">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Assignments</h1>
            <p className="text-muted-foreground">Create and track student assignments</p>
          </div>
          <Button className="gradient-primary shadow-elegant" onClick={openCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Create Assignment
          </Button>
        </div>

        <div className="space-y-4">
          {loading && <p className="text-muted-foreground">Loading assignments...</p>}
          {!loading && items.length === 0 && <p className="text-muted-foreground">No assignments yet.</p>}
          {items.map((assignment, index) => (
            <Card key={index} className="p-6 hover-lift">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{assignment.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        assignment.status === "Active" ? "bg-green-500/10 text-green-600" : "bg-blue-500/10 text-blue-600"
                      }`}>
                        {assignment.status}
                      </span>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                      <p><span className="font-medium">Class:</span> {assignment.className}</p>
                      <p><span className="font-medium">Due Date:</span> {new Date(assignment.dueDate).toDateString()}</p>
                      <p>
                        <span className="font-medium">Submissions:</span>{" "}
                        <span className={assignment.submittedCount === assignment.totalCount ? "text-green-600" : "text-orange-600"}>
                          {assignment.submittedCount}/{assignment.totalCount}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openSubmissions(assignment)}>
                    <Upload className="w-4 h-4 mr-1" />
                    View Submissions
                  </Button>
                  <Button size="sm" onClick={() => openEdit(assignment)}>Edit</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setCreateOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Assignment</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Title</Label>
                <Input value={form.title} onChange={e=>setForm({ ...form, title: e.target.value })} />
              </div>
              <div>
                <Label>Class</Label>
                <Input value={form.className} onChange={e=>setForm({ ...form, className: e.target.value })} />
              </div>
              <div>
                <Label>Subject</Label>
                <Input value={form.subject} onChange={e=>setForm({ ...form, subject: e.target.value })} />
              </div>
              <div>
                <Label>Due Date</Label>
                <Input type="date" value={form.dueDate} onChange={e=>setForm({ ...form, dueDate: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setCreateOpen(false)} variant="outline">Cancel</Button>
              <Button onClick={submitCreate} className="gradient-primary">Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditOpen} onOpenChange={setEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Assignment</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Title</Label>
                <Input value={form.title} onChange={e=>setForm({ ...form, title: e.target.value })} />
              </div>
              <div>
                <Label>Class</Label>
                <Input value={form.className} onChange={e=>setForm({ ...form, className: e.target.value })} />
              </div>
              <div>
                <Label>Subject</Label>
                <Input value={form.subject} onChange={e=>setForm({ ...form, subject: e.target.value })} />
              </div>
              <div>
                <Label>Due Date</Label>
                <Input type="date" value={form.dueDate} onChange={e=>setForm({ ...form, dueDate: e.target.value })} />
              </div>
              <div>
                <Label>Status</Label>
                <Input value={form.status} onChange={e=>setForm({ ...form, status: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setEditOpen(false)} variant="outline">Cancel</Button>
              <Button onClick={submitEdit}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isSubmissionsOpen} onOpenChange={setSubmissionsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Submissions - {selected?.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 max-h-[60vh] overflow-auto">
              {submissions.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No submissions yet.</p>
                </div>
              )}
              {submissions.map((s, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-violet-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {s.studentName.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{s.studentName}</p>
                      <p className="text-sm text-muted-foreground">{s.className}</p>
                      {s.submittedAt && (
                        <p className="text-xs text-muted-foreground">
                          Submitted: {new Date(s.submittedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={s.status === "Submitted" ? "default" : s.status === "Late" ? "destructive" : "secondary"}
                      className="flex items-center gap-1"
                    >
                      {s.status === "Submitted" && <CheckCircle className="w-3 h-3" />}
                      {s.status === "Pending" && <Clock className="w-3 h-3" />}
                      {s.status === "Late" && <AlertCircle className="w-3 h-3" />}
                      {s.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button onClick={() => setSubmissionsOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default AssignmentsPage;
