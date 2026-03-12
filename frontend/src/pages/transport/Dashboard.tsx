import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { LayoutDashboard, Users, MapPin, CheckSquare, Wrench, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const TransportDashboard = () => {
  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/transport/dashboard" },
    { icon: Users, label: "Students", path: "/transport/students" },
    { icon: MapPin, label: "Route", path: "/transport/route" },
    { icon: CheckSquare, label: "Attendance", path: "/transport/attendance" },
    { icon: Wrench, label: "Maintenance", path: "/transport/maintenance" },
    { icon: Settings, label: "Settings", path: "/transport/settings" }
  ];

  const [bus, setBus] = useState<any | null>(null);
  const [stops, setStops] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const stats = await api.get("/admin/transport/stats");
        const list = await api.get("/admin/transport/buses");
        const b = list?.[0];
        setBus(b);
        if (b) {
          const s = await api.get(`/admin/transport/buses/${b._id}/stops`);
          setStops(s);
        }
      } catch (e) { console.error(e); }
    }
    load();
  }, []);

  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="transport">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-black">
          Transport Dashboard
        </h1>
        <p className="text-muted-foreground">
          Manage your bus route and student attendance
        </p>

        {/* Stats section */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 hover-lift">
            <h3 className="text-2xl font-bold mb-2">{bus?.number || "Bus --"}</h3>
            <p className="text-muted-foreground">Assigned Bus</p>
          </Card>
          <Card className="p-6 hover-lift">
            <h3 className="text-2xl font-bold mb-2">{bus?.students || 0}</h3>
            <p className="text-muted-foreground">Students Today</p>
          </Card>
          <Card className="p-6 hover-lift">
            <h3 className="text-2xl font-bold mb-2">{stops.length}</h3>
            <p className="text-muted-foreground">Stops</p>
          </Card>
        </div>

        {/* Quick links section */}
        <Card className="p-6 hover-lift border-primary/20">
          <h3 className="font-semibold mb-4">Quick Links</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
            <a className="inline-flex items-center justify-center h-10 rounded-md border bg-background hover:bg-accent px-4 text-sm font-medium transition-smooth" href="/transport/attendance">Bus Attendance</a>
            <a className="inline-flex items-center justify-center h-10 rounded-md border bg-background hover:bg-accent px-4 text-sm font-medium transition-smooth" href="/transport/students">Student List</a>
            <a className="inline-flex items-center justify-center h-10 rounded-md border bg-background hover:bg-accent px-4 text-sm font-medium transition-smooth" href="/transport/route">Route Details</a>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TransportDashboard;
