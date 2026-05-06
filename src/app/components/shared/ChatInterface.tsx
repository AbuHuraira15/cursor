import { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Send, Phone, Video, MoreVertical, Paperclip, Image as ImageIcon, ChevronLeft, Smile, Mic, Check, CheckCheck, Info } from "lucide-react";

interface Message {
  id: string;
  sender: "me" | "other";
  text: string;
  time: string;
  read: boolean;
  type?: "text" | "image";
}

interface ChatInterfaceProps {
  contactName: string;
  contactRole?: string;
  taskTitle?: string;
  onBack?: () => void;
}

export function ChatInterface({ contactName, contactRole, taskTitle, onBack }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "other",
      text: "Hi! I'm interested in your task. I have 5+ years of experience in this area.",
      time: "10:30 AM",
      read: true,
      type: "text"
    },
    {
      id: "2",
      sender: "me",
      text: "Great! Can you tell me more about your previous work?",
      time: "10:32 AM",
      read: true,
      type: "text"
    },
    {
      id: "3",
      sender: "other",
      text: "Sure! I've completed similar projects for over 50 clients with excellent ratings. I can start tomorrow if needed.",
      time: "10:35 AM",
      read: true,
      type: "text"
    },
    {
      id: "4",
      sender: "me",
      text: "That sounds perfect. What's your availability?",
      time: "10:40 AM",
      read: true,
      type: "text"
    },
    {
      id: "5",
      sender: "other",
      text: "I'm available most weekdays. I can work around your schedule.",
      time: "10:42 AM",
      read: false,
      type: "text"
    }
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: "me",
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      type: "text"
    };

    setMessages([...messages, message]);
    setNewMessage("");

    // Simulate typing indicator
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  };

  const groupMessagesByDate = (messages: Message[]) => {
    const grouped: { [key: string]: Message[] } = {};
    const today = new Date().toDateString();

    messages.forEach((msg) => {
      const date = today; // Simplified - all messages today
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(msg);
    });

    return grouped;
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col bg-[#f0f2f5]">
      {/* Modern Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-3 flex-1">
            {onBack && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onBack}
                className="hover:bg-gray-100"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
            )}
            
            <div className="relative">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-primary text-white">
                  {contactName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm truncate">{contactName}</h3>
                {contactRole && (
                  <Badge variant="outline" className="text-xs px-1.5 py-0">{contactRole}</Badge>
                )}
              </div>
              <p className="text-xs text-green-600">Active now</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="hover:bg-gray-100 text-primary"
            >
              <Phone className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="hover:bg-gray-100 text-primary"
            >
              <Video className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="hover:bg-gray-100 text-primary"
            >
              <Info className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Task Context Banner */}
        {taskTitle && (
          <div className="px-4 pb-3">
            <div className="flex items-center gap-2 p-2.5 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground font-medium">Discussing Task</p>
                <p className="text-sm font-semibold truncate text-gray-800">{taskTitle}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div className="max-w-4xl mx-auto space-y-1">
          {Object.entries(groupedMessages).map(([date, msgs]) => (
            <div key={date}>
              {/* Date Divider */}
              <div className="flex items-center justify-center my-4">
                <div className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                  <span className="text-xs font-medium text-gray-600">Today</span>
                </div>
              </div>

              {/* Messages */}
              {msgs.map((message, index) => {
                const showAvatar = index === msgs.length - 1 || msgs[index + 1]?.sender !== message.sender;
                const isConsecutive = index > 0 && msgs[index - 1]?.sender === message.sender;

                return (
                  <div
                    key={message.id}
                    className={`flex gap-2 mb-1 ৳{
                      message.sender === "me" ? "justify-end" : "justify-start"
                    } ৳{isConsecutive ? "mt-0.5" : "mt-3"}`}
                  >
                    {/* Avatar for received messages */}
                    {message.sender === "other" && (
                      <div className="w-8 h-8 flex-shrink-0">
                        {showAvatar ? (
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-gray-300 text-gray-700 text-xs">
                              {contactName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="w-8 h-8" />
                        )}
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div
                      className={`group relative max-w-[65%] ৳{
                        message.sender === "me" ? "order-first" : ""
                      }`}
                    >
                      <div
                        className={`rounded-2xl px-4 py-2.5 shadow-sm ৳{
                          message.sender === "me"
                            ? "bg-primary text-white rounded-br-md"
                            : "bg-white text-gray-800 rounded-bl-md"
                        }`}
                      >
                        <p className="text-[15px] leading-relaxed break-words">
                          {message.text}
                        </p>
                      </div>

                      {/* Time & Status */}
                      <div
                        className={`flex items-center gap-1 mt-0.5 px-1 ৳{
                          message.sender === "me" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <span className="text-[11px] text-gray-500">
                          {message.time}
                        </span>
                        {message.sender === "me" && (
                          <span className="text-gray-500">
                            {message.read ? (
                              <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                            ) : (
                              <Check className="w-3.5 h-3.5" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Spacer for sent messages */}
                    {message.sender === "me" && <div className="w-8" />}
                  </div>
                );
              })}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-2 mb-1 justify-start mt-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-gray-300 text-gray-700 text-xs">
                  {contactName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span 
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" 
                    style={{ animationDelay: '0.15s' }}
                  ></span>
                  <span 
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" 
                    style={{ animationDelay: '0.3s' }}
                  ></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t p-3">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-2">
            {/* Action Buttons */}
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:bg-gray-100 text-primary rounded-full"
              >
                <Paperclip className="w-5 h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:bg-gray-100 text-primary rounded-full"
              >
                <ImageIcon className="w-5 h-5" />
              </Button>
            </div>

            {/* Message Input */}
            <div className="flex-1 relative">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="pr-10 rounded-full border-gray-300 focus:border-primary bg-gray-50 resize-none"
                style={{ minHeight: '40px' }}
              />
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-1 top-1/2 -translate-y-1/2 hover:bg-gray-200 rounded-full"
              >
                <Smile className="w-5 h-5 text-gray-500" />
              </Button>
            </div>

            {/* Send Button */}
            {newMessage.trim() ? (
              <Button
                onClick={handleSendMessage}
                size="icon"
                className="bg-primary hover:bg-primary/90 rounded-full w-10 h-10 shadow-md"
              >
                <Send className="w-5 h-5" />
              </Button>
            ) : (
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:bg-gray-100 text-primary rounded-full"
              >
                <Mic className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
