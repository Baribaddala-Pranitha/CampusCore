import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Bus,
  DollarSign,
  Building,
  FileText,
  Calendar,
  MessageSquare,
  Settings,
  Plus,
  MapPin,
  Clock
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const EventsPage = () => {
  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
    { icon: Users, label: "Students", path: "/admin/students" },
    { icon: GraduationCap, label: "Teachers", path: "/admin/teachers" },
    { icon: BookOpen, label: "Academics", path: "/admin/academics" },
    { icon: Bus, label: "Transport", path: "/admin/transport" },
    { icon: DollarSign, label: "Finance", path: "/admin/finance" },
    { icon: Building, label: "Infrastructure", path: "/admin/infrastructure" },
    { icon: FileText, label: "Reports", path: "/admin/reports" },
    { icon: Calendar, label: "Events", path: "/admin/events" },
    { icon: MessageSquare, label: "Communication", path: "/admin/communication" },
    { icon: Settings, label: "Settings", path: "/admin/settings" }
  ];

  const [events, setEvents] = useState<any[]>([]);
  const [stats, setStats] = useState<any | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<any>({ title: "", date: new Date().toISOString().slice(0,10), time: "10:00 AM", location: "", attendees: 0, type: "Event", color: "from-blue-500 to-cyan-600" });
  const [editing, setEditing] = useState<any | null>(null);
  const [details, setDetails] = useState<any | null>(null);

  const refresh = async () => {
    const [list, s] = await Promise.all([
      api.get("/admin/events"),
      api.get("/admin/events/stats").catch(() => null)
    ]);
    setEvents(list);
    if (s) setStats(s);
  };

  useEffect(() => {
    refresh();
  }, []);

  const createEvent = async () => {
    const payload = { ...newEvent, date: new Date(newEvent.date) };
    await api.post("/admin/events", payload);
    setIsCreateOpen(false);
    setNewEvent({ title: "", date: new Date().toISOString().slice(0,10), time: "10:00 AM", location: "", attendees: 0, type: "Event", color: "from-blue-500 to-cyan-600" });
    refresh();
  };

  const updateEvent = async () => {
    if (!editing) return;
    const payload = { ...editing, date: new Date(editing.date) };
    await api.post(`/admin/events/${editing._id}`, payload, { method: 'PUT' as any });
    setEditing(null);
    refresh();
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Events & Calendar</h1>
            <p className="text-muted-foreground">Manage school events and activities</p>
          </div>
          <Button className="gradient-primary shadow-elegant" onClick={() => setIsCreateOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        </div>

        {stats && (
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="p-6 hover-lift">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mb-3">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-1">{stats.total}</h3>
              <p className="text-sm text-muted-foreground">Total Events</p>
            </Card>
            <Card className="p-6 hover-lift">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-3">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-1">{stats.thisMonth}</h3>
              <p className="text-sm text-muted-foreground">This Month</p>
            </Card>
            <Card className="p-6 hover-lift">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-3">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-1">—</h3>
              <p className="text-sm text-muted-foreground">Total Participants</p>
            </Card>
            <Card className="p-6 hover-lift">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center mb-3">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-1">{stats.upcoming}</h3>
              <p className="text-sm text-muted-foreground">Upcoming Events</p>
            </Card>
          </div>
        )}

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Upcoming Events</h3>
          <div className="space-y-4">
            {events.map((event, index) => (
              <Card key={index} className="p-6 hover-lift">
                <div className="flex items-start gap-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${event.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold">{event.title}</h4>
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                        {event.type}
                      </span>
                    </div>
                    <div className="grid md:grid-cols-3 gap-3 text-sm text-muted-foreground">
                      <p className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(event.date).toDateString()}
                      </p>
                      <p className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {event.time}
                      </p>
                      <p className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      <Users className="w-3 h-3 inline mr-1" />
                      {event.attendees} expected attendees
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditing(event)}>Edit</Button>
                    <Button size="sm" onClick={() => setDetails(event)}>Details</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </div>

      {/* Create Event Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Event</DialogTitle>
          </DialogHeader>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Event Title</label>
              <Input placeholder="Enter Event Title" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Date</label>
              <Input placeholder="Select Date" type="date" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Time</label>
              <Input placeholder="Enter Time" value={newEvent.time} onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Location</label>
              <Input placeholder="Enter Location" value={newEvent.location} onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Expected Attendees</label>
              <Input placeholder="Enter Number of Attendees" type="number" value={newEvent.attendees} onChange={(e) => setNewEvent({ ...newEvent, attendees: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Event Type</label>
              <Input placeholder="Enter Event Type" value={newEvent.type} onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={createEvent}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Event Modal */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? `Edit ${editing.title}` : 'Edit Event'}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="grid md:grid-cols-2 gap-3">
              <Input placeholder="Title" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
              <Input placeholder="Date" type="date" value={new Date(editing.date).toISOString().slice(0,10)} onChange={(e) => setEditing({ ...editing, date: e.target.value })} />
              <Input placeholder="Time" value={editing.time} onChange={(e) => setEditing({ ...editing, time: e.target.value })} />
              <Input placeholder="Location" value={editing.location} onChange={(e) => setEditing({ ...editing, location: e.target.value })} />
              <Input placeholder="Attendees" type="number" value={editing.attendees} onChange={(e) => setEditing({ ...editing, attendees: Number(e.target.value) })} />
              <Input placeholder="Type" value={editing.type} onChange={(e) => setEditing({ ...editing, type: e.target.value })} />
            </div>
          )}
          <DialogFooter>
            <Button onClick={updateEvent}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Modal */}
      <Dialog open={!!details} onOpenChange={(o) => !o && setDetails(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Event Details</DialogTitle>
          </DialogHeader>
          {details && (
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Title:</span> {details.title}</p>
              <p><span className="font-medium">Date:</span> {new Date(details.date).toDateString()}</p>
              <p><span className="font-medium">Time:</span> {details.time}</p>
              <p><span className="font-medium">Location:</span> {details.location}</p>
              <p><span className="font-medium">Attendees:</span> {details.attendees}</p>
              <p><span className="font-medium">Type:</span> {details.type}</p>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setDetails(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default EventsPage;
