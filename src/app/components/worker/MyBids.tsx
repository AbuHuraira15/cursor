import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { MapPin, Clock, DollarSign, MessageSquare } from "lucide-react";
import { getBids } from "../../lib/api";

interface MyBidsProps {
  onNavigate: (page: string) => void;
  authToken: string;
}

export function MyBids({ onNavigate, authToken }: MyBidsProps) {
  const [bids, setBids] = useState<any[]>([]);

  useEffect(() => {
    if (!authToken) return;
    getBids(authToken)
      .then((data) => {
        const mapped = data.results.map((bid) => ({
          id: String(bid.id),
          taskTitle: `Task #${bid.task}`,
          client: "Client",
          yourBid: Number(bid.amount),
          clientBudget: Number(bid.amount),
          status: bid.status,
          location: "N/A",
          date: bid.created_at.slice(0, 10),
          submittedTime: bid.created_at.slice(0, 10),
          totalBids: 1,
          message: bid.message,
        }));
        setBids(mapped);
      })
      .catch(() => setBids([]));
  }, [authToken]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Pending</Badge>;
      case "accepted":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Accepted</Badge>;
      case "rejected":
        return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Rejected</Badge>;
      default:
        return null;
    }
  };

  const pendingBids = bids.filter((b) => b.status === "pending");
  const acceptedBids = bids.filter((b) => b.status === "accepted");
  const rejectedBids = bids.filter((b) => b.status === "rejected");

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1>My Bids</h1>
        <p className="text-muted-foreground">Track all your bids and their status</p>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({bids.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingBids.length})</TabsTrigger>
          <TabsTrigger value="accepted">Accepted ({acceptedBids.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedBids.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6 space-y-4">
          {bids.map((bid) => (
            <Card key={bid.id} className="p-4">
              <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="mb-1">{bid.taskTitle}</h3>
                      <p className="text-sm text-muted-foreground mb-2">Client: {bid.client}</p>
                    </div>
                    {getStatusBadge(bid.status)}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {bid.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {bid.submittedTime}
                    </span>
                    <span>Competing with {bid.totalBids - 1} other bids</span>
                  </div>

                  <p className="text-sm text-muted-foreground italic">"{bid.message}"</p>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Your Bid</p>
                    <p className="text-2xl">৳{bid.yourBid}</p>
                    <p className="text-xs text-muted-foreground">
                      Budget: ৳{bid.clientBudget}
                    </p>
                  </div>

                  {bid.status === "pending" && (
                    <Button variant="outline" size="sm">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Message Client
                    </Button>
                  )}

                  {bid.status === "accepted" && (
                    <Button 
                      size="sm" 
                      className="bg-primary hover:bg-primary/90"
                      onClick={() => onNavigate("active-job")}
                    >
                      View Job
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="pending" className="mt-6 space-y-4">
          {pendingBids.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No pending bids</p>
            </Card>
          ) : (
            pendingBids.map((bid) => (
              <Card key={bid.id} className="p-4">
                <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="mb-1">{bid.taskTitle}</h3>
                    <p className="text-sm text-muted-foreground mb-2">Client: {bid.client}</p>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {bid.location}
                      </span>
                      <span>Competing with {bid.totalBids - 1} other bids</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl">৳{bid.yourBid}</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Edit Bid
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="accepted" className="mt-6 space-y-4">
          {acceptedBids.map((bid) => (
            <Card key={bid.id} className="p-4 bg-green-50 border-green-200">
              <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
                <div className="flex-1">
                  <Badge className="bg-green-600 mb-2">Accepted</Badge>
                  <h3 className="mb-1">{bid.taskTitle}</h3>
                  <p className="text-sm text-muted-foreground">📅 {bid.date} • 📍 {bid.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl text-green-600">৳{bid.yourBid}</p>
                  <Button 
                    size="sm" 
                    className="mt-2 bg-primary hover:bg-primary/90"
                    onClick={() => onNavigate("active-job")}
                  >
                    Start Job
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="rejected" className="mt-6 space-y-4">
          {rejectedBids.map((bid) => (
            <Card key={bid.id} className="p-4 opacity-60">
              <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
                <div className="flex-1">
                  <Badge variant="outline" className="mb-2">Not Selected</Badge>
                  <h3 className="mb-1">{bid.taskTitle}</h3>
                  <p className="text-sm text-muted-foreground">Your bid: ৳{bid.yourBid} (Budget: ৳{bid.clientBudget})</p>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
