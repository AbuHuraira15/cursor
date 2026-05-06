import { Home, Search, Briefcase, MessageSquare, User, DollarSign, LayoutDashboard, Users as UsersIcon, AlertTriangle, Wallet, PlusCircle } from "lucide-react";
import { Badge } from "./ui/badge";

interface MobileNavProps {
  role: "client" | "worker" | "admin";
  currentPage: string;
  onNavigate: (page: string) => void;
  messageCount?: number;
}

export function MobileNav({ role, currentPage, onNavigate, messageCount = 0 }: MobileNavProps) {
  if (role === "admin") {
    return (
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50">
        <div className="flex items-center justify-around h-16 px-2">
          <button
            onClick={() => onNavigate("dashboard")}
            className={`flex flex-col items-center justify-center flex-1 h-full ৳{
              currentPage === "dashboard" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <LayoutDashboard className="w-6 h-6 mb-1" />
            <span className="text-xs">Dashboard</span>
          </button>

          <button
            onClick={() => onNavigate("users")}
            className={`flex flex-col items-center justify-center flex-1 h-full ৳{
              currentPage === "users" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <UsersIcon className="w-6 h-6 mb-1" />
            <span className="text-xs">Users</span>
          </button>

          <button
            onClick={() => onNavigate("reports")}
            className={`flex flex-col items-center justify-center flex-1 h-full ৳{
              currentPage === "reports" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <AlertTriangle className="w-6 h-6 mb-1" />
            <span className="text-xs">Reports</span>
          </button>

          <button
            onClick={() => onNavigate("settings")}
            className={`flex flex-col items-center justify-center flex-1 h-full ৳{
              currentPage === "settings" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <User className="w-6 h-6 mb-1" />
            <span className="text-xs">Settings</span>
          </button>
        </div>
      </nav>
    );
  }

  if (role === "client") {
    return (
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50">
        <div className="flex items-center justify-around h-16 px-2">
          <button
            onClick={() => onNavigate("dashboard")}
            className={`flex flex-col items-center justify-center flex-1 h-full ৳{
              currentPage === "dashboard" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Home className="w-6 h-6 mb-1" />
            <span className="text-xs">Home</span>
          </button>

          <button
            onClick={() => onNavigate("my-tasks")}
            className={`flex flex-col items-center justify-center flex-1 h-full ৳{
              currentPage === "my-tasks" || currentPage.includes("task") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Briefcase className="w-6 h-6 mb-1" />
            <span className="text-xs">Tasks</span>
          </button>

          <button
            onClick={() => onNavigate("payments")}
            className={`flex flex-col items-center justify-center flex-1 h-full ৳{
              currentPage === "payments" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Wallet className="w-6 h-6 mb-1" />
            <span className="text-xs">Payments</span>
          </button>

          <button
            onClick={() => onNavigate("post-task")}
            className={`flex flex-col items-center justify-center flex-1 h-full ৳{
              currentPage === "post-task" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <PlusCircle className="w-6 h-6 mb-1" />
            <span className="text-xs">Post Job</span>
          </button>

          <button
            onClick={() => onNavigate("profile")}
            className={`flex flex-col items-center justify-center flex-1 h-full ৳{
              currentPage === "profile" || currentPage === "settings" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <User className="w-6 h-6 mb-1" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </nav>
    );
  }

  // Worker navigation
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50">
      <div className="flex items-center justify-around h-16 px-2">
        <button
          onClick={() => onNavigate("dashboard")}
          className={`flex flex-col items-center justify-center flex-1 h-full ৳{
            currentPage === "dashboard" ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <Home className="w-6 h-6 mb-1" />
          <span className="text-xs">Home</span>
        </button>

        <button
          onClick={() => onNavigate("browse-tasks")}
          className={`flex flex-col items-center justify-center flex-1 h-full ৳{
            currentPage === "browse-tasks" ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <Search className="w-6 h-6 mb-1" />
          <span className="text-xs">Browse</span>
        </button>

        <button
          onClick={() => onNavigate("my-bids")}
          className={`flex flex-col items-center justify-center flex-1 h-full ৳{
            currentPage === "my-bids" || currentPage.includes("job") ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <Briefcase className="w-6 h-6 mb-1" />
          <span className="text-xs">My Jobs</span>
        </button>

        <button
          onClick={() => onNavigate("earnings")}
          className={`flex flex-col items-center justify-center flex-1 h-full ৳{
            currentPage === "earnings" ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <DollarSign className="w-6 h-6 mb-1" />
          <span className="text-xs">Earnings</span>
        </button>

        <button
          onClick={() => onNavigate("profile")}
          className={`flex flex-col items-center justify-center flex-1 h-full ৳{
            currentPage === "profile" || currentPage === "settings" ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <User className="w-6 h-6 mb-1" />
          <span className="text-xs">Profile</span>
        </button>
      </div>
    </nav>
  );
}