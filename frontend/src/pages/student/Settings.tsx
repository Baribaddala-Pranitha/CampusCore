import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Calendar,
  DollarSign,
  Bus,
  MessageSquare,
  Settings as SettingsIcon,
  User,
  Bell,
  Lock,
  Save
} from "lucide-react";

const StudentSettings = () => {
  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/student/dashboard" },
    { icon: Calendar, label: "Timetable", path: "/student/timetable" },
    { icon: BookOpen, label: "Assignments", path: "/student/assignments" },
    { icon: FileText, label: "Grades & Reports", path: "/student/grades" },
    { icon: DollarSign, label: "Fees", path: "/student/fees" },
    { icon: Bus, label: "Transport", path: "/student/transport" },
    { icon: MessageSquare, label: "Communication", path: "/student/communication" },
    { icon: SettingsIcon, label: "Settings", path: "/student/settings" }
  ];

  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="student">
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
              <Input defaultValue="John Smith" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Student ID</label>
              <Input defaultValue="STU-2024-1234" disabled />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Email</label>
              <Input defaultValue="john.smith@school.edu" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Phone Number</label>
              <Input defaultValue="+91 98765 43210" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Class</label>
              <Input defaultValue="10th Grade - Section A" disabled />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Roll Number</label>
              <Input defaultValue="15" disabled />
            </div>
          </div>
          <Button className="mt-6 shadow-elegant">
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
                <p className="font-medium">Assignment Notifications</p>
                <p className="text-sm text-muted-foreground">Get notified about new assignments</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="font-medium">Grade Updates</p>
                <p className="text-sm text-muted-foreground">Receive notifications when grades are posted</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="font-medium">Transport Alerts</p>
                <p className="text-sm text-muted-foreground">Bus arrival and delay notifications</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="font-medium">Fee Reminders</p>
                <p className="text-sm text-muted-foreground">Payment due date reminders</p>
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
              <Input type="password" placeholder="Enter current password" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">New Password</label>
              <Input type="password" placeholder="Enter new password" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Confirm New Password</label>
              <Input type="password" placeholder="Confirm new password" />
            </div>
            <Button className="shadow-elegant">
              Update Password
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentSettings;
