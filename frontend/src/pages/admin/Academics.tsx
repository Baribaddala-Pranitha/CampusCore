import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
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
  Book,
  ClipboardList,
  Award,
  Plus
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const AcademicsPage = () => {
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

  const [classes, setClasses] = useState<any[]>([]);
  const [stats, setStats] = useState<any | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newClass, setNewClass] = useState<any>({ name: "", teacherName: "", studentsCount: 0, subjectsCount: 0 });
  const [selectedClass, setSelectedClass] = useState<any | null>(null);
  const [isSyllabusOpen, setIsSyllabusOpen] = useState(false);
  const [isTimetableOpen, setIsTimetableOpen] = useState(false);
  const [syllabus, setSyllabus] = useState<Array<{ unit: string; topic: string }>>([]);
  const [timetable, setTimetable] = useState<Array<{ day: string; period: string; subject: string }>>([]);

  const refresh = async () => {
    const [list, s] = await Promise.all([
      api.get("/admin/classes").catch(() => []),
      api.get("/admin/classes/stats").catch(() => null),
    ]);
    setClasses(list);
    if (s) setStats(s);
  };

  useEffect(() => {
    refresh();
  }, []);

  const createClassroom = async () => {
    const payload = { ...newClass, studentsCount: Number(newClass.studentsCount), subjectsCount: Number(newClass.subjectsCount) };
    await api.post("/admin/classes", payload);
    setIsAddOpen(false);
    setNewClass({ name: "", teacherName: "", studentsCount: 0, subjectsCount: 0 });
    refresh();
  };

  const openSyllabus = async (cls: any) => {
    setSelectedClass(cls);
    const data = await api.get(`/admin/classes/${cls._id}/syllabus`).catch(() => []);
    setSyllabus(Array.isArray(data) ? data : []);
    setIsSyllabusOpen(true);
  };

  const saveSyllabus = async () => {
    if (!selectedClass) return;
    await api.post(`/admin/classes/${selectedClass._id}/syllabus`, { syllabus });
    setIsSyllabusOpen(false);
  };

  const openTimetable = async (cls: any) => {
    setSelectedClass(cls);
    const data = await api.get(`/admin/classes/${cls._id}/timetable`).catch(() => []);
    setTimetable(Array.isArray(data) ? data : []);
    setIsTimetableOpen(true);
  };

  const saveTimetable = async () => {
    if (!selectedClass) return;
    await api.post(`/admin/classes/${selectedClass._id}/timetable`, { timetable });
    setIsTimetableOpen(false);
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Academic Management</h1>
            <p className="text-muted-foreground">Manage classes, subjects, and curriculum</p>
          </div>
          <Button className="gradient-primary shadow-elegant" onClick={() => setIsAddOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Class
          </Button>
        </div>

        {stats && (
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="p-6 hover-lift">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mb-3">
                <Book className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-1">{stats.totalClasses}</h3>
              <p className="text-sm text-muted-foreground">Total Classes</p>
            </Card>
            <Card className="p-6 hover-lift">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-3">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-1">{stats.totalSubjects}</h3>
              <p className="text-sm text-muted-foreground">Total Subjects</p>
            </Card>
            <Card className="p-6 hover-lift">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-3">
                <ClipboardList className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-1">—</h3>
              <p className="text-sm text-muted-foreground">Exams Scheduled</p>
            </Card>
            <Card className="p-6 hover-lift">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center mb-3">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-1">{stats.avgStudents}</h3>
              <p className="text-sm text-muted-foreground">Avg Students per Class</p>
            </Card>
          </div>
        )}

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Class Overview</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {classes.map((cls, index) => (
              <Card key={index} className="p-6 hover-lift">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold">{cls.name}</h4>
                  <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="flex justify-between">
                    <span className="text-muted-foreground">Students:</span>
                    <span className="font-medium">{cls.studentsCount}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-muted-foreground">Class Teacher:</span>
                    <span className="font-medium">{cls.teacherName}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-muted-foreground">Subjects:</span>
                    <span className="font-medium">{cls.subjectsCount}</span>
                  </p>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => openTimetable(cls)}>Timetable</Button>
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => openSyllabus(cls)}>Syllabus</Button>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </div>

      {/* Add Class Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Class</DialogTitle>
          </DialogHeader>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Class Name</label>
              <Input placeholder="Enter Class Name" value={newClass.name} onChange={(e) => setNewClass({ ...newClass, name: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Class Teacher</label>
              <Input placeholder="Enter Class Teacher Name" value={newClass.teacherName} onChange={(e) => setNewClass({ ...newClass, teacherName: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Students Count</label>
              <Input placeholder="Enter Number of Students" type="number" value={newClass.studentsCount} onChange={(e) => setNewClass({ ...newClass, studentsCount: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Subjects Count</label>
              <Input placeholder="Enter Number of Subjects" type="number" value={newClass.subjectsCount} onChange={(e) => setNewClass({ ...newClass, subjectsCount: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={createClassroom}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Timetable */}
      <Dialog open={isTimetableOpen} onOpenChange={setIsTimetableOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedClass ? `${selectedClass.name} Timetable` : 'Timetable'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {timetable.map((row, idx) => (
              <div key={idx} className="grid md:grid-cols-3 gap-2">
                <Input placeholder="Day" value={row.day} onChange={(e) => setTimetable(timetable.map((r, i) => i===idx? { ...r, day: e.target.value }: r))} />
                <Input placeholder="Period" value={row.period} onChange={(e) => setTimetable(timetable.map((r, i) => i===idx? { ...r, period: e.target.value }: r))} />
                <Input placeholder="Subject" value={row.subject} onChange={(e) => setTimetable(timetable.map((r, i) => i===idx? { ...r, subject: e.target.value }: r))} />
              </div>
            ))}
            <Button variant="outline" onClick={() => setTimetable([...timetable, { day: "", period: "", subject: "" }])}>Add Row</Button>
          </div>
          <DialogFooter>
            <Button onClick={saveTimetable}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Syllabus */}
      <Dialog open={isSyllabusOpen} onOpenChange={setIsSyllabusOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedClass ? `${selectedClass.name} Syllabus` : 'Syllabus'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {syllabus.map((row, idx) => (
              <div key={idx} className="grid md:grid-cols-2 gap-2">
                <Input placeholder="Unit" value={row.unit} onChange={(e) => setSyllabus(syllabus.map((r, i) => i===idx? { ...r, unit: e.target.value }: r))} />
                <Input placeholder="Topic" value={row.topic} onChange={(e) => setSyllabus(syllabus.map((r, i) => i===idx? { ...r, topic: e.target.value }: r))} />
              </div>
            ))}
            <Button variant="outline" onClick={() => setSyllabus([...syllabus, { unit: "", topic: "" }])}>Add Row</Button>
          </div>
          <DialogFooter>
            <Button onClick={saveSyllabus}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AcademicsPage;
