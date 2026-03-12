import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  LayoutDashboard,
  Users,
  FileText,
  DollarSign,
  Calendar,
  Bell,
  MessageSquare,
  Settings as SettingsIcon,
  User,
  Lock,
  Save
} from "lucide-react";

const ParentSettings = () => {
  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/parent/dashboard" },
    { icon: Users, label: "My Children", path: "/parent/children" },
    { icon: FileText, label: "Academic Reports", path: "/parent/reports" },
    { icon: DollarSign, label: "Fee Payments", path: "/parent/fees" },
    { icon: Calendar, label: "Events", path: "/parent/events" },
    { icon: Bell, label: "Notifications", path: "/parent/notifications" },
    { icon: MessageSquare, label: "Communication", path: "/parent/communication" },
    { icon: SettingsIcon, label: "Settings", path: "/parent/settings" }
  ];

  const [profile, setProfile] = useState<any>({ name: "", email: "", phone: "", address: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const parents: any[] = await api.get("/parents");
        const p = parents?.[0];
        if (!p) return;
        const data = await api.get(`/parents/${p._id}/profile`);
        setProfile({ name: data.name || "", email: data.email || "", phone: data.phone || "", address: data.address || "" });
      } catch (e) { console.error(e); }
    })();
  }, []);

  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="parent">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-black">
            Settings
          </h1>
          <p className="text-muted-foreground">Manage your account preferences</p>
        </div>

        <Card className="p-6 shadow-elegant">
          <div className="flex items-center space-x-3 mb-6">
            <User className="h-6 w-6 text-primary" />
            <h3 className="font-semibold text-lg">Profile Information</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Full Name</label>
              <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Email</label>
              <Input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Phone Number</label>
              <Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Relationship</label>
              <Input placeholder="Father/Mother/Guardian" />
            </div>
          </div>
          <Button className="mt-6 shadow-elegant" disabled={saving} onClick={async () => {
            try {
              setSaving(true);
              const parents: any[] = await api.get("/parents");
              const p = parents?.[0];
              if (!p) return;
              await api.post(`/parents/${p._id}/profile`, profile, { method: "PUT" as any });
            } catch (e) { console.error(e); } finally { setSaving(false); }
          }}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </Card>

        <Card className="p-6 shadow-elegant">
          <div className="flex items-center space-x-3 mb-6">
            <Bell className="h-6 w-6 text-primary" />
            <h3 className="font-semibold text-lg">Notification Preferences</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="font-medium">Grade Updates</p>
                <p className="text-sm text-muted-foreground">Get notified when grades are published</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="font-medium">Fee Reminders</p>
                <p className="text-sm text-muted-foreground">Payment due date notifications</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="font-medium">Event Notifications</p>
                <p className="text-sm text-muted-foreground">Updates about school events</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="font-medium">Attendance Alerts</p>
                <p className="text-sm text-muted-foreground">Get notified about attendance issues</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>

        <Card className="p-6 shadow-elegant">
          <div className="flex items-center space-x-3 mb-6">
            <Lock className="h-6 w-6 text-primary" />
            <h3 className="font-semibold text-lg">Change Password</h3>
          </div>
          <div className="space-y-4 max-w-md">
            <div>
              <label className="text-sm font-medium mb-2 block">Current Password</label>
              <Input id="currentPassword" type="password" placeholder="Enter current password" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">New Password</label>
              <Input id="newPassword" type="password" placeholder="Enter new password" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Confirm New Password</label>
              <Input id="confirmPassword" type="password" placeholder="Confirm new password" />
            </div>
            <Button className="shadow-elegant" onClick={async () => {
              try {
                const current = (document.getElementById("currentPassword") as HTMLInputElement)?.value;
                const next = (document.getElementById("newPassword") as HTMLInputElement)?.value;
                const confirm = (document.getElementById("confirmPassword") as HTMLInputElement)?.value;
                if (!next || next !== confirm) return;
                await api.post(`/settings/change-password`, { current, next });
              } catch (e) { console.error(e); }
            }}>
              Update Password
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ParentSettings;
