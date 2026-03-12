import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { LayoutDashboard, ClipboardCheck, Calendar, CalendarDays, FileText, Wrench, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const StaffDashboard = () => {
  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/staff/dashboard" },
    { icon: ClipboardCheck, label: "My Tasks", path: "/staff/tasks" },
    { icon: Calendar, label: "Attendance", path: "/staff/attendance" },
    { icon: CalendarDays, label: "Leave", path: "/staff/leave" },
    { icon: FileText, label: "Payroll", path: "/staff/payroll" },
    { icon: Wrench, label: "Maintenance", path: "/staff/maintenance" },
    { icon: Settings, label: "Settings", path: "/staff/settings" }
  ];

  const [stats, setStats] = useState<{ tasks: number; attendance: number; salary: number }>({ tasks: 0, attendance: 0, salary: 0 });

  useEffect(() => {
    async function load() {
      try {
        const staff: any[] = await api.get("/staff?status=Active");
        const s = staff?.[0];
        if (!s) return;
        const [tasks, attendance, payroll] = await Promise.all([
          api.get(`/staff/${s._id}/tasks`),
          api.get(`/staff/${s._id}/attendance`),
          api.get(`/staff/${s._id}/payroll`),
        ]);
        const days = attendance.length || 1;
        const present = attendance.filter((a: any) => a.status === "Present").length;
        const attendancePct = Math.round((present / days) * 100);
        const latestNet = payroll[0]?.net || 0;
        setStats({ tasks: tasks.filter((t: any) => t.status !== "Completed").length, attendance: attendancePct, salary: latestNet });
      } catch (e) { console.error(e); }
    }
    load();
  }, []);

  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="staff">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Staff Dashboard</h1>
        <p className="text-muted-foreground">Manage your tasks and responsibilities</p>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 hover-lift"><h3 className="text-2xl font-bold mb-2">{stats.tasks}</h3><p className="text-muted-foreground">Pending Tasks</p></Card>
          <Card className="p-6 hover-lift"><h3 className="text-2xl font-bold mb-2">{stats.attendance}%</h3><p className="text-muted-foreground">Attendance</p></Card>
          <Card className="p-6 hover-lift"><h3 className="text-2xl font-bold mb-2">₹{stats.salary?.toLocaleString?.("en-IN") || stats.salary}</h3><p className="text-muted-foreground">Monthly Salary</p></Card>
        </div>

        <Card className="p-6 hover-lift border-primary/20">
          <h3 className="font-semibold mb-4">Quick Links</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
            <a className="inline-flex items-center justify-center h-10 rounded-md border bg-background hover:bg-accent px-4 text-sm font-medium transition-smooth" href="/staff/attendance">Mark Attendance</a>
            <a className="inline-flex items-center justify-center h-10 rounded-md border bg-background hover:bg-accent px-4 text-sm font-medium transition-smooth" href="/staff/leave">Apply Leave</a>
            <a className="inline-flex items-center justify-center h-10 rounded-md border bg-background hover:bg-accent px-4 text-sm font-medium transition-smooth" href="/staff/payroll">View Payslips</a>
            <a className="inline-flex items-center justify-center h-10 rounded-md border bg-background hover:bg-accent px-4 text-sm font-medium transition-smooth" href="/staff/maintenance">Maintenance Tasks</a>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StaffDashboard;


