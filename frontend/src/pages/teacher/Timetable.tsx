import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useEffect, useMemo, useState } from "react";
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
  Clock,
  Plus,
  Edit,
  Trash2,
  CheckCircle
} from "lucide-react";

const TimetablePage = () => {
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

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [teacher, setTeacher] = useState<any | null>(null);
  const [isAddOpen, setAddOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [form, setForm] = useState<any>({ 
    day: "Monday", 
    period: "08:30-09:30", 
    subject: "", 
    className: "",
    room: ""
  });

  useEffect(() => {
    async function load() {
      try {
        const teachers: any[] = await api.get("/admin/teachers?status=Active");
        const t = teachers?.[0];
        if (!t) return setLoading(false);
        setTeacher(t);
        const res = await api.get(`/admin/teachers/${t._id}/timetable`);
        setItems(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const schedule = useMemo(() => {
    const grouped: Record<string, any[]> = {};
    for (const it of items) {
      const day = it.day || "Other";
      if (!grouped[day]) grouped[day] = [];
      grouped[day].push({
        time: it.period,
        class: it.className || it.class,
        subject: it.subject,
        room: it.room || "-",
      });
    }
    return grouped;
  }, [items]);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const timeSlots = [
    "08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00",
    "12:00-13:00", "13:00-14:00", "14:00-15:00", "15:00-16:00"
  ];

  async function addPeriod() {
    try {
      if (!teacher) return;
      if (!form.subject || !form.className) {
        toast.error("Please fill in all required fields");
        return;
      }
      
      const newItem = {
        day: form.day,
        period: form.period,
        subject: form.subject,
        className: form.className,
        room: form.room || "TBD"
      };
      
      // Add to local state immediately
      setItems(prev => [...prev, newItem]);
      setAddOpen(false);
      setForm({ day: "Monday", period: "08:30-09:30", subject: "", className: "", room: "" });
      setShowSuccessModal(true);
      toast.success("Timetable period added successfully!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to add timetable period");
    }
  }

  function openEdit(item: any, index: number) {
    setEditingItem({ ...item, index });
    setForm({
      day: item.day,
      period: item.period,
      subject: item.subject,
      className: item.class,
      room: item.room
    });
    setEditOpen(true);
  }

  async function updatePeriod() {
    try {
      if (!editingItem) return;
      if (!form.subject || !form.className) {
        toast.error("Please fill in all required fields");
        return;
      }

      const updatedItem = {
        day: form.day,
        period: form.period,
        subject: form.subject,
        className: form.className,
        room: form.room || "TBD"
      };

      setItems(prev => prev.map((item, index) => 
        index === editingItem.index ? updatedItem : item
      ));
      
      setEditOpen(false);
      setEditingItem(null);
      setForm({ day: "Monday", period: "08:30-09:30", subject: "", className: "", room: "" });
      setShowSuccessModal(true);
      toast.success("Timetable period updated successfully!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to update timetable period");
    }
  }

  function deletePeriod(index: number) {
    setItems(prev => prev.filter((_, i) => i !== index));
    toast.success("Timetable period deleted successfully!");
  }

  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="teacher">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Timetable</h1>
            <p className="text-muted-foreground">View your weekly class schedule</p>
          </div>
          <Button className="gradient-primary shadow-elegant" onClick={()=>setAddOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Period
          </Button>
        </div>

        <div className="space-y-6">
          {loading && <p className="text-muted-foreground">Loading timetable...</p>}
          {!loading && Object.keys(schedule).length === 0 && <p className="text-muted-foreground">No timetable assigned.</p>}
          {Object.entries(schedule).map(([day, classes]) => (
            <Card key={day} className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                {day}
              </h3>
              <div className="space-y-3">
                {classes.map((cls, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth">
                    <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 grid md:grid-cols-4 gap-4">
                      <p className="font-medium">{cls.time}</p>
                      <p className="text-muted-foreground">{cls.class}</p>
                      <p className="text-muted-foreground">{cls.subject}</p>
                      <p className="text-muted-foreground">{cls.room}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => openEdit(cls, index)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => deletePeriod(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={isAddOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Timetable Period</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Day</Label>
              <Select value={form.day} onValueChange={(value) => setForm({ ...form, day: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {days.map(day => (
                    <SelectItem key={day} value={day}>{day}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Time Period</Label>
              <Select value={form.period} onValueChange={(value) => setForm({ ...form, period: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time period" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map(slot => (
                    <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Class</Label>
              <Input 
                placeholder="Enter class name" 
                value={form.className} 
                onChange={e=>setForm({ ...form, className: e.target.value })} 
              />
            </div>
            <div>
              <Label>Subject</Label>
              <Input 
                placeholder="Enter subject" 
                value={form.subject} 
                onChange={e=>setForm({ ...form, subject: e.target.value })} 
              />
            </div>
            <div>
              <Label>Room (Optional)</Label>
              <Input 
                placeholder="Enter room number" 
                value={form.room} 
                onChange={e=>setForm({ ...form, room: e.target.value })} 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={()=>setAddOpen(false)}>Cancel</Button>
            <Button onClick={addPeriod}>Add Period</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Timetable Period</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Day</Label>
              <Select value={form.day} onValueChange={(value) => setForm({ ...form, day: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {days.map(day => (
                    <SelectItem key={day} value={day}>{day}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Time Period</Label>
              <Select value={form.period} onValueChange={(value) => setForm({ ...form, period: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time period" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map(slot => (
                    <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Class</Label>
              <Input 
                placeholder="Enter class name" 
                value={form.className} 
                onChange={e=>setForm({ ...form, className: e.target.value })} 
              />
            </div>
            <div>
              <Label>Subject</Label>
              <Input 
                placeholder="Enter subject" 
                value={form.subject} 
                onChange={e=>setForm({ ...form, subject: e.target.value })} 
              />
            </div>
            <div>
              <Label>Room (Optional)</Label>
              <Input 
                placeholder="Enter room number" 
                value={form.room} 
                onChange={e=>setForm({ ...form, room: e.target.value })} 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={()=>setEditOpen(false)}>Cancel</Button>
            <Button onClick={updatePeriod}>Update Period</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Timetable Updated
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">
              Your timetable has been updated successfully.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowSuccessModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default TimetablePage;
