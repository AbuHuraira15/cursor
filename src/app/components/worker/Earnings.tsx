import { useEffect, useMemo, useState } from "react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { DollarSign, TrendingUp, Clock, CheckCircle, Download, CreditCard } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { getPayments } from "../../lib/api";

interface EarningsProps {
  onNavigate: (page: string) => void;
  authToken: string;
}

export function Earnings({ onNavigate, authToken }: EarningsProps) {
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    if (!authToken) return;
    getPayments(authToken)
      .then((data) => setTransactions(data.results))
      .catch(() => setTransactions([]));
  }, [authToken]);

  const summary = useMemo(() => {
    const totalEarnings = transactions
      .filter((payment) => payment.status === "completed")
      .reduce((sum, payment) => sum + Number(payment.task_amount || 0), 0);
    const pendingPayout = transactions
      .filter((payment) => payment.status === "pending")
      .reduce((sum, payment) => sum + Number(payment.task_amount || 0), 0);
    return {
      totalEarnings,
      thisMonth: totalEarnings,
      pendingPayout,
      availableBalance: totalEarnings - pendingPayout,
    };
  }, [transactions]);

  const stats = [
    { label: "Total Earned", value: summary.totalEarnings, icon: DollarSign, color: "text-green-600", bgColor: "bg-green-100" },
    { label: "This Month", value: summary.thisMonth, icon: TrendingUp, color: "text-blue-600", bgColor: "bg-blue-100" },
    { label: "Pending", value: summary.pendingPayout, icon: Clock, color: "text-orange-600", bgColor: "bg-orange-100" },
    { label: "Available", value: summary.availableBalance, icon: CheckCircle, color: "text-purple-600", bgColor: "bg-purple-100" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1>Earnings</h1>
          <p className="text-muted-foreground">Track your income and transaction history</p>
        </div>
        <Select defaultValue="all-time">
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-time">All Time</SelectItem>
            <SelectItem value="this-month">This Month</SelectItem>
            <SelectItem value="last-month">Last Month</SelectItem>
            <SelectItem value="this-year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Earnings Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <div className={`w-8 h-8 ৳{stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ৳{stat.color}`} />
                </div>
              </div>
              <h2 className={`text-3xl ৳{stat.color}`}>৳{stat.value}</h2>
            </Card>
          );
        })}
      </div>

      {/* Payout Card */}
      <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="mb-1">Available for Withdrawal</h3>
              <p className="text-3xl text-green-600 mb-1">৳{summary.availableBalance}</p>
              <p className="text-sm text-muted-foreground">
                Pending: ৳{summary.pendingPayout} (will be available in 3-7 days)
              </p>
            </div>
          </div>
          <Button className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
            Withdraw Funds
          </Button>
        </div>
      </Card>

      {/* Transactions */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2>Transaction History</h2>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-3">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-1">
                  <h4 className="mb-1">Task #{transaction.task}</h4>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <span>Worker payment</span>
                    <span>•</span>
                    <span>{transaction.created_at?.slice(0, 10)}</span>
                    <span>•</span>
                    {transaction.status === "completed" ? (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        Paid
                      </Badge>
                    ) : (
                      <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                        Pending
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xl font-semibold text-green-600">+৳{Number(transaction.task_amount || 0).toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">
                    Total: ৳{Number(transaction.total_amount || 0).toFixed(2)} (Fee: ৳{Number(transaction.platform_fee || 0).toFixed(2)})
                  </p>
                </div>
              </div>
            ))}
            {transactions.length === 0 && <p className="text-sm text-muted-foreground">No earnings yet.</p>}
          </TabsContent>

          <TabsContent value="completed" className="space-y-3">
            {transactions.filter((t) => t.status === "completed").map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="mb-1">Task #{transaction.task}</h4>
                  <p className="text-sm text-muted-foreground">{transaction.created_at?.slice(0, 10)} • Paid</p>
                </div>
                <p className="text-xl font-semibold text-green-600">+৳{Number(transaction.task_amount || 0).toFixed(2)}</p>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="pending" className="space-y-3">
            {transactions.filter((t) => t.status === "pending").map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg bg-orange-50">
                <div className="flex-1">
                  <h4 className="mb-1">Task #{transaction.task}</h4>
                  <p className="text-sm text-muted-foreground">
                    Created on {transaction.created_at?.slice(0, 10)} • Awaiting completion
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-semibold text-orange-600">৳{Number(transaction.task_amount || 0).toFixed(2)}</p>
                  <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 mt-1">
                    Processing
                  </Badge>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </Card>

      {/* Payment Method */}
      <Card className="p-6">
        <h2 className="mb-4">Payment Method</h2>
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center text-white text-xs font-bold">
              BANK
            </div>
            <div>
              <p className="font-medium">Bank Account ****3456</p>
              <p className="text-sm text-muted-foreground">Primary payment method</p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            Change
          </Button>
        </div>
      </Card>
    </div>
  );
}
