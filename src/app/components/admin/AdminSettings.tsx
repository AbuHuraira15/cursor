import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Bell, Globe, DollarSign, Tag, Plus, X } from "lucide-react";
import { Badge } from "../ui/badge";
import { useState } from "react";

interface AdminSettingsProps {
  onNavigate: (page: string) => void;
}

export function AdminSettings({ onNavigate }: AdminSettingsProps) {
  const [platformFee, setPlatformFee] = useState(10);
  const [categories, setCategories] = useState([
    "Plumbing",
    "Electrical",
    "Cleaning",
    "Moving",
    "Gardening",
    "Painting",
    "Carpentry"
  ]);
  const [newCategory, setNewCategory] = useState("");

  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory("");
    }
  };

  const removeCategory = (cat: string) => {
    setCategories(categories.filter((c) => c !== cat));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1>Admin Settings</h1>
        <p className="text-muted-foreground">Configure platform settings and preferences</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6 space-y-6">
          <Card className="p-6">
            <h2 className="mb-6">Platform Settings</h2>

            <div className="space-y-6">
              <div>
                <Label htmlFor="platform-name">Platform Name</Label>
                <Input id="platform-name" defaultValue="MiniMates" />
              </div>

              <div>
                <Label htmlFor="support-email">Support Email</Label>
                <Input id="support-email" type="email" defaultValue="support@minimates.com" />
              </div>

              <div>
                <Label htmlFor="support-phone">Support Phone</Label>
                <Input id="support-phone" type="tel" defaultValue="+1 (555) 000-0000" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Maintenance Mode</p>
                  <p className="text-sm text-muted-foreground">
                    Disable platform access for users
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">New User Registration</p>
                  <p className="text-sm text-muted-foreground">
                    Allow new users to sign up
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto-Verification</p>
                  <p className="text-sm text-muted-foreground">
                    Automatically verify new users
                  </p>
                </div>
                <Switch />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-6">Languages</h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="default-language">Default Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger id="default-language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="zh">中文</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable Multiple Languages</p>
                  <p className="text-sm text-muted-foreground">
                    Allow users to select their preferred language
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6 space-y-6">
          <Card className="p-6">
            <h2 className="mb-6">Notification Settings</h2>

            <div className="space-y-6">
              <div>
                <h3 className="mb-4">Send Broadcast Notification</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="notification-title">Title</Label>
                    <Input id="notification-title" placeholder="Important announcement" />
                  </div>

                  <div>
                    <Label htmlFor="notification-message">Message</Label>
                    <Textarea
                      id="notification-message"
                      placeholder="Your notification message..."
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="notification-audience">Audience</Label>
                    <Select defaultValue="all">
                      <SelectTrigger id="notification-audience">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="clients">Clients Only</SelectItem>
                        <SelectItem value="workers">Workers Only</SelectItem>
                        <SelectItem value="verified">Verified Users Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="bg-primary hover:bg-primary/90">
                    <Bell className="w-4 h-4 mr-2" />
                    Send Notification
                  </Button>
                </div>
              </div>

              <div className="pt-6 border-t">
                <h3 className="mb-4">Automated Notifications</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">New Task Alert</p>
                      <p className="text-sm text-muted-foreground">
                        Notify workers of new tasks
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Bid Received</p>
                      <p className="text-sm text-muted-foreground">
                        Notify clients of new bids
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Payment Reminder</p>
                      <p className="text-sm text-muted-foreground">
                        Remind users of pending payments
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Review Request</p>
                      <p className="text-sm text-muted-foreground">
                        Ask users to leave reviews
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="mt-6 space-y-6">
          <Card className="p-6">
            <h2 className="mb-6">Payment Settings</h2>

            <div className="space-y-6">
              <div>
                <Label htmlFor="platform-fee">Platform Fee (%)</Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="platform-fee"
                    type="number"
                    value={platformFee}
                    onChange={(e) => setPlatformFee(parseInt(e.target.value) || 0)}
                    className="w-32"
                  />
                  <span className="text-muted-foreground">
                    Workers will receive {100 - platformFee}% of task payment
                  </span>
                </div>
              </div>

              <div>
                <Label htmlFor="min-task-amount">Minimum Task Amount (BDT)</Label>
                <Input
                  id="min-task-amount"
                  type="number"
                  defaultValue="20"
                  className="w-32"
                />
              </div>

              <div>
                <Label htmlFor="max-task-amount">Maximum Task Amount (BDT)</Label>
                <Input
                  id="max-task-amount"
                  type="number"
                  defaultValue="5000"
                  className="w-32"
                />
              </div>

              <div>
                <Label htmlFor="payout-schedule">Payout Schedule</Label>
                <Select defaultValue="weekly">
                  <SelectTrigger id="payout-schedule">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="biweekly">Bi-weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto-Release Payment</p>
                  <p className="text-sm text-muted-foreground">
                    Automatically release payment after task completion
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div>
                <Label htmlFor="release-delay">Payment Release Delay (days)</Label>
                <Input
                  id="release-delay"
                  type="number"
                  defaultValue="3"
                  className="w-32"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Time to hold payment for dispute resolution
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="mt-6 space-y-6">
          <Card className="p-6">
            <h2 className="mb-6">Task Categories</h2>

            <div className="space-y-4">
              <div>
                <Label>Active Categories</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {categories.map((cat) => (
                    <Badge key={cat} variant="secondary" className="text-sm px-3 py-1">
                      {cat}
                      <button
                        onClick={() => removeCategory(cat)}
                        className="ml-2 hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="new-category">Add New Category</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="new-category"
                    placeholder="Enter category name..."
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addCategory()}
                  />
                  <Button onClick={addCategory}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-6">Category Settings</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Require Category Selection</p>
                  <p className="text-sm text-muted-foreground">
                    Force users to select a category for tasks
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Show Category Icons</p>
                  <p className="text-sm text-muted-foreground">
                    Display icons for categories
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2 pt-6 border-t">
        <Button variant="outline">Cancel</Button>
        <Button className="bg-primary hover:bg-primary/90">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
