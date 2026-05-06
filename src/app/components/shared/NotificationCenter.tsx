import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Bell, Briefcase, MessageSquare, DollarSign, Star, Check } from "lucide-react";

interface NotificationCenterProps {
  onClose?: () => void;
}

export function NotificationCenter({ onClose }: NotificationCenterProps) {
  const notifications = [
    {
      id: "1",
      type: "bid",
      icon: Briefcase,
      title: "New bid received",
      message: "Rahim Uddin placed a bid of ৳75 on your task 'Fix kitchen faucet'",
      time: "5 min ago",
      read: false,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      id: "2",
      type: "message",
      icon: MessageSquare,
      title: "New message",
      message: "Sarah Williams sent you a message about 'Deep cleaning'",
      time: "15 min ago",
      read: false,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      id: "3",
      type: "payment",
      icon: DollarSign,
      title: "Payment received",
      message: "You received ৳54 for completing 'Garden maintenance'",
      time: "1 hour ago",
      read: true,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      id: "4",
      type: "review",
      icon: Star,
      title: "New review",
      message: "Karim Hasan left you a 5-star review for 'Plumbing repair'",
      time: "2 hours ago",
      read: true,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100"
    },
    {
      id: "5",
      type: "bid",
      icon: Briefcase,
      title: "Bid accepted",
      message: "Emily Chen accepted your bid for 'Moving furniture'",
      time: "3 hours ago",
      read: true,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      id: "6",
      type: "message",
      icon: MessageSquare,
      title: "New message",
      message: "Tom Anderson replied to your message",
      time: "1 day ago",
      read: true,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ];

  const unreadNotifications = notifications.filter((n) => !n.read);
  const allNotifications = notifications;

  return (
    <Card className="w-full max-w-md">
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <h2>Notifications</h2>
          {unreadNotifications.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {unreadNotifications.length} unread
            </p>
          )}
        </div>
        <Button variant="ghost" size="sm">
          Mark all as read
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="px-4 pt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">
              All ({allNotifications.length})
            </TabsTrigger>
            <TabsTrigger value="unread">
              Unread ({unreadNotifications.length})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="m-0">
          <ScrollArea className="h-[500px]">
            <div className="p-4 space-y-2">
              {allNotifications.map((notification) => {
                const Icon = notification.icon;
                return (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors ৳{
                      !notification.read ? "bg-blue-50 border-blue-200" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 ৳{notification.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-5 h-5 ৳{notification.color}`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="text-sm">{notification.title}</h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1"></div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="unread" className="m-0">
          <ScrollArea className="h-[500px]">
            {unreadNotifications.length === 0 ? (
              <div className="p-12 text-center">
                <Check className="w-12 h-12 mx-auto mb-4 text-green-600" />
                <h3 className="mb-2">All caught up!</h3>
                <p className="text-sm text-muted-foreground">
                  No unread notifications
                </p>
              </div>
            ) : (
              <div className="p-4 space-y-2">
                {unreadNotifications.map((notification) => {
                  const Icon = notification.icon;
                  return (
                    <div
                      key={notification.id}
                      className="p-3 rounded-lg border bg-blue-50 border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 ৳{notification.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-5 h-5 ৳{notification.color}`} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="text-sm font-medium">{notification.title}</h4>
                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1"></div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
