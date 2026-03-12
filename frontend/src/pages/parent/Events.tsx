import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  LayoutDashboard,
  Users,
  FileText,
  DollarSign,
  Calendar as CalendarIcon,
  Bell,
  MessageSquare,
  Settings,
  Clock,
  MapPin
} from "lucide-react";

const ParentEvents = () => {
  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/parent/dashboard" },
    { icon: Users, label: "My Children", path: "/parent/children" },
    { icon: FileText, label: "Academic Reports", path: "/parent/reports" },
    { icon: DollarSign, label: "Fee Payments", path: "/parent/fees" },
    { icon: CalendarIcon, label: "Events", path: "/parent/events" },
    { icon: Bell, label: "Notifications", path: "/parent/notifications" },
    { icon: MessageSquare, label: "Communication", path: "/parent/communication" },
    { icon: Settings, label: "Settings", path: "/parent/settings" }
  ];

  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const parents: any[] = await api.get("/parents");
        const p = parents?.[0];
        if (!p) return setLoading(false);
        const res = await api.get(`/parents/${p._id}/events`);
        setEvents(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="parent">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-black">
            School Events
          </h1>
          <p className="text-muted-foreground">Stay updated with school activities and events</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 hover-lift gradient-primary text-white">
            <CalendarIcon className="h-8 w-8 mb-2" />
            <h3 className="text-2xl font-bold mb-2">{events.length}</h3>
            <p className="text-white/90">Upcoming Events</p>
          </Card>
          <Card className="p-6 hover-lift">
            <Bell className="h-8 w-8 mb-2 text-primary" />
            <h3 className="text-2xl font-bold mb-2">2</h3>
            <p className="text-muted-foreground">Events This Week</p>
          </Card>
          <Card className="p-6 hover-lift">
            <Users className="h-8 w-8 mb-2 text-success" />
            <h3 className="text-2xl font-bold mb-2">5</h3>
            <p className="text-muted-foreground">Events Attended</p>
          </Card>
        </div>

        <div className="space-y-4">
          {loading && <Card className="p-6">Loading events...</Card>}
          {!loading && events.map((event, index) => (
            <Card key={index} className="p-6 shadow-elegant hover-lift">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-muted-foreground">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      <span>{new Date(event.date).toDateString()}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    {event.type}
                  </span>
                  <Button className="shadow-elegant">RSVP</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6 shadow-elegant">
          <h3 className="font-semibold text-lg mb-6">Past Events</h3>
          <div className="space-y-3">
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">Sports Day 2024</p>
                  <p className="text-sm text-muted-foreground">November 25, 2024</p>
                </div>
                <span className="px-3 py-1 bg-success/10 text-success rounded-full text-sm font-medium">
                  Attended
                </span>
              </div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">Diwali Celebration</p>
                  <p className="text-sm text-muted-foreground">November 12, 2024</p>
                </div>
                <span className="px-3 py-1 bg-success/10 text-success rounded-full text-sm font-medium">
                  Attended
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ParentEvents;
