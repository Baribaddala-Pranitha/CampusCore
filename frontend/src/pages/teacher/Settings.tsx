import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  BookOpen,
  FileText,
  MessageSquare,
  Calendar,
  Settings as SettingsIcon,
  User,
  Bell,
  Save,
  CheckCircle
} from "lucide-react";

const SettingsPage = () => {
  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/teacher/dashboard" },
    { icon: Users, label: "My Classes", path: "/teacher/classes" },
    { icon: ClipboardCheck, label: "Attendance", path: "/teacher/attendance" },
    { icon: BookOpen, label: "Assignments", path: "/teacher/assignments" },
    { icon: FileText, label: "Exams & Grades", path: "/teacher/exams" },
    { icon: Calendar, label: "Timetable", path: "/teacher/timetable" },
    { icon: MessageSquare, label: "Communication", path: "/teacher/communication" },
    { icon: SettingsIcon, label: "Settings", path: "/teacher/settings" }
  ];

  const [teacher, setTeacher] = useState<any | null>(null);
  const [name, setName] = useState("Dr. Sarah Johnson");
  const [email, setEmail] = useState("sarah.j@school.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [notif, setNotif] = useState({ assignment: true, parent: true, admin: false });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const teachers: any[] = await api.get("/admin/teachers?status=Active");
        const t = teachers?.[0];
        if (!t) return;
        setTeacher(t);
        setName(t.name || name);
        setEmail(t.email || email);
        setPhone(t.phone || phone);
      } catch (e) { console.error(e); }
    }
    load();
  }, []);

  async function saveProfile() {
    try {
      if (!teacher) return;
      setSaving(true);
      
      // Validate required fields
      if (!name.trim()) {
        toast.error("Name is required");
        return;
      }
      if (!email.trim()) {
        toast.error("Email is required");
        return;
      }
      
      await api.post(`/admin/teachers/${teacher._id}`, { name, email, phone }, { method: "PUT" } as any);
      setShowSuccessModal(true);
      toast.success("Profile updated successfully!");
    } catch (e) { 
      console.error(e); 
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  async function saveNotifications() {
    try {
      setSaving(true);
      // In a real app, you'd save notification preferences to the backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setShowSuccessModal(true);
      toast.success("Notification preferences saved successfully!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to save notification preferences");
    } finally {
      setSaving(false);
    }
  }

  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="teacher">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your profile and preferences</p>
        </div>

        <div className="grid gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Profile Information</h3>
            </div>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Full Name</label>
                  <Input value={name} onChange={e=>setName(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Employee ID</label>
                  <Input defaultValue="TCH-2025-001" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Email</label>
                  <Input value={email} onChange={e=>setEmail(e.target.value)} type="email" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Phone</label>
                  <Input value={phone} onChange={e=>setPhone(e.target.value)} />
                </div>
              </div>
              <Button className="gradient-primary" onClick={saveProfile} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Notifications</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium">Assignment Submissions</p>
                  <p className="text-sm text-muted-foreground">Get notified when students submit assignments</p>
                </div>
                <Switch checked={notif.assignment} onCheckedChange={(v)=>setNotif(n=>({ ...n, assignment: Boolean(v) }))} />
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium">Parent Messages</p>
                  <p className="text-sm text-muted-foreground">Receive notifications for parent messages</p>
                </div>
                <Switch checked={notif.parent} onCheckedChange={(v)=>setNotif(n=>({ ...n, parent: Boolean(v) }))} />
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium">Admin Announcements</p>
                  <p className="text-sm text-muted-foreground">Get school-wide announcements</p>
                </div>
                <Switch checked={notif.admin} onCheckedChange={(v)=>setNotif(n=>({ ...n, admin: Boolean(v) }))} />
              </div>
              <Button className="gradient-primary" onClick={saveNotifications} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Saving..." : "Save Preferences"}
              </Button>
            </div>
          </Card>
        </div>

        {/* Success Modal */}
        <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Changes Saved Successfully
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-muted-foreground">
                Your settings have been saved successfully. Changes will take effect immediately.
              </p>
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

export default SettingsPage;
