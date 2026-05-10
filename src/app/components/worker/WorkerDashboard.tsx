import { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { DollarSign, Briefcase, Star, TrendingUp, MapPin, Clock, AlertCircle } from "lucide-react";
import { BrowseTasks } from "./BrowseTasks";
import { MyBids } from "./MyBids";
import { ActiveJobs } from "./ActiveJobs";
import { Earnings } from "./Earnings";
import { WorkerProfile } from "./WorkerProfile";
import { TaskDetail } from "./TaskDetail";
import { getBids, getPayments, getTasks } from "../../lib/api";

interface WorkerDashboardProps {
  currentPage: string;
  onNavigate: (page: string, params?: any) => void;
  authToken: string;
}

export function WorkerDashboard({ currentPage, onNavigate, authToken }: WorkerDashboardProps) {
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [bids, setBids] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    if (!authToken) return;
    getTasks(authToken).then((data) => setTasks(data.results)).catch(() => setTasks([]));
    getBids(authToken).then((data) => setBids(data.results)).catch(() => setBids([]));
    getPayments(authToken).then((data) => setPayments(data.results)).catch(() => setPayments([]));
  }, [authToken]);

  const stats = useMemo(() => {
    const completedJobs = tasks.filter((task) => task.status === "completed").length;
    const activeJobs = tasks.filter((task) => ["assigned", "in_progress"].includes(task.status)).length;
    const activeBids = bids.filter((bid) => bid.status === "pending").length;
    const totalEarnings = payments
      .filter((payment) => payment.status === "completed")
      .reduce((sum, payment) => sum + Number(payment.task_amount || 0), 0);
    const pendingPayout = payments
      .filter((payment) => payment.status === "pending")
      .reduce((sum, payment) => sum + Number(payment.task_amount || 0), 0);
    return { completedJobs, activeJobs, activeBids, totalEarnings, pendingPayout, rating: 5.0 };
  }, [tasks, bids, payments]);

  const nearbyTasks = useMemo(
    () =>
      tasks
        .filter((task) => task.status === "open")
        .slice(0, 5)
        .map((task) => ({
          id: String(task.id),
          title: task.title,
          description: task.description,
          category: task.category,
          budget: Number(task.budget),
          distance: "N/A",
          location: task.location,
          date: task.scheduled_date,
          time: task.time_slot,
          postedTime: task.created_at?.slice(0, 10),
          bids: task.bids_count || 0,
          client: "Client",
          clientRating: 5,
          clientJobs: 0,
        })),
    [tasks],
  );

  const activeJob = useMemo(() => {
    const job = tasks.find((task) => ["assigned", "in_progress"].includes(task.status));
    if (!job) return null;
    return {
      id: String(job.id),
      title: job.title,
      client: "Client",
      clientRating: 5,
      location: job.location,
      amount: Number(job.budget),
      status: job.status,
      startTime: `${job.scheduled_date} ${job.time_slot}`,
    };
  }, [tasks]);

  // Route to sub-pages
  if (currentPage === "browse-tasks") {
    return <BrowseTasks onNavigate={onNavigate} onSelectTask={setSelectedTask} authToken={authToken} />;
  }

  if (currentPage === "my-bids") {
    return <MyBids onNavigate={onNavigate} authToken={authToken} />;
  }

  if (currentPage === "active-job") {
    return <ActiveJobs onNavigate={onNavigate} onBack={() => onNavigate("dashboard")} authToken={authToken} />;
  }

  if (currentPage === "earnings") {
    return <Earnings onNavigate={onNavigate} authToken={authToken} />;
  }

  if (currentPage === "profile" || currentPage === "settings") {
    return <WorkerProfile currentPage={currentPage} onNavigate={onNavigate} authToken={authToken} />;
  }

  if (currentPage === "task-detail" && selectedTask) {
    return (
      <TaskDetail
        task={selectedTask}
        onBack={() => onNavigate("browse-tasks")}
        onNavigate={onNavigate}
        authToken={authToken}
      />
    );
  }

  // Main Dashboard
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1>Welcome, Worker!</h1>
          <p className="text-muted-foreground">Find new tasks and grow your earnings</p>
        </div>
        <Button 
          className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
          onClick={() => onNavigate("browse-tasks")}
        >
          Browse Tasks
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Total Earnings</p>
            <DollarSign className="w-4 h-4 text-green-600" />
          </div>
          <h2 className="text-3xl text-green-600">৳{stats.totalEarnings}</h2>
          <p className="text-xs text-muted-foreground mt-1">All time</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Pending</p>
            <TrendingUp className="w-4 h-4 text-orange-600" />
          </div>
          <h2 className="text-3xl">৳{stats.pendingPayout}</h2>
          <p className="text-xs text-muted-foreground mt-1">To be paid</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Jobs Done</p>
            <Briefcase className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-3xl">{stats.completedJobs}</h2>
          <p className="text-xs text-muted-foreground mt-1">Completed</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Rating</p>
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          </div>
          <h2 className="text-3xl">{stats.rating}</h2>
          <p className="text-xs text-muted-foreground mt-1">From 47 reviews</p>
        </Card>
      </div>

      {/* Active Job Alert */}
      {activeJob ? (
        <Card className="p-4 bg-orange-50 border-orange-200">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-orange-500 hover:bg-orange-600">Active Job</Badge>
                <h3>{activeJob.title}</h3>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Client: {activeJob.client} ★ {activeJob.clientRating}</p>
                <p className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {activeJob.location}
                </p>
                <p className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {activeJob.startTime}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-semibold mb-2">৳{activeJob.amount}</p>
              <Button onClick={() => onNavigate("active-job")} size="sm">
                View Details
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">No active jobs right now.</p>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Nearby Tasks */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2>Nearby Tasks</h2>
            <Button variant="ghost" onClick={() => onNavigate("browse-tasks")}>
              View All
            </Button>
          </div>

          <div className="space-y-4">
            {nearbyTasks.map((task) => (
              <Card 
                key={task.id} 
                className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedTask(task);
                  onNavigate("task-detail");
                }}
              >
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="mb-2">{task.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {task.category}
                      </Badge>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {task.distance} away
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {task.postedTime}
                      </span>
                      <span>{task.bids} bids</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl">৳{task.budget}</p>
                    <Button size="sm" className="mt-2 bg-primary hover:bg-primary/90">
                      Place Bid
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
            {nearbyTasks.length === 0 && (
              <Card className="p-6">
                <p className="text-sm text-muted-foreground">No open tasks available now.</p>
              </Card>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card className="p-6">
            <h3 className="mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active Bids</span>
                <Badge variant="secondary">{stats.activeBids}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active Jobs</span>
                <Badge className="bg-orange-100 text-orange-700">{stats.activeJobs}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">This Week</span>
                <span className="font-semibold text-green-600">+৳180</span>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => onNavigate("earnings")}
            >
              View Earnings
            </Button>
          </Card>

          {/* Tips */}
          <Card className="p-6 bg-blue-50 border-primary/20">
            <h4 className="mb-2">💡 Tips for Success</h4>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li>• Respond to tasks quickly</li>
              <li>• Write detailed bid messages</li>
              <li>• Keep your profile updated</li>
              <li>• Maintain high ratings</li>
              <li>• Complete profile verification</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}