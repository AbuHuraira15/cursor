import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Search, MessageCircle, Book, HelpCircle, Mail, Phone } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useState } from "react";

interface HelpCenterProps {
  userRole?: "client" | "worker" | "admin";
  onClose?: () => void;
}

export function HelpCenter({ userRole = "client", onClose }: HelpCenterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showChat, setShowChat] = useState(false);

  const handleLiveChat = () => {
    setShowChat(true);
    // In a real app, this would open a live chat widget
    alert("Live chat feature would open here. In production, this would connect to a live chat service like Intercom, Zendesk, or custom chat.");
  };

  const handleEmailSupport = () => {
    window.location.href = "mailto:support@minimates.com?subject=Support Request from " + userRole;
  };

  const handlePhoneSupport = () => {
    window.location.href = "tel:+15550000000";
  };

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          q: "How do I post a task?",
          a: "Click the 'Post New Task' button on your dashboard, fill in the task details including title, description, location, date, and budget. Once submitted, workers will start bidding on your task."
        },
        {
          q: "How do I find tasks to work on?",
          a: "Browse available tasks in the 'Browse Tasks' section. Use filters to find tasks that match your skills, location, and availability. Click 'Place Bid' to submit your offer."
        },
        {
          q: "How does the bidding process work?",
          a: "Workers submit bids with their proposed price and a message. Clients review all bids and select the worker they want to hire. You'll be notified when your bid is accepted or rejected."
        }
      ]
    },
    {
      category: "Payments",
      questions: [
        {
          q: "When do I get paid?",
          a: "Payments are released 3-7 days after task completion, allowing time for any disputes. You can withdraw funds to your linked bank account once they're available."
        },
        {
          q: "What are the platform fees?",
          a: "We charge a 10% service fee on all transactions. This fee covers payment processing, customer support, and platform maintenance."
        },
        {
          q: "How do refunds work?",
          a: "If a task is cancelled before completion or if there's a valid dispute, refunds are processed within 5-10 business days to the original payment method."
        }
      ]
    },
    {
      category: "Safety & Trust",
      questions: [
        {
          q: "How are workers verified?",
          a: "Workers can verify their identity by submitting government ID and completing phone verification. Verified workers get a badge on their profile."
        },
        {
          q: "What if something goes wrong?",
          a: "You can report issues through the 'Report' button on any task. Our team reviews all reports within 24 hours and takes appropriate action."
        },
        {
          q: "Is my payment information secure?",
          a: "Yes, all payments are processed through secure, PCI-compliant payment processors. We never store your full payment details on our servers."
        }
      ]
    },
    {
      category: "Account",
      questions: [
        {
          q: "How do I change my password?",
          a: "Go to Settings > Security > Change Password. You'll need to enter your current password and choose a new one."
        },
        {
          q: "Can I switch between Client and Worker roles?",
          a: "Yes! You can switch roles anytime in your account settings. Many users use both roles depending on their needs."
        },
        {
          q: "How do I delete my account?",
          a: "Contact our support team to request account deletion. Note that this action is permanent and cannot be undone."
        }
      ]
    }
  ];

  const guides = [
    {
      title: "Complete Guide for Clients",
      description: "Learn how to post tasks, review bids, and work with workers effectively.",
      readTime: "5 min read"
    },
    {
      title: "Worker Success Guide",
      description: "Tips for winning bids, completing tasks, and building your reputation.",
      readTime: "7 min read"
    },
    {
      title: "Safety Best Practices",
      description: "Stay safe while using MiniMates. Essential guidelines for both clients and workers.",
      readTime: "4 min read"
    },
    {
      title: "Payment & Billing Guide",
      description: "Everything you need to know about payments, fees, and withdrawals.",
      readTime: "6 min read"
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="mb-2">Help Center</h1>
        <p className="text-muted-foreground">
          Find answers, guides, and support
        </p>
      </div>

      {/* Search */}
      <Card className="p-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search for help..."
            className="pl-12 h-14 text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </Card>

      {/* Quick Contact */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card 
          className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer"
          onClick={handleLiveChat}
        >
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <MessageCircle className="w-6 h-6 text-primary" />
          </div>
          <h3 className="mb-2">Live Chat</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Chat with our support team
          </p>
          <Badge variant="secondary" className="text-xs">
            Avg response: 2 min
          </Badge>
        </Card>

        <Card 
          className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer"
          onClick={handleEmailSupport}
        >
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Mail className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="mb-2">Email Support</h3>
          <p className="text-sm text-muted-foreground mb-3">
            support@minimates.com
          </p>
          <Badge variant="secondary" className="text-xs">
            Response within 24h
          </Badge>
        </Card>

        <Card 
          className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer"
          onClick={handlePhoneSupport}
        >
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Phone className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="mb-2">Phone Support</h3>
          <p className="text-sm text-muted-foreground mb-3">
            +1 (555) 000-0000
          </p>
          <Badge variant="secondary" className="text-xs">
            Mon-Fri 9AM-6PM EST
          </Badge>
        </Card>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="faq">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="faq">
            <HelpCircle className="w-4 h-4 mr-2" />
            FAQs
          </TabsTrigger>
          <TabsTrigger value="guides">
            <Book className="w-4 h-4 mr-2" />
            Guides
          </TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="mt-6">
          <div className="space-y-6">
            {faqs.map((category, idx) => (
              <Card key={idx} className="p-6">
                <h2 className="mb-4">{category.category}</h2>
                <Accordion type="single" collapsible>
                  {category.questions.map((item, qIdx) => (
                    <AccordionItem key={qIdx} value={`item-৳{idx}-৳{qIdx}`}>
                      <AccordionTrigger className="text-left">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="guides" className="mt-6">
          <div className="grid sm:grid-cols-2 gap-4">
            {guides.map((guide, idx) => (
              <Card key={idx} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Book className="w-6 h-6 text-primary" />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {guide.readTime}
                  </Badge>
                </div>
                <h3 className="mb-2">{guide.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {guide.description}
                </p>
                <Button variant="link" className="p-0 h-auto">
                  Read guide →
                </Button>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Still Need Help */}
      <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-primary/20 text-center">
        <h3 className="mb-2">Still need help?</h3>
        <p className="text-muted-foreground mb-6">
          Can't find what you're looking for? Our support team is here to help.
        </p>
        <Button 
          className="bg-primary hover:bg-primary/90"
          onClick={handleLiveChat}
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Contact Support
        </Button>
      </Card>
    </div>
  );
}