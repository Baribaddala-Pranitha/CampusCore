import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Save,
  CheckCircle,
  AlertCircle
} from "lucide-react";

const AttendancePage = () => {
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
  const [className, setClassName] = useState<string>("Class 10A");
  const [dateStr, setDateStr] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [roster, setRoster] = useState<Array<{ name: string; rollNo: string; present: boolean }>>([]);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<any[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        const teachers: any[] = await api.get("/admin/teachers?status=Active");
        const t = teachers?.[0];
        if (!t) {
          setLoading(false);
          return;
        }
        setTeacher(t);
        
        // Load students by class for marking attendance
        const students: any[] = await api.get(`/admin/students?className=${encodeURIComponent(className)}`);
        if (students && students.length > 0) {
          setRoster(students.map((s) => ({ 
            name: s.name, 
            rollNo: s.rollNo || `${s.className}-${s.rollNo}`, 
            present: true 
          })));
        } else {
          // If no students found, try to get from classes
          const classes = await api.get(`/admin/teachers/${t._id}/classes`);
          const classData = classes.find((c: any) => c.name === className);
          if (classData) {
            // Create dummy students for demo purposes
            const dummyStudents = Array.from({ length: classData.studentsCount || 5 }, (_, i) => ({
              name: `Student ${i + 1}`,
              rollNo: `${className}-${String(i + 1).padStart(2, '0')}`,
              present: true
            }));
            setRoster(dummyStudents);
          } else {
            setRoster([]);
          }
        }
        
        // Load last records
        const recs = await api.get(`/admin/teachers/${t._id}/attendance?className=${encodeURIComponent(className)}`);
        setHistory(recs || []);
      } catch (e) {
        console.error(e);
        // Set some dummy data for demo
        setRoster([
          { name: "John Doe", rollNo: "10A-01", present: true },
          { name: "Jane Smith", rollNo: "10A-02", present: true },
          { name: "Mike Johnson", rollNo: "10A-03", present: false },
          { name: "Sarah Wilson", rollNo: "10A-04", present: true },
          { name: "David Brown", rollNo: "10A-05", present: true }
        ]);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [className]);

  const overall = useMemo(() => {
    const total = roster.length || 1;
    const present = roster.filter((r) => r.present).length;
    return Math.round((present / total) * 100);
  }, [roster]);

  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="teacher">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Mark Attendance</h1>
            <p className="text-muted-foreground">{className} - {teacher?.subject || "Subject"} - {new Date(dateStr).toDateString()}</p>
          </div>
          <Button 
            className="gradient-primary shadow-elegant" 
            onClick={async () => {
              if (!teacher) {
                toast.error("Teacher not found");
                return;
              }
              if (roster.length === 0) {
                toast.error("No students to mark attendance for");
                return;
              }
              
              try {
                setSaving(true);
                await api.post(`/admin/teachers/${teacher._id}/attendance`, {
                  date: new Date(dateStr),
                  className,
                  subject: teacher.subject,
                  entries: roster.map(r => ({ studentName: r.name, rollNo: r.rollNo, present: r.present }))
                });
                
                // Refresh history
                const recs = await api.get(`/admin/teachers/${teacher._id}/attendance?className=${encodeURIComponent(className)}`);
                setHistory(recs || []);
                
                setShowSuccessModal(true);
                toast.success("Attendance saved successfully!");
              } catch (e) {
                console.error(e);
                toast.error("Failed to save attendance");
              } finally {
                setSaving(false);
              }
            }}
            disabled={saving || roster.length === 0}
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save Attendance"}
          </Button>
        </div>

        <Card className="p-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <Label>Class</Label>
              <Input value={className} onChange={e=>setClassName(e.target.value)} />
            </div>
            <div>
              <Label>Date</Label>
              <Input type="date" value={dateStr} onChange={e=>setDateStr(e.target.value)} />
            </div>
            <div>
              <Button variant="outline" onClick={()=>setRoster(r=>r.map(s=>({ ...s, present: true })))} className="w-full">
                Mark All Present
              </Button>
            </div>
            <div>
              <Button variant="outline" onClick={()=>setRoster(r=>r.map(s=>({ ...s, present: false })))} className="w-full">
                Mark All Absent
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Student Attendance</h3>
          {loading && <p className="text-muted-foreground">Loading roster...</p>}
          {!loading && (
            <div className="space-y-3">
              {roster.map((student, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Checkbox 
                      checked={student.present} 
                      onCheckedChange={(v) => {
                        const checked = Boolean(v);
                        setRoster((r) => r.map((it, i) => i === idx ? { ...it, present: checked } : it));
                      }} 
                    />
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-muted-foreground">Roll No: {student.rollNo}</p>
                    </div>
                  </div>
                  <Badge variant={student.present ? "default" : "secondary"}>
                    {student.present ? "Present" : "Absent"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Attendance Summary */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Attendance Summary</h3>
              <p className="text-sm text-muted-foreground">Current class attendance</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">
                {roster.filter(r => r.present).length}/{roster.length}
              </p>
              <p className="text-sm text-muted-foreground">Present Students</p>
              <p className="text-sm text-muted-foreground">{overall}% attendance rate</p>
            </div>
          </div>
        </Card>

        {/* Success Modal */}
        <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Attendance Saved Successfully
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-muted-foreground">
                Attendance for {className} on {new Date(dateStr).toDateString()} has been saved successfully.
              </p>
              <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                <p className="font-medium">Summary:</p>
                <p className="text-sm text-muted-foreground">
                  {roster.filter(r => r.present).length} out of {roster.length} students marked present
                </p>
                <p className="text-sm text-muted-foreground">
                  Attendance rate: {overall}%
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

export default AttendancePage;
