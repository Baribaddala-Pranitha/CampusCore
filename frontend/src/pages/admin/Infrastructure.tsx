import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Home,
  Library,
  Beaker,
  Trophy,
  Plus
} from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const InfrastructurePage = () => {
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

  const [facilities, setFacilities] = useState<any[]>([]);
  const [maintenance, setMaintenance] = useState<any[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [newFacility, setNewFacility] = useState<any>({ name: "", category: "Facility", count: 0, capacity: 0, utilization: "0%", status: "Good", color: "from-blue-500 to-cyan-600" });
  const [newRequest, setNewRequest] = useState<any>({ facility: "", issue: "", priority: "Low" });

  const refresh = async () => {
    const [assets, maint] = await Promise.all([
      api.get("/admin/assets").catch(() => []),
      api.get("/admin/maintenance").catch(() => []),
    ]);
    setFacilities(assets);
    setMaintenance(maint);
  };

  useEffect(() => {
    refresh();
  }, []);

  const createFacility = async () => {
    const payload = { ...newFacility, count: Number(newFacility.count), capacity: Number(newFacility.capacity) };
    await api.post("/admin/assets", payload);
    setIsAddOpen(false);
    setNewFacility({ name: "", category: "Facility", count: 0, capacity: 0, utilization: "0%", status: "Good", color: "from-blue-500 to-cyan-600" });
    refresh();
  };

  const createRequest = async () => {
    await api.post("/admin/maintenance", newRequest);
    setIsRequestOpen(false);
    setNewRequest({ facility: "", issue: "", priority: "Low" });
    refresh();
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Infrastructure Management</h1>
            <p className="text-muted-foreground">Manage facilities, assets, and maintenance</p>
          </div>
          <Button className="gradient-primary shadow-elegant" onClick={() => setIsAddOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Facility
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {facilities.map((facility, index) => (
            <Card key={index} className="p-6 hover-lift">
              <div className={`w-12 h-12 bg-gradient-to-br ${facility.color} rounded-xl flex items-center justify-center mb-4`}>
                {/* icon name stored, using generic indicator */}
                <Home className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-1">{facility.count}</h3>
              <p className="text-sm text-muted-foreground mb-3">{facility.name}</p>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Capacity:</span>
                  <span className="font-medium">{facility.capacity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Utilization:</span>
                  <span className="font-medium text-primary">{facility.utilization}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium text-green-600">{facility.status}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Maintenance Requests</h3>
            <Button variant="outline" size="sm" onClick={() => setIsRequestOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Request
            </Button>
          </div>
          <div className="space-y-3">
            {maintenance.map((request, index) => (
              <Card key={index} className="p-4 hover-lift">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold">{request.facility}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        request.priority === "High" ? "bg-red-500/10 text-red-600" :
                        request.priority === "Medium" ? "bg-orange-500/10 text-orange-600" :
                        "bg-blue-500/10 text-blue-600"
                      }`}>
                        {request.priority}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{request.issue}</p>
                    <p className="text-xs text-muted-foreground">Reported: {new Date(request.date).toDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    request.status === "Completed" ? "bg-green-500/10 text-green-600" :
                    request.status === "In Progress" ? "bg-blue-500/10 text-blue-600" :
                    "bg-orange-500/10 text-orange-600"
                  }`}>
                    {request.status}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </div>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Facility</DialogTitle>
          </DialogHeader>
          <div className="grid md:grid-cols-2 gap-3">
            <Input placeholder="Name" value={newFacility.name} onChange={(e) => setNewFacility({ ...newFacility, name: e.target.value })} />
            <Input placeholder="Category" value={newFacility.category} onChange={(e) => setNewFacility({ ...newFacility, category: e.target.value })} />
            <Input placeholder="Count" type="number" value={newFacility.count} onChange={(e) => setNewFacility({ ...newFacility, count: e.target.value })} />
            <Input placeholder="Capacity" type="number" value={newFacility.capacity} onChange={(e) => setNewFacility({ ...newFacility, capacity: e.target.value })} />
            <Input placeholder="Utilization" value={newFacility.utilization} onChange={(e) => setNewFacility({ ...newFacility, utilization: e.target.value })} />
            <Input placeholder="Status" value={newFacility.status} onChange={(e) => setNewFacility({ ...newFacility, status: e.target.value })} />
          </div>
          <DialogFooter>
            <Button onClick={createFacility}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Request Modal */}
      <Dialog open={isRequestOpen} onOpenChange={setIsRequestOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Maintenance Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Facility</label>
              <Input 
                placeholder="Enter facility name" 
                value={newRequest.facility} 
                onChange={(e) => setNewRequest({ ...newRequest, facility: e.target.value })} 
              />
            </div>
            <div>
              <label className="text-sm font-medium">Issue Description</label>
              <Textarea 
                placeholder="Describe the issue..." 
                value={newRequest.issue} 
                onChange={(e) => setNewRequest({ ...newRequest, issue: e.target.value })} 
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Priority</label>
              <Select value={newRequest.priority} onValueChange={(value) => setNewRequest({ ...newRequest, priority: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRequestOpen(false)}>Cancel</Button>
            <Button onClick={createRequest}>Submit Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default InfrastructurePage;
