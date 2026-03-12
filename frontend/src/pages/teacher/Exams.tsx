import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
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
  Edit,
  CheckCircle,
  AlertCircle,
  TrendingUp
} from "lucide-react";

const ExamsPage = () => {
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
  const [isScheduleOpen, setScheduleOpen] = useState(false);
  const [isGradesOpen, setGradesOpen] = useState(false);
  const [form, setForm] = useState<any>({ name: "", className: "", subject: "", date: "", maxMarks: 100 });
  const [selected, setSelected] = useState<any | null>(null);
  const [gradesCSV, setGradesCSV] = useState<string>("studentName,score\nJohn Doe,92\nSarah Smith,88");
  const [grades, setGrades] = useState<any[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const teachers: any[] = await api.get("/admin/teachers?status=Active");
        const t = teachers?.[0];
        if (!t) return setLoading(false);
        setTeacher(t);
        const res = await api.get(`/admin/teachers/${t._id}/exams`);
        setItems(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function refreshExams() {
    if (!teacher) return;
    const res = await api.get(`/admin/teachers/${teacher._id}/exams`);
    setItems(res);
  }

  function openSchedule() {
    setForm({ name: "Unit Test", className: "Class 10A", subject: teacher?.subject || "", date: new Date().toISOString().slice(0,10), maxMarks: 100 });
    setScheduleOpen(true);
  }

  async function submitSchedule() {
    if (!teacher) return;
    const payload = { ...form, date: new Date(form.date) };
    await api.post(`/admin/teachers/${teacher._id}/exams`, payload);
    setScheduleOpen(false);
    await refreshExams();
  }

  function gradeFromScore(score: number, max: number) {
    const pct = (score / (max || 100)) * 100;
    if (pct >= 90) return "A";
    if (pct >= 80) return "B+";
    if (pct >= 70) return "B";
    if (pct >= 60) return "C";
    return "D";
  }

  function openGrades(exam: any) {
    setSelected(exam);
    // Load existing grades if any
    loadGrades(exam);
    setGradesOpen(true);
  }

  async function loadGrades(exam: any) {
    try {
      const existingGrades = await api.get(`/admin/teachers/${teacher?._id}/exams/${exam._id}/grades`);
      setGrades(existingGrades || []);
    } catch (e) {
      console.error(e);
      setGrades([]);
    }
  }

  async function submitGrades() {
    if (!teacher || !selected) return;
    
    try {
      setSaving(true);
      const rows = gradesCSV
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l && !l.toLowerCase().startsWith("studentname"))
        .map((l) => {
          const [studentName, scoreStr] = l.split(",");
          const score = Number(scoreStr?.trim() || 0);
          return {
            studentName: (studentName || "").trim(),
            className: selected.className,
            score,
            maxMarks: selected.maxMarks || 100,
            grade: gradeFromScore(score, selected.maxMarks || 100),
          };
        });
      
      if (rows.length === 0) {
        toast.error("No valid grades to submit");
        return;
      }

      // Validate scores
      const invalidScores = rows.filter(r => r.score < 0 || r.score > selected.maxMarks);
      if (invalidScores.length > 0) {
        toast.error(`Invalid scores found. Scores must be between 0 and ${selected.maxMarks}`);
        return;
      }

      await api.post(`/admin/teachers/${teacher._id}/exams/${selected._id}/grades`, rows);
      setGrades(rows);
      setShowSuccessModal(true);
      toast.success("Grades submitted successfully!");
      setGradesOpen(false);
    } catch (e) {
      console.error(e);
      toast.error("Failed to submit grades");
    } finally {
      setSaving(false);
    }
  }

  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="teacher">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Exams & Grades</h1>
            <p className="text-muted-foreground">Manage exams and enter student grades</p>
          </div>
          <Button className="gradient-primary shadow-elegant" onClick={openSchedule}>
            <Plus className="w-4 h-4 mr-2" />
            Schedule Exam
          </Button>
        </div>

        <div className="space-y-4">
          {loading && <p className="text-muted-foreground">Loading exams...</p>}
          {!loading && items.length === 0 && <p className="text-muted-foreground">No exams scheduled.</p>}
          {items.map((exam, index) => (
            <Card key={index} className="p-6 hover-lift">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{exam.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        exam.status === "Upcoming" ? "bg-blue-500/10 text-blue-600" :
                        exam.status === "Graded" ? "bg-green-500/10 text-green-600" :
                        "bg-orange-500/10 text-orange-600"
                      }`}>
                        {exam.status}
                      </span>
                    </div>
                    <div className="grid md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                      <p><span className="font-medium">Class:</span> {exam.className}</p>
                      <p><span className="font-medium">Date:</span> {new Date(exam.date).toDateString()}</p>
                      <p><span className="font-medium">Max Marks:</span> {exam.maxMarks}</p>
                      <p>
                        <span className="font-medium">Graded:</span>{" "}
                        <span className={exam.gradedCount === exam.totalCount ? "text-green-600" : "text-orange-600"}>
                          {exam.gradedCount}/{exam.totalCount}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openGrades(exam)}>
                    <Edit className="w-4 h-4 mr-1" />
                    Enter Grades
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Dialog open={isScheduleOpen} onOpenChange={setScheduleOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule Exam</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Name</Label>
                <Input value={form.name} onChange={e=>setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <Label>Class</Label>
                <Input value={form.className} onChange={e=>setForm({ ...form, className: e.target.value })} />
              </div>
              <div>
                <Label>Subject</Label>
                <Input value={form.subject} onChange={e=>setForm({ ...form, subject: e.target.value })} />
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <Label>Date</Label>
                  <Input type="date" value={form.date} onChange={e=>setForm({ ...form, date: e.target.value })} />
                </div>
                <div>
                  <Label>Max Marks</Label>
                  <Input type="number" value={form.maxMarks} onChange={e=>setForm({ ...form, maxMarks: Number(e.target.value || 0) })} />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={()=>setScheduleOpen(false)}>Cancel</Button>
              <Button onClick={submitSchedule} className="gradient-primary">Schedule</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isGradesOpen} onOpenChange={setGradesOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Enter Grades{selected ? ` - ${selected.name}` : ""}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm font-medium mb-2">Instructions:</p>
                <p className="text-sm text-muted-foreground">
                  Paste CSV data in the format: studentName,score (one per line)
                </p>
                <p className="text-sm text-muted-foreground">
                  Example: John Doe,92
                </p>
              </div>
              
              <div>
                <Label>Grade Data (CSV Format)</Label>
                <Textarea 
                  className="min-h-[200px] font-mono text-sm" 
                  value={gradesCSV} 
                  onChange={e=>setGradesCSV(e.target.value)}
                  placeholder="studentName,score&#10;John Doe,92&#10;Jane Smith,88&#10;Mike Johnson,75"
                />
              </div>

              {grades.length > 0 && (
                <div>
                  <Label>Preview Grades</Label>
                  <div className="max-h-40 overflow-auto border rounded-lg p-3 bg-muted/20">
                    {grades.map((grade, i) => (
                      <div key={i} className="flex items-center justify-between py-1 text-sm">
                        <span>{grade.studentName}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{grade.score}/{grade.maxMarks}</span>
                          <Badge variant={grade.grade === 'A' ? 'default' : grade.grade === 'B+' ? 'default' : 'secondary'}>
                            {grade.grade}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={()=>setGradesOpen(false)}>Cancel</Button>
              <Button onClick={submitGrades} disabled={saving}>
                {saving ? "Submitting..." : "Submit Grades"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Success Modal */}
        <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Grades Submitted Successfully
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-muted-foreground">
                Grades for {selected?.name} have been submitted successfully.
              </p>
              <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                <p className="font-medium">Summary:</p>
                <p className="text-sm text-muted-foreground">
                  {grades.length} students graded
                </p>
                <p className="text-sm text-muted-foreground">
                  Average score: {grades.length > 0 ? Math.round(grades.reduce((sum, g) => sum + g.score, 0) / grades.length) : 0}/{selected?.maxMarks || 100}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setShowSuccessModal(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default ExamsPage;
