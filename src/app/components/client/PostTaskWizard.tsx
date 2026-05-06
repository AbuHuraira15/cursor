import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Wrench, Home, Scissors, Package, Car, Laptop, Calendar as CalendarIcon, MapPin, DollarSign, Clock, Zap } from "lucide-react";
import { format } from "date-fns";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Progress } from "../ui/progress";

interface PostTaskWizardProps {
  onClose: () => void;
  onComplete: (taskData: any) => Promise<void>;
}

const categories = [
  { id: "plumbing", name: "Plumbing", icon: Wrench },
  { id: "electrical", name: "Electrician", icon: Zap },
  { id: "cleaning", name: "Cleaning", icon: Home },
  { id: "gardening", name: "Gardening", icon: Scissors },
  { id: "moving", name: "Moving", icon: Package },
  { id: "delivery", name: "Delivery", icon: Car },
  { id: "tech", name: "Tech Support", icon: Laptop },
];

export function PostTaskWizard({ onClose, onComplete }: PostTaskWizardProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    address: "",
    date: undefined as Date | undefined,
    time: "",
    duration: "",
    budget: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.title.trim()) newErrors.title = "Title is required";
      if (!formData.description.trim()) newErrors.description = "Description is required";
    }
    if (currentStep === 2) {
      if (!formData.category) newErrors.category = "Please select a category";
    }
    if (currentStep === 3) {
      if (!formData.location.trim()) newErrors.location = "Location is required";
      if (!formData.address.trim()) newErrors.address = "Address is required";
    }
    if (currentStep === 4) {
      if (!formData.date) newErrors.date = "Date is required";
      if (!formData.time) newErrors.time = "Time is required";
      if (!formData.duration) newErrors.duration = "Duration is required";
    }
    if (currentStep === 5) {
      if (!formData.budget) newErrors.budget = "Budget is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (validateStep(step)) {
      if (step < totalSteps) {
        setStep(step + 1);
      } else {
        setIsSubmitting(true);
        try {
          await onComplete(formData);
        } finally {
          setIsSubmitting(false);
        }
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setErrors({});
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                placeholder="e.g., Fix leaking kitchen faucet"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={errors.title ? "border-destructive" : ""}
              />
              {errors.title && <p className="text-sm text-destructive mt-1">{errors.title}</p>}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the task in detail. What needs to be done? Any specific requirements?"
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={errors.description ? "border-destructive" : ""}
              />
              {errors.description && <p className="text-sm text-destructive mt-1">{errors.description}</p>}
              <p className="text-sm text-muted-foreground mt-1">
                Be clear and specific to get better bids
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label>Select Category</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat.id })}
                      className={`p-4 border rounded-lg flex flex-col items-center gap-2 transition-all hover:border-primary ৳{
                        formData.category === cat.id
                          ? "border-primary bg-blue-50"
                          : "border-border"
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ৳{
                        formData.category === cat.id ? "bg-primary" : "bg-muted"
                      }`}>
                        <Icon className={`w-6 h-6 ৳{
                          formData.category === cat.id ? "text-white" : "text-foreground"
                        }`} />
                      </div>
                      <span className="text-sm">{cat.name}</span>
                    </button>
                  );
                })}
              </div>
              {errors.category && <p className="text-sm text-destructive mt-2">{errors.category}</p>}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="location">City/Area</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="location"
                  placeholder="e.g., Downtown, Brooklyn"
                  className={`pl-10 ৳{errors.location ? "border-destructive" : ""}`}
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              {errors.location && <p className="text-sm text-destructive mt-1">{errors.location}</p>}
            </div>

            <div>
              <Label htmlFor="address">Full Address</Label>
              <Textarea
                id="address"
                placeholder="Street address, apartment/unit number"
                rows={3}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className={errors.address ? "border-destructive" : ""}
              />
              {errors.address && <p className="text-sm text-destructive mt-1">{errors.address}</p>}
              <p className="text-sm text-muted-foreground mt-1">
                Exact address will only be shared with the hired worker
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left ৳{errors.date ? "border-destructive" : ""}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? format(formData.date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => setFormData({ ...formData, date })}
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
              {errors.date && <p className="text-sm text-destructive mt-1">{errors.date}</p>}
            </div>

            <div>
              <Label htmlFor="time">Preferred Time</Label>
              <Select value={formData.time} onValueChange={(value) => setFormData({ ...formData, time: value })}>
                <SelectTrigger id="time" className={errors.time ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning (8 AM - 12 PM)</SelectItem>
                  <SelectItem value="afternoon">Afternoon (12 PM - 5 PM)</SelectItem>
                  <SelectItem value="evening">Evening (5 PM - 9 PM)</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
              {errors.time && <p className="text-sm text-destructive mt-1">{errors.time}</p>}
            </div>

            <div>
              <Label htmlFor="duration">Estimated Duration</Label>
              <Select value={formData.duration} onValueChange={(value) => setFormData({ ...formData, duration: value })}>
                <SelectTrigger id="duration" className={errors.duration ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Less than 1 hour</SelectItem>
                  <SelectItem value="2">1-2 hours</SelectItem>
                  <SelectItem value="4">2-4 hours</SelectItem>
                  <SelectItem value="8">4-8 hours</SelectItem>
                  <SelectItem value="full">Full day (8+ hours)</SelectItem>
                </SelectContent>
              </Select>
              {errors.duration && <p className="text-sm text-destructive mt-1">{errors.duration}</p>}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="budget">Your Budget (BDT)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="budget"
                  type="number"
                  placeholder="e.g., 100"
                  className={`pl-10 ৳{errors.budget ? "border-destructive" : ""}`}
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                />
              </div>
              {errors.budget && <p className="text-sm text-destructive mt-1">{errors.budget}</p>}
              <p className="text-sm text-muted-foreground mt-1">
                Set a competitive budget to attract quality workers
              </p>
            </div>

            {/* Summary */}
            <Card className="p-4 bg-muted/50">
              <h4 className="mb-3">Task Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Title:</span>
                  <span className="font-medium">{formData.title || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="font-medium">
                    {categories.find((c) => c.id === formData.category)?.name || "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-medium">{formData.location || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium">
                    {formData.date ? format(formData.date, "PPP") : "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Budget:</span>
                  <span className="font-medium">৳{formData.budget || "—"}</span>
                </div>
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[92vh] flex flex-col">
        <div className="bg-white border-b p-3 flex items-center justify-between">
          <h2 className="text-lg">Post a Task</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-5 flex-1 min-h-0 flex flex-col">
          {/* Progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium">Step {step} of {totalSteps}</span>
              <span className="text-xs text-muted-foreground">
                {step === 1 && "Task Details"}
                {step === 2 && "Category"}
                {step === 3 && "Location"}
                {step === 4 && "Schedule"}
                {step === 5 && "Budget & Review"}
              </span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>

          {/* Step Content */}
          <div className="flex-1 min-h-0">
            {renderStep()}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
              size="sm"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <Button
              onClick={handleNext}
              className="bg-primary hover:bg-primary/90"
              size="sm"
              disabled={isSubmitting}
            >
              {step === totalSteps ? (isSubmitting ? "Posting..." : "Post Task") : "Next"}
              {step < totalSteps && <ChevronRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}