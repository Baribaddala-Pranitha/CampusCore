import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
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
  TrendingUp,
  TrendingDown,
  Wallet,
  CreditCard,
  Plus
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const FinancePage = () => {
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

  const [transactions, setTransactions] = useState<any[]>([]);
  const [financeStats, setFinanceStats] = useState<{ collected: number; pending: number } | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTxn, setNewTxn] = useState<any>({ studentName: "", className: "", amount: 0, type: "Tuition Fee", status: "Paid", date: new Date().toISOString().slice(0,10) });

  useEffect(() => {
    api.get("/admin/finance/transactions").then(setTransactions).catch(() => setTransactions([]));
    api.get("/admin/finance/stats").then(setFinanceStats).catch(() => setFinanceStats(null));
  }, []);

  const totals = useMemo(() => {
    if (financeStats) {
      const expenses = 3250000; // placeholder
      return { paid: financeStats.collected, pending: financeStats.pending, expenses };
    }
    const paidFallback = transactions.filter(t => t.status === "Paid").reduce((s, t) => s + t.amount, 0);
    const pendingFallback = transactions.filter(t => t.status === "Pending").reduce((s, t) => s + t.amount, 0);
    return { paid: paidFallback, pending: pendingFallback, expenses: 3250000 };
  }, [transactions, financeStats]);

  const refresh = async () => {
    const [tx, st] = await Promise.all([
      api.get("/admin/finance/transactions"),
      api.get("/admin/finance/stats").catch(() => null),
    ]);
    setTransactions(tx);
    if (st) setFinanceStats(st);
  };

  const addTransaction = async () => {
    const payload = { ...newTxn, amount: Number(newTxn.amount), date: new Date(newTxn.date) };
    await api.post("/admin/finance/transactions", payload);
    setIsAddOpen(false);
    setNewTxn({ studentName: "", className: "", amount: 0, type: "Tuition Fee", status: "Paid", date: new Date().toISOString().slice(0,10) });
    refresh();
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Finance Management</h1>
            <p className="text-muted-foreground">Track fees, payments, and financial reports</p>
          </div>
          <Button className="gradient-primary shadow-elegant" onClick={() => setIsAddOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Transaction
          </Button>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <Card className="p-6 hover-lift">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                <TrendingUp className="w-4 h-4" />
                +12%
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-1">₹{(totals.paid/100000).toFixed(1)}L</h3>
            <p className="text-sm text-muted-foreground">Total Revenue</p>
          </Card>
          <Card className="p-6 hover-lift">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                <TrendingUp className="w-4 h-4" />
                +8%
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-1">₹{(totals.paid/100000).toFixed(1)}L</h3>
            <p className="text-sm text-muted-foreground">Collected Fees</p>
          </Card>
          <Card className="p-6 hover-lift">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-sm font-medium text-red-600">
                <TrendingDown className="w-4 h-4" />
                -5%
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-1">₹{(totals.pending/100000).toFixed(1)}L</h3>
            <p className="text-sm text-muted-foreground">Pending Fees</p>
          </Card>
          <Card className="p-6 hover-lift">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-1">₹{(totals.expenses/100000).toFixed(1)}L</h3>
            <p className="text-sm text-muted-foreground">Total Expenses</p>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Recent Transactions</h3>
            <div className="space-y-3">
              {transactions.map((transaction, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth">
                  <div className="flex-1">
                    <p className="font-medium">{transaction.studentName} - Class {transaction.className}</p>
                    <p className="text-sm text-muted-foreground">{transaction.type} • {new Date(transaction.date).toDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{transaction.amount.toLocaleString()}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      transaction.status === "Paid" ? "bg-green-500/10 text-green-600" : "bg-orange-500/10 text-orange-600"
                    }`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Fee Categories</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium">Tuition Fees</p>
                  <p className="text-sm text-muted-foreground">Primary source</p>
                </div>
                <p className="text-lg font-bold">₹35.2L</p>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium">Transport Fees</p>
                  <p className="text-sm text-muted-foreground">Bus services</p>
                </div>
                <p className="text-lg font-bold">₹4.5L</p>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium">Activity Fees</p>
                  <p className="text-sm text-muted-foreground">Sports & clubs</p>
                </div>
                <p className="text-lg font-bold">₹3.4L</p>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium">Other Fees</p>
                  <p className="text-sm text-muted-foreground">Misc charges</p>
                </div>
                <p className="text-lg font-bold">₹2.1L</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Transaction</DialogTitle>
          </DialogHeader>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Student Name</label>
              <Input placeholder="Enter Student Name" value={newTxn.studentName} onChange={(e) => setNewTxn({ ...newTxn, studentName: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Class</label>
              <Input placeholder="Enter Class" value={newTxn.className} onChange={(e) => setNewTxn({ ...newTxn, className: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Amount</label>
              <Input placeholder="Enter Amount" type="number" value={newTxn.amount} onChange={(e) => setNewTxn({ ...newTxn, amount: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Transaction Type</label>
              <Input placeholder="Enter Transaction Type" value={newTxn.type} onChange={(e) => setNewTxn({ ...newTxn, type: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Input placeholder="Enter Status" value={newTxn.status} onChange={(e) => setNewTxn({ ...newTxn, status: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Date</label>
              <Input placeholder="Select Date" type="date" value={newTxn.date} onChange={(e) => setNewTxn({ ...newTxn, date: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={addTransaction}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default FinancePage;
