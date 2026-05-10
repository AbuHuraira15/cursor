import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card } from "../ui/card";
import { ChevronLeft, Eye, EyeOff, Mail, Phone, User, Lock, Chrome, Apple, Upload, FileCheck, Hash } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { signUp } from "../../lib/api";

interface SignUpProps {
  role: "client" | "worker" ;
  onSignUp: () => void;
  onBack: () => void;
  onSwitchToLogin: () => void;
}

export function SignUp({ role, onSignUp, onBack, onSwitchToLogin }: SignUpProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    language: "en",
    // Worker-specific fields
    tinNumber: "",
    certificateFile: null as File | null
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [certificateFileName, setCertificateFileName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors };

    switch (field) {
      case "name":
        if (!value.trim()) {
          newErrors.name = "Name is required";
        } else {
          delete newErrors.name;
        }
        break;
      case "email":
        if (!value.trim()) {
          newErrors.email = "Email is required";
        } else {
          delete newErrors.email;
        }
        break;
      case "phone":
        if (!value.trim()) {
          newErrors.phone = "Phone number is required";
        } else {
          delete newErrors.phone;
        }
        break;
      case "password":
        if (!value) {
          newErrors.password = "Password is required";
        } else if (value.length < 8) {
          newErrors.password = "Password must be at least 8 characters";
        } else {
          delete newErrors.password;
        }
        break;
      case "confirmPassword":
        if (!value) {
          newErrors.confirmPassword = "Please confirm your password";
        } else if (value !== formData.password) {
          newErrors.confirmPassword = "Passwords do not match";
        } else {
          delete newErrors.confirmPassword;
        }
        break;
      case "tinNumber":
        if (role === "worker" && !value.trim()) {
          newErrors.tinNumber = "TIN number is required";
        } else {
          delete newErrors.tinNumber;
        }
        break;
      case "certificateFile":
        if (role === "worker" && !value) {
          newErrors.certificateFile = "Certificate file is required";
        } else {
          delete newErrors.certificateFile;
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    validateField(field, value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, certificateFile: file });
      setCertificateFileName(file.name);
      validateField("certificateFile", file.name);
    } else {
      setFormData({ ...formData, certificateFile: null });
      setCertificateFileName("");
      validateField("certificateFile", "");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    validateField("name", formData.name);
    validateField("email", formData.email);
    validateField("phone", formData.phone);
    validateField("password", formData.password);
    validateField("confirmPassword", formData.confirmPassword);
    
    if (role === "worker") {
      validateField("tinNumber", formData.tinNumber);
      validateField("certificateFile", certificateFileName);
    }

    // Check if form is valid
    const hasErrors = Object.keys(errors).length > 0;
    let hasEmptyFields = !formData.name || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword;
    
    if (role === "worker") {
      hasEmptyFields = hasEmptyFields || !formData.tinNumber || !formData.certificateFile;
    }

    if (!hasErrors && !hasEmptyFields) {
      try {
        setApiError("");
        setIsSubmitting(true);
        const username = formData.email.includes("@") ? formData.email.split("@")[0] : formData.email;
        await signUp({
          username,
          first_name: formData.name.split(" ")[0] || formData.name,
          last_name: formData.name.split(" ").slice(1).join(" "),
          email: formData.email,
          phone: formData.phone,
          role,
          preferred_language: formData.language,
          tin_number: role === "worker" ? formData.tinNumber : undefined,
          password: formData.password,
          confirm_password: formData.confirmPassword,
        });
        onSignUp();
      } catch (error) {
        setApiError(error instanceof Error ? error.message : "Sign up failed");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const isFormValid = role === "worker"
    ? formData.name && 
      formData.email && 
      formData.phone && 
      formData.password && 
      formData.confirmPassword &&
      formData.tinNumber &&
      formData.certificateFile &&
      Object.keys(errors).length === 0
    : formData.name && 
      formData.email && 
      formData.phone && 
      formData.password && 
      formData.confirmPassword && 
      Object.keys(errors).length === 0;

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
            <h1 className="text-3xl mb-2">
              Sign Up as {role === "client" ? "Client" : "Worker"}
            </h1>
            <p className="text-muted-foreground">
              Create your account to get started
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Karim Hasan"
                  className="pl-10"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  onBlur={(e) => validateField("name", e.target.value)}
                />
              </div>
              {errors.name && (
                <p className="text-sm text-destructive mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="karim@example.com"
                  className="pl-10"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  onBlur={(e) => validateField("email", e.target.value)}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  className="pl-10"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  onBlur={(e) => validateField("phone", e.target.value)}
                />
              </div>
              {errors.phone && (
                <p className="text-sm text-destructive mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 8 characters"
                  className="pl-10 pr-10"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  onBlur={(e) => validateField("password", e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter password"
                  className="pl-10"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  onBlur={(e) => validateField("confirmPassword", e.target.value)}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-destructive mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <div>
              <Label htmlFor="language">Preferred Language</Label>
              <Select
                value={formData.language}
                onValueChange={(value) => setFormData({ ...formData, language: value })}
              >
                <SelectTrigger id="language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="zh">中文</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {role === "worker" && (
              <>
                <div>
                  <Label htmlFor="tinNumber">TIN Number (Tax Identification Number)</Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="tinNumber"
                      type="text"
                      placeholder="123-45-6789"
                      className="pl-10"
                      value={formData.tinNumber}
                      onChange={(e) => handleChange("tinNumber", e.target.value)}
                      onBlur={(e) => validateField("tinNumber", e.target.value)}
                    />
                  </div>
                  {errors.tinNumber && (
                    <p className="text-sm text-destructive mt-1">{errors.tinNumber}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Required for tax purposes and payment processing
                  </p>
                </div>

                <div>
                  <Label htmlFor="certificateFile">Worker Certificate</Label>
                  <div className="space-y-2">
                    <div className="relative">
                      <input
                        id="certificateFile"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={handleFileChange}
                        onBlur={() => validateField("certificateFile", certificateFileName)}
                      />
                      <label
                        htmlFor="certificateFile"
                        className="flex items-center justify-center gap-2 w-full h-12 px-4 border border-input rounded-lg cursor-pointer hover:bg-muted transition-colors"
                      >
                        {certificateFileName ? (
                          <>
                            <FileCheck className="w-4 h-4 text-green-600" />
                            <span className="text-sm truncate">{certificateFileName}</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Upload Certificate (PDF, JPG, PNG)</span>
                          </>
                        )}
                      </label>
                    </div>
                    {errors.certificateFile && (
                      <p className="text-sm text-destructive">{errors.certificateFile}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Upload any professional certifications, licenses, or qualifications
                    </p>
                  </div>
                </div>
              </>
            )}

            <Button 
              type="submit" 
              className="w-full h-12 bg-primary hover:bg-primary/90"
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>
            {apiError && <p className="text-sm text-destructive">{apiError}</p>}
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" type="button" className="h-11">
              <Chrome className="w-4 h-4 mr-2" />
              Google
            </Button>
            <Button variant="outline" type="button" className="h-11">
              <Apple className="w-4 h-4 mr-2" />
              Apple
            </Button>
          </div>

          {/* Only show login link if it makes sense - make it subtle */}
          <p className="text-center text-xs text-muted-foreground/60 mt-8">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-muted-foreground hover:text-primary underline"
            >
              Sign in
            </button>
          </p>
        </Card>
      </div>
    </div>
  );
}