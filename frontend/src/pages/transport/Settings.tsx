import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, MapPin, CheckSquare, Wrench, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const TransportSettings = () => {
  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/transport/dashboard" },
    { icon: Users, label: "Students", path: "/transport/students" },
    { icon: MapPin, label: "Route", path: "/transport/route" },
    { icon: CheckSquare, label: "Attendance", path: "/transport/attendance" },
    { icon: Wrench, label: "Maintenance", path: "/transport/maintenance" },
    { icon: Settings, label: "Settings", path: "/transport/settings" }
  ];

  const [profile, setProfile] = useState<any | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(()=>{
    (async ()=>{
      try {
        const staff: any[] = await api.get("/staff?status=Active");
        const s = staff?.[0];
        if (!s) return;
        setProfile(s);
        setName(s.name || "");
        setEmail(s.email || "");
      } catch (e) { console.error(e); }
    })();
  }, []);

  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="transport">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <Card className="p-6 hover-lift border-primary/20">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Your name" value={name} onChange={(e)=>{ setName(e.target.value); setSaved(false); }} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e)=>{ setEmail(e.target.value); setSaved(false); }} />
            </div>
            <div className="md:col-span-2">
              <Button onClick={async ()=>{
                try {
                  if (!profile) return;
                  await api.post(`/staff/${profile._id}`, { name, email }, { method: "PUT" as any });
                  setSaved(true);
                } catch (e) { console.error(e); }
              }}>Save Changes</Button>
              {saved && <span className="ml-3 text-sm text-success">Changes saved.</span>}
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TransportSettings;
