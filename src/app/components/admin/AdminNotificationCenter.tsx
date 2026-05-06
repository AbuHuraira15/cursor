import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { 
  Bell, 
  UserPlus, 
  Shield, 
  AlertTriangle, 
  DollarSign, 
  MessageSquare, 
  Flag,
  FileCheck,
  Lock,
  TrendingUp,
  Check,
  AlertCircle,
  Users,
  CreditCard
} from "lucide-react";

interface AdminNotificationCenterProps {
  onClose?: () => void;
}

export function AdminNotificationCenter({ onClose }: AdminNotificationCenterProps) {
  const notifications = [
    {
      id: "1",
      type: "user-registration",
      icon: UserPlus,
      title: "New User Registration",
      message: "Alex Martinez signed up as a Worker and is pending verification",
      time: "2 min ago",
      read: false,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      priority: "normal"
    },
    {
      id: "2",
      type: "verification",
      icon: Shield,
      title: "Verification Request",
      message: "Worker 'Rahim Uddin' submitted background check documents for review",
      time: "10 min ago",
      read: false,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
      priority: "high"
    },
    {
      id: "3",
      type: "dispute",
      icon: AlertTriangle,
      title: "Payment Dispute",
      message: "Client 'Sarah Williams' opened a dispute for task #2547 - Amount: ৳125",
      time: "25 min ago",
      read: false,
      color: "text-red-600",
      bgColor: "bg-red-100",
      priority: "urgent"
    },
    {
      id: "4",
      type: "support",
      icon: MessageSquare,
      title: "New Support Ticket",
      message: "High priority ticket #1847 from Karim Hasan - 'Unable to post task'",
      time: "1 hour ago",
      read: false,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      priority: "high"
    },
    {
      id: "5",
      type: "flagged",
      icon: Flag,
      title: "Flagged Content",
      message: "User 'Tom Anderson' has been flagged for suspicious activity by 3 users",
      time: "2 hours ago",
      read: true,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      priority: "urgent"
    },
    {
      id: "6",
      type: "payment",
      icon: DollarSign,
      title: "Large Transaction Alert",
      message: "Transaction of ৳2,500 processed for task #2891 - Auto-flagged for review",
      time: "3 hours ago",
      read: true,
      color: "text-green-600",
      bgColor: "bg-green-100",
      priority: "normal"
    },
    {
      id: "7",
      type: "verification",
      icon: FileCheck,
      title: "Insurance Expired",
      message: "Worker 'David Lee' insurance policy expired - Account auto-suspended",
      time: "5 hours ago",
      read: true,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
      priority: "high"
    },
    {
      id: "8",
      type: "security",
      icon: Lock,
      title: "Account Locked",
      message: "User 'Jane Smith' account locked after 5 failed login attempts",
      time: "6 hours ago",
      read: true,
      color: "text-red-600",
      bgColor: "bg-red-100",
      priority: "normal"
    },
    {
      id: "9",
      type: "stats",
      icon: TrendingUp,
      title: "Daily Report Generated",
      message: "Platform statistics: 47 new users, 234 tasks posted, ৳12,450 in transactions",
      time: "1 day ago",
      read: true,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      priority: "normal"
    },
    {
      id: "10",
      type: "user-registration",
      icon: Users,
      title: "Bulk Registration Alert",
      message: "15 new users registered in the last hour - potential spam detection",
      time: "1 day ago",
      read: true,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      priority: "high"
    },
    {
      id: "11",
      type: "payment",
      icon: CreditCard,
      title: "Refund Processed",
      message: "Refund of ৳85 issued to Emily Chen for cancelled task #2456",
      time: "2 days ago",
      read: true,
      color: "text-green-600",
      bgColor: "bg-green-100",
      priority: "normal"
    }
  ];

  const unreadNotifications = notifications.filter((n) => !n.read);
  const urgentNotifications = notifications.filter((n) => n.priority === "urgent");
  const highPriorityNotifications = notifications.filter((n) => n.priority === "high");
  const allNotifications = notifications;

  const renderNotification = (notification: any) => {
    const Icon = notification.icon;
    return (
      <div
        key={notification.id}
        className={`p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors ৳{
          !notification.read ? "bg-blue-50 border-blue-200" : ""
        } ৳{
          notification.priority === "urgent" ? "border-l-4 border-l-red-500" : 
          notification.priority === "high" ? "border-l-4 border-l-orange-500" : ""
        }`}
      >
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 ৳{notification.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-5 h-5 ৳{notification.color}`} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-sm font-medium">{notification.title}</h4>
                {notification.priority === "urgent" && (
                  <Badge variant="destructive" className="text-xs px-1.5 py-0">Urgent</Badge>
                )}
                {notification.priority === "high" && (
                  <Badge className="text-xs px-1.5 py-0 bg-orange-600">High</Badge>
                )}
              </div>
              {!notification.read && (
                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1"></div>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {notification.message}
            </p>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {notification.time}
              </p>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" className="h-6 text-xs px-2">
                  View
                </Button>
                {!notification.read && (
                  <Button variant="ghost" size="sm" className="h-6 text-xs px-2">
                    Mark read
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-2xl">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg">Admin Notifications</h2>
            {unreadNotifications.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {unreadNotifications.length} unread
                {urgentNotifications.length > 0 && (
                  <span className="text-red-600 font-medium ml-2">
                    • {urgentNotifications.length} urgent
                  </span>
                )}
              </p>
            )}
          </div>
          <Button variant="ghost" size="sm">
            Mark all as read
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-2">
          <Card className="p-2 bg-red-50 border-red-200">
            <div className="flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <div>
                <p className="text-xs text-muted-foreground">Urgent</p>
                <p className="text-lg font-bold text-red-600">{urgentNotifications.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-2 bg-orange-50 border-orange-200">
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              <div>
                <p className="text-xs text-muted-foreground">High</p>
                <p className="text-lg font-bold text-orange-600">{highPriorityNotifications.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-2 bg-blue-50 border-blue-200">
            <div className="flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-xs text-muted-foreground">Unread</p>
                <p className="text-lg font-bold text-blue-600">{unreadNotifications.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-2 bg-green-50 border-green-200">
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-lg font-bold text-green-600">{allNotifications.length}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="px-4 pt-3">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all" className="text-xs">
              All ({allNotifications.length})
            </TabsTrigger>
            <TabsTrigger value="unread" className="text-xs">
              Unread ({unreadNotifications.length})
            </TabsTrigger>
            <TabsTrigger value="urgent" className="text-xs">
              Urgent ({urgentNotifications.length})
            </TabsTrigger>
            <TabsTrigger value="high" className="text-xs">
              High ({highPriorityNotifications.length})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="m-0">
          <div className="max-h-[500px] overflow-y-auto">
            <div className="p-4 space-y-2">
              {allNotifications.map(renderNotification)}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="unread" className="m-0">
          <div className="max-h-[500px] overflow-y-auto">
            {unreadNotifications.length === 0 ? (
              <div className="p-12 text-center">
                <Check className="w-12 h-12 mx-auto mb-4 text-green-600" />
                <h3 className="text-base mb-2">All caught up!</h3>
                <p className="text-sm text-muted-foreground">
                  No unread notifications
                </p>
              </div>
            ) : (
              <div className="p-4 space-y-2">
                {unreadNotifications.map(renderNotification)}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="urgent" className="m-0">
          <div className="max-h-[500px] overflow-y-auto">
            {urgentNotifications.length === 0 ? (
              <div className="p-12 text-center">
                <Check className="w-12 h-12 mx-auto mb-4 text-green-600" />
                <h3 className="text-base mb-2">No urgent items</h3>
                <p className="text-sm text-muted-foreground">
                  All urgent notifications have been addressed
                </p>
              </div>
            ) : (
              <div className="p-4 space-y-2">
                {urgentNotifications.map(renderNotification)}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="high" className="m-0">
          <div className="max-h-[500px] overflow-y-auto">
            {highPriorityNotifications.length === 0 ? (
              <div className="p-12 text-center">
                <Check className="w-12 h-12 mx-auto mb-4 text-green-600" />
                <h3 className="text-base mb-2">No high priority items</h3>
                <p className="text-sm text-muted-foreground">
                  All high priority notifications have been addressed
                </p>
              </div>
            ) : (
              <div className="p-4 space-y-2">
                {highPriorityNotifications.map(renderNotification)}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
