import { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { User, Mail, Phone, MapPin, Star, Briefcase, Award, Settings, Bell, Globe, CreditCard } from "lucide-react";
import { getPayments, getTasks, me } from "../../lib/api";

interface ClientProfileProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  authToken: string;
}

export function ClientProfile({ currentPage, onNavigate, authToken }: ClientProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
  });

  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    taskUpdates: true,
    bidAlerts: true,
    newsletter: false,
    language: "en",
  });

  const [tasks, setTasks] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    if (!authToken) return;
    me(authToken)
      .then((user) =>
        setProfileData((prev) => ({
          ...prev,
          name: `${user.first_name} ${user.last_name}`.trim(),
          email: user.email || "",
          phone: user.phone || "",
        })),
      )
      .catch(() => undefined);
    getTasks(authToken).then((data) => setTasks(data.results)).catch(() => setTasks([]));
    getPayments(authToken).then((data) => setPayments(data.results)).catch(() => setPayments([]));
  }, [authToken]);

  const stats = useMemo(() => {
    const tasksPosted = tasks.length;
    const tasksCompleted = tasks.filter((task) => task.status === "completed").length;
    const activeWorkers = tasks.filter((task) => ["assigned", "in_progress"].includes(task.status)).length;
    const loyaltyPoints = Math.floor(
      payments.filter((payment) => payment.status === "completed").reduce((sum, payment) => sum + Number(payment.total_amount || 0), 0) / 10,
    );
    return { tasksPosted, tasksCompleted, activeWorkers, loyaltyPoints };
  }, [tasks, payments]);

  const taskHistory = useMemo(
    () =>
      tasks.slice(0, 10).map((task) => ({
        id: String(task.id),
        title: task.title,
        worker: task.assigned_worker ? `Worker #${task.assigned_worker}` : "Not assigned",
        rating: 5,
        amount: Number(task.budget),
        date: task.created_at?.slice(0, 10),
        status: task.status,
      })),
    [tasks],
  );

  const handleSaveProfile = () => {
    setIsEditing(false);
    // In a real app, save to backend
  };

  if (currentPage === "settings") {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <div>
          <h1>Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences</p>
        </div>

        <Tabs defaultValue="notifications">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="mt-6">
            <Card className="p-6">
              <h2 className="mb-6">Notification Settings</h2>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, emailNotifications: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-sm text-muted-foreground">Get text messages for important updates</p>
                  </div>
                  <Switch
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, smsNotifications: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive push notifications on your device</p>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, pushNotifications: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Task Updates</p>
                    <p className="text-sm text-muted-foreground">Notifications about your task status</p>
                  </div>
                  <Switch
                    checked={settings.taskUpdates}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, taskUpdates: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Bid Alerts</p>
                    <p className="text-sm text-muted-foreground">Get notified when you receive new bids</p>
                  </div>
                  <Switch
                    checked={settings.bidAlerts}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, bidAlerts: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Newsletter</p>
                    <p className="text-sm text-muted-foreground">Receive tips and platform updates</p>
                  </div>
                  <Switch
                    checked={settings.newsletter}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, newsletter: checked })
                    }
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="mt-6">
            <Card className="p-6">
              <h2 className="mb-6">Preferences</h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={settings.language}
                    onValueChange={(value) => setSettings({ ...settings, language: value })}
                  >
                    <SelectTrigger id="language">
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

                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="est">
                    <SelectTrigger id="timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="est">Eastern Time (ET)</SelectItem>
                      <SelectItem value="cst">Central Time (CT)</SelectItem>
                      <SelectItem value="mst">Mountain Time (MT)</SelectItem>
                      <SelectItem value="pst">Pacific Time (PT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <Card className="p-6">
              <h2 className="mb-6">Security</h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>

                <div>
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>

                <div>
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>

                <Button className="bg-primary hover:bg-primary/90">Update Password</Button>
              </div>

              <div className="mt-8 pt-8 border-t">
                <h3 className="mb-4">Two-Factor Authentication</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add an extra layer of security to your account
                </p>
                <Button variant="outline">Enable 2FA</Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // Profile View
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1>Profile</h1>
        <p className="text-muted-foreground">Manage your profile information</p>
      </div>

      {/* Profile Header */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <Avatar className="w-24 h-24">
            <AvatarFallback className="text-2xl">{(profileData.name || "C").charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h2>{profileData.name}</h2>
            <p className="text-muted-foreground mb-3">{profileData.bio}</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
              <div>
                <p className="text-sm text-muted-foreground">Tasks Posted</p>
                <p className="text-xl">{stats.tasksPosted}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-xl">{stats.tasksCompleted}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Workers</p>
                <p className="text-xl">{stats.activeWorkers}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Points</p>
                <p className="text-xl">{stats.loyaltyPoints}</p>
              </div>
            </div>
          </div>

          <Button
            variant={isEditing ? "default" : "outline"}
            onClick={() => (isEditing ? handleSaveProfile() : setIsEditing(true))}
            className={isEditing ? "bg-primary hover:bg-primary/90" : ""}
          >
            {isEditing ? "Save Changes" : "Edit Profile"}
          </Button>
        </div>
      </Card>

      {/* Profile Information */}
      <Card className="p-6">
        <h2 className="mb-6">Personal Information</h2>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="name"
                className="pl-10"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                className="pl-10"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                className="pl-10"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="location"
                className="pl-10"
                value={profileData.location}
                onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Task History */}
      <Card className="p-6">
        <h2 className="mb-6">Recent Task History</h2>

        <div className="space-y-4">
          {taskHistory.map((task) => (
            <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <h4 className="mb-1">{task.title}</h4>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>Worker: {task.worker}</span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    {task.rating}.0
                  </span>
                  <span>{task.date}</span>
                </div>
              </div>

              <div className="text-right">
                <p className="font-medium">৳{task.amount}</p>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                  {task.status}
                </Badge>
              </div>
            </div>
          ))}
          {taskHistory.length === 0 && <p className="text-sm text-muted-foreground">No task history yet.</p>}
        </div>

        <Button variant="outline" className="w-full mt-4">
          View All History
        </Button>
      </Card>

      {/* Loyalty Program */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="mb-2">Loyalty Points: {stats.loyaltyPoints}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Earn points with every completed task. Redeem for discounts on future tasks!
            </p>
            <Button variant="outline" className="bg-white">
              Redeem Points
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
