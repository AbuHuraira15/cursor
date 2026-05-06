import { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Key,
  Bell,
  Settings,
  Edit,
  Save,
  X,
} from "lucide-react";

interface AdminProfileProps {
  onNavigate?: (page: string) => void;
}

export function AdminProfile({ onNavigate }: AdminProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [adminData, setAdminData] = useState({
    name: "Admin User",
    email: "admin@minimates.com",
    phone: "+1 (555) 123-4567",
    role: "Super Admin",
    department: "Platform Operations",
    location: "Dhaka, BD",
    joinDate: "January 2023",
    employeeId: "ADM-001",
  });

  const [editData, setEditData] = useState(adminData);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSave = () => {
    setAdminData(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(adminData);
    setIsEditing(false);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password change
    alert("Password changed successfully!");
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="mb-2">Admin Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Card */}
          <Card className="p-6">
            <div className="text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4 bg-primary text-white text-2xl">
                <AvatarFallback>{adminData.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h3 className="mb-1">{adminData.name}</h3>
              <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 mb-2">
                <Shield className="w-3 h-3 mr-1" />
                {adminData.role}
              </Badge>
              <p className="text-sm text-muted-foreground">
                {adminData.department}
              </p>
            </div>
          </Card>

          {/* Quick Stats */}
          <Card className="p-6">
            <h4 className="mb-4">Account Information</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Employee ID</span>
                <span className="font-medium">{adminData.employeeId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Member Since</span>
                <span className="font-medium">{adminData.joinDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                  Active
                </Badge>
              </div>
            </div>
          </Card>

          {/* Security */}
          <Card className="p-6 bg-blue-50 border-primary/20">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="mb-2">Security Status</h4>
                <p className="text-xs text-muted-foreground mb-3">
                  Your account is protected with 2-factor authentication
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Manage Security
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="profile">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">
                <User className="w-4 h-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="security">
                <Key className="w-4 h-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="preferences">
                <Settings className="w-4 h-4 mr-2" />
                Preferences
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="mt-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3>Personal Information</h3>
                  {!isEditing ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancel}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleSave}>
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative mt-2">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="name"
                        value={editData.name}
                        onChange={(e) =>
                          setEditData({ ...editData, name: e.target.value })
                        }
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative mt-2">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={editData.email}
                        onChange={(e) =>
                          setEditData({ ...editData, email: e.target.value })
                        }
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative mt-2">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        value={editData.phone}
                        onChange={(e) =>
                          setEditData({ ...editData, phone: e.target.value })
                        }
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="department">Department</Label>
                    <div className="relative mt-2">
                      <Settings className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="department"
                        value={editData.department}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            department: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <div className="relative mt-2">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="location"
                        value={editData.location}
                        onChange={(e) =>
                          setEditData({ ...editData, location: e.target.value })
                        }
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="mt-6 space-y-6">
              <Card className="p-6">
                <h3 className="mb-6">Change Password</h3>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      className="mt-2"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      className="mt-2"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      className="mt-2"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Update Password
                  </Button>
                </form>
              </Card>

              <Card className="p-6">
                <h3 className="mb-4">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium mb-1">Status</p>
                    <p className="text-sm text-muted-foreground">
                      2FA is currently enabled
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                    Enabled
                  </Badge>
                </div>
                <Separator className="my-4" />
                <Button variant="outline" className="w-full">
                  Manage 2FA Settings
                </Button>
              </Card>

              <Card className="p-6">
                <h3 className="mb-4">Active Sessions</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Current Session</p>
                      <p className="text-xs text-muted-foreground">
                        Dhaka, BD • Chrome on Windows
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      Active
                    </Badge>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Sign Out Other Sessions
                </Button>
              </Card>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences" className="mt-6 space-y-6">
              <Card className="p-6">
                <h3 className="mb-6">Notification Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive email updates about platform activity
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Get push notifications for urgent alerts
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">SMS Alerts</p>
                      <p className="text-sm text-muted-foreground">
                        Receive text messages for critical updates
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="mb-6">Display Preferences</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Language</Label>
                    <Input className="mt-2" value="English (US)" disabled />
                  </div>
                  <div>
                    <Label>Timezone</Label>
                    <Input
                      className="mt-2"
                      value="Eastern Time (ET)"
                      disabled
                    />
                  </div>
                  <div>
                    <Label>Date Format</Label>
                    <Input className="mt-2" value="MM/DD/YYYY" disabled />
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}