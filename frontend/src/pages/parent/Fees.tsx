import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useState } from "react";
import { api, API_BASE_URL } from "@/lib/api";
import {
  LayoutDashboard,
  Users,
  FileText,
  DollarSign,
  Calendar,
  Bell,
  MessageSquare,
  Settings,
  CreditCard,
  Download,
  CheckCircle
} from "lucide-react";

const ParentFees = () => {
  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/parent/dashboard" },
    { icon: Users, label: "My Children", path: "/parent/children" },
    { icon: FileText, label: "Academic Reports", path: "/parent/reports" },
    { icon: DollarSign, label: "Fee Payments", path: "/parent/fees" },
    { icon: Calendar, label: "Events", path: "/parent/events" },
    { icon: Bell, label: "Notifications", path: "/parent/notifications" },
    { icon: MessageSquare, label: "Communication", path: "/parent/communication" },
    { icon: Settings, label: "Settings", path: "/parent/settings" }
  ];

  const [fees, setFees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [payOpen, setPayOpen] = useState(false);
  const [payTx, setPayTx] = useState<any | null>(null);
  const [payAmount, setPayAmount] = useState<string>("");

  useEffect(() => {
    async function load() {
      try {
        const parents: any[] = await api.get("/parents");
        const p = parents?.[0];
        if (!p) return setLoading(false);
        const res = await api.get(`/parents/${p._id}/fees`);
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
    let pending = 0;
    let paid = 0;
    for (const t of fees) {
      if (t.status === "Paid") paid += t.amount || 0;
      else pending += t.amount || 0;
    }
    return { pending, paid };
  }, [fees]);

  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="parent">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-black">
            Fee Payments
          </h1>
          <p className="text-muted-foreground">Manage fee payments for your children</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 hover-lift">
            <h3 className="text-2xl font-bold mb-2 text-warning">₹{totals.pending?.toLocaleString?.("en-IN") || totals.pending}</h3>
            <p className="text-muted-foreground">Total Pending</p>
            <Button className="w-full mt-4 shadow-elegant" onClick={() => {
              setPayTx(null);
              setPayAmount(String(totals.pending || 0));
              setPayOpen(true);
            }}>
              <CreditCard className="h-4 w-4 mr-2" />
              Pay Now
            </Button>
          </Card>
          <Card className="p-6 hover-lift">
            <h3 className="text-2xl font-bold mb-2 text-success">₹{totals.paid?.toLocaleString?.("en-IN") || totals.paid}</h3>
            <p className="text-muted-foreground">Total Paid This Year</p>
          </Card>
          <Card className="p-6 hover-lift">
            <h3 className="text-2xl font-bold mb-2">₹3,30,000</h3>
            <p className="text-muted-foreground">Annual Fees (Both Children)</p>
          </Card>
        </div>

        {loading ? (
          <Card className="p-6">Loading...</Card>
        ) : (
          fees.map((fee, index) => (
          <Card key={index} className="p-6 shadow-elegant hover-lift">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold">{fee.studentName}</h3>
                <p className="text-muted-foreground">Class {fee.className}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Pending Amount</p>
                <p className={`text-2xl font-bold ${fee.status === "Paid" ? "text-success" : "text-warning"}`}>
                  {fee.status === "Paid" ? "₹0" : `₹${fee.amount?.toLocaleString?.("en-IN") || fee.amount}`}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Total Paid</p>
                <p className="text-xl font-bold text-success">{fee.status === "Paid" ? `₹${fee.amount?.toLocaleString?.("en-IN") || fee.amount}` : "₹0"}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Payment Status</p>
                <div className="flex items-center">
                  {fee.status === "Paid" ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-success mr-2" />
                      <p className="font-bold text-success">Paid in Full</p>
                    </>
                  ) : (
                    <p className="font-bold text-warning">Pending</p>
                  )}
                </div>
              </div>
            </div>

            {fee.status !== "Paid" && (
              <div className="flex space-x-3">
                <Button className="flex-1 shadow-elegant" onClick={() => {
                  setPayTx(fee);
                  setPayAmount(String(fee.amount || 0));
                  setPayOpen(true);
                }}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pay ₹{fee.amount?.toLocaleString?.("en-IN") || fee.amount}
                </Button>
                <Button variant="outline" onClick={() => {
                  const blob = new Blob([JSON.stringify(fee, null, 2)], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `${fee.studentName}-${fee.type}-invoice.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Invoice
                </Button>
              </div>
            )}
          </Card>
        )))}

        <Card className="p-6 shadow-elegant">
          <h3 className="font-semibold text-lg mb-6">Payment History</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="font-semibold">Emily Johnson - March 2024</p>
                <p className="text-sm text-muted-foreground">Tuition Fee</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="font-bold">₹15,000</span>
                <Button variant="outline" size="sm" onClick={() => {
                  const blob = new Blob([JSON.stringify({ name: "Emily Johnson", month: "March 2024", amount: 15000, type: "Tuition Fee" }, null, 2)], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `Emily-Johnson-March-2024-invoice.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="font-semibold">Michael Johnson - March 2024</p>
                <p className="text-sm text-muted-foreground">Tuition Fee</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="font-bold">₹15,000</span>
                <Button variant="outline" size="sm" onClick={() => {
                  const blob = new Blob([JSON.stringify({ name: "Michael Johnson", month: "March 2024", amount: 15000, type: "Tuition Fee" }, null, 2)], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `Michael-Johnson-March-2024-invoice.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Dialog open={payOpen} onOpenChange={setPayOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{payTx ? `Pay ${payTx.studentName} - ${payTx.type}` : "Pay Fees"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Amount</label>
                <Input value={payAmount} onChange={(e) => setPayAmount(e.target.value)} placeholder="Enter amount" />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setPayOpen(false)}>Cancel</Button>
                <Button onClick={async () => {
                  try {
                    if (payTx) {
                      const students = await api.get(`/students?q=${encodeURIComponent(payTx.studentName)}`);
                      const st = (students || [])[0];
                      if (st) {
                        await fetch(`${API_BASE_URL}/students/${st._id}/fees/${payTx._id}/pay`, { method: "PUT" });
                      }
                    } else {
                      for (const t of fees.filter((x) => x.status !== "Paid")) {
                        const students = await api.get(`/students?q=${encodeURIComponent(t.studentName)}`);
                        const st = (students || [])[0];
                        if (st) {
                          await fetch(`${API_BASE_URL}/students/${st._id}/fees/${t._id}/pay`, { method: "PUT" });
                        }
                      }
                    }
                    const parents: any[] = await api.get("/parents");
                    const p = parents?.[0];
                    if (p) {
                      const res = await api.get(`/parents/${p._id}/fees`);
                      setFees(res);
                    }
                    setPayOpen(false);
                  } catch (e) { console.error(e); }
                }}>Pay</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default ParentFees;
