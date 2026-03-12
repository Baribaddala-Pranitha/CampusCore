import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, ClipboardCheck, Calendar, CalendarDays, FileText, Wrench, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const StaffPayroll = () => {
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

  useEffect(() => {
    async function load() {
      try {
        const staff: any[] = await api.get("/staff?status=Active");
        const s = staff?.[0];
        if (!s) return;
        const items = await api.get(`/staff/${s._id}/payroll`);
        setRows(items.map((r:any) => ({ m: r.month, g: `₹${r.gross.toLocaleString?.("en-IN") || r.gross}`, d: `₹${r.deductions.toLocaleString?.("en-IN") || r.deductions}`, n: `₹${r.net.toLocaleString?.("en-IN") || r.net}` })));
      } catch (e) { console.error(e); }
    }
    load();
  }, []);

  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="staff">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Payroll</h1>
        <Card className="p-6 hover-lift border-primary/20">
          <p className="text-muted-foreground">View salary slips and payment history</p>
        </Card>

        <Card className="p-6 hover-lift border-primary/20">
          <h3 className="font-semibold mb-3">Payslips</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead>Gross</TableHead>
                <TableHead>Deductions</TableHead>
                <TableHead>Net</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r,i)=> (
                <TableRow key={i}>
                  <TableCell>{r.m}</TableCell>
                  <TableCell>{r.g}</TableCell>
                  <TableCell>{r.d}</TableCell>
                  <TableCell className="font-medium">{r.n}</TableCell>
                  <TableCell><Button size="sm" variant="outline" onClick={()=>{
                    const blob = new Blob([JSON.stringify(r, null, 2)], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${r.m}-payslip.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}>Download</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StaffPayroll;


