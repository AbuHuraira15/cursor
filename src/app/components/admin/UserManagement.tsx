import { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Search, Lock, Unlock, Shield, Star, Mail, Phone, FileText, CheckCircle, AlertCircle, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface UserManagementProps {
  onNavigate: (page: string) => void;
}

export function UserManagement({ onNavigate }: UserManagementProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showLockDialog, setShowLockDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);

  const [users, setUsers] = useState([
    {
      id: "1",
      name: "Karim Hasan",
      email: "karim.hasan@example.com",
      phone: "+1 (555) 123-4567",
      role: "Client",
      status: "active",
      verified: true,
      joinDate: "Dec 15, 2025",
      tasksPosted: 12,
      rating: 4.7,
      spent: 1240
    },
    {
      id: "2",
      name: "Rahim Uddin",
      email: "rahim.u@example.com",
      phone: "+1 (555) 987-6543",
      role: "Worker",
      status: "active",
      verified: true,
      joinDate: "Nov 8, 2025",
      jobsCompleted: 47,
      rating: 4.9,
      earned: 3420,
      // Worker-specific details
      tin: "XX-XXXXXXX47",
      ssn: "***-**-5678",
      workerDetails: {
        backgroundCheck: {
          status: "Verified",
          date: "Nov 5, 2025",
          provider: "CheckrPro"
        },
        insurance: {
          provider: "State Farm",
          policyNumber: "POL-2025-47891",
          expiryDate: "Nov 2026",
          coverage: "৳1,000,000"
        },
        certificates: [
          {
            name: "Licensed Plumber",
            issuer: "State Licensing Board",
            number: "PL-2024-1547",
            issueDate: "Jan 2024",
            expiryDate: "Jan 2027"
          },
          {
            name: "HVAC Certification",
            issuer: "HVAC Excellence",
            number: "HVAC-8874",
            issueDate: "Mar 2023",
            expiryDate: "Mar 2026"
          }
        ],
        skills: ["Plumbing", "HVAC", "Electrical", "General Handyman"],
        serviceAreas: ["Manhattan", "Brooklyn", "Queens"],
        yearsOfExperience: 8,
        languages: ["English", "Spanish"]
      }
    },
    {
      id: "3",
      name: "Sarah Williams",
      email: "sarah.w@example.com",
      phone: "+1 (555) 456-7890",
      role: "Client",
      status: "active",
      verified: true,
      joinDate: "Jan 2, 2026",
      tasksPosted: 8,
      rating: 5.0,
      spent: 680
    },
    {
      id: "4",
      name: "Tom Anderson",
      email: "tom.a@example.com",
      phone: "+1 (555) 234-5678",
      role: "Worker",
      status: "locked",
      verified: false,
      joinDate: "Oct 20, 2025",
      jobsCompleted: 15,
      rating: 3.8,
      earned: 890,
      // Worker-specific details
      tin: "XX-XXXXXXX23",
      ssn: "***-**-1234",
      workerDetails: {
        backgroundCheck: {
          status: "Pending",
          date: "Jan 10, 2026",
          provider: "CheckrPro"
        },
        insurance: {
          provider: "N/A",
          policyNumber: "N/A",
          expiryDate: "N/A",
          coverage: "N/A"
        },
        certificates: [],
        skills: ["Moving", "Delivery"],
        serviceAreas: ["Bronx"],
        yearsOfExperience: 2,
        languages: ["English"]
      }
    },
    {
      id: "5",
      name: "Emily Chen",
      email: "emily.c@example.com",
      phone: "+1 (555) 345-6789",
      role: "Client",
      status: "active",
      verified: true,
      joinDate: "Dec 1, 2025",
      tasksPosted: 15,
      rating: 4.8,
      spent: 1580
    }
  ]);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const clients = filteredUsers.filter((u) => u.role === "Client");
  const workers = filteredUsers.filter((u) => u.role === "Worker");
  const lockedUsers = filteredUsers.filter((u) => u.status === "locked");

  const handleLockUnlock = (user: any) => {
    setSelectedUser(user);
    setShowLockDialog(true);
  };

  const handleViewDetails = (user: any) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  const confirmLockUnlock = () => {
    if (selectedUser) {
      // Toggle the user's locked status
      setUsers(users.map(u => 
        u.id === selectedUser.id 
          ? { ...u, status: u.status === "locked" ? "active" : "locked" }
          : u
      ));
    }
    setShowLockDialog(false);
    setSelectedUser(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1>User Management</h1>
        <p className="text-muted-foreground">Manage clients, workers, and user accounts</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            <SelectItem value="verified">Verified Only</SelectItem>
            <SelectItem value="unverified">Unverified</SelectItem>
            <SelectItem value="locked">Locked</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* User Tabs */}
      <Tabs defaultValue="all">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({filteredUsers.length})</TabsTrigger>
          <TabsTrigger value="clients">Clients ({clients.length})</TabsTrigger>
          <TabsTrigger value="workers">Workers ({workers.length})</TabsTrigger>
          <TabsTrigger value="locked">Locked ({lockedUsers.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6 space-y-3">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4>{user.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {user.role}
                      </Badge>
                      {user.verified && (
                        <Shield className="w-4 h-4 text-primary" title="Verified" />
                      )}
                      {user.status === "locked" && (
                        <Badge variant="destructive" className="text-xs">Locked</Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {user.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {user.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {user.rating}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm">
                      {user.role === "Client" ? (
                        <>
                          <span className="text-muted-foreground">
                            {user.tasksPosted} tasks posted
                          </span>
                          <span className="text-green-600 font-medium">
                            ৳{user.spent} spent
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-muted-foreground">
                            {user.jobsCompleted} jobs completed
                          </span>
                          <span className="text-green-600 font-medium">
                            ৳{user.earned} earned
                          </span>
                        </>
                      )}
                      <span className="text-muted-foreground">
                        Joined {user.joinDate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleViewDetails(user)}>
                    View Details
                  </Button>
                  <Button
                    variant={user.status === "locked" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleLockUnlock(user)}
                    className={user.status === "locked" ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    {user.status === "locked" ? (
                      <>
                        <Unlock className="w-4 h-4 mr-2" />
                        Unlock
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Lock
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="clients" className="mt-6 space-y-3">
          {clients.map((user) => (
            <Card key={user.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="mb-1">{user.name}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{user.email}</p>
                    <div className="flex items-center gap-3 text-sm">
                      <span>{user.tasksPosted} tasks</span>
                      <span>★ {user.rating}</span>
                      <span className="text-green-600">৳{user.spent} spent</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="workers" className="mt-6 space-y-3">
          {workers.map((user) => (
            <Card key={user.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4>{user.name}</h4>
                      {user.verified && <Shield className="w-4 h-4 text-primary" />}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{user.email}</p>
                    <div className="flex items-center gap-3 text-sm">
                      <span>{user.jobsCompleted} jobs</span>
                      <span>★ {user.rating}</span>
                      <span className="text-green-600">৳{user.earned} earned</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="locked" className="mt-6 space-y-3">
          {lockedUsers.length === 0 ? (
            <Card className="p-12 text-center">
              <Lock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No locked users</p>
            </Card>
          ) : (
            lockedUsers.map((user) => (
              <Card key={user.id} className="p-4 bg-red-50 border-red-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-12 h-12 opacity-50">
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4>{user.name}</h4>
                        <Badge variant="destructive">Locked</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleLockUnlock(user)}
                  >
                    <Unlock className="w-4 h-4 mr-2" />
                    Unlock
                  </Button>
                </div>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Lock/Unlock Dialog */}
      <AlertDialog open={showLockDialog} onOpenChange={setShowLockDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedUser?.status === "locked" ? "Unlock" : "Lock"} User Account?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedUser?.status === "locked"
                ? `Are you sure you want to unlock ৳{selectedUser?.name}'s account? They will regain access to the platform.`
                : `Are you sure you want to lock ৳{selectedUser?.name}'s account? They will lose access to the platform.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmLockUnlock}
              className={selectedUser?.status === "locked" ? "bg-green-600 hover:bg-green-700" : "bg-destructive hover:bg-destructive/90"}
            >
              {selectedUser?.status === "locked" ? "Unlock Account" : "Lock Account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* User Details Dialog */}
      <Dialog open={showUserDetails} onOpenChange={setShowUserDetails}>
        <DialogContent className="max-w-4xl max-h-[95vh] flex flex-col">
          <DialogHeader className="pb-2 flex-shrink-0">
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Complete information for {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <>
              <div className="space-y-3 overflow-y-auto flex-1 pr-2">
                {/* User Header - Compact */}
                <div className="flex items-center gap-3 pb-3 border-b">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="text-lg">{selectedUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                      <Badge variant="outline" className="text-xs">{selectedUser.role}</Badge>
                      {selectedUser.verified && (
                        <Shield className="w-4 h-4 text-primary" title="Verified" />
                      )}
                      {selectedUser.status === "locked" && (
                        <Badge variant="destructive" className="text-xs">Locked</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{selectedUser.rating}</span>
                      <span className="text-muted-foreground">rating</span>
                    </div>
                  </div>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Left Column */}
                  <div className="space-y-3">
                    {/* Contact Information */}
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Contact Information</h4>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-muted-foreground min-w-16">Email:</span>
                          <span className="truncate">{selectedUser.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-muted-foreground min-w-16">Phone:</span>
                          <span>{selectedUser.phone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Account Details */}
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Account Details</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <Card className="p-2.5">
                          <p className="text-xs text-muted-foreground mb-0.5">Join Date</p>
                          <p className="text-sm font-medium">{selectedUser.joinDate}</p>
                        </Card>
                        <Card className="p-2.5">
                          <p className="text-xs text-muted-foreground mb-0.5">Status</p>
                          <p className="text-sm font-medium capitalize">{selectedUser.status}</p>
                        </Card>
                      </div>
                    </div>

                    {/* Activity Stats */}
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Activity & Performance</h4>
                      {selectedUser.role === "Client" ? (
                        <div className="grid grid-cols-2 gap-2">
                          <Card className="p-2.5">
                            <p className="text-xs text-muted-foreground mb-0.5">Tasks Posted</p>
                            <p className="text-xl font-bold">{selectedUser.tasksPosted}</p>
                          </Card>
                          <Card className="p-2.5">
                            <p className="text-xs text-muted-foreground mb-0.5">Total Spent</p>
                            <p className="text-xl font-bold text-green-600">৳{selectedUser.spent}</p>
                          </Card>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          <Card className="p-2.5">
                            <p className="text-xs text-muted-foreground mb-0.5">Jobs Done</p>
                            <p className="text-xl font-bold">{selectedUser.jobsCompleted}</p>
                          </Card>
                          <Card className="p-2.5">
                            <p className="text-xs text-muted-foreground mb-0.5">Total Earned</p>
                            <p className="text-xl font-bold text-green-600">৳{selectedUser.earned}</p>
                          </Card>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column - Worker Details */}
                  {selectedUser.role === "Worker" && selectedUser.workerDetails ? (
                    <div className="space-y-3">
                      {/* Tax Information */}
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Tax & Identity</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <Card className="p-2.5">
                            <p className="text-xs text-muted-foreground mb-0.5">TIN Number</p>
                            <p className="text-xs font-mono font-medium">{selectedUser.tin}</p>
                          </Card>
                          <Card className="p-2.5">
                            <p className="text-xs text-muted-foreground mb-0.5">SSN</p>
                            <p className="text-xs font-mono font-medium">{selectedUser.ssn}</p>
                          </Card>
                        </div>
                      </div>

                      {/* Background Check & Insurance */}
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Verification & Insurance</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {/* Background Check */}
                          <Card className="p-2.5">
                            <div className="flex items-center justify-between mb-1.5">
                              <p className="text-xs font-medium">Background</p>
                              {selectedUser.workerDetails.backgroundCheck.status === "Verified" ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-orange-600" />
                              )}
                            </div>
                            <Badge 
                              className={`text-xs ৳{selectedUser.workerDetails.backgroundCheck.status === "Verified" 
                                ? "bg-green-600" 
                                : "bg-orange-600"
                              }`}
                            >
                              {selectedUser.workerDetails.backgroundCheck.status}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1.5">{selectedUser.workerDetails.backgroundCheck.provider}</p>
                          </Card>

                          {/* Insurance */}
                          <Card className="p-2.5">
                            <div className="flex items-center justify-between mb-1.5">
                              <p className="text-xs font-medium">Insurance</p>
                              {selectedUser.workerDetails.insurance.provider !== "N/A" ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-red-600" />
                              )}
                            </div>
                            <p className="text-xs font-medium mb-0.5">{selectedUser.workerDetails.insurance.provider}</p>
                            <p className="text-xs text-muted-foreground">{selectedUser.workerDetails.insurance.coverage}</p>
                          </Card>
                        </div>
                      </div>

                      {/* Skills & Expertise - Compact */}
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Skills & Expertise</h4>
                        <Card className="p-2.5 space-y-2">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Skills</p>
                            <div className="flex flex-wrap gap-1">
                              {selectedUser.workerDetails.skills.slice(0, 4).map((skill: string, index: number) => (
                                <Badge key={index} variant="outline" className="text-xs py-0">{skill}</Badge>
                              ))}
                              {selectedUser.workerDetails.skills.length > 4 && (
                                <Badge variant="outline" className="text-xs py-0">+{selectedUser.workerDetails.skills.length - 4}</Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 pt-1 border-t">
                            <div>
                              <p className="text-xs text-muted-foreground">Experience</p>
                              <p className="text-sm font-bold">{selectedUser.workerDetails.yearsOfExperience} years</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Languages</p>
                              <p className="text-xs font-medium">{selectedUser.workerDetails.languages.join(", ")}</p>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center text-muted-foreground text-sm">
                      No additional details available for clients
                    </div>
                  )}
                </div>

                {/* Certificates - Horizontal Compact */}
                {selectedUser.role === "Worker" && selectedUser.workerDetails?.certificates && selectedUser.workerDetails.certificates.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Certificates</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedUser.workerDetails.certificates.slice(0, 2).map((cert: any, index: number) => (
                        <Card key={index} className="p-2.5">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 mb-1">
                                <FileText className="w-3.5 h-3.5 text-primary" />
                                <h5 className="text-xs font-medium truncate">{cert.name}</h5>
                              </div>
                              <div className="grid grid-cols-2 gap-1 text-xs">
                                <div>
                                  <p className="text-muted-foreground text-[10px]">Issuer</p>
                                  <p className="font-medium truncate">{cert.issuer}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground text-[10px]">Expires</p>
                                  <p className="font-medium">{cert.expiryDate}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                      {selectedUser.workerDetails.certificates.length > 2 && (
                        <Card className="p-2.5 flex items-center justify-center">
                          <p className="text-xs text-muted-foreground">+{selectedUser.workerDetails.certificates.length - 2} more</p>
                        </Card>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions - Always visible at bottom */}
              <div className="flex gap-2 pt-3 border-t flex-shrink-0">
                <Button
                  variant={selectedUser.status === "locked" ? "default" : "destructive"}
                  className={selectedUser.status === "locked" ? "bg-green-600 hover:bg-green-700" : ""}
                  onClick={() => {
                    setShowUserDetails(false);
                    handleLockUnlock(selectedUser);
                  }}
                >
                  {selectedUser.status === "locked" ? (
                    <>
                      <Unlock className="w-4 h-4 mr-2" />
                      Unlock Account
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Lock Account
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => setShowUserDetails(false)}>
                  Close
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}