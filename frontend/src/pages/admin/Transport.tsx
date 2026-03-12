import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
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
  MapPin,
  Wrench,
  AlertCircle,
  Plus
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const TransportPage = () => {
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

  const [buses, setBuses] = useState<any[]>([]);
  const [stats, setStats] = useState<any | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newBus, setNewBus] = useState<any>({ number: "", route: "", students: 0, driver: "", status: "Active", maintenance: "Good" });
  const [details, setDetails] = useState<any | null>(null);

  const refresh = async () => {
    const [list, s] = await Promise.all([
      api.get("/admin/transport/buses").catch(() => []),
      api.get("/admin/transport/stats").catch(() => null),
    ]);
    setBuses(list);
    if (s) setStats(s);
  };

  useEffect(() => {
    refresh();
  }, []);

  const createBus = async () => {
    const payload = { ...newBus, students: Number(newBus.students) };
    await api.post("/admin/transport/buses", payload);
    setIsAddOpen(false);
    setNewBus({ number: "", route: "", students: 0, driver: "", status: "Active", maintenance: "Good" });
    refresh();
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Transport Management</h1>
            <p className="text-muted-foreground">Manage buses, routes, and transport staff</p>
          </div>
          <Button className="gradient-primary shadow-elegant" onClick={() => setIsAddOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Bus
          </Button>
        </div>

        {stats && (
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="p-6 hover-lift">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-3">
                <Bus className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-1">{stats.totalBuses}</h3>
              <p className="text-sm text-muted-foreground">Total Buses</p>
            </Card>
            <Card className="p-6 hover-lift">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-3">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-1">{stats.activeRoutes}</h3>
              <p className="text-sm text-muted-foreground">Active Routes</p>
            </Card>
            <Card className="p-6 hover-lift">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mb-3">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-1">—</h3>
              <p className="text-sm text-muted-foreground">Students Using Transport</p>
            </Card>
            <Card className="p-6 hover-lift">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center mb-3">
                <Wrench className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-1">{stats.maintenanceDue}</h3>
              <p className="text-sm text-muted-foreground">Maintenance Due</p>
            </Card>
          </div>
        )}

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Bus Fleet Overview</h3>
          <div className="space-y-4">
            {buses.map((bus, index) => (
              <Card key={index} className="p-6 hover-lift">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
                      <Bus className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold">{bus.number}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          bus.status === "Active" ? "bg-green-500/10 text-green-600" : "bg-orange-500/10 text-orange-600"
                        }`}>
                          {bus.status}
                        </span>
                        {bus.maintenance === "Due" && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Maintenance Due
                          </span>
                        )}
                      </div>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <p className="text-muted-foreground">
                          <MapPin className="w-3 h-3 inline mr-1" />
                          {bus.route}
                        </p>
                        <p className="text-muted-foreground">
                          <Users className="w-3 h-3 inline mr-1" />
                          {bus.students} Students
                        </p>
                        <p className="text-muted-foreground">
                          Driver: {bus.driver}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setDetails(bus)}>Details</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </div>

      {/* Add Bus Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Bus</DialogTitle>
          </DialogHeader>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Bus Number</label>
              <Input placeholder="Enter Bus Number" value={newBus.number} onChange={(e) => setNewBus({ ...newBus, number: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Route</label>
              <Input placeholder="Enter Route" value={newBus.route} onChange={(e) => setNewBus({ ...newBus, route: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Students Count</label>
              <Input placeholder="Enter Number of Students" type="number" value={newBus.students} onChange={(e) => setNewBus({ ...newBus, students: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Driver Name</label>
              <Input placeholder="Enter Driver Name" value={newBus.driver} onChange={(e) => setNewBus({ ...newBus, driver: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Input placeholder="Enter Status" value={newBus.status} onChange={(e) => setNewBus({ ...newBus, status: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Maintenance Status</label>
              <Input placeholder="Enter Maintenance Status" value={newBus.maintenance} onChange={(e) => setNewBus({ ...newBus, maintenance: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={createBus}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Modal */}
      <Dialog open={!!details} onOpenChange={(o) => !o && setDetails(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bus Details</DialogTitle>
          </DialogHeader>
          {details && (
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Number:</span> {details.number}</p>
              <p><span className="font-medium">Route:</span> {details.route}</p>
              <p><span className="font-medium">Students:</span> {details.students}</p>
              <p><span className="font-medium">Driver:</span> {details.driver}</p>
              <p><span className="font-medium">Status:</span> {details.status}</p>
              <p><span className="font-medium">Maintenance:</span> {details.maintenance}</p>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setDetails(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </DashboardLayout>
  );
};

export default TransportPage;
