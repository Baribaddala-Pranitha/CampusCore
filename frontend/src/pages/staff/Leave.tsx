import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LayoutDashboard, ClipboardCheck, Calendar, CalendarDays, FileText, Wrench, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const StaffLeave = () => {
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
        const items = await api.get(`/staff/${s._id}/leaves`);
        setRows(items.map((r:any) => ({ d: `${new Date(r.fromDate).toDateString()} - ${new Date(r.toDate).toDateString()}`, days: r.days, s: r.status })));
      } catch (e) { console.error(e); }
    }
    load();
  }, []);

  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="staff">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Attendance & Leave</h1>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 hover-lift border-primary/20">
            <h3 className="font-semibold mb-3">Apply for Leave</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="from">From</Label>
                <Input id="from" type="date" />
              </div>
              <div>
                <Label htmlFor="to">To</Label>
                <Input id="to" type="date" />
              </div>
              <div>
                <Label htmlFor="reason">Reason</Label>
                <Textarea id="reason" placeholder="Enter reason" />
              </div>
              <Button className="w-full" onClick={async ()=>{
                try {
                  if (!staffId) return;
                  const from = (document.getElementById("from") as HTMLInputElement)?.value;
                  const to = (document.getElementById("to") as HTMLInputElement)?.value;
                  const reason = (document.getElementById("reason") as HTMLTextAreaElement)?.value;
                  if (!from || !to) return;
                  const fromDate = new Date(from);
                  const toDate = new Date(to);
                  const msPerDay = 24*60*60*1000;
                  const days = Math.max(1, Math.round((toDate.getTime() - fromDate.getTime())/msPerDay) + 1);
                  await api.post(`/staff/${staffId}/leaves`, { fromDate, toDate, days, reason });
                  const items = await api.get(`/staff/${staffId}/leaves`);
                  setRows(items.map((r:any) => ({ d: `${new Date(r.fromDate).toDateString()} - ${new Date(r.toDate).toDateString()}`, days: r.days, s: r.status })));
                } catch (e) { console.error(e); }
              }}>Submit Request</Button>
            </div>
          </Card>

          <Card className="p-6 hover-lift border-primary/20">
            <h3 className="font-semibold mb-3">Recent Leave Requests</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dates</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r,i)=>(
                  <TableRow key={i}>
                    <TableCell>{r.d}</TableCell>
                    <TableCell>{r.days}</TableCell>
                  <TableCell className="font-medium"><Badge variant={r.s === "Approved" ? "success" : r.s === "Rejected" ? "destructive" : "outline"}>{r.s}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StaffLeave;


