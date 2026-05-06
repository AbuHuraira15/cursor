import { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
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
import { CreditCard, DollarSign, Lock, CheckCircle } from "lucide-react";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: number;
  workerName: string;
  taskTitle: string;
  onPaymentComplete: () => void;
}

export function PaymentDialog({
  open,
  onOpenChange,
  amount,
  workerName,
  taskTitle,
  onPaymentComplete,
}: PaymentDialogProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const platformFee = amount * 0.1;
  const totalAmount = amount + platformFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      setPaymentSuccess(true);

      // Close dialog and notify parent after showing success
      setTimeout(() => {
        setPaymentSuccess(false);
        onPaymentComplete();
        onOpenChange(false);
      }, 2000);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg">Complete Payment</DialogTitle>
          <DialogDescription className="text-xs">
            Release payment to {workerName} for completing the task
          </DialogDescription>
        </DialogHeader>

        {paymentSuccess ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="mb-1 text-base">Payment Successful!</h3>
            <p className="text-xs text-muted-foreground">
              ৳{totalAmount.toFixed(2)} has been sent to {workerName}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            {/* Task Summary */}
            <Card className="p-4 bg-muted">
              <p className="text-sm text-muted-foreground mb-1">Task</p>
              <p className="font-semibold mb-3">{taskTitle}</p>
              <p className="text-sm text-muted-foreground mb-1">Worker</p>
              <p className="font-semibold">{workerName}</p>
            </Card>

            {/* Payment Method */}
            <div>
              <Label>Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">Credit/Debit Card</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {paymentMethod === "card" && (
              <>
                {/* Card Number */}
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <div className="relative mt-2">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      className="pl-10"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      maxLength={19}
                      required
                    />
                  </div>
                </div>

                {/* Card Name */}
                <div>
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input
                    id="cardName"
                    placeholder="Karim Hasan"
                    className="mt-2"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    required
                  />
                </div>

                {/* Expiry and CVV */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      className="mt-2"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
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
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      maxLength={4}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {paymentMethod === "paypal" && (
              <Card className="p-6 bg-blue-50 border-primary/20 text-center">
                <p className="text-sm text-muted-foreground">
                  You will be redirected to PayPal to complete the payment
                </p>
              </Card>
            )}

            {paymentMethod === "bank" && (
              <Card className="p-6 bg-blue-50 border-primary/20">
                <p className="text-sm mb-2">Bank Transfer Details:</p>
                <p className="text-xs text-muted-foreground">
                  Account: MiniMates Payments<br />
                  Account Number: 1234567890<br />
                  Routing Number: 987654321
                </p>
              </Card>
            )}

            {/* Amount Breakdown */}
            <Card className="p-4 bg-muted">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Task Amount</span>
                  <span>৳{amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Platform Fee (10%)</span>
                  <span className="text-muted-foreground">৳{platformFee.toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold text-base">
                  <span>Total Amount</span>
                  <span>৳{totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </Card>

            {/* Security Notice */}
            <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <Lock className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-green-700">
                Your payment information is encrypted and secure. We never store your full card details.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
                disabled={processing}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary/90"
                disabled={processing}
              >
                {processing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <DollarSign className="w-4 h-4 mr-2" />
                    Pay ৳{totalAmount.toFixed(2)}
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}