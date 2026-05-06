import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Users, Briefcase, AlertTriangle, DollarSign, TrendingUp, Activity } from "lucide-react";
import { UserManagement } from "./UserManagement";
import { Reports } from "./Reports";
import { AdminSettings } from "./AdminSettings";
import { AdminProfile } from "./AdminProfile";
import { Analytics } from "./Analytics";
import { AdminNotificationCenter } from "./AdminNotificationCenter";
import { SendNotificationDialog } from "./SendNotificationDialog";
import { useState } from "react";

interface AdminDashboardProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function AdminDashboard({ currentPage, onNavigate }: AdminDashboardProps) {
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);

  const stats = {
    totalUsers: 2458,
    activeClients: 1205,
    activeWorkers: 892,
    totalTasks: 1842,
    activeTasks: 156,
    completedTasks: 1543,
    pendingReports: 12,
    platformRevenue: 28540,
    monthlyGrowth: 15.3
  };

  const recentActivity = [
    {
      id: "1",
      type: "user",
      action: "New user registered",
      user: "Sarah Johnson",
      role: "Worker",
      time: "5 min ago"
    },
    {
      id: "2",
      type: "report",
      action: "New report filed",
      user: "Karim Hasan",
      details: "Payment dispute",
      time: "15 min ago"
    },
    {
      id: "3",
      type: "task",
      action: "High-value task posted",
      user: "Emily Chen",
      amount: 500,
      time: "1 hour ago"
    },
    {
      id: "4",
      type: "user",
      action: "User verification completed",
      user: "Rahim Anderson",
      role: "Worker",
      time: "2 hours ago"
    }
  ];

  // Route to sub-pages
  if (currentPage === "users") {
    return <UserManagement onNavigate={onNavigate} />;
  }

  if (currentPage === "reports") {
    return <Reports onNavigate={onNavigate} />;
  }

  if (currentPage === "settings") {
    return <AdminSettings onNavigate={onNavigate} />;
  }

  if (currentPage === "profile") {
    return <AdminProfile onNavigate={onNavigate} />;
  }

  if (currentPage === "analytics") {
    return <Analytics onNavigate={onNavigate} />;
  }

  // Main Dashboard
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1>Admin Dashboard</h1>
        <p className="text-muted-foreground">Monitor platform activity and manage operations</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Total Users</p>
            <Users className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-3xl">{stats.totalUsers.toLocaleString()}</h2>
          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
            <span>{stats.activeClients} clients</span>
            <span>•</span>
            <span>{stats.activeWorkers} workers</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Active Tasks</p>
            <Briefcase className="w-4 h-4 text-blue-600" />
          </div>
          <h2 className="text-3xl">{stats.activeTasks}</h2>
          <p className="text-xs text-muted-foreground mt-2">
            {stats.completedTasks} completed
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Platform Revenue</p>
            <DollarSign className="w-4 h-4 text-green-600" />
          </div>
          <h2 className="text-3xl text-green-600">৳{stats.platformRevenue.toLocaleString()}</h2>
          <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +{stats.monthlyGrowth}% this month
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Pending Reports</p>
            <AlertTriangle className="w-4 h-4 text-orange-600" />
          </div>
          <h2 className="text-3xl text-orange-600">{stats.pendingReports}</h2>
          <Button 
            variant="link" 
            className="text-xs p-0 h-auto mt-2"
            onClick={() => onNavigate("reports")}
          >
            Review reports →
          </Button>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2>Recent Activity</h2>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>

            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ৳{
                    activity.type === "user" ? "bg-blue-100" :
                    activity.type === "report" ? "bg-orange-100" : "bg-green-100"
                  }`}>
                    {activity.type === "user" && <Users className="w-5 h-5 text-blue-600" />}
                    {activity.type === "report" && <AlertTriangle className="w-5 h-5 text-orange-600" />}
                    {activity.type === "task" && <Briefcase className="w-5 h-5 text-green-600" />}
                  </div>

                  <div className="flex-1">
                    <p className="font-medium mb-1">{activity.action}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{activity.user}</span>
                      {activity.role && (
                        <>
                          <span>•</span>
                          <Badge variant="outline" className="text-xs">{activity.role}</Badge>
                        </>
                      )}
                      {activity.details && (
                        <>
                          <span>•</span>
                          <span>{activity.details}</span>
                        </>
                      )}
                      {activity.amount && (
                        <>
                          <span>•</span>
                          <span className="text-green-600">৳{activity.amount}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => onNavigate("users")}
              >
                <Users className="w-4 h-4 mr-2" />
                Manage Users
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => onNavigate("reports")}
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Review Reports
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => onNavigate("analytics")}
              >
                <Activity className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setNotificationDialogOpen(true)}
              >
                Send Notification
              </Button>
            </div>
          </Card>

          <Card className="p-6 bg-blue-50 border-primary/20">
            <h4 className="mb-2">System Health</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">API Status</span>
                <Badge className="bg-green-600">Operational</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Database</span>
                <Badge className="bg-green-600">Healthy</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Payments</span>
                <Badge className="bg-green-600">Active</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Uptime</span>
                <span className="font-medium">99.9%</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <SendNotificationDialog 
        open={notificationDialogOpen}
        onOpenChange={setNotificationDialogOpen}
      />
    </div>
  );
}