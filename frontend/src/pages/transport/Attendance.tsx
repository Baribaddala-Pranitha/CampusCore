import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LayoutDashboard, Users, MapPin, CheckSquare, Wrench, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const TransportAttendance = () => {
  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/transport/dashboard" },
    { icon: Users, label: "Students", path: "/transport/students" },
    { icon: MapPin, label: "Route", path: "/transport/route" },
    { icon: CheckSquare, label: "Attendance", path: "/transport/attendance" },
    { icon: Wrench, label: "Maintenance", path: "/transport/maintenance" },
    { icon: Settings, label: "Settings", path: "/transport/settings" }
  ];

  const [rows, setRows] = useState<any[]>([]);
  const [bus, setBus] = useState<any | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const list = await api.get("/admin/transport/buses");
        const b = list?.[0];
        if (!b) return;
        setBus(b);
        const att = await api.get(`/admin/transport/buses/${b._id}/attendance`).catch(()=>[]);
        const latest = att?.[0];
        setRows((latest?.entries || []).map((e:any) => ({ n: e.studentName, stop: e.stop, s: e.status })));
      } catch (e) { console.error(e); }
    }
    load();
  }, []);

  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="transport">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Bus Attendance</h1>
        <Card className="p-6 hover-lift border-primary/20">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">Mark onboard / offboard</p>
            <div className="space-x-2">
              <Button onClick={async ()=>{
                try {
                  if (!bus) return;
                  const today = new Date();
                  const payload = { date: new Date(today.toDateString()), entries: rows.map((r:any)=> ({ studentName: r.n, stop: r.stop, status: "Onboard" })) };
                  await api.post(`/admin/transport/buses/${bus._id}/attendance`, payload);
                  const att = await api.get(`/admin/transport/buses/${bus._id}/attendance`);
                  const latest = att?.[0];
                  setRows((latest?.entries || []).map((e:any) => ({ n: e.studentName, stop: e.stop, s: e.status })));
                } catch (e) { console.error(e); }
              }}>Mark All Onboard</Button>
              <Button variant="outline" onClick={async ()=>{
                try {
                  if (!bus) return;
                  const today = new Date();
                  const payload = { date: new Date(today.toDateString()), entries: rows.map((r:any)=> ({ studentName: r.n, stop: r.stop, status: "Offboard" })) };
                  await api.post(`/admin/transport/buses/${bus._id}/attendance`, payload);
                  const att = await api.get(`/admin/transport/buses/${bus._id}/attendance`);
                  const latest = att?.[0];
                  setRows((latest?.entries || []).map((e:any) => ({ n: e.studentName, stop: e.stop, s: e.status })));
                } catch (e) { console.error(e); }
              }}>Mark All Offboard</Button>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover-lift border-primary/20">
          <h3 className="font-semibold mb-3">Today's Student List</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Stop</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r,i)=>(
                <TableRow key={i}>
                  <TableCell>{r.n}</TableCell>
                  <TableCell>{r.stop}</TableCell>
                  <TableCell className="font-medium"><Badge variant={r.s === "Onboard" ? "success" : r.s === "Pending" ? "outline" : "default"}>{r.s}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TransportAttendance;


