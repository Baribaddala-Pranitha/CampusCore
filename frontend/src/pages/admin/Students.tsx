import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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
  Filter,
  Download,
  UserPlus,
  Eye,
  Edit,
  Trash2
} from "lucide-react";

const StudentsPage = () => {
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

  const [students, setStudents] = useState<any[]>([]);
  const [stats, setStats] = useState<any | null>(null);
  const [query, setQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newStudent, setNewStudent] = useState<any>({ studentId: "", name: "", className: "", rollNo: "", email: "", phone: "", status: "Active" });
  const [editing, setEditing] = useState<any | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    api
      .get(`/admin/students?q=${encodeURIComponent(query)}`)
      .then(setStudents)
      .catch(() => setStudents([]));
    api.get('/admin/students/stats').then(setStats).catch(() => setStats(null));
    return () => controller.abort();
  }, [query]);

  const refresh = async () => {
    const data = await api.get(`/admin/students?q=${encodeURIComponent(query)}`);
    setStudents(data);
    const s = await api.get('/admin/students/stats');
    setStats(s);
  };

  const onCreate = async () => {
    await api.post('/admin/students', newStudent);
    setIsAddOpen(false);
    setNewStudent({ studentId: "", name: "", className: "", rollNo: "", email: "", phone: "", status: "Active" });
    refresh();
  };

  const onUpdate = async () => {
    if (!editing) return;
    await api.post(`/admin/students/${editing._id}`, editing, { method: 'PUT' as any });
    setEditing(null);
    refresh();
  };

  const onDelete = async (id: string) => {
    await api.post(`/admin/students/${id}`, {}, { method: 'DELETE' as any });
    refresh();
  };

  const toggleOnBoard = async (id: string, current: boolean) => {
    await api.post(`/admin/students/${id}/transport`, { onBoard: !current });
    // Optimistic update
    setStudents(prev => prev.map(s => s._id === id ? { ...s, onBoard: !current } : s));
  };

  const exportCsv = () => {
    const header = ['Student ID','Name','Class','Roll No','Email','Phone','Status'];
    const rows = students.map(s => [s.studentId, s.name, s.className, s.rollNo, s.email, s.phone, s.status]);
    const csv = [header, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Student Management</h1>
            <p className="text-muted-foreground">Manage all student records and information</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportCsv}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button className="gradient-primary shadow-elegant" onClick={() => setIsAddOpen(true)}>
              <UserPlus className="w-4 h-4 mr-2" />
              Add Student
            </Button>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: "Total Students", value: String(stats.total), icon: Users, color: "from-blue-500 to-cyan-600" },
              { label: "New Admissions (30d)", value: String(stats.newAdmissions30d), icon: UserPlus, color: "from-green-500 to-emerald-600" },
              { label: "Active", value: String(stats.active), icon: Users, color: "from-purple-500 to-pink-600" },
              { label: "Inactive", value: String(stats.inactive), icon: Users, color: "from-orange-500 to-amber-600" },
            ].map((stat, index) => (
              <Card key={index} className="p-4 hover-lift">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Search */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search by name, ID, or class..." className="pl-10" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
          </div>
        </Card>

        {/* Students Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Student ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Class</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Roll No</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Phone</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={index} className="border-t hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium">{student.studentId}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="font-medium">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{student.className}</td>
                    <td className="px-6 py-4 text-sm">{student.rollNo}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{student.email}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{student.phone}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          student.status === "Active" 
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                            : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                        }`}>
                          {student.status}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          student.onBoard ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                        }`}>
                          {student.onBoard ? "Onboard" : "Offboard"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="hover:text-primary" onClick={() => setEditing(student)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="hover:text-primary" onClick={() => setEditing(student)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => toggleOnBoard(student._id, !!student.onBoard)}>
                          {student.onBoard ? 'Mark Offboard' : 'Mark Onboard'}
                        </Button>
                        <Button variant="ghost" size="icon" className="hover:text-destructive" onClick={() => onDelete(student._id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Add Student Modal */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Student</DialogTitle>
            </DialogHeader>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Student ID</label>
                <Input placeholder="Enter Student ID" value={newStudent.studentId} onChange={(e) => setNewStudent({ ...newStudent, studentId: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Full Name</label>
                <Input placeholder="Enter Full Name" value={newStudent.name} onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Class</label>
                <Input placeholder="Enter Class" value={newStudent.className} onChange={(e) => setNewStudent({ ...newStudent, className: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Roll Number</label>
                <Input placeholder="Enter Roll Number" value={newStudent.rollNo} onChange={(e) => setNewStudent({ ...newStudent, rollNo: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Email Address</label>
                <Input placeholder="Enter Email Address" value={newStudent.email} onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Phone Number</label>
                <Input placeholder="Enter Phone Number" value={newStudent.phone} onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={onCreate}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit/View Student Modal */}
        <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? `Edit ${editing.name}` : 'Edit Student'}</DialogTitle>
            </DialogHeader>
            {editing && (
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Student ID</label>
                  <Input placeholder="Enter Student ID" value={editing.studentId} onChange={(e) => setEditing({ ...editing, studentId: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Full Name</label>
                  <Input placeholder="Enter Full Name" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Class</label>
                  <Input placeholder="Enter Class" value={editing.className} onChange={(e) => setEditing({ ...editing, className: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Roll Number</label>
                  <Input placeholder="Enter Roll Number" value={editing.rollNo} onChange={(e) => setEditing({ ...editing, rollNo: e.target.value })} />
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

export default StudentsPage;
