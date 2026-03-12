import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Calendar,
  DollarSign,
  Bus,
  MessageSquare,
  Settings,
  Download,
  Clock
} from "lucide-react";

const StudentTimetable = () => {
  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/student/dashboard" },
    { icon: Calendar, label: "Timetable", path: "/student/timetable" },
    { icon: BookOpen, label: "Assignments", path: "/student/assignments" },
    { icon: FileText, label: "Grades & Reports", path: "/student/grades" },
    { icon: DollarSign, label: "Fees", path: "/student/fees" },
    { icon: Bus, label: "Transport", path: "/student/transport" },
    { icon: MessageSquare, label: "Communication", path: "/student/communication" },
    { icon: Settings, label: "Settings", path: "/student/settings" }
  ];

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      try {
        const students: any[] = await api.get("/admin/students?status=Active");
        const s = students?.[0];
        if (!s) return setLoading(false);
        const tt = await api.get(`/admin/students/${s._id}/timetable`);
        setItems(tt);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const periods = ["8:00-9:00", "9:00-10:00", "10:30-11:30", "11:30-12:30", "1:30-2:30", "2:30-3:30"];

  const timetable = useMemo(() => {
    // Convert list of {day, period, subject} to matrix per day
    const byDay: Record<string, string[]> = {};
    for (const it of items) {
      const d = it.day || "Other";
      if (!byDay[d]) byDay[d] = [];
      byDay[d].push(it.subject);
    }
    return Object.entries(byDay).map(([day, periods]) => ({ day, periods }));
  }, [items]);

  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="student">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">My Timetable</h1>
            <p className="text-muted-foreground">View your weekly class schedule</p>
          </div>
          <Button className="shadow-elegant" onClick={()=>{
            if (!tableRef.current) return;
            const blob = new Blob([tableRef.current.innerHTML], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'timetable.html';
            a.click();
            URL.revokeObjectURL(url);
          }}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>

        <Card className="p-6 shadow-elegant hover-lift">
          <div className="overflow-x-auto" ref={tableRef}>
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold">Day</th>
                  {periods.map((period, index) => (
                    <th key={index} className="text-center p-3 font-semibold">
                      <Clock className="h-4 w-4 inline mr-1" />
                      {period}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timetable.map((day, dayIndex) => (
                  <tr key={dayIndex} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="p-3 font-semibold text-primary">{day.day}</td>
                    {day.periods.map((subject, periodIndex) => (
                      <td key={periodIndex} className="p-3 text-center">
                        <div className="bg-primary/10 rounded-lg py-2 px-3 hover:bg-primary/20 transition-colors">
                          {subject}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 hover-lift">
            <h3 className="font-semibold text-lg mb-4">Today's Classes</h3>
            <div className="space-y-3">
              {(() => {
                const today = new Date().toLocaleString('en-US', { weekday: 'long' });
                const day = timetable.find(d => d.day === today);
                if (!day) return <p className="text-muted-foreground">No classes today.</p>;
                return day.periods.map((subject, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-semibold">{subject}</p>
                      <p className="text-sm text-muted-foreground">{today}</p>
                    </div>
                    <span className="text-sm font-medium">Period {i+1}</span>
                  </div>
                ));
              })()}
            </div>
          </Card>

          <Card className="p-6 hover-lift">
            <h3 className="font-semibold text-lg mb-4">Upcoming Tests</h3>
            <div className="space-y-3">
              {items.slice(0,3).map((it:any,i:number)=> (
                <div key={i} className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
                  <div>
                    <p className="font-semibold">{it.subject}</p>
                    <p className="text-sm text-muted-foreground">{it.className || it.class}</p>
                  </div>
                  <span className="text-sm font-medium">{it.period}</span>
                </div>
              ))}
              {items.length===0 && <p className="text-muted-foreground">No upcoming tests.</p>}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentTimetable;
