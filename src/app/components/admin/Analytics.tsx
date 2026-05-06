import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { ArrowLeft, TrendingUp, Users, Briefcase, DollarSign } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface AnalyticsProps {
  onNavigate: (page: string) => void;
}

export function Analytics({ onNavigate }: AnalyticsProps) {
  // User Growth Data
  const userGrowthData = [
    { month: "Jan", clients: 120, workers: 95 },
    { month: "Feb", clients: 180, workers: 140 },
    { month: "Mar", clients: 250, workers: 195 },
    { month: "Apr", clients: 340, workers: 270 },
    { month: "May", clients: 480, workers: 380 },
    { month: "Jun", clients: 650, workers: 510 },
    { month: "Jul", clients: 820, workers: 650 },
    { month: "Aug", clients: 1020, workers: 760 },
    { month: "Sep", clients: 1150, workers: 840 },
    { month: "Oct", clients: 1205, workers: 892 }
  ];

  // Task Completion Data
  const taskCompletionData = [
    { month: "Jan", completed: 85, cancelled: 15 },
    { month: "Feb", completed: 132, cancelled: 18 },
    { month: "Mar", completed: 198, cancelled: 22 },
    { month: "Apr", completed: 265, cancelled: 25 },
    { month: "May", completed: 342, cancelled: 28 },
    { month: "Jun", completed: 428, cancelled: 32 },
    { month: "Jul", completed: 512, cancelled: 38 },
    { month: "Aug", completed: 598, cancelled: 42 },
    { month: "Sep", completed: 685, cancelled: 45 },
    { month: "Oct", completed: 758, cancelled: 48 }
  ];

  // Revenue Data
  const revenueData = [
    { month: "Jan", revenue: 3200 },
    { month: "Feb", revenue: 4800 },
    { month: "Mar", revenue: 6400 },
    { month: "Apr", revenue: 8500 },
    { month: "May", revenue: 11200 },
    { month: "Jun", revenue: 14800 },
    { month: "Jul", revenue: 17600 },
    { month: "Aug", revenue: 21400 },
    { month: "Sep", revenue: 24800 },
    { month: "Oct", revenue: 28540 }
  ];

  // Task Categories
  const taskCategoryData = [
    { name: "Home Services", value: 425, color: "#7C3AED" },
    { name: "Moving & Delivery", value: 368, color: "#3B82F6" },
    { name: "Handyman", value: 312, color: "#10B981" },
    { name: "Cleaning", value: 289, color: "#F59E0B" },
    { name: "Assembly", value: 198, color: "#EF4444" },
    { name: "Other", value: 250, color: "#6B7280" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onNavigate("dashboard")}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1>Platform Analytics</h1>
          <p className="text-muted-foreground">Comprehensive platform performance metrics</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Total Users</p>
            <Users className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-3xl">2,458</h2>
          <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +18.2% from last month
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Total Tasks</p>
            <Briefcase className="w-4 h-4 text-blue-600" />
          </div>
          <h2 className="text-3xl">1,842</h2>
          <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +22.5% from last month
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Monthly Revenue</p>
            <DollarSign className="w-4 h-4 text-green-600" />
          </div>
          <h2 className="text-3xl text-green-600">৳28.5K</h2>
          <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +15.3% from last month
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Success Rate</p>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          <h2 className="text-3xl">94.1%</h2>
          <p className="text-xs text-green-600 mt-2">
            Tasks completed successfully
          </p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <Card className="p-6">
          <h3 className="mb-4">User Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="clients" stroke="#7C3AED" strokeWidth={2} />
              <Line type="monotone" dataKey="workers" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Revenue Chart */}
        <Card className="p-6">
          <h3 className="mb-4">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Task Completion Chart */}
        <Card className="p-6">
          <h3 className="mb-4">Task Completion Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={taskCompletionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" fill="#10B981" />
              <Bar dataKey="cancelled" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Task Categories Pie Chart */}
        <Card className="p-6">
          <h3 className="mb-4">Tasks by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={taskCategoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `৳{name} ৳{(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {taskCategoryData.map((entry, index) => (
                  <Cell key={`cell-৳{index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="mb-4">Top Performing Categories</h3>
          <div className="space-y-3">
            {taskCategoryData.slice(0, 5).map((category, index) => (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-muted">
                    <span className="text-sm font-medium">#{index + 1}</span>
                  </div>
                  <span className="text-sm">{category.name}</span>
                </div>
                <span className="text-sm font-medium">{category.value} tasks</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4">Platform Engagement</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Average Response Time</span>
                <span className="font-medium">2.4 hrs</span>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Average Bids per Task</span>
                <span className="font-medium">5.8</span>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Average Task Value</span>
                <span className="font-medium">৳127</span>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Client Retention</span>
                <span className="font-medium">87%</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4">Geographic Distribution</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Dhaka</span>
              <span className="text-sm font-medium">32%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Los Angeles</span>
              <span className="text-sm font-medium">28%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Chittagong</span>
              <span className="text-sm font-medium">18%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Houston</span>
              <span className="text-sm font-medium">12%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Other</span>
              <span className="text-sm font-medium">10%</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
