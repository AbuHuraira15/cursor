import { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/input";
import { Clock, MapPin, DollarSign, Search, Filter } from "lucide-react";

interface MyTasksProps {
  tasks: any[];
  onNavigate: (page: string) => void;
  onSelectTask: (id: string) => void;
}

export function MyTasks({ tasks, onNavigate, onSelectTask }: MyTasksProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || task.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Open</Badge>;
      case "in-progress":
        return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">In Progress</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Completed</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1>My Tasks</h1>
        <p className="text-muted-foreground">Manage and track all your posted tasks</p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({tasks.length})</TabsTrigger>
          <TabsTrigger value="open">
            Open ({tasks.filter((t) => t.status === "open").length})
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            Active ({tasks.filter((t) => t.status === "in-progress").length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({tasks.filter((t) => t.status === "completed").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredTasks.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No tasks found</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <Card
                  key={task.id}
                  className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onSelectTask(task.id)}
                >
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
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
                        {getStatusBadge(task.status)}
                      </div>

                      {task.worker && (
                        <div className="mt-2 text-sm">
                          <span className="text-muted-foreground">Worker: </span>
                          <span className="font-medium">{task.worker}</span>
                          <span className="text-yellow-600 ml-1">★ {task.workerRating}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Budget</p>
                        <p className="text-xl">৳{task.budget}</p>
                      </div>

                      {task.status === "open" && task.bids > 0 && (
                        <Badge variant="secondary">{task.bids} bids</Badge>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}