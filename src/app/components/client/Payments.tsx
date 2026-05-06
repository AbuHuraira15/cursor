import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  CreditCard,
  Plus,
  Trash2,
  Calendar,
  DollarSign,
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle,
  Clock,
  Filter,
  Download,
  Wallet,
  Lock,
  AlertCircle,
} from "lucide-react";
import { Separator } from "../ui/separator";
import { getPayments } from "../../lib/api";

interface PaymentsProps {
  onNavigate: (page: string) => void;
  authToken: string;
}

interface PaymentMethod {
  id: string;
  type: "card" | "paypal" | "bank";
  name: string;
  last4?: string;
  expiry?: string;
  isDefault: boolean;
  brand?: string;
}

interface Transaction {
  id: string;
  type: "payment" | "refund" | "fee";
  description: string;
  amount: number;
  status: "completed" | "pending" | "failed";
  date: string;
  taskId?: string;
  workerName?: string;
  paymentMethod?: string;
}

export function Payments({ onNavigate, authToken }: PaymentsProps) {
  const [showAddPaymentMethod, setShowAddPaymentMethod] = useState(false);
  const [showPaymentDetail, setShowPaymentDetail] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPeriod, setFilterPeriod] = useState<string>("all");

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "card",
      name: "Visa ending in 4242",
      last4: "4242",
      expiry: "12/25",
      isDefault: true,
      brand: "visa",
    },
    {
      id: "2",
      type: "card",
      name: "Mastercard ending in 5555",
      last4: "5555",
      expiry: "09/26",
      isDefault: false,
      brand: "mastercard",
    },
    {
      id: "3",
      type: "paypal",
      name: "PayPal (karim@email.com)",
      isDefault: false,
    },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (!authToken) return;
    getPayments(authToken)
      .then((data) => {
        const mapped: Transaction[] = data.results.map((payment) => ({
          id: String(payment.id),
          type: "payment",
          description: `Payment for task #${payment.task}`,
          amount: Number(payment.total_amount),
          status: payment.status,
          date: payment.created_at.slice(0, 10),
          taskId: String(payment.task),
          workerName: `Worker #${payment.worker}`,
          paymentMethod: payment.method.toUpperCase(),
        }));
        setTransactions(mapped);
      })
      .catch(() => setTransactions([]));
  }, [authToken]);

  const [newPaymentMethod, setNewPaymentMethod] = useState({
    type: "card" as "card" | "paypal" | "bank",
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });

  const handleSetDefaultPaymentMethod = (id: string) => {
    setPaymentMethods(
      paymentMethods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
  };

  const handleDeletePaymentMethod = (id: string) => {
    setPaymentMethods(paymentMethods.filter((method) => method.id !== id));
  };

  const handleAddPaymentMethod = () => {
    const newMethod: PaymentMethod = {
      id: String(paymentMethods.length + 1),
      type: newPaymentMethod.type,
      name:
        newPaymentMethod.type === "card"
          ? `Card ending in ৳{newPaymentMethod.cardNumber.slice(-4)}`
          : newPaymentMethod.type === "paypal"
          ? "PayPal Account"
          : "Bank Account",
      last4: newPaymentMethod.type === "card" ? newPaymentMethod.cardNumber.slice(-4) : undefined,
      expiry: newPaymentMethod.type === "card" ? newPaymentMethod.expiry : undefined,
      isDefault: paymentMethods.length === 0,
      brand: newPaymentMethod.type === "card" ? "visa" : undefined,
    };

    setPaymentMethods([...paymentMethods, newMethod]);
    setShowAddPaymentMethod(false);
    setNewPaymentMethod({
      type: "card",
      cardNumber: "",
      cardName: "",
      expiry: "",
      cvv: "",
    });
  };

  const filteredTransactions = transactions.filter((transaction) => {
    if (filterStatus !== "all" && transaction.status !== filterStatus) {
      return false;
    }
    // Add period filtering logic here if needed
    return true;
  });

  const totalSpent = transactions
    .filter((t) => t.type === "payment" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingPayments = transactions.filter((t) => t.status === "pending").length;

  const handleViewTransactionDetail = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowPaymentDetail(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1>Payments</h1>
          <p className="text-muted-foreground">Manage your payment methods and view transaction history</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <h2 className="text-3xl mt-1">৳{totalSpent.toFixed(2)}</h2>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Payment Methods</p>
              <h2 className="text-3xl mt-1">{paymentMethods.length}</h2>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending Payments</p>
              <h2 className="text-3xl mt-1">{pendingPayments}</h2>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="methods" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="history">Transaction History</TabsTrigger>
        </TabsList>

        {/* Payment Methods Tab */}
        <TabsContent value="methods" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2>Your Payment Methods</h2>
            <Button onClick={() => setShowAddPaymentMethod(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Payment Method
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paymentMethods.map((method) => (
              <Card key={method.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center ৳{
                        method.type === "card"
                          ? "bg-gradient-to-br from-blue-500 to-blue-600"
                          : method.type === "paypal"
                          ? "bg-gradient-to-br from-blue-400 to-blue-500"
                          : "bg-gradient-to-br from-green-500 to-green-600"
                      }`}
                    >
                      {method.type === "card" ? (
                        <CreditCard className="w-6 h-6 text-white" />
                      ) : method.type === "paypal" ? (
                        <Wallet className="w-6 h-6 text-white" />
                      ) : (
                        <DollarSign className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm">{method.name}</h3>
                      {method.expiry && (
                        <p className="text-xs text-muted-foreground">Expires {method.expiry}</p>
                      )}
                    </div>
                  </div>
                  {method.isDefault && (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Default</Badge>
                  )}
                </div>

                <Separator className="my-4" />

                <div className="flex gap-2">
                  {!method.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleSetDefaultPaymentMethod(method.id)}
                    >
                      Set as Default
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDeletePaymentMethod(method.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {paymentMethods.length === 0 && (
            <Card className="p-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="mb-2">No payment methods added</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add a payment method to start paying for tasks
              </p>
              <Button onClick={() => setShowAddPaymentMethod(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Payment Method
              </Button>
            </Card>
          )}

          {/* Security Notice */}
          <Card className="p-4 bg-green-50 border-green-200">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm text-green-900 mb-1">Your payments are secure</h3>
                <p className="text-xs text-green-700">
                  All payment information is encrypted and processed securely. We never store your full card
                  details on our servers.
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Transaction History Tab */}
        <TabsContent value="history" className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2>Transaction History</h2>
            <div className="flex gap-2 w-full sm:w-auto">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {filteredTransactions.map((transaction) => (
              <Card
                key={transaction.id}
                className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleViewTransactionDetail(transaction)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ৳{
                        transaction.type === "payment"
                          ? "bg-red-100"
                          : transaction.type === "refund"
                          ? "bg-green-100"
                          : "bg-gray-100"
                      }`}
                    >
                      {transaction.type === "payment" ? (
                        <ArrowUpRight className="w-5 h-5 text-red-600" />
                      ) : transaction.type === "refund" ? (
                        <ArrowDownLeft className="w-5 h-5 text-green-600" />
                      ) : (
                        <DollarSign className="w-5 h-5 text-gray-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm mb-1 truncate">{transaction.description}</h3>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {transaction.date}
                        </span>
                        {transaction.workerName && (
                          <>
                            <span>•</span>
                            <span>{transaction.workerName}</span>
                          </>
                        )}
                        {transaction.paymentMethod && (
                          <>
                            <span>•</span>
                            <span>{transaction.paymentMethod}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p
                      className={`font-semibold mb-1 ৳{
                        transaction.type === "payment" ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {transaction.type === "payment" || transaction.type === "fee" ? "-" : "+"}৳
                      {transaction.amount.toFixed(2)}
                    </p>
                    {transaction.status === "completed" && (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Completed
                      </Badge>
                    )}
                    {transaction.status === "pending" && (
                      <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
                      </Badge>
                    )}
                    {transaction.status === "failed" && (
                      <Badge className="bg-red-100 text-red-700 hover:bg-red-100 text-xs">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Failed
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredTransactions.length === 0 && (
            <Card className="p-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="mb-2">No transactions found</h3>
              <p className="text-sm text-muted-foreground">
                Your transaction history will appear here once you complete tasks
              </p>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Add Payment Method Dialog */}
      <Dialog open={showAddPaymentMethod} onOpenChange={setShowAddPaymentMethod}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>Add a new payment method to your account</DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddPaymentMethod();
            }}
            className="space-y-4"
          >
            {/* Payment Type */}
            <div>
              <Label>Payment Type</Label>
              <Select
                value={newPaymentMethod.type}
                onValueChange={(value) =>
                  setNewPaymentMethod({ ...newPaymentMethod, type: value as "card" | "paypal" | "bank" })
                }
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">Credit/Debit Card</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="bank">Bank Account</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {newPaymentMethod.type === "card" && (
              <>
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    className="mt-2"
                    value={newPaymentMethod.cardNumber}
                    onChange={(e) =>
                      setNewPaymentMethod({
                        ...newPaymentMethod,
                        cardNumber: e.target.value,
                      })
                    }
                    maxLength={19}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input
                    id="cardName"
                    placeholder="Karim Hasan"
                    className="mt-2"
                    value={newPaymentMethod.cardName}
                    onChange={(e) =>
                      setNewPaymentMethod({
                        ...newPaymentMethod,
                        cardName: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      className="mt-2"
                      value={newPaymentMethod.expiry}
                      onChange={(e) =>
                        setNewPaymentMethod({
                          ...newPaymentMethod,
                          expiry: e.target.value,
                        })
                      }
                      maxLength={5}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      type="password"
                      className="mt-2"
                      value={newPaymentMethod.cvv}
                      onChange={(e) =>
                        setNewPaymentMethod({
                          ...newPaymentMethod,
                          cvv: e.target.value,
                        })
                      }
                      maxLength={4}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {newPaymentMethod.type === "paypal" && (
              <Card className="p-6 bg-blue-50 border-primary/20 text-center">
                <p className="text-sm text-muted-foreground">
                  You will be redirected to PayPal to connect your account
                </p>
              </Card>
            )}

            {newPaymentMethod.type === "bank" && (
              <Card className="p-6 bg-blue-50 border-primary/20">
                <p className="text-sm text-muted-foreground mb-3">
                  You will need to verify your bank account before using it for payments
                </p>
                <div className="space-y-3">
                  <Input placeholder="Account Number" />
                  <Input placeholder="Routing Number" />
                </div>
              </Card>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setShowAddPaymentMethod(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Add Payment Method
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Transaction Detail Dialog */}
      <Dialog open={showPaymentDetail} onOpenChange={setShowPaymentDetail}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
          </DialogHeader>

          {selectedTransaction && (
            <div className="space-y-4">
              <Card className="p-4 bg-muted">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Amount</span>
                  <span
                    className={`text-2xl font-semibold ৳{
                      selectedTransaction.type === "payment" ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {selectedTransaction.type === "payment" || selectedTransaction.type === "fee" ? "-" : "+"}৳
                    {selectedTransaction.amount.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  {selectedTransaction.status === "completed" && (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Completed
                    </Badge>
                  )}
                  {selectedTransaction.status === "pending" && (
                    <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                      <Clock className="w-3 h-3 mr-1" />
                      Pending
                    </Badge>
                  )}
                </div>
              </Card>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Description</p>
                  <p className="text-sm">{selectedTransaction.description}</p>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Date</p>
                  <p className="text-sm">{selectedTransaction.date}</p>
                </div>

                {selectedTransaction.workerName && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Worker</p>
                      <p className="text-sm">{selectedTransaction.workerName}</p>
                    </div>
                  </>
                )}

                {selectedTransaction.paymentMethod && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Payment Method</p>
                      <p className="text-sm">{selectedTransaction.paymentMethod}</p>
                    </div>
                  </>
                )}

                {selectedTransaction.taskId && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Task ID</p>
                      <p className="text-sm">{selectedTransaction.taskId}</p>
                    </div>
                  </>
                )}
              </div>

              <Button className="w-full" onClick={() => setShowPaymentDetail(false)}>
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
