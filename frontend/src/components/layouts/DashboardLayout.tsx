import { useState, ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Menu,
  X,
  Bell,
  Settings,
  LogOut,
  User
} from "lucide-react";
import { toast } from "sonner";

interface DashboardLayoutProps {
  children: ReactNode;
  sidebarItems: Array<{
    icon: any;
    label: string;
    path: string;
  }>;
  userRole: string;
}

const DashboardLayout = ({ children, sidebarItems, userRole }: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const getSidebarColor = () => {
    // Allow override for admin color via localStorage if provided
    if (userRole === "admin") {
      const override = localStorage.getItem("adminSidebarColor");
      if (override) return override;
    }
    // Map portal to brand color (aligned with logo gradients)
    switch (userRole) {
      case "admin":
        return "var(--gradient-primary)"; // match Generate Report gradient
      case "teacher":
        return "#0ea5e9"; // blue/cyan
      case "student":
        return "#10b981"; // green
      case "parent":
        return "#f59e0b"; // orange/amber
      case "staff":
        return "#a855f7"; // purple
      case "transport":
        return "#06b6d4"; // cyan
      default:
        return "hsl(262 83% 58%)";
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("isAuthenticated");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background portal-theme" style={{ ['--portal-accent' as any]: getSidebarColor() }}>
      {/* Top Bar */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-lg">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold hidden md:block">EduManage</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => navigate(`/${userRole}/notifications`)}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full"></span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => navigate(`/${userRole}/settings`)}>
              <Settings className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          style={{ background: getSidebarColor() }}
          className={`fixed md:sticky top-16 left-0 h-[calc(100vh-4rem)] border-r transition-all duration-300 z-30 shadow-lg ${
            isSidebarOpen ? "w-64" : "w-0 md:w-16"
          } overflow-hidden`}
        >
          <div className="p-4">
            {/* User Info */}
            <div className={`flex items-center gap-3 p-3 mb-6 bg-white/10 rounded-lg border border-white/20 ${!isSidebarOpen && "md:justify-center"}`}>
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-white" />
              </div>
              {isSidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate capitalize text-white">{userRole} User</p>
                  <p className="text-xs text-white/70 truncate">user@school.com</p>
                </div>
              )}
            </div>

            {/* Navigation Items */}
            <nav className="space-y-2">
              {sidebarItems.map((item, index) => (
                <Link key={index} to={item.path}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start gap-3 text-white/80 hover:bg-white/10 hover:text-white ${
                      !isSidebarOpen && "md:justify-center md:px-2"
                    }`}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {isSidebarOpen && <span>{item.label}</span>}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
