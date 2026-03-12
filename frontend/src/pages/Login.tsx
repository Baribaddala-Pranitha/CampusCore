import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import {
  GraduationCap,
  Shield,
  BookOpen,
  Users,
  Building,
  Bus,
  ArrowLeft
} from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const preselectedRole = location.state?.role;
  
  const [selectedRole, setSelectedRole] = useState(preselectedRole || "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const roles = [
    { value: "admin", label: "Admin/Founder", icon: Shield, color: "from-indigo-500 to-purple-600" },
    { value: "teacher", label: "Teacher", icon: GraduationCap, color: "from-blue-500 to-cyan-600" },
    { value: "student", label: "Student", icon: BookOpen, color: "from-green-500 to-emerald-600" },
    { value: "parent", label: "Parent", icon: Users, color: "from-orange-500 to-amber-600" },
    { value: "staff", label: "Staff", icon: Building, color: "from-purple-500 to-pink-600" },
    { value: "transport", label: "Transport", icon: Bus, color: "from-cyan-500 to-blue-600" }
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRole) {
      toast.error("Please select a role");
      return;
    }
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    
    // Simulate authentication
    setTimeout(() => {
      localStorage.setItem("userRole", selectedRole);
      localStorage.setItem("isAuthenticated", "true");
      toast.success("Login successful!");
      
      // Navigate to appropriate dashboard
      navigate(`/${selectedRole}/dashboard`);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-muted/50 to-background p-6">
      <div className="w-full max-w-6xl animate-fade-in">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Role Selection */}
          <div>
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">Welcome Back</h1>
              <p className="text-muted-foreground">Select your role to continue</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {roles.map((role) => (
                <Card
                  key={role.value}
                  className={`p-6 cursor-pointer transition-all hover-lift ${
                    selectedRole === role.value
                      ? "border-2 border-primary shadow-elegant"
                      : "border-2 border-transparent"
                  }`}
                  onClick={() => setSelectedRole(role.value)}
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${role.color} rounded-xl flex items-center justify-center mb-3 mx-auto`}>
                    <role.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-center font-medium">{role.label}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Login Form */}
          <Card className="p-8 shadow-elegant">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Login to EduManage</h2>
                <p className="text-muted-foreground mt-2">
                  {selectedRole ? `Logging in as ${roles.find(r => r.value === selectedRole)?.label}` : "Select a role to continue"}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-muted-foreground">Remember me</span>
                  </label>
                  <a href="#" className="text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full gradient-primary shadow-elegant"
                disabled={isLoading || !selectedRole}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
