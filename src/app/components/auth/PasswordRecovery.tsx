import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card } from "../ui/card";
import { ChevronLeft, Mail, CheckCircle } from "lucide-react";

interface PasswordRecoveryProps {
  onBack: () => void;
}

export function PasswordRecovery({ onBack }: PasswordRecoveryProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = (value: string) => {
    if (!value.trim()) {
      setError("Email is required");
      return false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+৳/.test(value)) {
      setError("Invalid email address");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateEmail(email)) {
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl mb-2">Check Your Email</h1>
            <p className="text-muted-foreground mb-6">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Click the link in the email to reset your password. If you don't see it, check your spam folder.
            </p>
            <Button
              onClick={onBack}
              variant="outline"
              className="w-full"
            >
              Back to Sign In
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={onBack}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card className="p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl mb-2">Reset Password</h1>
            <p className="text-muted-foreground">
              Enter your email and we'll send you a reset link
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="karim@example.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={(e) => validateEmail(e.target.value)}
                />
              </div>
              {error && (
                <p className="text-sm text-destructive mt-1">{error}</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-primary hover:bg-primary/90"
              disabled={!email}
            >
              Send Reset Link
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
