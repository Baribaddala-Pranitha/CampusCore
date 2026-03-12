import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LayoutDashboard, ClipboardCheck, Calendar, CalendarDays, FileText, Wrench, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const StaffTasks = () => {
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
  const [rawItems, setRawItems] = useState<any[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [action, setAction] = useState<{ id?: string; next?: string } | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const staff: any[] = await api.get("/staff?status=Active");
        const s = staff?.[0];
        if (!s) return;
        const items = await api.get(`/staff/${s._id}/tasks`);
        setRawItems(items);
        setRows(items.map((r:any) => ({ id: r._id, t: r.title, d: r.dueDate ? new Date(r.dueDate).toDateString() : "-", s: r.status })));
      } catch (e) { console.error(e); }
    }
    load();
  }, []);

  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="staff">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">My Tasks</h1>
        <Card className="p-6 hover-lift">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Due</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r,i)=> (
                <TableRow key={i}>
                  <TableCell>{r.t}</TableCell>
                  <TableCell>{r.d}</TableCell>
                  <TableCell className="font-medium">
                    <Badge variant={r.s === "Completed" ? "success" : r.s === "In Progress" ? "default" : "outline"}>{r.s}</Badge>
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button size="sm" variant="outline" onClick={()=>{ setAction({ id: r.id, next: "In Progress" }); setConfirmOpen(true); }}>Start</Button>
                    <Button size="sm" onClick={()=>{ setAction({ id: r.id, next: "Completed" }); setConfirmOpen(true); }}>Complete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Task Status</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>Are you sure you want to set this task to <span className="font-semibold">{action?.next}</span>?</p>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={()=>setConfirmOpen(false)}>Cancel</Button>
                <Button disabled={updating} onClick={async ()=>{
                  try {
                    if (!action?.id || !action?.next) return;
                    setUpdating(true);
                    // Optimistic update
                    setRows((curr) => curr.map((r:any) => r.id === action.id ? { ...r, s: action.next } : r));
                    const staff: any[] = await api.get("/staff?status=Active");
                    const s = staff?.[0];
                    if (!s) return;
                    await api.post(`/staff/${s._id}/tasks/${action.id}`, { status: action.next }, { method: "PUT" as any });
                    const items = await api.get(`/staff/${s._id}/tasks`);
                    setRawItems(items);
                    setRows(items.map((r:any) => ({ id: r._id, t: r.title, d: r.dueDate ? new Date(r.dueDate).toDateString() : "-", s: r.status })));
                    setConfirmOpen(false);
                  } catch (e) { console.error(e); }
                  finally { setUpdating(false); }
                }}>Update</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default StaffTasks;


