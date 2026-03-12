import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LayoutDashboard, ClipboardCheck, Calendar, CalendarDays, FileText, Wrench, Settings, Edit, Plus, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const StaffMaintenance = () => {
  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/staff/dashboard" },
    { icon: ClipboardCheck, label: "My Tasks", path: "/staff/tasks" },
    { icon: Calendar, label: "Attendance", path: "/staff/attendance" },
    { icon: CalendarDays, label: "Leave", path: "/staff/leave" },
    { icon: FileText, label: "Payroll", path: "/staff/payroll" },
    { icon: Wrench, label: "Maintenance", path: "/staff/maintenance" },
    { icon: Settings, label: "Settings", path: "/staff/settings" }
  ];

  const [maint, setMaint] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState<any | null>(null);
  const [updateForm, setUpdateForm] = useState({
    status: "",
    notes: "",
    completedBy: ""
  });

  useEffect(() => {
    async function load() {
      try {
        const staff: any[] = await api.get("/staff?status=Active");
        const s = staff?.[0];
        if (!s) return;
        const items = await api.get(`/staff/${s._id}/maintenance`);
        setMaint(items.map((r:any) => ({ 
          id: r._id,
          t: `${r.facility} - ${r.issue}`, 
          p: r.priority, 
          s: r.status,
          facility: r.facility,
          issue: r.issue,
          date: r.date,
          notes: r.notes || ""
        })));
        setInventory([{ i: "Whiteboard markers", q: 12 }, { i: "Basketballs", q: 6 }]);
      } catch (e) { console.error(e); }
    }
    load();
  }, []);

  const handleUpdateMaintenance = async () => {
    try {
      if (!selectedMaintenance) return;
      await api.post(`/admin/maintenance/${selectedMaintenance.id}`, {
        status: updateForm.status,
        notes: updateForm.notes,
        completedBy: updateForm.completedBy
      }, { method: "PUT" as any });
      
      // Refresh the maintenance list
      const staff: any[] = await api.get("/staff?status=Active");
      const s = staff?.[0];
      if (s) {
        const items = await api.get(`/staff/${s._id}/maintenance`);
        setMaint(items.map((r:any) => ({ 
          id: r._id,
          t: `${r.facility} - ${r.issue}`, 
          p: r.priority, 
          s: r.status,
          facility: r.facility,
          issue: r.issue,
          date: r.date,
          notes: r.notes || ""
        })));
      }
      
      setIsUpdateModalOpen(false);
      setSelectedMaintenance(null);
      setUpdateForm({ status: "", notes: "", completedBy: "" });
    } catch (e) { 
      console.error(e); 
    }
  };

  const handleOpenUpdateModal = (maintenance: any) => {
    setSelectedMaintenance(maintenance);
    setUpdateForm({
      status: maintenance.s,
      notes: maintenance.notes || "",
      completedBy: ""
    });
    setIsUpdateModalOpen(true);
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="staff">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Maintenance & Inventory Tasks</h1>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 hover-lift border-primary/20">
            <h3 className="font-semibold mb-3">Assigned Maintenance</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {maint.map((r,i)=>(
                  <TableRow key={i}>
                    <TableCell>{r.t}</TableCell>
                    <TableCell><Badge variant={r.p === "High" ? "destructive" : r.p === "Medium" ? "default" : "outline"}>{r.p}</Badge></TableCell>
                    <TableCell className="font-medium"><Badge variant={r.s === "Completed" ? "success" : r.s === "In Progress" ? "default" : "outline"}>{r.s}</Badge></TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleOpenUpdateModal(r)}
                        disabled={r.s === "Completed"}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Update
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
          <Card className="p-6 hover-lift border-primary/20">
            <h3 className="font-semibold mb-3">Inventory Tasks</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventory.map((r,i)=>(
                  <TableRow key={i}>
                    <TableCell>{r.i}</TableCell>
                    <TableCell>{r.q}</TableCell>
                    <TableCell><Button size="sm" variant="outline">Request</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* Update Maintenance Modal */}
        <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Maintenance Request</DialogTitle>
            </DialogHeader>
            {selectedMaintenance && (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Maintenance Details:</h4>
                  <p className="text-sm"><strong>Facility:</strong> {selectedMaintenance.facility}</p>
                  <p className="text-sm"><strong>Issue:</strong> {selectedMaintenance.issue}</p>
                  <p className="text-sm"><strong>Priority:</strong> {selectedMaintenance.p}</p>
                  <p className="text-sm"><strong>Date:</strong> {new Date(selectedMaintenance.date).toLocaleDateString()}</p>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <Select value={updateForm.status} onValueChange={(value) => setUpdateForm({ ...updateForm, status: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Completed By</label>
                    <Input 
                      placeholder="Enter your name" 
                      value={updateForm.completedBy} 
                      onChange={(e) => setUpdateForm({ ...updateForm, completedBy: e.target.value })} 
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Notes</label>
                    <Textarea 
                      placeholder="Add any notes or comments..." 
                      value={updateForm.notes} 
                      onChange={(e) => setUpdateForm({ ...updateForm, notes: e.target.value })} 
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUpdateModalOpen(false)}>Cancel</Button>
              <Button onClick={handleUpdateMaintenance}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Update Status
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default StaffMaintenance;


