import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { User, Wrench, ChevronLeft } from "lucide-react";

interface RoleSelectionProps {
  onSelectRole: (role: "client" | "worker") => void;
  onSelectRoleForLogin: (role: "client" | "worker") => void;
  onBack: () => void;
}

export function RoleSelection({ onSelectRole, onSelectRoleForLogin, onBack }: RoleSelectionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={onBack}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-3xl mb-2">Choose Your Role</h1>
          <p className="text-muted-foreground">
            How would you like to use MiniMates?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-8 hover:shadow-xl transition-all hover:border-primary">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-2xl mb-4">
                <User className="w-10 h-10 text-primary" />
              </div>
              <h2 className="mb-2">I'm a Client</h2>
              <p className="text-muted-foreground mb-6">
                I need help with tasks and want to hire workers
              </p>
              <ul className="text-sm text-left space-y-2 mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>Post unlimited tasks</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>Get competitive bids</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>Secure payments</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>Rate & review workers</span>
                </li>
              </ul>
              <div className="space-y-2">
                <Button 
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectRole("client");
                  }}
                >
                  Sign Up as Client
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectRoleForLogin("client");
                  }}
                >
                  Login as Client
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-8 hover:shadow-xl transition-all hover:border-green-600">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-2xl mb-4">
                <Wrench className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="mb-2">I'm a Worker</h2>
              <p className="text-muted-foreground mb-6">
                I want to find work and earn money by completing tasks
              </p>
              <ul className="text-sm text-left space-y-2 mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Browse nearby tasks</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Flexible schedule</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Fast payouts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Build your reputation</span>
                </li>
              </ul>
              <div className="space-y-2">
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectRole("worker");
                  }}
                >
                  Sign Up as Worker
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectRoleForLogin("worker");
                  }}
                >
                  Login as Worker
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          You can switch roles anytime in your account settings
        </p>
      </div>
    </div>
  );
}