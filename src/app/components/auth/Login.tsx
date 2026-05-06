import { useState, useCallback, useMemo } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card } from "../ui/card";
import { ChevronLeft, Eye, EyeOff, Mail, Lock, Chrome, Apple } from "lucide-react";

interface LoginProps {
  role: "client" | "worker" | "admin";
  onLogin: (email: string, password: string) => Promise<void>;
  onBack: () => void;
  onSwitchToSignUp?: () => void;
  onForgotPassword: () => void;
}

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Login({ 
  role, 
  onLogin, 
  onBack, 
  onSwitchToSignUp, 
  onForgotPassword 
}: LoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = useCallback((value: string): string | null => {
    if (!value.trim()) return "Email is required";
    if (!EMAIL_REGEX.test(value)) return "Please enter a valid email address";
    return null;
  }, []);

  const validatePassword = useCallback((value: string): string | null => {
    if (!value) return "Password is required";
    return null;
  }, []);

  const validateForm = useCallback((data: FormData): FormErrors => {
    const newErrors: FormErrors = {};
    
    const emailError = validateEmail(data.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(data.password);
    if (passwordError) newErrors.password = passwordError;

    return newErrors;
  }, [validateEmail, validatePassword]);

  const handleChange = useCallback((field: keyof FormData) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error on change
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const handleBlur = useCallback((field: keyof FormData) => (value: string) => {
    const fieldError = field === 'email' ? validateEmail(value) : validatePassword(value);
    setErrors(prev => ({
      ...prev,
      [field]: fieldError || undefined
    }));
  }, [validateEmail, validatePassword]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors = validateForm(formData);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setApiError("");
      setIsSubmitting(true);
      
      try {
        await onLogin(formData.email.trim(), formData.password);
      } catch (error) {
        setApiError(error instanceof Error ? error.message : "Login failed. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [formData, onLogin, validateForm]);

  const isFormValid = useMemo(() => {
    return formData.email.trim().length > 0 && 
           formData.password.length > 0 && 
           Object.keys(errors).length === 0;
  }, [formData, errors]);

  const roleTitle = useMemo(() => {
    const titles: Record<LoginProps["role"], string> = {
      client: "Client",
      worker: "Worker",
      admin: "Admin",
    };
  
    return role === "admin"
      ? "Admin Login"
      : `Sign In as ${titles[role]}`;
  }, [role]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4" role="main">
      <div className="w-full max-w-md">
        {role !== "admin" && (
          <Button
            variant="ghost"
            className="mb-6"
            onClick={onBack}
            aria-label="Go back"
          >
            <ChevronLeft className="w-4 h-4 mr-2" aria-hidden />
            Back
          </Button>
        )}

        <Card className="p-8" role="form" aria-labelledby="login-title">
          <div className="text-center mb-6">
            <h1 id="login-title" className="text-3xl mb-2 font-bold">
            {role === "admin"
    ? "Admin Login"
    : `Sign In as ${role === "client" ? "Client" : "Worker"}`}
            </h1>
            <p className="text-muted-foreground" aria-describedby="login-description">
              Welcome back! Please enter your details
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail 
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" 
                  aria-hidden 
                />
                <Input
                  id="email"
                  type="email"
                  placeholder="karim@example.com"
                  className="pl-10"
                  value={formData.email}
                  onChange={(e) => handleChange("email")(e.target.value)}
                  onBlur={(e) => handleBlur("email")(e.target.value)}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  aria-invalid={!!errors.email}
                  autoComplete="email"
                  disabled={isSubmitting}
                />
              </div>
              {errors.email && (
                <p id="email-error" className="text-sm text-destructive mt-1" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-sm text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label="Forgot password"
                  disabled={isSubmitting}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock 
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" 
                  aria-hidden 
                />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-10 pr-10"
                  value={formData.password}
                  onChange={(e) => handleChange("password")(e.target.value)}
                  onBlur={(e) => handleBlur("password")(e.target.value)}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  aria-invalid={!!errors.password}
                  autoComplete="current-password"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground hover:bg-accent rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  disabled={isSubmitting}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="text-sm text-destructive mt-1" role="alert">
                  {errors.password}
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-primary hover:bg-primary/90"
              disabled={!isFormValid || isSubmitting}
              aria-live="polite"
            >
              {isSubmitting ? (
                <>
                  <span className="sr-only">Signing in</span>
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            
            {apiError && (
              <p className="text-sm text-destructive text-center" role="alert" aria-live="assertive">
                {apiError}
              </p>
            )}
          </form>

          {role !== "admin" && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-wider">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  type="button" 
                  className="h-11" 
                  disabled={isSubmitting}
                  aria-label="Continue with Google"
                >
                  <Chrome className="w-4 h-4 mr-2" aria-hidden />
                  Google
                </Button>
                <Button 
                  variant="outline" 
                  type="button" 
                  className="h-11" 
                  disabled={isSubmitting}
                  aria-label="Continue with Apple"
                >
                  <Apple className="w-4 h-4 mr-2" aria-hidden />
                  Apple
                </Button>
              </div>

              {onSwitchToSignUp && (
                <p className="text-center text-sm text-muted-foreground mt-6">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={onSwitchToSignUp}
                    className="text-primary hover:underline font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none"
                    disabled={isSubmitting}
                  >
                    Sign up
                  </button>
                </p>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  );
}