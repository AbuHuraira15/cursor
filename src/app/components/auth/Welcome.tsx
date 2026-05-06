import { Button } from "../ui/button";
import { Users, Briefcase, Shield, ChevronLeft } from "lucide-react";

interface WelcomeProps {
  onContinue: () => void;
  onBack?: () => void;
}

export function Welcome({ onContinue, onBack }: WelcomeProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4 relative">
      {onBack && (
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="absolute top-4 left-4"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      )}
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-2xl mb-4">
            <Users className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl mb-3">MiniMates</h1>
          <p className="text-muted-foreground">
            Connect with trusted workers for your small tasks
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg mb-6">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="mb-1">Post Tasks</h3>
                <p className="text-sm text-muted-foreground">
                  Describe your task and get competitive bids from skilled workers
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="mb-1">Find Work</h3>
                <p className="text-sm text-muted-foreground">
                  Browse nearby tasks and earn money on your schedule
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="mb-1">Safe & Secure</h3>
                <p className="text-sm text-muted-foreground">
                  Verified profiles, secure payments, and 24/7 support
                </p>
              </div>
            </div>
          </div>
        </div>

        <Button 
          onClick={onContinue} 
          className="w-full h-12 bg-primary hover:bg-primary/90"
        >
          Get Started
        </Button>

        <p className="text-center text-sm text-muted-foreground mt-4">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}