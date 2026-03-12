import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LayoutDashboard, ClipboardCheck, Calendar, CalendarDays, FileText, Wrench, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const StaffAttendance = () => {
  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/staff/dashboard" },
    { icon: ClipboardCheck, label: "My Tasks", path: "/staff/tasks" },
    { icon: Calendar, label: "Attendance", path: "/staff/attendance" },
    { icon: CalendarDays, label: "Leave", path: "/staff/leave" },
    { icon: FileText, label: "Payroll", path: "/staff/payroll" },
    { icon: Wrench, label: "Maintenance", path: "/staff/maintenance" },
    { icon: Settings, label: "Settings", path: "/staff/settings" }
  ];

  const [rows, setRows] = useState<any[]>([]);
  const [staffId, setStaffId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const staff: any[] = await api.get("/staff?status=Active");
        const s = staff?.[0];
        if (!s) return;
        setStaffId(s._id);
        const items = await api.get(`/staff/${s._id}/attendance`);
        setRows(items.map((a:any) => ({ d: new Date(a.date).toISOString().slice(0,10), s: a.status, in: a.checkIn || "-", out: a.checkOut || "-" })));
      } catch (e) { console.error(e); }
    }
    load();
  }, []);

  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="staff">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Attendance</h1>
        <Card className="p-6 hover-lift border-primary/20">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">Mark your attendance</p>
            <Button onClick={async ()=>{
              try {
                if (!staffId) return;
                const today = new Date();
                const payload = { date: today, status: "Present", checkIn: `${today.getHours().toString().padStart(2,'0')}:${today.getMinutes().toString().padStart(2,'0')}` };
                await api.post(`/staff/${staffId}/attendance`, payload);
                const refreshed = await api.get(`/staff/${staffId}/attendance`);
                setRows(refreshed.map((a:any) => ({ d: new Date(a.date).toISOString().slice(0,10), s: a.status, in: a.checkIn || "-", out: a.checkOut || "-" })));
              } catch (e) { console.error(e); }
            }}>Mark Present</Button>
          </div>
        </Card>

        <Card className="p-6 hover-lift border-primary/20">
          <h3 className="font-semibold mb-3">This Month</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Check-in</TableHead>
                <TableHead>Check-out</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r,i)=>(
                <TableRow key={i}>
                  <TableCell>{r.d}</TableCell>
                  <TableCell><Badge variant={r.s === "Present" ? "success" : r.s === "Absent" ? "destructive" : "outline"}>{r.s}</Badge></TableCell>
                  <TableCell>{r.in}</TableCell>
                  <TableCell>{r.out}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StaffAttendance;


