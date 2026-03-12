import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { LayoutDashboard, Users, MapPin, CheckSquare, Wrench, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const TransportRoute = () => {
  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/transport/dashboard" },
    { icon: Users, label: "Students", path: "/transport/students" },
    { icon: MapPin, label: "Route", path: "/transport/route" },
    { icon: CheckSquare, label: "Attendance", path: "/transport/attendance" },
    { icon: Wrench, label: "Maintenance", path: "/transport/maintenance" },
    { icon: Settings, label: "Settings", path: "/transport/settings" }
  ];

  const [stops, setStops] = useState<any[]>([]);
  const [bus, setBus] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<{ id?: string; name: string; eta: string; students: number }>({ name: "", eta: "", students: 0 });

  useEffect(() => {
    async function load() {
      try {
        const list = await api.get("/admin/transport/buses");
        const b = list?.[0];
        if (!b) return;
        setBus(b);
        const s = await api.get(`/admin/transport/buses/${b._id}/stops`);
        setStops(s);
      } catch (e) { console.error(e); }
    }
    load();
  }, []);

  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="transport">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Route</h1>
        <Card className="p-6 hover-lift border-primary/20">
          <p className="text-muted-foreground mb-3">Route and stops overview</p>
          <div className="mb-3 flex justify-end">
            <Button size="sm" onClick={()=>{ setForm({ name: "", eta: "", students: 0 }); setOpen(true); }}>Add Stop</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Stop</TableHead>
                <TableHead>ETA</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stops.map((r:any,i)=>(
                <TableRow key={i}>
                  <TableCell>{r.name}</TableCell>
                  <TableCell>{r.eta}</TableCell>
                  <TableCell>{r.students}</TableCell>
                  <TableCell className="space-x-2">
                    <Button size="sm" variant="outline" onClick={()=>{ setForm({ id: r._id, name: r.name, eta: r.eta, students: r.students }); setOpen(true); }}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={async ()=>{
                      if (!r._id) return;
                      await api.post(`/admin/transport/stops/${r._id}`, {}, { method: "DELETE" as any });
                      const s = await api.get(`/admin/transport/buses/${bus._id}/stops`);
                      setStops(s);
                    }}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{form.id ? "Edit Stop" : "Add Stop"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Stop name" value={form.name} onChange={(e)=>setForm({ ...form, name: e.target.value })} />
              <Input placeholder="ETA (e.g. 08:05)" value={form.eta} onChange={(e)=>setForm({ ...form, eta: e.target.value })} />
              <Input placeholder="Students count" type="number" value={form.students as any} onChange={(e)=>setForm({ ...form, students: Number(e.target.value||0) })} />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={()=>setOpen(false)}>Cancel</Button>
                <Button onClick={async ()=>{
                  try {
                    if (!bus) return;
                    if (form.id) {
                      await api.post(`/admin/transport/stops/${form.id}`, { name: form.name, eta: form.eta, students: form.students }, { method: "PUT" as any });
                    } else {
                      await api.post(`/admin/transport/buses/${bus._id}/stops`, { name: form.name, eta: form.eta, students: form.students, order: (stops[stops.length-1]?.order||0)+1 });
                    }
                    const s = await api.get(`/admin/transport/buses/${bus._id}/stops`);
                    setStops(s);
                    setOpen(false);
                  } catch (e) { console.error(e); }
                }}>{form.id ? "Update" : "Save"}</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default TransportRoute;


