import { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import { ChevronLeft, MapPin, Calendar, Clock, DollarSign, Star, CheckCircle, MessageSquare, Phone, Shield, CreditCard, Wallet, ArrowRight } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { assignTask, completePayment, completeTask, createPayment, updateTask, deleteTask } from "../../lib/api";

interface TaskDetailProps {
  task: any;
  onBack: () => void;
  onNavigate: (page: string) => void;
  onUpdateTask: (taskId: string, updates: any) => void;
  onCancelTask: (taskId: string) => void;
  authToken: string;
}

export function TaskDetail({ task, onBack, onNavigate, onUpdateTask, onCancelTask, authToken }: TaskDetailProps) {
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: task.title || "",
    description: task.description || "",
    budget: task.budget || "",
    location: task.location || "",
    address: task.address || ""
  });
  const [selectedBid, setSelectedBid] = useState<any>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card-1234");
  const [acceptedWorker, setAcceptedWorker] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [ratingCategories, setRatingCategories] = useState({
    quality: 0,
    communication: 0,
    timeliness: 0,
    professionalism: 0
  });
  const [apiError, setApiError] = useState("");

  // Mock payment methods
  const paymentMethods = [
    { id: "card-1234", type: "card", last4: "4242", brand: "Visa", isDefault: true },
    { id: "card-5678", type: "card", last4: "5555", brand: "Mastercard", isDefault: false },
    { id: "wallet", type: "wallet", balance: 250.00 }
  ];

  const bids = (task.bidsList || []).map((bid: any) => ({
    id: String(bid.id),
    workerId: bid.worker,
    workerName: bid.worker_name || "Worker",
    rating: 5,
    completedJobs: 0,
    amount: Number(bid.amount),
    message: bid.message,
    verified: true,
    responseTime: "Recently active",
  }));

  const handleAcceptBid = (bidId: string) => {
    setSelectedBid(bidId);
    setShowAcceptDialog(true);
  };

  const confirmAcceptBid = async () => {
    const worker = bids.find((b) => b.id === selectedBid);
    if (!worker) return;
    try {
      await assignTask(authToken, Number(task.id), Number(selectedBid));
      setApiError("");
      setShowAcceptDialog(false);
      setAcceptedWorker(worker);
      onUpdateTask(task.id, {
        status: "in_progress",
        assignedWorker: worker,
        agreedAmount: worker.amount,
      });
      onNavigate("my-tasks");
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Could not assign bid");
    }
  };

  const handleCompleteTask = () => {
    setShowCompleteDialog(true);
  };

  const confirmCompleteTask = () => {
    setShowCompleteDialog(false);
    // Show payment dialog when task is completed
    setShowPaymentDialog(true);
  };

  const confirmPayment = async () => {
    const worker = task.assignedWorker || acceptedWorker;
    const amount = task.agreedAmount || task.budget;
    try {
      await completeTask(authToken, Number(task.id));
      const createdPayment = await createPayment(authToken, {
        task: Number(task.id),
        worker: Number(worker?.workerId || worker?.id),
        task_amount: Number(amount),
        method: selectedPaymentMethod.includes("paypal")
          ? "paypal"
          : selectedPaymentMethod.includes("wallet")
            ? "bank"
            : "card",
      });
      await completePayment(authToken, createdPayment.id);
      setApiError("");
      setShowPaymentDialog(false);
      onUpdateTask(task.id, {
        status: "completed",
        completedDate: "Just now",
        paymentMethod: selectedPaymentMethod,
        paymentAmount: amount,
        paymentProcessed: true,
      });
      setShowRatingDialog(true);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Payment failed");
    }
  };

  const submitRating = () => {
    const worker = task.assignedWorker || acceptedWorker;
    // In a real app, submit rating to backend
    const reviewData = {
      workerId: worker?.id,
      rating: rating,
      categories: ratingCategories,
      review: reviewText,
      taskId: task.id
    };
    console.log('Submitting review:', reviewData);
    setShowRatingDialog(false);
    // Reset rating state
    setRating(0);
    setHoverRating(0);
    setReviewText("");
    setRatingCategories({
      quality: 0,
      communication: 0,
      timeliness: 0,
      professionalism: 0
    });
    onNavigate("my-tasks");
  };

  const skipRating = () => {
    setShowRatingDialog(false);
    setRating(0);
    setHoverRating(0);
    setReviewText("");
    setRatingCategories({
      quality: 0,
      communication: 0,
      timeliness: 0,
      professionalism: 0
    });
    onNavigate("my-tasks");
  };

  const handleCancelTask = () => {
    setShowCancelDialog(true);
  };

  const confirmCancelTask = async () => {
    try {
      await deleteTask(authToken, Number(task.id));
      setShowCancelDialog(false);
      onCancelTask(task.id);
      onNavigate("my-tasks");
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Failed to cancel task");
      setShowCancelDialog(false);
    }
  };

  const handleEditTask = () => {
    setEditFormData({
      title: task.title || "",
      description: task.description || "",
      budget: task.budget || "",
      location: task.location || "",
      address: task.address || ""
    });
    setShowEditDialog(true);
  };

  const confirmEditTask = async () => {
    try {
      await updateTask(authToken, Number(task.id), editFormData as any);
      setShowEditDialog(false);
      onUpdateTask(task.id, editFormData);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Failed to update task");
    }
  };

  const handleMessageWorker = (workerId: string, workerName: string) => {
    // Navigate to messages page with the worker and task context
    onNavigate("messages", {
      targetUserId: workerId,
      targetUserName: workerName,
      taskId: task.id,
      taskTitle: task.title
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ChevronLeft className="w-4 h-4 mr-2" />
          My Tasks
        </Button>

        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h1>{task.title}</h1>
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                {task.status === "open" ? "Open" : task.status}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <Badge variant="outline">{task.category}</Badge>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Posted {task.postedDate}
              </span>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm text-muted-foreground">Your Budget</p>
            <p className="text-3xl">৳{task.budget}</p>
          </div>
        </div>
      </div>
      {apiError && (
        <Card className="p-4 border-destructive">
          <p className="text-sm text-destructive">{apiError}</p>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Task Details */}
          <Card className="p-6">
            <h2 className="mb-4">Task Details</h2>
            <p className="text-muted-foreground mb-6">{task.description}</p>

            <Separator className="my-6" />

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{task.location}</p>
                  <p className="text-sm text-muted-foreground">{task.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date & Time</p>
                  <p className="font-medium">{task.date}</p>
                  <p className="text-sm text-muted-foreground">{task.time}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">{task.duration}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Budget</p>
                  <p className="font-medium">৳{task.budget}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Bids */}
          {task.status === "open" && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2>Bids ({bids.length})</h2>
              <p className="text-sm text-muted-foreground">
                Avg: ৳{Math.round(bids.reduce((sum, bid) => sum + bid.amount, 0) / bids.length)}
              </p>
            </div>

            <div className="space-y-4">
              {bids.map((bid) => (
                <Card key={bid.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback>{bid.workerName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4>{bid.workerName}</h4>
                          {bid.verified && (
                            <Shield className="w-4 h-4 text-primary" title="Verified" />
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            {bid.rating}
                          </span>
                          <span>{bid.completedJobs} jobs</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{bid.responseTime}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl">৳{bid.amount}</p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">{bid.message}</p>

                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-primary hover:bg-primary/90"
                      onClick={() => handleAcceptBid(bid.id)}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Accept
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={() => handleMessageWorker(bid.workerId, bid.workerName)}>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                    <Button variant="outline" size="icon">
                      <Phone className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
          )}

          {/* Assigned Worker - In Progress / Assigned */}
          {["assigned", "in_progress", "in-progress"].includes(task.status) && task.assignedWorker && (
            <Card className="p-6">
              <h2 className="mb-6">Assigned Worker</h2>
              <Card className="p-4 bg-green-50 border-green-200">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-14 h-14">
                      <AvatarFallback>{task.assignedWorker.workerName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3>{task.assignedWorker.workerName}</h3>
                        {task.assignedWorker.verified && (
                          <Shield className="w-5 h-5 text-primary" title="Verified" />
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          {task.assignedWorker.rating}
                        </span>
                        <span>{task.assignedWorker.completedJobs} jobs</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Agreed Amount</p>
                    <p className="text-2xl font-semibold">৳{task.agreedAmount}</p>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => handleMessageWorker(task.assignedWorker.workerId || task.assignedWorker.id, task.assignedWorker.workerName)}>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Message Worker
                    </Button>
                    <Button variant="outline" size="icon">
                      <Phone className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={handleCompleteTask}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Complete & Pay
                  </Button>
                </div>
              </Card>

              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium mb-2">📋 Task Progress</h4>
                <p className="text-sm text-muted-foreground">
                  Your worker is on the job! Once the work is completed to your satisfaction, click "Mark as Complete & Pay" to release payment to the worker.
                </p>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {["open", "pending"].includes(task.status) && (
            <Card className="p-6">
              <h3 className="mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={handleEditTask}>
                  Edit Task
                </Button>
                <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive" onClick={handleCancelTask}>
                  Cancel Task
                </Button>
              </div>
            </Card>
          )}

          <Card className="p-6 bg-blue-50 border-primary/20">
            <h4 className="mb-2">💡 Tips</h4>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li>• Review worker profiles and ratings carefully</li>
              <li>• Message workers before accepting to clarify details</li>
              <li>• Check if workers have completed similar tasks</li>
              <li>• Consider verified workers for added security</li>
            </ul>
          </Card>
        </div>
      </div>

      {/* Accept Bid Dialog */}
      <AlertDialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Accept This Bid?</AlertDialogTitle>
            <AlertDialogDescription>
              You're about to accept {bids.find((b) => b.id === selectedBid)?.workerName}'s bid of ৳
              {bids.find((b) => b.id === selectedBid)?.amount}. This will notify the worker and move your task to "In Progress".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAcceptBid} className="bg-primary hover:bg-primary/90">
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-3">
            <DialogTitle className="text-lg">Select Payment Method</DialogTitle>
            <DialogDescription className="text-xs">
              Choose how you'd like to pay for this completed task
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-3 overflow-y-auto flex-1">
            <div className="space-y-3">
              {/* Worker and Amount Summary */}
              <Card className="p-3 bg-muted/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>{(task.assignedWorker?.workerName || bids.find((b) => b.id === selectedBid)?.workerName)?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium text-sm">{task.assignedWorker?.workerName || bids.find((b) => b.id === selectedBid)?.workerName}</h4>
                      <p className="text-xs text-muted-foreground">{task.title}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="text-xl font-semibold">৳{task.agreedAmount || bids.find((b) => b.id === selectedBid)?.amount}</p>
                  </div>
                </div>
              </Card>

              {/* Payment Methods */}
              <div className="space-y-2">
                <Label className="text-sm">Payment Method</Label>
                <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                  {paymentMethods.map((method) => (
                    <div key={method.id}>
                      <label
                        htmlFor={method.id}
                        className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors"
                      >
                        <RadioGroupItem value={method.id} id={method.id} />
                        <div className="flex items-center gap-3 flex-1">
                          {method.type === "card" ? (
                            <>
                              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                <CreditCard className="w-5 h-5 text-primary" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-sm">{method.brand} ••{method.last4}</p>
                                  {method.isDefault && (
                                    <Badge variant="outline" className="text-xs">Default</Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground">Credit/Debit Card</p>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                                <Wallet className="w-5 h-5 text-success" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-sm">MiniMates Wallet</p>
                                <p className="text-xs text-muted-foreground">Balance: ৳{method.balance.toFixed(2)}</p>
                              </div>
                            </>
                          )}
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Payment Breakdown */}
              <div className="space-y-2 pt-3 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Task Amount</span>
                  <span>৳{(task.agreedAmount || bids.find((b) => b.id === selectedBid)?.amount)?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Service Fee</span>
                  <span>৳0.00</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-primary">৳{(task.agreedAmount || bids.find((b) => b.id === selectedBid)?.amount)?.toFixed(2)}</span>
                </div>
              </div>

              {/* Security Note */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-2.5">
                <p className="text-xs text-green-900">
                  ✅ Payment will be released to {task.assignedWorker?.workerName || bids.find((b) => b.id === selectedBid)?.workerName} upon confirmation. You can rate your experience after payment.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t">
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmPayment} className="bg-green-600 hover:bg-green-700">
              <CreditCard className="w-4 h-4 mr-2" />
              Pay ৳{(task.agreedAmount || bids.find((b) => b.id === selectedBid)?.amount)?.toFixed(2)}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Task Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel This Task?</AlertDialogTitle>
            <AlertDialogDescription>
              You're about to cancel this task. This will notify all workers and remove the task from your list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Go Back</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancelTask} className="bg-red-500 hover:bg-red-600">
              Confirm Cancel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Task Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Update the details of your task.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={editFormData.title}
                onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={editFormData.description}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Budget (৳)</Label>
              <Input
                type="number"
                value={editFormData.budget}
                onChange={(e) => setEditFormData({ ...editFormData, budget: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={editFormData.location}
                onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input
                value={editFormData.address}
                onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmEditTask} className="bg-primary hover:bg-primary/90">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Complete Task Dialog */}
      <AlertDialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark Task as Complete?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you satisfied with the work completed by {task.assignedWorker?.workerName}? Once confirmed, you'll proceed to payment and the task will be marked as complete.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Not Yet</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCompleteTask} className="bg-green-600 hover:bg-green-700">
              Yes, Proceed to Payment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Share Task Dialog */}
      <AlertDialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Share This Task?</AlertDialogTitle>
            <AlertDialogDescription>
              You're about to share this task. This will allow others to see and bid on your task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => setShowShareDialog(false)} className="bg-primary hover:bg-primary/90">
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Rating Dialog */}
      <Dialog open={showRatingDialog} onOpenChange={setShowRatingDialog}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-3">
            <DialogTitle className="text-lg">Rate Your Experience</DialogTitle>
            <DialogDescription className="text-xs">
              Please provide feedback on your experience with {task.assignedWorker?.workerName || acceptedWorker?.workerName}
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-3 overflow-y-auto flex-1">
            <div className="space-y-4">
              {/* Worker Info */}
              <Card className="p-3 bg-muted/50">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback>{(task.assignedWorker?.workerName || acceptedWorker?.workerName)?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{task.assignedWorker?.workerName || acceptedWorker?.workerName}</h4>
                    <p className="text-xs text-muted-foreground">{task.title}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Paid</p>
                    <p className="text-lg font-semibold">৳{task.agreedAmount || task.budget}</p>
                  </div>
                </div>
              </Card>

              {/* Overall Rating */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Overall Rating</Label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-8 h-8 cursor-pointer transition-all ৳{
                        star <= (hoverRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                    />
                  ))}
                  {rating > 0 && (
                    <span className="ml-2 text-sm font-medium">{rating}.0</span>
                  )}
                </div>
              </div>

              {/* Category Ratings */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Quality</Label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 cursor-pointer transition-all ৳{
                          star <= ratingCategories.quality
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                        onClick={() => setRatingCategories({ ...ratingCategories, quality: star })}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Communication</Label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 cursor-pointer transition-all ৳{
                          star <= ratingCategories.communication
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                        onClick={() => setRatingCategories({ ...ratingCategories, communication: star })}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Timeliness</Label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 cursor-pointer transition-all ৳{
                          star <= ratingCategories.timeliness
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                        onClick={() => setRatingCategories({ ...ratingCategories, timeliness: star })}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Professionalism</Label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 cursor-pointer transition-all ৳{
                          star <= ratingCategories.professionalism
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                        onClick={() => setRatingCategories({ ...ratingCategories, professionalism: star })}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Review Text */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Write a Review <span className="text-muted-foreground font-normal">(Optional)</span>
                </Label>
                <Textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share details about your experience..."
                  rows={3}
                  className="text-sm resize-none"
                />
              </div>

              {/* Encouragement Note */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5">
                <p className="text-xs text-blue-900">
                  💡 Your honest feedback helps other clients make informed decisions and helps workers improve their service.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t">
            <Button variant="outline" onClick={skipRating}>
              Skip for Now
            </Button>
            <Button 
              onClick={submitRating} 
              disabled={rating === 0}
              className="bg-primary hover:bg-primary/90"
            >
              <Star className="w-4 h-4 mr-2" />
              Submit Rating
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}