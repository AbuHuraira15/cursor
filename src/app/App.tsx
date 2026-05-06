import { useEffect, useState } from "react";
import { Navigation } from "./components/Navigation";
import { MobileNav } from "./components/MobileNav";
import { HelpCenter } from "./components/shared/HelpCenter";
import { AdminSupportCenter } from "./components/admin/AdminSupportCenter";
import { NotificationCenter } from "./components/shared/NotificationCenter";
import { AdminNotificationCenter } from "./components/admin/AdminNotificationCenter";
import { ChatInterface } from "./components/shared/ChatInterface";
import { HomePage } from "./components/HomePage";
import { Footer } from "./components/Footer";

// Import auth components
import { Welcome } from "./components/auth/Welcome";
import { RoleSelection } from "./components/auth/RoleSelection";
import { SignUp } from "./components/auth/SignUp";
import { Login } from "./components/auth/Login";
import { PasswordRecovery } from "./components/auth/PasswordRecovery";

// Import client components (to be created)
import { ClientDashboard } from "./components/client/ClientDashboard";

// Import worker components (to be created)
import { WorkerDashboard } from "./components/worker/WorkerDashboard";

// Import admin components
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { AdminProfile } from "./components/admin/AdminProfile";
import { login as loginApi, me, type AuthUser } from "./lib/api";

export default function App() {
  const [authStep, setAuthStep] = useState<"home" | "welcome" | "role" | "signup" | "login" | "password-recovery" | "authenticated">("home");
  const [userRole, setUserRole] = useState<"client" | "worker" | "admin" | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(localStorage.getItem("accessToken"));
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  useEffect(() => {
    if (!authToken) return;
    me(authToken)
      .then((user) => {
        setAuthUser(user);
        setUserRole(user.role);
        setAuthStep("authenticated");
      })
      .catch(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setAuthToken(null);
      });
  }, [authToken]);

  const handleRoleSelection = (role: "client" | "worker") => {
    setUserRole(role);
    setAuthStep("signup");
  };

  const handleRoleSelectionForLogin = (role: "client" | "worker") => {
    setUserRole(role);
    setAuthStep("login");
  };

  const handleSignUp = () => {
    setAuthStep("login");
  };

  const handleLogin = async (email: string, password: string) => {
    const username = email.includes("@") ? email.split("@")[0] : email;
    const data = await loginApi({ username, password });
    localStorage.setItem("accessToken", data.access);
    localStorage.setItem("refreshToken", data.refresh);
    setAuthToken(data.access);
    setAuthUser(data.user);
    setUserRole(data.user.role);
    setAuthStep("authenticated");
  };

  const handleAdminAccess = () => {
    setUserRole("admin");
    setAuthStep("login");
    setShowAdminLogin(false);
  };

  const handleNavigation = (page: string) => {
    setCurrentPage(page);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setAuthToken(null);
    setAuthUser(null);
    setAuthStep("welcome");
    setUserRole(null);
    setCurrentPage("dashboard");
  };

  // Show Admin Login button in Welcome screen
  if (authStep === "welcome") {
    return (
      <div className="relative">
        <Welcome 
          onContinue={() => setAuthStep("role")}
          onBack={() => setAuthStep("home")}
        />
        <button
          onClick={() => setShowAdminLogin(true)}
          className="fixed bottom-4 right-4 text-xs text-muted-foreground hover:text-foreground underline"
        >
          Admin Login
        </button>
        {showAdminLogin && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full">
              <h3 className="mb-4">Admin Access</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Are you sure you want to access the admin panel?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleAdminAccess}
                  className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
                >
                  Yes, Continue
                </button>
                <button
                  onClick={() => setShowAdminLogin(false)}
                  className="flex-1 border px-4 py-2 rounded-lg hover:bg-muted"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (authStep === "role") {
    return (
      <RoleSelection
        onSelectRole={handleRoleSelection}
        onSelectRoleForLogin={handleRoleSelectionForLogin}
        onBack={() => setAuthStep("welcome")}
      />
    );
  }

  if (authStep === "signup" && userRole) {
    return (
      <SignUp
        role={userRole}
        onSignUp={handleSignUp}
        onBack={() => setAuthStep("role")}
        onSwitchToLogin={() => setAuthStep("login")}
      />
    );
  }

  if (authStep === "login") {
    return (
      <Login
        role={userRole || "client"}
        onLogin={handleLogin}
        onBack={() => {
          if (userRole === "admin") {
            setUserRole(null);
            setAuthStep("welcome");
          } else {
            setAuthStep("role");
          }
        }}
        onSwitchToSignUp={userRole !== "admin" ? () => setAuthStep("signup") : undefined}
        onForgotPassword={() => setAuthStep("password-recovery")}
      />
    );
  }

  if (authStep === "password-recovery") {
    return (
      <PasswordRecovery
        onBack={() => setAuthStep("login")}
      />
    );
  }

  // Authenticated App
  if (authStep === "authenticated" && userRole) {
    // Show Help Center
    if (currentPage === "help") {
      return (
        <div className="min-h-screen bg-background">
          <Navigation
            role={userRole}
            onNavigate={handleNavigation}
            onLogout={handleLogout}
            notificationCount={3}
            messageCount={2}
          />
          <main className="pb-20 md:pb-8">
            {userRole === "admin" ? (
              <AdminSupportCenter />
            ) : (
              <HelpCenter userRole={userRole} />
            )}
          </main>
          <MobileNav
            role={userRole}
            currentPage={currentPage}
            onNavigate={handleNavigation}
            messageCount={2}
          />
        </div>
      );
    }

    // Show Notifications
    if (currentPage === "notifications") {
      return (
        <div className="min-h-screen bg-background">
          <Navigation
            role={userRole}
            onNavigate={handleNavigation}
            onLogout={handleLogout}
            notificationCount={3}
            messageCount={2}
          />
          <main className="pb-20 md:pb-8 max-w-7xl mx-auto px-4 py-6">
            {userRole === "admin" ? (
              <AdminNotificationCenter />
            ) : (
              <NotificationCenter />
            )}
          </main>
          <MobileNav
            role={userRole}
            currentPage={currentPage}
            onNavigate={handleNavigation}
            messageCount={2}
          />
        </div>
      );
    }

    // Show Messages/Chat
    if (currentPage === "messages") {
      return (
        <div className="min-h-screen bg-background">
          <Navigation
            role={userRole}
            onNavigate={handleNavigation}
            onLogout={handleLogout}
            notificationCount={3}
            messageCount={2}
          />
          <main className="pb-20 md:pb-8 max-w-7xl mx-auto px-4 py-6">
            <ChatInterface
              contactName={userRole === "client" ? "Rahim Uddin" : "Karim Hasan"}
              contactRole={userRole === "client" ? "Worker" : "Client"}
              taskTitle="Deep clean 2-bedroom apartment"
              onBack={() => handleNavigation("dashboard")}
            />
          </main>
          <MobileNav
            role={userRole}
            currentPage={currentPage}
            onNavigate={handleNavigation}
            messageCount={2}
          />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation
          role={userRole}
          onNavigate={handleNavigation}
          onLogout={handleLogout}
          notificationCount={3}
          messageCount={2}
        />

        <main className="pb-20 md:pb-0 flex-1">
          {userRole === "client" && (
            <ClientDashboard
              currentPage={currentPage}
              onNavigate={handleNavigation}
              authToken={authToken || ""}
              authUser={authUser}
            />
          )}
          {userRole === "worker" && (
            <WorkerDashboard currentPage={currentPage} onNavigate={handleNavigation} authToken={authToken || ""} />
          )}
          {userRole === "admin" && <AdminDashboard currentPage={currentPage} onNavigate={handleNavigation} />}
        </main>

        <Footer />

        <MobileNav
          role={userRole}
          currentPage={currentPage}
          onNavigate={handleNavigation}
          messageCount={2}
        />
      </div>
    );
  }

  return (
    <HomePage onGetStarted={() => setAuthStep("welcome")} />
  );
}