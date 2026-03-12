import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Calendar,
  DollarSign,
  Bus,
  MessageSquare,
  Settings,
  MapPin,
  Clock,
  User
} from "lucide-react";

const StudentTransport = () => {
  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/student/dashboard" },
    { icon: Calendar, label: "Timetable", path: "/student/timetable" },
    { icon: BookOpen, label: "Assignments", path: "/student/assignments" },
    { icon: FileText, label: "Grades & Reports", path: "/student/grades" },
    { icon: DollarSign, label: "Fees", path: "/student/fees" },
    { icon: Bus, label: "Transport", path: "/student/transport" },
    { icon: MessageSquare, label: "Communication", path: "/student/communication" },
    { icon: Settings, label: "Settings", path: "/student/settings" }
  ];

  const [buses, setBuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const students: any[] = await api.get("/admin/students?status=Active");
        const s = students?.[0];
        if (!s) return setLoading(false);
        const res = await api.get(`/admin/students/${s._id}/transport`);
        setBuses(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-black">
            Transport Information
          </h1>
          <p className="text-muted-foreground">Track your school bus and route details</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 hover-lift gradient-primary text-white">
            <Bus className="h-8 w-8 mb-2" />
            <h3 className="text-2xl font-bold mb-2">{buses[0]?.number || "Bus --"}</h3>
            <p className="text-white/90">Assigned Bus</p>
          </Card>
          <Card className="p-6 hover-lift">
            <Clock className="h-8 w-8 mb-2 text-primary" />
            <h3 className="text-2xl font-bold mb-2">7:30 AM</h3>
            <p className="text-muted-foreground">Pickup Time</p>
          </Card>
          <Card className="p-6 hover-lift">
            <MapPin className="h-8 w-8 mb-2 text-destructive" />
            <h3 className="text-2xl font-bold mb-2">15 mins</h3>
            <p className="text-muted-foreground">Est. Arrival Time</p>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 shadow-elegant">
            <h3 className="font-semibold text-lg mb-6">Driver Information</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-lg">Mr. Rajesh Kumar</p>
                  <p className="text-sm text-muted-foreground">Bus Driver</p>
                </div>
              </div>
              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Experience:</span>
                  <span className="font-semibold">15 years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">License No:</span>
                  <span className="font-semibold">DL-12345678</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contact:</span>
                  <span className="font-semibold">+91 98765 43210</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-elegant">
            <h3 className="font-semibold text-lg mb-6">Bus Details</h3>
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Bus Number:</span>
                  <span className="font-semibold">DL-01-AB-1234</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Capacity:</span>
                  <span className="font-semibold">45 Students</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Model:</span>
                  <span className="font-semibold">Ashok Leyland 2023</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">GPS Tracking:</span>
                  <span className="font-semibold text-success">Active</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6 shadow-elegant">
          <h3 className="font-semibold text-lg mb-6">Route & Stops</h3>
          <div className="space-y-4">
            {loading && <p className="text-muted-foreground">Loading transport info...</p>}
            {!loading && (buses[0]?.route ? (
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full flex items-center justify-center bg-primary/20 text-primary">
                  <MapPin className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{buses[0].route}</p>
                      <p className="text-sm text-muted-foreground">Driver: {buses[0].driver}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${buses[0].status === "Active" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
                      {buses[0].status}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No route assigned.</p>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentTransport;
