import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { toast } from "sonner";
import { Bell, Users, Briefcase, User } from "lucide-react";

interface SendNotificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SendNotificationDialog({ open, onOpenChange }: SendNotificationDialogProps) {
  const [notificationData, setNotificationData] = useState({
    title: "",
    message: "",
    recipient: "all",
    priority: "normal",
    includeEmail: false,
    includePush: true,
    scheduleLater: false
  });

  const handleSend = () => {
    if (!notificationData.title.trim()) {
      toast.error("Please enter a notification title");
      return;
    }

    if (!notificationData.message.trim()) {
      toast.error("Please enter a notification message");
      return;
    }

    // Simulate sending notification
    toast.success(
      `Notification sent successfully to ৳{
        notificationData.recipient === "all" ? "all users" :
        notificationData.recipient === "clients" ? "all clients" :
        "all workers"
      }!`,
      {
        description: `"৳{notificationData.title}" has been delivered via ৳{
          notificationData.includePush && notificationData.includeEmail ? "push & email" :
          notificationData.includePush ? "push notification" :
          "email"
        }`
      }
    );

    // Reset form
    setNotificationData({
      title: "",
      message: "",
      recipient: "all",
      priority: "normal",
      includeEmail: false,
      includePush: true,
      scheduleLater: false
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Send Notification</DialogTitle>
              <DialogDescription>
                Send notifications to users across the platform
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Recipient Selection */}
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipients</Label>
            <Select
              value={notificationData.recipient}
              onValueChange={(value) => setNotificationData({ ...notificationData, recipient: value })}
            >
              <SelectTrigger id="recipient">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>All Users</span>
                  </div>
                </SelectItem>
                <SelectItem value="clients">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>All Clients</span>
                  </div>
                </SelectItem>
                <SelectItem value="workers">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    <span>All Workers</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={notificationData.priority}
              onValueChange={(value) => setNotificationData({ ...notificationData, priority: value })}
            >
              <SelectTrigger id="priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Notification Title</Label>
            <Input
              id="title"
              placeholder="Enter notification title"
              value={notificationData.title}
              onChange={(e) => setNotificationData({ ...notificationData, title: e.target.value })}
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Enter your message here..."
              value={notificationData.message}
              onChange={(e) => setNotificationData({ ...notificationData, message: e.target.value })}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              {notificationData.message.length} / 500 characters
            </p>
          </div>

          {/* Delivery Options */}
          <div className="space-y-3">
            <Label>Delivery Method</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="push"
                  checked={notificationData.includePush}
                  onCheckedChange={(checked) => 
                    setNotificationData({ ...notificationData, includePush: checked as boolean })
                  }
                />
                <label
                  htmlFor="push"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Push Notification
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="email"
                  checked={notificationData.includeEmail}
                  onCheckedChange={(checked) => 
                    setNotificationData({ ...notificationData, includeEmail: checked as boolean })
                  }
                />
                <label
                  htmlFor="email"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Email Notification
                </label>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="border rounded-lg p-4 bg-muted/50 space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Preview</p>
            <div className="space-y-1">
              <p className="font-medium">{notificationData.title || "Notification Title"}</p>
              <p className="text-sm text-muted-foreground">
                {notificationData.message || "Your notification message will appear here..."}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSend}>
            <Bell className="w-4 h-4 mr-2" />
            Send Notification
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
