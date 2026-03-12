import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LayoutDashboard, Users, MapPin, CheckSquare, Wrench, Settings, MessageSquare, Edit, Trash2, Plus, Bus } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const TransportStudents = () => {
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
  const [stops, setStops] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", eta: "", students: 0 });
  const [editingStop, setEditingStop] = useState<any | null>(null);
  const [messageModal, setMessageModal] = useState<any | null>(null);
  const [messageForm, setMessageForm] = useState({ subject: "", message: "" });
  const [onBoardStatus, setOnBoardStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function load() {
      try {
        const list = await api.get("/admin/transport/buses");
        const b = list?.[0];
        if (!b) return;
        setBus(b);
        const stops = await api.get(`/admin/transport/buses/${b._id}/stops`);
        const students: any[] = await api.get(`/admin/students?status=Active`);
        const mapped = students.slice(0, 20).map((s: any, idx: number) => ({ 
          id: s._id, 
          n: s.name, 
          c: s.className, 
          stop: stops[idx % stops.length]?.name || "-", 
          g: "-",
          onBoard: false
        }));
        setRows(mapped);
        setStops(stops);
      } catch (e) { console.error(e); }
    }
    load();
  }, []);

  const handleSaveStop = async () => {
    try {
      if (!bus) return;
      if (editingStop) {
        // Update existing stop
        await api.post(`/admin/transport/stops/${editingStop._id}`, { 
          name: form.name, 
          eta: form.eta, 
          students: form.students 
        }, { method: "PUT" as any });
      } else {
        // Create new stop
        await api.post(`/admin/transport/buses/${bus._id}/stops`, { 
          name: form.name, 
          eta: form.eta, 
          students: form.students, 
          order: (stops[stops.length-1]?.order||0)+1 
        });
      }
      const s = await api.get(`/admin/transport/buses/${bus._id}/stops`);
      setStops(s);
      setOpen(false);
      setEditingStop(null);
      setForm({ name: "", eta: "", students: 0 });
    } catch (e) { 
      console.error(e); 
    }
  };

  const handleDeleteStop = async (stopId: string) => {
    try {
      await api.post(`/admin/transport/stops/${stopId}`, {}, { method: "DELETE" as any });
      const s = await api.get(`/admin/transport/buses/${bus?._id}/stops`);
      setStops(s);
    } catch (e) { 
      console.error(e); 
    }
  };

  const handleEditStop = (stop: any) => {
    setEditingStop(stop);
    setForm({ name: stop.name, eta: stop.eta, students: stop.students });
    setOpen(true);
  };

  const handleMessage = (student: any) => {
    setMessageModal(student);
    setMessageForm({ subject: "", message: "" });
  };

  const handleSendMessage = async () => {
    try {
      await api.post('/admin/messages', {
        from: 'Transport Department',
        to: messageModal.n,
        subject: messageForm.subject,
        body: messageForm.message
      });
      setMessageModal(null);
      setMessageForm({ subject: "", message: "" });
    } catch (e) { 
      console.error(e); 
    }
  };

  const handleMarkOnBoard = async (studentId: string) => {
    try {
      const isOnBoard = onBoardStatus[studentId] || false;
      // Fallback: we will just flip locally; attendance marking is done on Attendance page
      setOnBoardStatus(prev => ({
        ...prev,
        [studentId]: !isOnBoard
      }));
    } catch (e) { 
      console.error(e); 
    }
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="transport">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Student List</h1>
        <Card className="p-6 hover-lift border-primary/20">
          <p className="text-muted-foreground mb-3">Assigned students for your route</p>
          <div className="mb-3 flex justify-between">
            <div className="flex gap-2">
              <Button size="sm" onClick={()=>{ setEditingStop(null); setForm({ name: "", eta: "", students: 0 }); setOpen(true); }}>
                <Plus className="w-4 h-4 mr-1" />
                Add Stop
              </Button>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Stop</TableHead>
                <TableHead>Guardian</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r,i)=>(
                <TableRow key={i}>
                  <TableCell>{r.n}</TableCell>
                  <TableCell>{r.c}</TableCell>
                  <TableCell>{r.stop}</TableCell>
                  <TableCell>{r.g}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      onBoardStatus[r.id] ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                    }`}>
                      {onBoardStatus[r.id] ? "On Board" : "Not On Board"}
                    </span>
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleMessage(r)}>
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Message
                    </Button>
                    <Button 
                      size="sm" 
                      variant={onBoardStatus[r.id] ? "destructive" : "default"}
                      onClick={() => handleMarkOnBoard(r.id)}
                    >
                      <Bus className="w-4 h-4 mr-1" />
                      {onBoardStatus[r.id] ? "Mark Off Board" : "Mark On Board"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Stops Management */}
        <Card className="p-6 hover-lift border-primary/20">
          <h3 className="font-semibold text-lg mb-4">Route Stops</h3>
          <div className="space-y-2">
            {stops.map((stop: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{stop.name}</p>
                    <p className="text-sm text-muted-foreground">ETA: {stop.eta} | Students: {stop.students}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEditStop(stop)}>
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDeleteStop(stop._id)}>
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingStop ? "Edit Route Stop" : "Add Route Stop"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Stop name" value={form.name} onChange={(e)=>setForm({ ...form, name: e.target.value })} />
              <Input placeholder="ETA (e.g. 08:05)" value={form.eta} onChange={(e)=>setForm({ ...form, eta: e.target.value })} />
              <Input placeholder="Students count" type="number" value={form.students as any} onChange={(e)=>setForm({ ...form, students: Number(e.target.value||0) })} />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={()=>{ setOpen(false); setEditingStop(null); setForm({ name: "", eta: "", students: 0 }); }}>Cancel</Button>
              <Button onClick={handleSaveStop}>
                {editingStop ? "Update" : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Message Modal */}
        <Dialog open={!!messageModal} onOpenChange={(o) => !o && setMessageModal(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Message to {messageModal?.n}</DialogTitle>
            </DialogHeader>
            <p id="message-desc" className="sr-only">Send a message to the selected student's guardian</p>
            <div className="space-y-3">
              <Input 
                placeholder="Subject" 
                value={messageForm.subject} 
                onChange={(e)=>setMessageForm({ ...messageForm, subject: e.target.value })} 
              />
              <Textarea 
                placeholder="Message content" 
                value={messageForm.message} 
                onChange={(e)=>setMessageForm({ ...messageForm, message: e.target.value })} 
                rows={4}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setMessageModal(null)}>Cancel</Button>
              <Button onClick={handleSendMessage}>Send Message</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default TransportStudents;


