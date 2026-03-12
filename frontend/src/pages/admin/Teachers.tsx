import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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
  Search,
  UserPlus,
  Mail,
  Phone
} from "lucide-react";

const TeachersPage = () => {
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

  const [teachers, setTeachers] = useState<any[]>([]);
  const [stats, setStats] = useState<any | null>(null);
  const [query, setQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTeacher, setNewTeacher] = useState<any>({ name: "", subject: "", classes: "", experienceYears: 0, email: "", phone: "", status: "Active" });
  const [editing, setEditing] = useState<any | null>(null);
  const [viewing, setViewing] = useState<any | null>(null);

  useEffect(() => {
    api
      .get(`/admin/teachers?q=${encodeURIComponent(query)}`)
      .then((data) => {
        setTeachers(data);
      })
      .catch(() => setTeachers([]));
    api.get('/admin/teachers/stats').then(setStats).catch(() => setStats(null));
  }, [query]);

  const refresh = async () => {
    const list = await api.get(`/admin/teachers?q=${encodeURIComponent(query)}`);
    setTeachers(list);
    const s = await api.get('/admin/teachers/stats');
    setStats(s);
  };

  const onCreate = async () => {
    const payload = { ...newTeacher, classes: String(newTeacher.classes).split(',').map((s: string) => s.trim()).filter(Boolean), experienceYears: Number(newTeacher.experienceYears) };
    await api.post('/admin/teachers', payload);
    setIsAddOpen(false);
    setNewTeacher({ name: "", subject: "", classes: "", experienceYears: 0, email: "", phone: "", status: "Active" });
    refresh();
  };

  const onUpdate = async () => {
    if (!editing) return;
    const payload = { ...editing, classes: Array.isArray(editing.classes) ? editing.classes : String(editing.classes).split(',').map((s: string) => s.trim()).filter(Boolean) };
    await api.post(`/admin/teachers/${editing._id}`, payload, { method: 'PUT' as any });
    setEditing(null);
    refresh();
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Teachers Management</h1>
            <p className="text-muted-foreground">Manage teaching staff and their assignments</p>
          </div>
          <Button className="gradient-primary shadow-elegant" onClick={() => setIsAddOpen(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add Teacher
          </Button>
        </div>

        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input placeholder="Search teachers..." className="pl-10" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
          </div>

          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="p-4 hover-lift"><div className="text-sm text-muted-foreground">Total</div><div className="text-2xl font-bold">{stats.total}</div></Card>
              <Card className="p-4 hover-lift"><div className="text-sm text-muted-foreground">Active</div><div className="text-2xl font-bold text-green-600">{stats.active}</div></Card>
              <Card className="p-4 hover-lift"><div className="text-sm text-muted-foreground">On Leave</div><div className="text-2xl font-bold text-orange-600">{stats.onLeave}</div></Card>
            </div>
          )}

          <div className="space-y-4">
            {teachers.map((teacher) => (
              <Card key={teacher._id} className="p-6 hover-lift">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{teacher.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          teacher.status === "Active" ? "bg-green-500/10 text-green-600" : "bg-orange-500/10 text-orange-600"
                        }`}>
                          {teacher.status}
                        </span>
                      </div>
                      <div className="grid md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <p><span className="font-medium">Subject:</span> {teacher.subject}</p>
                        <p><span className="font-medium">Classes:</span> {Array.isArray(teacher.classes) ? teacher.classes.join(", ") : teacher.classes}</p>
                        <p className="flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {teacher.email}
                        </p>
                        <p className="flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {teacher.phone}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        <span className="font-medium">Experience:</span> {teacher.experienceYears} years
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setViewing(teacher)}>View</Button>
                    <Button variant="outline" size="sm" onClick={() => setEditing(teacher)}>Edit</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        {/* Add Teacher Modal */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Teacher</DialogTitle>
            </DialogHeader>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Full Name</label>
                <Input placeholder="Enter Full Name" value={newTeacher.name} onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Subject</label>
                <Input placeholder="Enter Subject" value={newTeacher.subject} onChange={(e) => setNewTeacher({ ...newTeacher, subject: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Classes</label>
                <Input placeholder="Enter Classes (comma-separated)" value={newTeacher.classes} onChange={(e) => setNewTeacher({ ...newTeacher, classes: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Experience (Years)</label>
                <Input placeholder="Enter Experience in Years" type="number" value={newTeacher.experienceYears} onChange={(e) => setNewTeacher({ ...newTeacher, experienceYears: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Email Address</label>
                <Input placeholder="Enter Email Address" value={newTeacher.email} onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Phone Number</label>
                <Input placeholder="Enter Phone Number" value={newTeacher.phone} onChange={(e) => setNewTeacher({ ...newTeacher, phone: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={onCreate}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Teacher Modal (read-only) */}
        <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{viewing ? viewing.name : 'View Teacher'}</DialogTitle>
            </DialogHeader>
            {viewing && (
              <div className="grid md:grid-cols-2 gap-3">
                <Input disabled value={viewing.name} />
                <Input disabled value={viewing.subject} />
                <Input disabled value={Array.isArray(viewing.classes) ? viewing.classes.join(', ') : viewing.classes} />
                <Input disabled value={viewing.experienceYears + ' years'} />
                <Input disabled value={viewing.email} />
                <Input disabled value={viewing.phone} />
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => setViewing(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Teacher Modal */}
        <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? `Edit ${editing.name}` : 'Edit Teacher'}</DialogTitle>
            </DialogHeader>
            {editing && (
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Full Name</label>
                  <Input placeholder="Enter Full Name" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Subject</label>
                  <Input placeholder="Enter Subject" value={editing.subject} onChange={(e) => setEditing({ ...editing, subject: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Classes</label>
                  <Input placeholder="Enter Classes (comma-separated)" value={Array.isArray(editing.classes) ? editing.classes.join(', ') : editing.classes} onChange={(e) => setEditing({ ...editing, classes: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Experience (Years)</label>
                  <Input placeholder="Enter Experience in Years" type="number" value={editing.experienceYears} onChange={(e) => setEditing({ ...editing, experienceYears: Number(e.target.value) })} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email Address</label>
                  <Input placeholder="Enter Email Address" value={editing.email} onChange={(e) => setEditing({ ...editing, email: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Phone Number</label>
                  <Input placeholder="Enter Phone Number" value={editing.phone} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button onClick={onUpdate}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default TeachersPage;
