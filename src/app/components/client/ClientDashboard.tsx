import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Plus, Briefcase, Clock, CheckCircle, MapPin, DollarSign } from "lucide-react";
import { PostTaskWizard } from "./PostTaskWizard";
import { MyTasks } from "./MyTasks";
import { TaskDetail } from "./TaskDetail";
import { ClientProfile } from "./ClientProfile";
import { Payments } from "./Payments";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { createTask, getTasks, type AuthUser } from "../../lib/api";

interface ClientDashboardProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  authToken: string;
  authUser: AuthUser | null;
}

export function ClientDashboard({ currentPage, onNavigate, authToken, authUser }: ClientDashboardProps) {
  const [showPostTask, setShowPostTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    if (!authToken) return;
    getTasks(authToken)
      .then((data) => {
        const mappedTasks = data.results.map((task) => ({
          id: String(task.id),
          title: task.title,
          description: task.description,
          category: task.category,
          status: task.status === "in_progress" ? "in-progress" : task.status,
          budget: Number(task.budget),
          bids: task.bids_count,
          location: task.location,
          address: task.address,
          date: format(new Date(task.scheduled_date), "MMM d, yyyy"),
          time: task.time_slot,
          duration: task.duration,
          postedDate: format(new Date(task.created_at), "MMM d, yyyy"),
          assignedWorker: task.assigned_worker,
          bidsList: task.bids || [],
        }));
        setTasks(mappedTasks);
      })
      .catch(() => setTasks([]));
  }, [authToken]);

  const handleAddTask = async (taskData: any) => {
    if (!authToken) return;
    const created = await createTask(authToken, {
      title: taskData.title,
      description: taskData.description,
      category: taskData.category,
      location: taskData.location,
      address: taskData.address,
      scheduled_date: format(taskData.date, "yyyy-MM-dd"),
      time_slot: taskData.time,
      duration: taskData.duration,
      budget: Number(taskData.budget),
    });
    const newTask = {
      id: String(created.id),
      title: created.title,
      category: created.category,
      status: "open",
      budget: Number(created.budget),
      bids: created.bids_count,
      location: created.location,
      postedDate: format(new Date(created.created_at), "MMM d, yyyy"),
      description: created.description,
      address: created.address,
      date: format(new Date(created.scheduled_date), "MMM d, yyyy"),
      time: created.time_slot,
      duration: created.duration,
    };
    setTasks([newTask, ...tasks]);
    setShowPostTask(false);
    onNavigate("my-tasks");
  };

  const handleUpdateTask = (taskId: string, updates: any) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };

  const handleCancelTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    onNavigate("my-tasks");
  };

  // Route to sub-pages
  if (currentPage === "post-task" || showPostTask) {
    return (
      <PostTaskWizard
        onClose={() => {
          setShowPostTask(false);
          onNavigate("dashboard");
        }}
        onComplete={handleAddTask}
      />
    );
  }

  if (currentPage === "my-tasks") {
    return <MyTasks tasks={tasks} onNavigate={onNavigate} onSelectTask={(id) => {
      setSelectedTask(id);
      onNavigate("task-detail");
    }} />;
  }

  if (currentPage === "task-detail" && selectedTask) {
    const task = tasks.find(t => t.id === selectedTask);
    if (!task) {
      onNavigate("my-tasks");
      return null;
    }
    return (
      <TaskDetail 
        task={task}
        onBack={() => onNavigate("my-tasks")} 
        onNavigate={onNavigate}
        onUpdateTask={handleUpdateTask}
        onCancelTask={handleCancelTask}
        authToken={authToken}
      />
    );
  }

  if (currentPage === "profile" || currentPage === "settings") {
    return <ClientProfile currentPage={currentPage} onNavigate={onNavigate} authToken={authToken} />;
  }

  if (currentPage === "payments") {
    return <Payments onNavigate={onNavigate} authToken={authToken} />;
  }

  // Main Dashboard
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1>Welcome back, {authUser?.first_name || "Client"}!</h1>
          <p className="text-muted-foreground">Manage your tasks and find trusted workers</p>
        </div>
        <Button 
          className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
          onClick={() => setShowPostTask(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Post New Task
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Tasks</p>
              <h2 className="text-3xl mt-1">{tasks.filter(task => task.status === "in-progress").length}</h2>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <h2 className="text-3xl mt-1">{tasks.filter(task => task.status === "completed").length}</h2>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <h2 className="text-3xl mt-1">৳{tasks.reduce((total, task) => total + task.budget, 0)}</h2>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Tasks */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2>Recent Tasks</h2>
          <Button variant="ghost" onClick={() => onNavigate("my-tasks")}>
            View All
          </Button>
        </div>

        <div className="space-y-4">
          {tasks.map((task) => (
            <Card 
              key={task.id} 
              className="p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => {
                setSelectedTask(task.id);
                onNavigate("task-detail");
              }}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="flex-1">
                      <h3 className="mb-1">{task.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="outline" className="text-xs">
                          {task.category}
                        </Badge>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {task.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {task.postedDate}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="flex-1 sm:flex-none text-right">
                    <p className="text-sm text-muted-foreground">Budget</p>
                    <p className="font-semibold">৳{task.budget}</p>
                  </div>
                  
                  {task.status === "open" && (
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                      {task.bids} bids
                    </Badge>
                  )}
                  {task.status === "in-progress" && (
                    <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                      In Progress
                    </Badge>
                  )}
                  {task.status === "completed" && (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      Completed
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-primary/20">
        <h3 className="mb-2">Need help with a task?</h3>
        <p className="text-muted-foreground mb-4">
          Post your task and get competitive bids from verified workers in your area
        </p>
        <Button className="bg-primary hover:bg-primary/90" onClick={() => setShowPostTask(true)}>
          Post Your First Task
        </Button>
      </Card>
    </div>
  );
}