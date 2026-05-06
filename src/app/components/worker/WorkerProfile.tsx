import { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { User, Mail, Phone, MapPin, Star, Briefcase, Award, Shield, Settings, Plus, X } from "lucide-react";
import { getPayments, getTasks, me } from "../../lib/api";

interface WorkerProfileProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  authToken: string;
}

export function WorkerProfile({ currentPage, onNavigate, authToken }: WorkerProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    hourlyRate: 45,
  });

  const [skills, setSkills] = useState([
    "Plumbing",
    "Electrical",
    "Carpentry",
    "Painting",
    "General Repairs"
  ]);

  const [newSkill, setNewSkill] = useState("");

  const [tasks, setTasks] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const reviews: any[] = [];

  useEffect(() => {
    if (!authToken) return;
    me(authToken)
      .then((user) =>
        setProfileData((prev) => ({
          ...prev,
          name: `${user.first_name} ${user.last_name}`.trim(),
          email: user.email || "",
          phone: user.phone || "",
          location: "",
          bio: "",
        })),
      )
      .catch(() => undefined);
    getTasks(authToken).then((data) => setTasks(data.results)).catch(() => setTasks([]));
    getPayments(authToken).then((data) => setPayments(data.results)).catch(() => setPayments([]));
  }, [authToken]);

  const stats = useMemo(() => {
    const completedJobs = tasks.filter((task) => task.status === "completed").length;
    const totalEarnings = payments
      .filter((payment) => payment.status === "completed")
      .reduce((sum, payment) => sum + Number(payment.task_amount || 0), 0);
    return { completedJobs, rating: 5.0, responseTime: "N/A", verified: true, totalEarnings };
  }, [tasks, payments]);

  const handleSaveProfile = () => {
    setIsEditing(false);
    // In a real app, save to backend
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
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
                    <p className="font-medium">New Task Alerts</p>
                    <p className="text-sm text-muted-foreground">Get notified about new tasks in your area</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Bid Updates</p>
                    <p className="text-sm text-muted-foreground">Updates on your bid status</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Messages</p>
                    <p className="text-sm text-muted-foreground">Client messages and chat notifications</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Payment Updates</p>
                    <p className="text-sm text-muted-foreground">Notifications about earnings and payouts</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-sm text-muted-foreground">Get text messages for important updates</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="mt-6">
            <Card className="p-6">
              <h2 className="mb-6">Work Preferences</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="search-radius">Search Radius (miles)</Label>
                  <Select defaultValue="10">
                    <SelectTrigger id="search-radius">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 miles</SelectItem>
                      <SelectItem value="10">10 miles</SelectItem>
                      <SelectItem value="25">25 miles</SelectItem>
                      <SelectItem value="50">50 miles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select defaultValue="en">
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
        <p className="text-muted-foreground">Build trust with clients by showcasing your skills and reviews</p>
      </div>

      {/* Profile Header */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <Avatar className="w-24 h-24">
            <AvatarFallback className="text-2xl">{(profileData.name || "W").charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h2>{profileData.name}</h2>
              {stats.verified && (
                <Badge className="bg-primary hover:bg-primary">
                  <Shield className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{stats.rating}</span>
                <span className="text-muted-foreground text-sm">({stats.completedJobs} jobs)</span>
              </div>
              <span className="text-sm text-muted-foreground">
                Avg response: {stats.responseTime}
              </span>
            </div>

            <p className="text-muted-foreground mb-4">{profileData.bio}</p>

            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary">{skill}</Badge>
              ))}
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

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <Briefcase className="w-6 h-6 mx-auto mb-2 text-primary" />
          <p className="text-2xl font-semibold">{stats.completedJobs}</p>
          <p className="text-sm text-muted-foreground">Jobs Done</p>
        </Card>

        <Card className="p-4 text-center">
          <Star className="w-6 h-6 mx-auto mb-2 text-yellow-400 fill-yellow-400" />
          <p className="text-2xl font-semibold">{stats.rating}</p>
          <p className="text-sm text-muted-foreground">Rating</p>
        </Card>

        <Card className="p-4 text-center">
          <Award className="w-6 h-6 mx-auto mb-2 text-green-600" />
          <p className="text-2xl font-semibold">৳{stats.totalEarnings}</p>
          <p className="text-sm text-muted-foreground">Total Earned</p>
        </Card>

        <Card className="p-4 text-center">
          <Shield className="w-6 h-6 mx-auto mb-2 text-primary" />
          <p className="text-2xl font-semibold">✓</p>
          <p className="text-sm text-muted-foreground">Verified</p>
        </Card>
      </div>

      {/* Personal Information */}
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
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              rows={3}
              value={profileData.bio}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
              disabled={!isEditing}
            />
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

          <div>
            <Label htmlFor="hourly-rate">Hourly Rate (BDT)</Label>
            <Input
              id="hourly-rate"
              type="number"
              value={profileData.hourlyRate}
              onChange={(e) => setProfileData({ ...profileData, hourlyRate: parseInt(e.target.value) })}
              disabled={!isEditing}
            />
          </div>
        </div>
      </Card>

      {/* Skills */}
      <Card className="p-6">
        <h2 className="mb-6">Skills & Services</h2>

        <div className="flex flex-wrap gap-2 mb-4">
          {skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="text-sm px-3 py-1">
              {skill}
              {isEditing && (
                <button
                  onClick={() => removeSkill(skill)}
                  className="ml-2 hover:text-destructive"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </Badge>
          ))}
        </div>

        {isEditing && (
          <div className="flex gap-2">
            <Input
              placeholder="Add a skill..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addSkill()}
            />
            <Button onClick={addSkill}>
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
        )}
      </Card>

      {/* Reviews */}
      <Card className="p-6">
        <h2 className="mb-6">Reviews ({reviews.length})</h2>

        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border-b last:border-0 pb-4 last:pb-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="mb-1">{review.client}</h4>
                  <p className="text-sm text-muted-foreground">{review.task}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ৳{
                          i < review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">{review.date}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground italic">"{review.comment}"</p>
            </div>
          ))}
          {reviews.length === 0 && <p className="text-sm text-muted-foreground">No reviews yet.</p>}
        </div>

        <Button variant="outline" className="w-full mt-4">
          View All Reviews
        </Button>
      </Card>

      {/* Verification */}
      <Card className="p-6 bg-blue-50 border-primary/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="mb-2">Profile Verification</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Complete verification to build trust with clients and unlock premium features.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-green-600">✓ Email Verified</Badge>
              <Badge className="bg-green-600">✓ Phone Verified</Badge>
              <Badge className="bg-green-600">✓ ID Verified</Badge>
              <Badge variant="outline">Background Check (Optional)</Badge>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}