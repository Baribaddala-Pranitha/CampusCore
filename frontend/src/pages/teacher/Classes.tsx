import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  BookOpen,
  FileText,
  MessageSquare,
  Calendar,
  Settings,
  ChevronRight
} from "lucide-react";

const ClassesPage = () => {
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
  const [classes, setClasses] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isDetailsOpen, setDetailsOpen] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const [syllabus, setSyllabus] = useState<any[]>([]);
  const [timetable, setTimetable] = useState<any[]>([]);
  const [form, setForm] = useState<any>({ name: "", teacherName: "", studentsCount: 40, subjectsCount: 8 });

  useEffect(() => {
    async function load() {
      try {
        const teachers: any[] = await api.get("/admin/teachers?status=Active");
        const t = teachers?.[0];
        if (!t) return setLoading(false);
        setTeacher(t);
        const cls = await api.get(`/admin/teachers/${t._id}/classes`);
        setClasses(cls);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function refreshClasses() {
    if (!teacher) return;
    const cls = await api.get(`/admin/teachers/${teacher._id}/classes`);
    setClasses(cls);
  }

  function openCreate() {
    setForm({ name: "Class 10C", teacherName: teacher?.name || "", studentsCount: 40, subjectsCount: 8 });
    setCreateOpen(true);
  }

  async function submitCreate() {
    try {
      await api.post("/admin/classes", form);
      setCreateOpen(false);
      await refreshClasses();
    } catch (e) { console.error(e); }
  }

  async function openDetails(cls: any) {
    setSelected(cls);
    try {
      const s = await api.get(`/admin/classes/${cls._id}/syllabus`);
      const t = await api.get(`/admin/classes/${cls._id}/timetable`);
      setSyllabus(s);
      setTimetable(t);
    } catch (e) { console.error(e); }
    setDetailsOpen(true);
  }

  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="teacher">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Classes</h1>
            <p className="text-muted-foreground">View and manage your assigned classes</p>
          </div>
          <Button className="gradient-primary shadow-elegant" onClick={openCreate}>Create Class</Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {loading && <p className="text-muted-foreground">Loading classes...</p>}
          {!loading && classes.length === 0 && <p className="text-muted-foreground">No classes assigned.</p>}
          {classes.map((cls, index) => (
            <Card key={index} className="p-6 hover-lift">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">{cls.name}</h3>
                <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-muted-foreground mb-4">{cls.teacherName}</p>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Students:</span>
                  <span className="font-medium">{cls.studentsCount}</span>
                </div>
              </div>
              <Button className="w-full" variant="outline" onClick={() => openDetails(cls)}>
                View Details <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Card>
          ))}
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setCreateOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Class</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Class Name</Label>
                <Input value={form.name} onChange={e=>setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <Label>Class Teacher</Label>
                <Input value={form.teacherName} onChange={e=>setForm({ ...form, teacherName: e.target.value })} />
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <Label>Students Count</Label>
                  <Input type="number" value={form.studentsCount} onChange={e=>setForm({ ...form, studentsCount: Number(e.target.value || 0) })} />
                </div>
                <div>
                  <Label>Subjects Count</Label>
                  <Input type="number" value={form.subjectsCount} onChange={e=>setForm({ ...form, subjectsCount: Number(e.target.value || 0) })} />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={()=>setCreateOpen(false)}>Cancel</Button>
              <Button onClick={submitCreate} className="gradient-primary">Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isDetailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Class Details - {selected?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid md:grid-cols-3 gap-3">
                <Card className="p-3"><div className="text-sm text-muted-foreground">Teacher</div><div className="font-medium">{selected?.teacherName}</div></Card>
                <Card className="p-3"><div className="text-sm text-muted-foreground">Students</div><div className="font-medium">{selected?.studentsCount}</div></Card>
                <Card className="p-3"><div className="text-sm text-muted-foreground">Subjects</div><div className="font-medium">{selected?.subjectsCount}</div></Card>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Syllabus</h4>
                <div className="space-y-2">
                  {(syllabus || []).map((s:any,i:number)=>(
                    <div key={i} className="p-2 bg-muted/40 rounded text-sm">{s.unit ? `${s.unit}: ` : ""}{s.topic}</div>
                  ))}
                  {(syllabus || []).length===0 && <p className="text-sm text-muted-foreground">No syllabus added.</p>}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Timetable</h4>
                <div className="space-y-2">
                  {(timetable || []).map((t:any,i:number)=>(
                    <div key={i} className="p-2 bg-muted/40 rounded text-sm">{t.day} - {t.period} - {t.subject}</div>
                  ))}
                  {(timetable || []).length===0 && <p className="text-sm text-muted-foreground">No timetable set.</p>}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={()=>setDetailsOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default ClassesPage;
