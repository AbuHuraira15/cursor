import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Avatar } from "../ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  User,
  Briefcase,
  Send,
  Filter
} from "lucide-react";

interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userType: "client" | "worker";
  userAvatar?: string;
  subject: string;
  message: string;
  category: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  createdAt: string;
  lastUpdate: string;
  responses: number;
}

export function AdminSupportCenter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");

  // Mock support tickets from clients and workers
  const [tickets] = useState<SupportTicket[]>([
    {
      id: "T001",
      userId: "C123",
      userName: "Sarah Johnson",
      userType: "client",
      subject: "Payment not processing",
      message: "I'm trying to pay for a completed task but my credit card keeps getting declined. I've verified with my bank and the card is working fine. Can you help?",
      category: "Payment Issues",
      status: "open",
      priority: "high",
      createdAt: "10 min ago",
      lastUpdate: "10 min ago",
      responses: 0
    },
    {
      id: "T002",
      userId: "W456",
      userName: "Sajid Ali",
      userType: "worker",
      subject: "Client not responding",
      message: "I completed a plumbing task 3 days ago and the client hasn't marked it as complete. I've tried contacting them but no response. Task ID: #T4521",
      category: "Task Dispute",
      status: "in-progress",
      priority: "medium",
      createdAt: "2 hours ago",
      lastUpdate: "1 hour ago",
      responses: 2
    },
    {
      id: "T003",
      userId: "C789",
      userName: "Emily Rodriguez",
      userType: "client",
      subject: "Need to cancel task",
      message: "I posted a task but need to cancel it urgently. The worker hasn't started yet. How can I cancel and get a refund?",
      category: "Task Management",
      status: "open",
      priority: "medium",
      createdAt: "3 hours ago",
      lastUpdate: "3 hours ago",
      responses: 0
    },
    {
      id: "T004",
      userId: "W234",
      userName: "Tareq Rahman",
      userType: "worker",
      subject: "Verification document rejected",
      message: "My ID verification was rejected but I don't understand why. I submitted a valid driver's license. Can you review it again?",
      category: "Account Verification",
      status: "open",
      priority: "high",
      createdAt: "5 hours ago",
      lastUpdate: "5 hours ago",
      responses: 0
    },
    {
      id: "T005",
      userId: "W567",
      userName: "Maria Garcia",
      userType: "worker",
      subject: "Earnings withdrawal delayed",
      message: "I requested a withdrawal 5 business days ago but haven't received it yet. My bank account details are correct. Please check the status.",
      category: "Payment Issues",
      status: "in-progress",
      priority: "urgent",
      createdAt: "1 day ago",
      lastUpdate: "6 hours ago",
      responses: 3
    },
    {
      id: "T006",
      userId: "C345",
      userName: "David Kim",
      userType: "client",
      subject: "Worker didn't show up",
      message: "I hired a worker for a cleaning task today but they never showed up. I've been charged already. What should I do?",
      category: "Task Dispute",
      status: "open",
      priority: "urgent",
      createdAt: "30 min ago",
      lastUpdate: "30 min ago",
      responses: 0
    },
    {
      id: "T007",
      userId: "C678",
      userName: "Lisa Thompson",
      userType: "client",
      subject: "How to edit posted task?",
      message: "I need to change the date on a task I posted. Is this possible? If so, how do I do it?",
      category: "Task Management",
      status: "resolved",
      priority: "low",
      createdAt: "2 days ago",
      lastUpdate: "1 day ago",
      responses: 1
    },
    {
      id: "T008",
      userId: "W890",
      userName: "Robert Wilson",
      userType: "worker",
      subject: "Unfair negative review",
      message: "A client left a 1-star review saying I didn't complete the work, but I have photos proving I did. This is affecting my rating. Can you help?",
      category: "Dispute Resolution",
      status: "in-progress",
      priority: "high",
      createdAt: "1 day ago",
      lastUpdate: "12 hours ago",
      responses: 4
    }
  ]);

  const stats = {
    totalTickets: tickets.length,
    openTickets: tickets.filter(t => t.status === "open").length,
    inProgressTickets: tickets.filter(t => t.status === "in-progress").length,
    resolvedToday: 15,
    avgResponseTime: "12 min"
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-500";
      case "high": return "bg-orange-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "border-blue-500 bg-blue-50";
      case "in-progress": return "border-yellow-500 bg-yellow-50";
      case "resolved": return "border-green-500 bg-green-50";
      case "closed": return "border-gray-500 bg-gray-50";
      default: return "border-gray-300";
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || ticket.status === filterStatus;
    const matchesPriority = filterPriority === "all" || ticket.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleSendReply = () => {
    if (replyMessage.trim() && selectedTicket) {
      // In real app, send reply to backend
      console.log("Sending reply to ticket:", selectedTicket.id, replyMessage);
      setReplyMessage("");
      // Show success message
      alert("Reply sent successfully!");
    }
  };

  const handleUpdateStatus = (ticketId: string, newStatus: string) => {
    // In real app, update status in backend
    console.log("Updating ticket", ticketId, "to status:", newStatus);
    alert(`Ticket ৳{ticketId} updated to ৳{newStatus}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="mb-2">Admin Support Center</h1>
        <p className="text-muted-foreground">
          Manage support tickets from clients and workers
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Tickets</p>
              <p className="text-2xl font-bold">{stats.totalTickets}</p>
            </div>
            <MessageCircle className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Open</p>
              <p className="text-2xl font-bold text-blue-600">{stats.openTickets}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">In Progress</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.inProgressTickets}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Resolved Today</p>
              <p className="text-2xl font-bold text-green-600">{stats.resolvedToday}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Response</p>
              <p className="text-2xl font-bold">{stats.avgResponseTime}</p>
            </div>
            <Clock className="w-8 h-8 text-primary" />
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket List */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <div className="space-y-4 mb-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search tickets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              <div className="flex gap-2">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tickets */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filteredTickets.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No tickets found</p>
              ) : (
                filteredTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                    className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ৳{
                      selectedTicket?.id === ticket.id ? getStatusColor(ticket.status) : ""
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8 bg-primary text-white flex items-center justify-center text-sm">
                          {ticket.userName.charAt(0)}
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{ticket.userName}</p>
                          <div className="flex items-center gap-1">
                            {ticket.userType === "client" ? (
                              <User className="w-3 h-3 text-blue-500" />
                            ) : (
                              <Briefcase className="w-3 h-3 text-green-500" />
                            )}
                            <span className="text-xs text-muted-foreground capitalize">
                              {ticket.userType}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className={`w-2 h-2 rounded-full ৳{getPriorityColor(ticket.priority)}`} />
                    </div>
                    
                    <h4 className="text-sm font-medium mb-1 line-clamp-1">{ticket.subject}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                      {ticket.message}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs">
                      <Badge variant="outline" className="text-xs">
                        {ticket.status.replace("-", " ")}
                      </Badge>
                      <span className="text-muted-foreground">{ticket.createdAt}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Ticket Detail */}
        <div className="lg:col-span-2">
          {selectedTicket ? (
            <Card className="p-6">
              {/* Ticket Header */}
              <div className="border-b pb-4 mb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12 bg-primary text-white flex items-center justify-center">
                      {selectedTicket.userName.charAt(0)}
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{selectedTicket.userName}</h3>
                      <div className="flex items-center gap-2">
                        {selectedTicket.userType === "client" ? (
                          <User className="w-4 h-4 text-blue-500" />
                        ) : (
                          <Briefcase className="w-4 h-4 text-green-500" />
                        )}
                        <span className="text-sm text-muted-foreground capitalize">
                          {selectedTicket.userType}
                        </span>
                        <span className="text-sm text-muted-foreground">• ID: {selectedTicket.userId}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Select
                      value={selectedTicket.status}
                      onValueChange={(value) => handleUpdateStatus(selectedTicket.id, value)}
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Badge className={getPriorityColor(selectedTicket.priority) + " text-white"}>
                    {selectedTicket.priority.toUpperCase()}
                  </Badge>
                  <Badge variant="outline">{selectedTicket.category}</Badge>
                  <span className="text-muted-foreground">Ticket #{selectedTicket.id}</span>
                </div>
              </div>

              {/* Ticket Content */}
              <div className="mb-6">
                <h2 className="mb-3">{selectedTicket.subject}</h2>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm leading-relaxed">{selectedTicket.message}</p>
                </div>
                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <span>Created: {selectedTicket.createdAt}</span>
                  <span>•</span>
                  <span>Last updated: {selectedTicket.lastUpdate}</span>
                  <span>•</span>
                  <span>{selectedTicket.responses} responses</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <Button variant="outline" className="w-full">
                  <Mail className="w-4 h-4 mr-2" />
                  Email User
                </Button>
                <Button variant="outline" className="w-full">
                  <Phone className="w-4 h-4 mr-2" />
                  Call User
                </Button>
                <Button variant="outline" className="w-full">
                  <User className="w-4 h-4 mr-2" />
                  View Profile
                </Button>
              </div>

              {/* Reply Section */}
              <div className="border-t pt-4">
                <Label className="mb-2 block">Send Reply</Label>
                <Textarea
                  placeholder="Type your response to the user..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows={4}
                  className="mb-3"
                />
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Add Template
                    </Button>
                    <Button variant="outline" size="sm">
                      Attach File
                    </Button>
                  </div>
                  <Button onClick={handleSendReply} disabled={!replyMessage.trim()}>
                    <Send className="w-4 h-4 mr-2" />
                    Send Reply
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-12 flex flex-col items-center justify-center text-center">
              <MessageCircle className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="mb-2">No Ticket Selected</h3>
              <p className="text-muted-foreground">
                Select a support ticket from the list to view details and respond
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={`text-sm font-medium ৳{className}`}>{children}</label>;
}
