import { useState, useCallback, useMemo } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card } from "../ui/card";
import { ChevronLeft, Eye, EyeOff, Mail, Lock, Chrome, Apple } from "lucide-react";
import { motion } from "motion/react";

interface LoginProps {
  role: "client" | "worker" | "admin";
  onLogin: (email: string, password: string) => Promise<boolean>; // ✅ return success
  onBack: () => void;
  onSwitchToSignUp?: () => void;
  onForgotPassword: () => void;
}

export function Login({
  role,
  onLogin,
  onBack,
  onSwitchToSignUp,
  onForgotPassword
}: LoginProps) {

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ validation
  const validate = useCallback((email: string, password: string) => {
    const newErrors: Record<string, string> = {};

    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password) newErrors.password = "Password is required";

    return newErrors;
  }, []);

  const handleChange = (field: "email" | "password", value: string) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);

    // live validation
    setErrors(validate(updated.email, updated.password));
  };

  const isFormValid = useMemo(() => {
    return (
      formData.email.trim() !== "" &&
      formData.password.trim() !== "" &&
      Object.keys(errors).length === 0
    );
  }, [formData, errors]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate(formData.email, formData.password);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      setLoading(true);
      setApiError("");

      // ✅ API CALL
      const success = await onLogin(formData.email, formData.password);

      if (!success) {
        setApiError("Invalid email or password");
        return;
      }

      // ✅ redirect handled in parent (dashboard)
    } catch (err: any) {
      setApiError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const roleTitle =
    role === "admin"
      ? "Admin Login"
      : `Sign in as ${role === "client" ? "Client" : "Worker"}`;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">

      <div className="w-full max-w-[420px]">

        {role !== "admin" && (
          <button
            onClick={onBack}
            className="mb-5 text-sm text-gray-500 hover:text-black flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
        )}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card className="p-8">

            <h1 className="text-xl font-semibold mb-1">{roleTitle}</h1>
            <p className="text-sm text-gray-500 mb-6">
              Enter your details to continue
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* EMAIL */}
              <div>
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email}</p>
                )}
              </div>

              {/* PASSWORD */}
              <div>
                <Label>Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    className="pl-10 pr-10"
                    value={formData.password}
                    onChange={(e) =>
                      handleChange("password", e.target.value)
                    }
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2 text-gray-400"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>

                {errors.password && (
                  <p className="text-red-500 text-xs">{errors.password}</p>
                )}
              </div>

              {/* BUTTON */}
              <Button
                type="submit"
                disabled={!isFormValid || loading}
                className="w-full"
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>

              {/* API ERROR */}
              {apiError && (
                <p className="text-red-500 text-sm text-center">
                  {apiError}
                </p>
              )}
            </form>

            {/* SOCIAL */}
            <div className="mt-6 flex gap-2">
              <Button variant="outline" className="w-1/2">
                <Chrome className="w-4 h-4 mr-2" />
                Google
              </Button>
              <Button variant="outline" className="w-1/2">
                <Apple className="w-4 h-4 mr-2" />
                Apple
              </Button>
            </div>

            {onSwitchToSignUp && (
              <p className="text-center text-sm mt-4 text-gray-500">
                No account?{" "}
                <button
                  onClick={onSwitchToSignUp}
                  className="text-blue-500"
                >
                  Sign up
                </button>
              </p>
            )}

          </Card>
        </motion.div>
      </div>
    </div>
  );
}