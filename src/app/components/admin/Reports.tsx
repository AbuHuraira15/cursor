import { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Textarea } from "../ui/textarea";
import { AlertTriangle, CheckCircle, XCircle, Clock, MessageSquare, Mail } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { toast } from "sonner";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

interface ReportsProps {
  onNavigate: (page: string) => void;
}

export function Reports({ onNavigate }: ReportsProps) {
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [showResolveDialog, setShowResolveDialog] = useState(false);
  const [showDismissDialog, setShowDismissDialog] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [resolution, setResolution] = useState("");
  const [dismissalReason, setDismissalReason] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactRecipients, setContactRecipients] = useState({
    reporter: false,
    reportedUser: false
  });

  const [reportsData, setReportsData] = useState([
    {
      id: "1",
      type: "Payment Dispute",
      reportedBy: "Karim Hasan",
      reportedUser: "Rahim Uddin",
      task: "Fix kitchen faucet",
      status: "pending",
      priority: "high",
      description: "Worker completed task but there were issues with quality. Requesting partial refund.",
      submittedDate: "2h ago",
      details: {
        taskId: "T-1234",
        amount: 80,
        clientStory: "The faucet is still leaking after the worker left. Not satisfied with the work.",
        workerStory: "I fixed the faucet properly. Client approved the work before I left."
      }
    },
    {
      id: "2",
      type: "Harassment",
      reportedBy: "Sarah Williams",
      reportedUser: "Tom Anderson",
      task: "Garden maintenance",
      status: "pending",
      priority: "urgent",
      description: "Worker was inappropriate and made me uncomfortable during the task.",
      submittedDate: "5h ago",
      details: {
        taskId: "T-5678",
        clientStory: "Worker made several inappropriate comments. I felt unsafe.",
        evidence: "Screenshots of messages"
      }
    },
    {
      id: "3",
      type: "No Show",
      reportedBy: "Emily Chen",
      reportedUser: "Alex Brown",
      task: "Deep cleaning",
      status: "resolved",
      priority: "medium",
      description: "Worker didn't show up for scheduled task.",
      submittedDate: "1d ago",
      resolvedDate: "20h ago",
      resolution: "Refunded client and issued warning to worker.",
      details: {
        taskId: "T-9012",
        scheduledTime: "Jan 13, 2026 2:00 PM"
      }
    },
    {
      id: "4",
      type: "Task Misrepresentation",
      reportedBy: "David Lee",
      reportedUser: "Lisa Martin",
      task: "Move furniture",
      status: "dismissed",
      priority: "low",
      description: "Client didn't mention having to move items up 3 flights of stairs.",
      submittedDate: "2d ago",
      resolvedDate: "1d ago",
      resolution: "Task description was adequate. No action needed.",
      details: {
        taskId: "T-3456"
      }
    }
  ]);

  const pendingReports = reportsData.filter((r) => r.status === "pending");
  const resolvedReports = reportsData.filter((r) => r.status === "resolved");
  const dismissedReports = reportsData.filter((r) => r.status === "dismissed");

  const handleResolve = (report: any) => {
    setSelectedReport(report);
    setShowResolveDialog(true);
  };

  const handleDismiss = (report: any) => {
    setSelectedReport(report);
    setShowDismissDialog(true);
  };

  const handleContact = (report: any) => {
    setSelectedReport(report);
    setShowContactDialog(true);
  };

  const confirmResolve = () => {
    setShowResolveDialog(false);
    setResolution("");
    // In real app, update report status in backend
    const updatedReports = reportsData.map(report => {
      if (report.id === selectedReport.id) {
        return {
          ...report,
          status: "resolved",
          resolution: resolution,
          resolvedDate: new Date().toLocaleString()
        };
      }
      return report;
    });
    setReportsData(updatedReports);
    toast.success("Report resolved successfully!");
  };

  const confirmDismiss = () => {
    setShowDismissDialog(false);
    setDismissalReason("");
    // In real app, update report status in backend
    const updatedReports = reportsData.map(report => {
      if (report.id === selectedReport.id) {
        return {
          ...report,
          status: "dismissed",
          resolution: dismissalReason,
          resolvedDate: new Date().toLocaleString()
        };
      }
      return report;
    });
    setReportsData(updatedReports);
    toast.success("Report dismissed successfully!");
  };

  const sendContactMessage = () => {
    setShowContactDialog(false);
    setContactMessage("");
    setContactRecipients({
      reporter: false,
      reportedUser: false
    });
    // In real app, send message to users
    toast.success("Message sent successfully!");
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Badge className="bg-red-600">Urgent</Badge>;
      case "high":
        return <Badge className="bg-orange-600">High</Badge>;
      case "medium":
        return <Badge className="bg-yellow-600">Medium</Badge>;
      default:
        return <Badge variant="outline">Low</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5 text-orange-600" />;
      case "resolved":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "dismissed":
        return <XCircle className="w-5 h-5 text-gray-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1>Reports & Moderation</h1>
        <p className="text-muted-foreground">Review and resolve user reports and disputes</p>
      </div>

      <Tabs defaultValue="pending">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending">
            Pending ({pendingReports.length})
          </TabsTrigger>
          <TabsTrigger value="all">All ({reportsData.length})</TabsTrigger>
          <TabsTrigger value="resolved">
            Resolved ({resolvedReports.length})
          </TabsTrigger>
          <TabsTrigger value="dismissed">
            Dismissed ({dismissedReports.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6 space-y-4">
          {pendingReports.length === 0 ? (
            <Card className="p-12 text-center">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-600" />
              <h3 className="mb-2">No Pending Reports</h3>
              <p className="text-muted-foreground">All caught up! No reports need review.</p>
            </Card>
          ) : (
            pendingReports.map((report) => (
              <Card key={report.id} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3>{report.type}</h3>
                          {getPriorityBadge(report.priority)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Reported {report.submittedDate} by <strong>{report.reportedBy}</strong>
                        </p>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-4">{report.description}</p>

                    <div className="grid sm:grid-cols-2 gap-4 mb-4 p-4 bg-muted/30 rounded-lg">
                      <div>
                        <p className="text-sm font-medium mb-1">Reported User</p>
                        <div className="flex items-center gap-2">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs">
                              {report.reportedUser.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{report.reportedUser}</span>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-1">Related Task</p>
                        <p className="text-sm text-muted-foreground">{report.task}</p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {report.details.taskId}
                        </Badge>
                      </div>
                    </div>

                    {report.details.clientStory && (
                      <div className="mb-3 p-3 border rounded-lg">
                        <p className="text-sm font-medium mb-1">Client's Account:</p>
                        <p className="text-sm text-muted-foreground italic">
                          "{report.details.clientStory}"
                        </p>
                      </div>
                    )}

                    {report.details.workerStory && (
                      <div className="mb-3 p-3 border rounded-lg">
                        <p className="text-sm font-medium mb-1">Worker's Account:</p>
                        <p className="text-sm text-muted-foreground italic">
                          "{report.details.workerStory}"
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2 mt-4">
                      <Button
                        className="bg-primary hover:bg-primary/90"
                        onClick={() => handleResolve(report)}
                      >
                        Resolve Report
                      </Button>
                      <Button variant="outline" onClick={() => handleDismiss(report)}>
                        Dismiss
                      </Button>
                      <Button variant="outline" onClick={() => handleContact(report)}>
                        Contact Users
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="all" className="mt-6 space-y-4">
          {reportsData.map((report) => (
            <Card key={report.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                    {getStatusIcon(report.status)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4>{report.type}</h4>
                      {getPriorityBadge(report.priority)}
                      {report.status === "resolved" && (
                        <Badge className="bg-green-100 text-green-700">Resolved</Badge>
                      )}
                      {report.status === "dismissed" && (
                        <Badge variant="outline">Dismissed</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{report.description}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>Reported by {report.reportedBy}</span>
                      <span>•</span>
                      <span>{report.submittedDate}</span>
                    </div>
                  </div>
                </div>

                {report.status === "pending" && (
                  <Button size="sm" onClick={() => handleResolve(report)}>
                    Review
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="resolved" className="mt-6 space-y-4">
          {resolvedReports.map((report) => (
            <Card key={report.id} className="p-4 bg-green-50 border-green-200">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4>{report.type}</h4>
                    <Badge className="bg-green-600">Resolved</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{report.description}</p>
                  <div className="p-3 bg-white border rounded-lg mb-2">
                    <p className="text-sm font-medium mb-1">Resolution:</p>
                    <p className="text-sm text-muted-foreground">{report.resolution}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Resolved {report.resolvedDate}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="dismissed" className="mt-6 space-y-4">
          {dismissedReports.map((report) => (
            <Card key={report.id} className="p-4 opacity-60">
              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-gray-600 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4>{report.type}</h4>
                    <Badge variant="outline">Dismissed</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{report.description}</p>
                  <p className="text-sm text-muted-foreground mb-2">
                    Reason: {report.resolution}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Dismissed {report.resolvedDate}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Resolve Dialog */}
      <Dialog open={showResolveDialog} onOpenChange={setShowResolveDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Resolve Report</DialogTitle>
            <DialogDescription>
              Provide a resolution for this report. This will notify both parties.
            </DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="mb-2">{selectedReport.type}</h4>
                <p className="text-sm text-muted-foreground">{selectedReport.description}</p>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Resolution & Actions Taken
                </label>
                <Textarea
                  placeholder="Describe how you resolved this issue..."
                  rows={5}
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResolveDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmResolve}
              disabled={!resolution}
              className="bg-green-600 hover:bg-green-700"
            >
              Mark as Resolved
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dismiss Dialog */}
      <Dialog open={showDismissDialog} onOpenChange={setShowDismissDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Dismiss Report</DialogTitle>
            <DialogDescription>
              Provide a reason for dismissing this report. This will notify both parties.
            </DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="mb-2">{selectedReport.type}</h4>
                <p className="text-sm text-muted-foreground">{selectedReport.description}</p>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Reason for Dismissal
                </label>
                <Textarea
                  placeholder="Describe why you are dismissing this report..."
                  rows={5}
                  value={dismissalReason}
                  onChange={(e) => setDismissalReason(e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDismissDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmDismiss}
              disabled={!dismissalReason}
              className="bg-red-600 hover:bg-red-700"
            >
              Dismiss Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contact Dialog */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Contact Users</DialogTitle>
            <DialogDescription>
              Send a message to the reporter and/or reported user.
            </DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="mb-2">{selectedReport.type}</h4>
                <p className="text-sm text-muted-foreground">{selectedReport.description}</p>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Recipients
                </label>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="reporter"
                    checked={contactRecipients.reporter}
                    onCheckedChange={(checked) => setContactRecipients(prev => ({ ...prev, reporter: checked }))}
                  />
                  <Label htmlFor="reporter">Reporter ({selectedReport.reportedBy})</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="reportedUser"
                    checked={contactRecipients.reportedUser}
                    onCheckedChange={(checked) => setContactRecipients(prev => ({ ...prev, reportedUser: checked }))}
                  />
                  <Label htmlFor="reportedUser">Reported User ({selectedReport.reportedUser})</Label>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Message
                </label>
                <Textarea
                  placeholder="Type your message here..."
                  rows={5}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowContactDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={sendContactMessage}
              disabled={!contactMessage || (!contactRecipients.reporter && !contactRecipients.reportedUser)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}