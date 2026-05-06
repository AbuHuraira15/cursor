import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  CheckCircle, 
  Shield, 
  Clock, 
  Star, 
  Wrench, 
  Home, 
  Scissors, 
  Package, 
  Car, 
  Laptop,
  ArrowRight,
  Users,
  Briefcase,
  DollarSign,
  Zap
} from "lucide-react";
import { Footer } from "./Footer";

interface HomePageProps {
  onGetStarted: () => void;
}

export function HomePage({ onGetStarted }: HomePageProps) {
  const categories = [
    { id: "plumbing", name: "Plumbing", icon: Wrench, count: "200+ tasks" },
    { id: "electrical", name: "Electrician", icon: Zap, count: "190+ tasks" },
    { id: "cleaning", name: "Cleaning", icon: Home, count: "350+ tasks" },
    { id: "gardening", name: "Gardening", icon: Scissors, count: "180+ tasks" },
    { id: "moving", name: "Moving", icon: Package, count: "150+ tasks" },
    { id: "delivery", name: "Delivery", icon: Car, count: "280+ tasks" },
    { id: "tech", name: "Tech Support", icon: Laptop, count: "220+ tasks" },
  ];

  const features = [
    {
      icon: Shield,
      title: "Verified Workers",
      description: "All workers are background-checked and verified for your safety and peace of mind."
    },
    {
      icon: DollarSign,
      title: "Competitive Pricing",
      description: "Get multiple bids and choose the best offer that fits your budget."
    },
    {
      icon: Clock,
      title: "Quick Response",
      description: "Connect with available workers nearby and get your tasks done quickly."
    },
    {
      icon: Star,
      title: "Quality Guaranteed",
      description: "Read reviews and ratings to ensure you're hiring top-rated professionals."
    }
  ];

  const howItWorks = [
    {
      step: 1,
      title: "Post Your Task",
      description: "Describe what you need done, set your budget, and choose your schedule."
    },
    {
      step: 2,
      title: "Get Bids",
      description: "Receive competitive bids from verified workers in your area."
    },
    {
      step: 3,
      title: "Choose & Chat",
      description: "Review profiles, chat with workers, and select the best fit."
    },
    {
      step: 4,
      title: "Task Complete",
      description: "Worker completes the task, and you pay securely through the platform."
    }
  ];

  const stats = [
    { icon: Users, value: "50,000+", label: "Active Users" },
    { icon: Briefcase, value: "100,000+", label: "Tasks Completed" },
    { icon: Star, value: "4.8/5", label: "Average Rating" },
    { icon: Shield, value: "100%", label: "Verified Workers" }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header/Navigation */}
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl">MiniMates</h2>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="hidden sm:inline-flex">
              How It Works
            </Button>
            <Button variant="ghost" className="hidden sm:inline-flex">
              Become a Worker
            </Button>
            <Button onClick={onGetStarted} className="bg-primary hover:bg-primary/90">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/10">
                Trusted by 50,000+ Users
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6">
                Get Your Tasks Done by Trusted Workers
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Post tasks, receive competitive bids, and hire verified workers for any job—from plumbing to tech support. Fast, safe, and affordable.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-lg px-8"
                  onClick={onGetStarted}
                >
                  Post a Task
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Become a Worker
                </Button>
              </div>

              {/* Mini Stats */}
              <div className="flex gap-6 mt-8 flex-wrap">
                {stats.slice(0, 3).map((stat, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <stat.icon className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-semibold text-lg">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Image/Illustration */}
            <div className="relative">
              <Card className="p-6 backdrop-blur-sm bg-white/80">
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Briefcase className="w-20 h-20 text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Find the perfect worker for any task</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">Popular Categories</h2>
            <p className="text-xl text-muted-foreground">Browse tasks by category</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
            {categories.map((category) => (
              <Card 
                key={category.id} 
                className="p-6 hover:shadow-lg transition-all cursor-pointer hover:scale-105 text-center"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <category.icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-1">{category.name}</h4>
                <p className="text-xs text-muted-foreground">{category.count}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">Getting help is easy with MiniMates</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item) => (
              <Card key={item.step} className="p-6 text-center relative">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {item.step}
                </div>
                <h4 className="font-semibold mb-2">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                {item.step < 4 && (
                  <ArrowRight className="hidden lg:block absolute top-1/2 -right-4 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
                )}
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" className="bg-primary hover:bg-primary/90" onClick={onGetStarted}>
              Get Started Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">Why Choose MiniMates?</h2>
            <p className="text-xl text-muted-foreground">We prioritize trust, safety, and quality</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-br from-primary to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="w-8 h-8 mx-auto mb-3 opacity-80" />
                <p className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</p>
                <p className="text-blue-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">What Our Users Say</h2>
            <p className="text-xl text-muted-foreground">Real reviews from real people</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Client",
                avatar: "S",
                rating: 5,
                comment: "Found an amazing plumber within hours! The bidding system helped me get a great price. Highly recommend MiniMates!"
              },
              {
                name: "Sajid Ali",
                role: "Worker",
                avatar: "M",
                rating: 5,
                comment: "As a worker, this platform has been a game-changer. I get consistent work and the payment system is reliable."
              },
              {
                name: "Emily Rodriguez",
                role: "Client",
                avatar: "E",
                rating: 5,
                comment: "Super easy to use! Posted a cleaning task and had 5 bids within an hour. The worker did an excellent job!"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">{testimonial.comment}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of satisfied users and experience the easiest way to get tasks done
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-lg px-8"
              onClick={onGetStarted}
            >
              Post Your First Task
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              Browse Available Tasks
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}