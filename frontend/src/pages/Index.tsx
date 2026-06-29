import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  GraduationCap,
  Users,
  BookOpen,
  Bus,
  DollarSign,
  Building,
  Shield,
  ChevronRight,
  CheckCircle,
  Star,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const Index = () => {
  const [testimonials, setTestimonials] = useState<any[]>([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await api.get('/testimonials');
        setTestimonials(data);
      } catch (e) {
        console.error('Failed to fetch testimonials:', e);
        // Fallback to dummy data if API fails
        setTestimonials([
          {
            schoolName: "Delhi Public School",
            principalName: "Dr. Rajesh Kumar",
            review: "EduManage has revolutionized how we manage our school. Everything is so streamlined and efficient now!",
            rating: 5
          },
          {
            schoolName: "St. Mary's Convent",
            principalName: "Sister Maria",
            review: "The system has made our administrative tasks so much easier. Highly recommended!",
            rating: 5
          },
          {
            schoolName: "Modern Public School",
            principalName: "Mr. Amit Sharma",
            review: "Excellent platform for school management. Our teachers and parents love it!",
            rating: 5
          }
        ]);
      }
    };
    fetchTestimonials();
  }, []);

  const features = [
    {
      icon: Users,
      title: "Student Management",
      description: "Complete student lifecycle management from admission to graduation"
    },
    {
      icon: GraduationCap,
      title: "Teacher Portal",
      description: "Streamlined tools for educators to manage classes and track progress"
    },
    {
      icon: BookOpen,
      title: "Academic Excellence",
      description: "Comprehensive academic planning, timetables, and curriculum management"
    },
    {
      icon: Bus,
      title: "Transport Management",
      description: "Real-time bus tracking and route optimization for student safety"
    },
    {
      icon: DollarSign,
      title: "Finance & Fees",
      description: "Automated fee collection, payroll, and financial reporting"
    },
    {
      icon: Building,
      title: "Infrastructure",
      description: "Complete facility and asset management for your institution"
    }
  ];

  const portals = [
    { name: "Admin Portal", role: "admin", color: "from-indigo-500 to-purple-600", icon: Shield },
    { name: "Teacher Portal", role: "teacher", color: "from-blue-500 to-cyan-600", icon: GraduationCap },
    { name: "Student Portal", role: "student", color: "from-green-500 to-emerald-600", icon: BookOpen },
    { name: "Parent Portal", role: "parent", color: "from-orange-500 to-amber-600", icon: Users },
    { name: "Staff Portal", role: "staff", color: "from-purple-500 to-pink-600", icon: Building },
    { name: "Transport Portal", role: "transport", color: "from-cyan-500 to-blue-600", icon: Bus }
  ];

  const steps = [
    { step: "1", title: "Register Your School", description: "Quick setup with your institution details" },
    { step: "2", title: "Add Users & Data", description: "Import or manually add students, teachers, and staff" },
    { step: "3", title: "Configure System", description: "Customize workflows, fees, and academic structure" },
    { step: "4", title: "Go Live", description: "Start managing your school operations seamlessly" }
  ];

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img
                src="/Educatin.svg"
                alt="EduManage Logo"
                className="w-30 h-30 object-contain"
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-violet-400 bg-clip-text text-transparent">
                EduManage
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-foreground/70 hover:text-foreground transition-smooth">Features</a>
              <a href="#how-it-works" className="text-foreground/70 hover:text-foreground transition-smooth">How It Works</a>
              <a href="#portals" className="text-foreground/70 hover:text-foreground transition-smooth">Portals</a>
              <Link to="/login">
                <Button variant="outline" className="mr-2">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="gradient-primary shadow-elegant">
                  Sign Up <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 gradient-hero opacity-10"></div>
        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-foreground">
              Transform Your School
              <span className="block text-primary">
                Management System
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-foreground mb-8 max-w-2xl mx-auto">
              All-in-one platform for managing students, teachers, academics, transport, finance, and infrastructure
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button size="lg" className="gradient-primary shadow-elegant text-lg px-8 hover-scale">
                  Get Started <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 hover-lift" onClick={() => {
                const videoUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"; // Replace with your video URL
                window.open(videoUrl, '_blank');
              }}>
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to run a modern educational institution
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-6 hover-lift cursor-pointer border-2 hover:border-primary/50 transition-smooth animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">Get started in minutes</p>
          </div>

          <div className="max-w-4xl mx-auto">
            {steps.map((item, index) => (
              <div key={index} className="flex gap-6 mb-12 last:mb-0 animate-slide-up" style={{ animationDelay: `${index * 0.15}s` }}>
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center text-white font-bold text-xl shadow-elegant">
                    {item.step}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-lg text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portals Section */}
      <section id="portals" className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Access Your Portal</h2>
            <p className="text-xl text-muted-foreground">Role-based access for everyone</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portals.map((portal, index) => (
              <Link to="/login" state={{ role: portal.role }} key={index}>
                <Card className={`p-8 text-center hover-lift cursor-pointer border-2 hover:border-primary/50 transition-smooth animate-scale-in group`}
                  style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className={`w-16 h-16 bg-gradient-to-br ${portal.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-elegant group-hover:scale-110 transition-smooth`}>
                    <portal.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{portal.name}</h3>
                  <p className="text-sm text-muted-foreground">Access your dashboard</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Trusted by Schools</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <Card key={i} className="p-6 hover-lift">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating || 5)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 fill-violet-500 text-violet-500" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "{testimonial.review}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-violet-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {testimonial.principalName?.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.principalName}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.schoolName}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 py-12 border-t">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">EduManage</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Comprehensive school management system for modern institutions
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-smooth">Features</a></li>
                <li><a href="#portals" className="hover:text-foreground transition-smooth">Portals</a></li>
                <li><a href="#" className="hover:text-foreground transition-smooth">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-smooth">About Us</a></li>
                <li><a href="#" className="hover:text-foreground transition-smooth">Contact</a></li>
                <li><a href="#" className="hover:text-foreground transition-smooth">Blog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-smooth">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-smooth">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2025 EduManage. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
