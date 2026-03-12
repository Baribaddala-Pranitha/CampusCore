import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
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
  CreditCard,
  CheckCircle,
  Clock
} from "lucide-react";

const StudentFees = () => {
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

  const [fees, setFees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const students: any[] = await api.get("/admin/students?status=Active");
        const s = students?.[0];
        if (!s) return setLoading(false);
        const res = await api.get(`/admin/students/${s._id}/fees`);
        setFees(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const totals = useMemo(() => {
    let paid = 0;
    for (const t of fees) if (t.status === "Paid") paid += t.amount || 0;
    const pendingItem = fees.find((t) => t.status !== "Paid");
    const pending = pendingItem ? pendingItem.amount : 0;
    return { paid, pending };
  }, [fees]);

  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Fee Management</h1>
          <p className="text-muted-foreground">View and manage your fee payments</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 hover-lift">
            <h3 className="text-2xl font-bold mb-2">₹{totals.pending?.toLocaleString?.("en-IN") || totals.pending}</h3>
            <p className="text-muted-foreground">Pending Payment</p>
            <Button className="w-full mt-4 shadow-elegant">
              <CreditCard className="h-4 w-4 mr-2" />
              Pay Now
            </Button>
          </Card>
          <Card className="p-6 hover-lift">
            <h3 className="text-2xl font-bold mb-2 text-success">₹{totals.paid?.toLocaleString?.("en-IN") || totals.paid}</h3>
            <p className="text-muted-foreground">Total Paid This Year</p>
          </Card>
          <Card className="p-6 hover-lift">
            <h3 className="text-2xl font-bold mb-2">₹1,80,000</h3>
            <p className="text-muted-foreground">Annual Fee Structure</p>
          </Card>
        </div>

        <Card className="p-6 shadow-elegant">
          <h3 className="font-semibold text-lg mb-6">Fee Breakdown</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
              <span className="font-medium">Tuition Fee</span>
              <span className="font-bold">₹1,20,000</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
              <span className="font-medium">Transport Fee</span>
              <span className="font-bold">₹30,000</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
              <span className="font-medium">Library & Lab Fee</span>
              <span className="font-bold">₹15,000</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
              <span className="font-medium">Sports & Activities</span>
              <span className="font-bold">₹10,000</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
              <span className="font-medium">Miscellaneous</span>
              <span className="font-bold">₹5,000</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-primary/10 rounded-lg border-2 border-primary">
              <span className="font-bold text-lg">Total Annual Fee</span>
              <span className="font-bold text-2xl text-primary">₹1,80,000</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 shadow-elegant">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg">Payment History</h3>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download All Receipts
            </Button>
          </div>
          <div className="space-y-3">
            {loading && <p className="text-muted-foreground">Loading payment history...</p>}
            {!loading && fees.map((fee, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-muted rounded-lg hover-lift"
              >
                <div className="flex items-center space-x-4">
                  {fee.status === "Paid" ? (
                    <CheckCircle className="h-6 w-6 text-success" />
                  ) : (
                    <Clock className="h-6 w-6 text-warning" />
                  )}
                  <div>
                    <p className="font-semibold">{fee.type}</p>
                    <p className="text-sm text-muted-foreground">{new Date(fee.date).toDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-bold text-lg">₹{fee.amount?.toLocaleString?.("en-IN") || fee.amount}</span>
                  {fee.status === "Paid" ? (
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Receipt
                    </Button>
                  ) : (
                    <Button size="sm" className="shadow-elegant">
                      Pay Now
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentFees;
