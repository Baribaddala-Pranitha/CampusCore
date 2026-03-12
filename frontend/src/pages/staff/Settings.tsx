import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, ClipboardCheck, Calendar, CalendarDays, FileText, Wrench, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const StaffSettings = () => {
  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/staff/dashboard" },
    { icon: ClipboardCheck, label: "My Tasks", path: "/staff/tasks" },
    { icon: Calendar, label: "Attendance", path: "/staff/attendance" },
    { icon: CalendarDays, label: "Leave", path: "/staff/leave" },
    { icon: FileText, label: "Payroll", path: "/staff/payroll" },
    { icon: Wrench, label: "Maintenance", path: "/staff/maintenance" },
    { icon: Settings, label: "Settings", path: "/staff/settings" }
  ];

  const [profile, setProfile] = useState<any | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const staff: any[] = await api.get("/staff?status=Active");
        const s = staff?.[0];
        if (!s) return;
        setProfile(s);
        setName(s.name || "");
        setEmail(s.email || "");
      } catch (e) { console.error(e); }
    }
    load();
  }, []);

  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="staff">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <Card className="p-6 hover-lift border-primary/20">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Your name" value={name} onChange={(e)=>setName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e)=>setEmail(e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <Button onClick={async ()=>{
                if (!profile) return;
                try {
                  await api.post(`/staff/${profile._id}`, { name, email }, { method: "PUT" as any });
                } catch (e) { console.error(e); }
              }}>Save Changes</Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StaffSettings;


