import { Bell, MessageSquare, User, Users, Settings, HelpCircle, Wallet } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface NavigationProps {
  role: "client" | "worker" | "admin";
  onNavigate: (page: string) => void;
  onLogout: () => void;
  notificationCount?: number;
  messageCount?: number;
}

export function Navigation({ role, onNavigate, onLogout, notificationCount = 0, messageCount = 0 }: NavigationProps) {
  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <button onClick={() => onNavigate("dashboard")} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl">MiniMates</span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              <Button
                variant="ghost"
                onClick={() => onNavigate("dashboard")}
                className="text-sm"
              >
                Dashboard
              </Button>
              {role === "client" && (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => onNavigate("my-tasks")}
                    className="text-sm"
                  >
                    My Tasks
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => onNavigate("payments")}
                    className="text-sm"
                  >
                    Payments
                  </Button>
                </>
              )}
              {role === "worker" && (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => onNavigate("browse-tasks")}
                    className="text-sm"
                  >
                    Browse Tasks
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => onNavigate("my-bids")}
                    className="text-sm"
                  >
                    My Bids
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => onNavigate("earnings")}
                    className="text-sm"
                  >
                    Earnings
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Role Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg mr-2">
              <div className={`w-2 h-2 rounded-full ৳{
                role === "admin" ? "bg-purple-500" : 
                role === "worker" ? "bg-blue-500" : 
                "bg-green-500"
              }`} />
              <span className="text-sm font-medium capitalize">
                {role}
              </span>
            </div>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => onNavigate("notifications")}
            >
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-0 bg-destructive text-white text-xs">
                  {notificationCount > 9 ? "9+" : notificationCount}
                </Badge>
              )}
            </Button>

            {/* Messages */}
            {role !== "admin" && (
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => onNavigate("messages")}
              >
                <MessageSquare className="w-5 h-5" />
                {messageCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-0 bg-destructive text-white text-xs">
                    {messageCount > 9 ? "9+" : messageCount}
                  </Badge>
                )}
              </Button>
            )}

            {/* Help */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate("help")}
            >
              <HelpCircle className="w-5 h-5" />
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onNavigate("profile")}>
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onNavigate("settings")}>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={onLogout}>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}