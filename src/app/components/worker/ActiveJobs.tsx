import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { ChevronLeft, MapPin, Calendar, Clock, DollarSign, Phone, MessageSquare, Navigation, CheckCircle, Star } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { getTasks } from "../../lib/api";

interface ActiveJobsProps {
  onNavigate: (page: string, params?: any) => void;
  onBack: () => void;
  authToken: string;
}

export function ActiveJobs({ onNavigate, onBack, authToken }: ActiveJobsProps) {
  const [jobStatus, setJobStatus] = useState<"accepted" | "on-way" | "in-progress" | "completed">("accepted");
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [job, setJob] = useState<any>({
    id: "1",
    title: "No active job",
    description: "Accepted jobs will appear here.",
    clientId: null,
    client: "Client",
    clientRating: 5,
    clientPhone: "N/A",
    location: "N/A",
    date: "N/A",
    time: "N/A",
    amount: 0,
    platformFee: 0,
    netEarnings: 0,
  });

  useEffect(() => {
    if (!authToken) return;
    getTasks(authToken)
      .then((data) => {
        const active = data.results.find((task) => ["assigned", "in_progress"].includes(task.status));
        if (!active) return;
        const amount = Number(active.budget);
        setJob({
          id: String(active.id),
          title: active.title,
          description: active.description,
          clientId: active.client,
          client: active.client_name || "Client",
          clientRating: 5,
          clientPhone: "N/A",
          location: active.location,
          date: active.scheduled_date,
          time: active.time_slot,
          amount,
          platformFee: amount * 0.1,
          netEarnings: amount * 0.9,
        });
      })
      .catch(() => undefined);
  }, [authToken]);

  const handleStatusUpdate = (newStatus: "on-way" | "in-progress" | "completed") => {
    if (newStatus === "completed") {
      setShowCompleteDialog(true);
    } else {
      setJobStatus(newStatus);
    }
  };

  const confirmComplete = () => {
    setJobStatus("completed");
    setShowCompleteDialog(false);
    // Navigate to payment/review screen
    setTimeout(() => {
      onNavigate("earnings");
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div>
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1>Active Job</h1>
            <p className="text-muted-foreground">Complete the task and confirm with the client</p>
          </div>
        </div>
      </div>

      {/* Status Tracker */}
      <Card className="p-6">
        <h2 className="mb-6">Job Progress</h2>
        <div className="flex items-center justify-between mb-8">
          <div className={`flex flex-col items-center ৳{jobStatus !== "accepted" ? "opacity-50" : ""}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ৳{
              jobStatus === "accepted" ? "bg-primary text-white" : "bg-muted text-muted-foreground"
            }`}>
              1
            </div>
            <span className="text-xs text-center">Accepted</span>
          </div>

          <div className={`flex-1 h-0.5 ৳{jobStatus !== "accepted" ? "bg-primary" : "bg-muted"}`} />

          <div className={`flex flex-col items-center ৳{!["on-way", "in-progress", "completed"].includes(jobStatus) ? "opacity-50" : ""}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ৳{
              ["on-way", "in-progress", "completed"].includes(jobStatus) ? "bg-primary text-white" : "bg-muted text-muted-foreground"
            }`}>
              2
            </div>
            <span className="text-xs text-center">On My Way</span>
          </div>

          <div className={`flex-1 h-0.5 ৳{["in-progress", "completed"].includes(jobStatus) ? "bg-primary" : "bg-muted"}`} />

          <div className={`flex flex-col items-center ৳{!["in-progress", "completed"].includes(jobStatus) ? "opacity-50" : ""}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ৳{
              ["in-progress", "completed"].includes(jobStatus) ? "bg-primary text-white" : "bg-muted text-muted-foreground"
            }`}>
              3
            </div>
            <span className="text-xs text-center">In Progress</span>
          </div>

          <div className={`flex-1 h-0.5 ৳{jobStatus === "completed" ? "bg-green-600" : "bg-muted"}`} />

          <div className={`flex flex-col items-center ৳{jobStatus !== "completed" ? "opacity-50" : ""}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ৳{
              jobStatus === "completed" ? "bg-green-600 text-white" : "bg-muted text-muted-foreground"
            }`}>
              <CheckCircle className="w-5 h-5" />
            </div>
            <span className="text-xs text-center">Completed</span>
          </div>
        </div>

        {/* Status Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          {jobStatus === "accepted" && (
            <Button 
              className="flex-1 bg-primary hover:bg-primary/90"
              onClick={() => handleStatusUpdate("on-way")}
            >
              <Navigation className="w-4 h-4 mr-2" />
              I'm On My Way
            </Button>
          )}

          {jobStatus === "on-way" && (
            <Button 
              className="flex-1 bg-primary hover:bg-primary/90"
              onClick={() => handleStatusUpdate("in-progress")}
            >
              Start Task
            </Button>
          )}

          {jobStatus === "in-progress" && (
            <Button 
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={() => handleStatusUpdate("completed")}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark as Complete
            </Button>
          )}

          {jobStatus === "completed" && (
            <div className="flex-1 bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="font-medium text-green-700">Job Completed!</p>
              <p className="text-sm text-muted-foreground">Waiting for client confirmation</p>
            </div>
          )}
        </div>
      </Card>

      {/* Job Details */}
      <Card className="p-6">
        <h2 className="mb-4">Job Details</h2>

        <div className="space-y-4">
          <div>
            <h3 className="mb-1">{job.title}</h3>
            <p className="text-muted-foreground">{job.description}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 pt-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">{job.location}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date & Time</p>
                <p className="font-medium">{job.date}</p>
                <p className="text-sm text-muted-foreground">{job.time}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payment</p>
                <p className="font-medium">৳{job.amount}</p>
                <p className="text-xs text-muted-foreground">
                  Your earnings: ৳{job.netEarnings} (after ৳{job.platformFee} fee)
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Client Info */}
      <Card className="p-6">
        <h2 className="mb-4">Client Information</h2>

        <div className="flex items-start gap-4 mb-4">
          <Avatar className="w-12 h-12">
            <AvatarFallback>EC</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3>{job.client}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                {job.clientRating}
              </span>
              <span>• Verified Client</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1">
            <Phone className="w-4 h-4 mr-2" />
            Call Client
          </Button>
          <Button variant="outline" className="flex-1" onClick={() => onNavigate("messages", {
            targetUserId: job.clientId,
            targetUserName: job.client,
            taskId: job.id,
            taskTitle: job.title
          })}>
            <MessageSquare className="w-4 h-4 mr-2" />
            Message
          </Button>
        </div>
      </Card>

      {/* Complete Job Dialog */}
      <AlertDialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark Job as Complete?</AlertDialogTitle>
            <AlertDialogDescription>
              Please confirm that you have completed the task to the client's satisfaction. The client will review and release payment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Not Yet</AlertDialogCancel>
            <AlertDialogAction onClick={confirmComplete} className="bg-green-600 hover:bg-green-700">
              Confirm Complete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
