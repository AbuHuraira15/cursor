import { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Avatar } from "../ui/avatar";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { 
  ChevronLeft, 
  MapPin, 
  Calendar, 
  Clock, 
  DollarSign, 
  Star, 
  Briefcase,
  MessageSquare,
  AlertCircle
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "../ui/sheet";
import { createBid } from "../../lib/api";

interface TaskDetailProps {
  task: {
    id: string;
    title: string;
    description: string;
    category: string;
    budget: number;
    distance: string;
    location: string;
    date: string;
    time: string;
    postedTime: string;
    bids: number;
    client: string;
    clientRating: number;
    clientJobs: number;
  };
  onBack: () => void;
  onNavigate?: (page: string) => void;
  authToken?: string;
}

export function TaskDetail({ task, onBack, onNavigate, authToken }: TaskDetailProps) {
  const [showBidSheet, setShowBidSheet] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [bidMessage, setBidMessage] = useState("");
  const [bidSubmitted, setBidSubmitted] = useState(false);

  const handleSubmitBid = async () => {
    try {
      if (authToken) {
        await createBid(authToken, {
          task: Number(task.id),
          amount: Number(bidAmount),
          message: bidMessage,
        });
      }
      setBidSubmitted(true);
      setShowBidSheet(false);
    } catch {
      // keep open so worker can retry
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Browse Tasks
        </Button>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">{task.category}</Badge>
              <span className="text-sm text-muted-foreground">{task.postedTime}</span>
            </div>
            <h1 className="mb-2">{task.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {task.location} · {task.distance}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {task.date}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {task.time}
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground mb-1">Budget</p>
            <p className="text-3xl">৳{task.budget}</p>
            <p className="text-sm text-muted-foreground mt-1">{task.bids} bids received</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Task Description */}
          <Card className="p-6">
            <h3 className="mb-4">Task Description</h3>
            <p className="text-muted-foreground whitespace-pre-line">{task.description}</p>
          </Card>

          {/* Task Details */}
          <Card className="p-6">
            <h3 className="mb-4">Task Details</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Date</span>
                </div>
                <p>{task.date}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Time</span>
                </div>
                <p>{task.time}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">Location</span>
                </div>
                <p>{task.location}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-sm">Budget</span>
                </div>
                <p>৳{task.budget}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4">Task Availability</h3>
            <p className="text-sm text-muted-foreground">
              Browse the task list for more live opportunities from the backend.
            </p>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Action Card */}
          <Card className="p-6">
            {!bidSubmitted ? (
              <>
                <h3 className="mb-4">Ready to bid?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Submit your competitive bid to get hired for this task.
                </p>
                <Button 
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={() => setShowBidSheet(true)}
                >
                  Place a Bid
                </Button>
              </>
            ) : (
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="mb-2">Bid Submitted!</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  You'll be notified when the client reviews your bid.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => onNavigate?.("my-bids")}
                >
                  View My Bids
                </Button>
              </div>
            )}
          </Card>

          {/* Client Info */}
          <Card className="p-6">
            <h3 className="mb-4">About the Client</h3>
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="w-12 h-12 bg-primary text-white flex items-center justify-center">
                {task.client ? task.client.charAt(0) : "C"}
              </Avatar>
              <div>
                <p className="font-semibold">{task.client || "Client Name"}</p>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{task.clientRating || 5.0}</span>
                  <span className="text-muted-foreground">({task.clientJobs || 0} jobs)</span>
                </div>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Member since</span>
                <span>Jan 2024</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Response rate</span>
                <span>95%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Avg. response time</span>
                <span>2 hours</span>
              </div>
            </div>
          </Card>

          {/* Safety Tips */}
          <Card className="p-6 bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold mb-2">Safety Tips</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Always communicate through the platform</li>
                  <li>• Verify task details before accepting</li>
                  <li>• Report suspicious activity</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Place Bid Sheet */}
      <Sheet open={showBidSheet} onOpenChange={setShowBidSheet}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Place Your Bid</SheetTitle>
            <SheetDescription>
              Enter your bid amount and cover letter to submit your bid for this task.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6 mt-6">
            {/* Task Summary */}
            <Card className="p-4 bg-muted">
              <p className="font-semibold mb-1">{task.title}</p>
              <p className="text-sm text-muted-foreground">{task.location}</p>
              <p className="text-sm text-muted-foreground">Client Budget: ৳{task.budget}</p>
            </Card>

            {/* Bid Amount */}
            <div>
              <Label htmlFor="bidAmount">Your Bid Amount (BDT)</Label>
              <div className="relative mt-2">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="bidAmount"
                  type="number"
                  placeholder="Enter amount"
                  className="pl-10"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Suggested range: ৳{Math.floor(task.budget * 0.8)} - ৳{Math.ceil(task.budget * 1.2)}
              </p>
            </div>

            {/* Cover Letter */}
            <div>
              <Label htmlFor="bidMessage">Cover Letter</Label>
              <Textarea
                id="bidMessage"
                placeholder="Explain why you're the best fit for this task. Mention your relevant experience and how you plan to complete the work."
                rows={6}
                className="mt-2"
                value={bidMessage}
                onChange={(e) => setBidMessage(e.target.value)}
              />
              <p className="text-sm text-muted-foreground mt-1">
                A detailed cover letter increases your chances of getting hired
              </p>
            </div>

            {/* Fee Breakdown */}
            <Card className="p-4 bg-muted">
              <h4 className="mb-3">Earnings Breakdown</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Your bid</span>
                  <span>৳{bidAmount || "0"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service fee (10%)</span>
                  <span>-৳{bidAmount ? (parseFloat(bidAmount) * 0.1).toFixed(2) : "0"}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>You'll earn</span>
                  <span>৳{bidAmount ? (parseFloat(bidAmount) * 0.9).toFixed(2) : "0"}</span>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowBidSheet(false)}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-primary hover:bg-primary/90"
                onClick={handleSubmitBid}
                disabled={!bidAmount || !bidMessage}
              >
                Submit Bid
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}