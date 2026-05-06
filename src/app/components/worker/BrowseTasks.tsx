import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Slider } from "../ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { MapPin, Clock, DollarSign, Search, SlidersHorizontal, Map, List } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "../ui/sheet";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { createBid, getTasks } from "../../lib/api";

interface BrowseTasksProps {
  onNavigate: (page: string) => void;
  onSelectTask?: (task: any) => void;
  authToken: string;
}

export function BrowseTasks({ onNavigate, onSelectTask, authToken }: BrowseTasksProps) {
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [maxDistance, setMaxDistance] = useState([10]);
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showBidSheet, setShowBidSheet] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [bidAmount, setBidAmount] = useState("");
  const [bidMessage, setBidMessage] = useState("");

  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    if (!authToken) return;
    getTasks(authToken)
      .then((data) => {
        const mapped = data.results.map((task) => ({
          id: String(task.id),
          title: task.title,
          description: task.description,
          category: task.category,
          budget: Number(task.budget),
          distance: "N/A",
          location: task.location,
          date: task.scheduled_date,
          time: task.time_slot,
          postedTime: task.created_at.slice(0, 10),
          bids: task.bids_count,
          client: "Client",
          clientRating: 5,
          clientJobs: 0,
        }));
        setTasks(mapped);
      })
      .catch(() => setTasks([]));
  }, [authToken]);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === "all" || task.category === category;
    const matchesDistance = parseFloat(task.distance) <= maxDistance[0];
    return matchesSearch && matchesCategory && matchesDistance;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "nearest") return parseFloat(a.distance) - parseFloat(b.distance);
    if (sortBy === "highest-pay") return b.budget - a.budget;
    return 0; // newest (default order)
  });

  const handlePlaceBid = (task: any) => {
    setSelectedTask(task);
    setBidAmount(String(task.budget));
    setShowBidSheet(true);
  };

  const submitBid = async () => {
    if (!selectedTask || !bidAmount || !bidMessage) return;
    try {
      await createBid(authToken, {
        task: Number(selectedTask.id),
        amount: Number(bidAmount),
        message: bidMessage,
      });
      setShowBidSheet(false);
      setBidAmount("");
      setBidMessage("");
    } catch {
      // keep modal open; user can retry
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1>Browse Tasks</h1>
        <p className="text-muted-foreground">Find tasks nearby and place your bids</p>
      </div>

      {/* Search & Filters */}
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

        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="nearest">Nearest</SelectItem>
              <SelectItem value="highest-pay">Highest Pay</SelectItem>
            </SelectContent>
          </Select>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Tasks</SheetTitle>
                <SheetDescription>
                  Filter tasks by category and distance
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-6 mt-6">
                <div>
                  <Label>Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Cleaning">Cleaning</SelectItem>
                      <SelectItem value="Plumbing">Plumbing</SelectItem>
                      <SelectItem value="Moving">Moving</SelectItem>
                      <SelectItem value="Gardening">Gardening</SelectItem>
                      <SelectItem value="Electrical">Electrical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Max Distance: {maxDistance[0]} miles</Label>
                  <Slider
                    value={maxDistance}
                    onValueChange={setMaxDistance}
                    max={25}
                    min={1}
                    step={1}
                    className="mt-2"
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <div className="hidden sm:flex border rounded-lg overflow-hidden">
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
              className="rounded-none"
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "map" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("map")}
              className="rounded-none"
            >
              <Map className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {sortedTasks.length} tasks found within {maxDistance[0]} miles
        </p>
      </div>

      {/* Tasks List/Map */}
      {viewMode === "map" ? (
        <Card className="p-12 text-center bg-muted/30">
          <Map className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="mb-2">Map View</h3>
          <p className="text-muted-foreground">
            Interactive map showing task locations would appear here
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedTasks.map((task) => (
            <Card key={task.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="mb-1">{task.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-3">
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

                  <div className="text-sm">
                    <p>Client: <strong>{task.client}</strong> ★ {task.clientRating} ({task.clientJobs} tasks)</p>
                    <p className="text-muted-foreground">📍 {task.location}</p>
                    <p className="text-muted-foreground">📅 {task.date} • {task.time}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Budget</p>
                    <p className="text-3xl">৳{task.budget}</p>
                  </div>
                  <Button 
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => handlePlaceBid(task)}
                  >
                    Place Bid
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onSelectTask) {
                        onSelectTask(task);
                      }
                      onNavigate("task-detail");
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          {sortedTasks.length === 0 && (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No tasks found matching your criteria</p>
            </Card>
          )}
        </div>
      )}

      {/* Place Bid Sheet */}
      <Sheet open={showBidSheet} onOpenChange={setShowBidSheet}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Place Your Bid</SheetTitle>
            <SheetDescription>
              Enter your bid amount and a message to the client
            </SheetDescription>
          </SheetHeader>

          {selectedTask && (
            <div className="space-y-4 mt-6">
              <Card className="p-4 bg-muted/30">
                <h4 className="mb-1">{selectedTask.title}</h4>
                <p className="text-sm text-muted-foreground">Client budget: ৳{selectedTask.budget}</p>
              </Card>

              <div>
                <Label htmlFor="bid-amount">Your Bid Amount (BDT)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="bid-amount"
                    type="number"
                    placeholder="Enter amount"
                    className="pl-10"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Platform fee (10%): ৳{bidAmount ? (parseFloat(bidAmount) * 0.1).toFixed(2) : "0.00"}
                </p>
              </div>

              <div>
                <Label htmlFor="bid-message">Message to Client</Label>
                <Textarea
                  id="bid-message"
                  placeholder="Introduce yourself and explain why you're the best fit for this task..."
                  rows={5}
                  value={bidMessage}
                  onChange={(e) => setBidMessage(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  A detailed message increases your chances of being hired
                </p>
              </div>

              <div className="space-y-2 pt-4">
                <Button
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={submitBid}
                  disabled={!bidAmount || !bidMessage}
                >
                  Submit Bid
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowBidSheet(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}