import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, MapPin, CheckSquare, Wrench, Settings } from "lucide-react";

const TransportMaintenance = () => {
  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/transport/dashboard" },
    { icon: Users, label: "Students", path: "/transport/students" },
    { icon: MapPin, label: "Route", path: "/transport/route" },
    { icon: CheckSquare, label: "Attendance", path: "/transport/attendance" },
    { icon: Wrench, label: "Maintenance", path: "/transport/maintenance" },
    { icon: Settings, label: "Settings", path: "/transport/settings" }
  ];

  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="transport">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Maintenance</h1>
        <Card className="p-6 hover-lift border-primary/20">
          <p className="text-muted-foreground mb-3">Log maintenance and fuel usage</p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Issue</TableHead>
                <TableHead>Reported</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[{i:"Brake check",d:"Oct 1",s:"Resolved"},{i:"Oil change",d:"Oct 2",s:"Pending"}].map((r,i)=>(
                <TableRow key={i}>
                  <TableCell>{r.i}</TableCell>
                  <TableCell>{r.d}</TableCell>
                  <TableCell>{r.s}</TableCell>
                  <TableCell><Button size="sm" variant="outline">Update</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TransportMaintenance;


