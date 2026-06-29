import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { api } from "@/lib/api";
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

  // States for email verification resend flow
  const [showResend, setShowResend] = useState(false);
  const [resendEmail, setResendEmail] = useState("");
  const [isResending, setIsResending] = useState(false);

  // Check URL query parameters for verified=true status
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("verified") === "true") {
      toast.success("Email verified successfully! You can now log in.");
      navigate(location.pathname, { replace: true });
    } else if (params.get("verified") === "false") {
      toast.error("Email verification failed. The link might be invalid or expired.");
      navigate(location.pathname, { replace: true });
    } else if (params.get("registered") === "true") {
      toast.info("Check your inbox for a verification email before logging in.");
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const roles = [
    { value: "admin", label: "Admin/Founder", icon: Shield, color: "from-indigo-500 to-purple-600" },
    { value: "teacher", label: "Teacher", icon: GraduationCap, color: "from-blue-500 to-cyan-600" },
    { value: "student", label: "Student", icon: BookOpen, color: "from-green-500 to-emerald-600" },
    { value: "parent", label: "Parent", icon: Users, color: "from-orange-500 to-amber-600" },
    { value: "staff", label: "Staff", icon: Building, color: "from-purple-500 to-pink-600" },
    { value: "transport", label: "Transport", icon: Bus, color: "from-cyan-500 to-blue-600" }
  ];

  const handleLogin = async (e: React.FormEvent) => {
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

    try {
      const data = await api.post("/auth/login", { email, password });
      
      // Ensure the logged in user's role matches the selected role
      if (data.user.role !== selectedRole) {
        toast.error(`Invalid credentials for role: ${selectedRole}`);
        setIsLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", data.user.role);
      localStorage.setItem("isAuthenticated", "true");
      toast.success("Login successful!");
      
      // Redirect dynamically based on the role
      navigate(`/${data.user.role}/dashboard`);
    } catch (error: any) {
      console.error("Login API error:", error);
      const errMsg = error.message || "Failed to log in";
      toast.error(errMsg);
      // Show option to resend verification email if relevant
      if (errMsg.toLowerCase().includes("verify your email")) {
        setShowResend(true);
        setResendEmail(email);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail) {
      toast.error("Please enter your email");
      return;
    }

    setIsResending(true);
    try {
      const response = await api.post("/auth/resend-verification", { email: resendEmail });
      toast.success(response.message || "Verification email resent successfully! Check your inbox.");
      setShowResend(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to resend verification email");
    } finally {
      setIsResending(false);
    }
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
                  className={`p-6 cursor-pointer transition-all hover-lift ${selectedRole === role.value
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
                {showResend && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800 animate-fade-in space-y-2">
                    <p className="font-semibold">Account not verified</p>
                    <p>Please verify your email before logging in. Click below to resend the verification link to: <strong>{resendEmail || email}</strong>.</p>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleResend}
                        disabled={isResending}
                        className="bg-white border-amber-300 text-amber-900 hover:bg-amber-100 hover:text-amber-955"
                      >
                        {isResending ? "Resending..." : "Resend Link"}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowResend(false)}
                        className="text-amber-700 hover:bg-amber-100/50"
                      >
                        Dismiss
                      </Button>
                    </div>
                  </div>
                )}
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
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowResend(true);
                        setResendEmail(email || "");
                      }}
                      className="text-primary hover:underline text-xs"
                    >
                      Resend Verification?
                    </button>
                    <span className="text-muted-foreground">|</span>
                    <a href="#" className="text-primary hover:underline text-xs">
                      Forgot password?
                    </a>
                  </div>
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
