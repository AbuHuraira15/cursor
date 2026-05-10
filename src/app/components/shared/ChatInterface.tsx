import { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Send, Phone, Video, MoreVertical, Paperclip, Image as ImageIcon, ChevronLeft, Smile, Mic, Check, CheckCheck, Info } from "lucide-react";

import { getConversations, getMessages, sendMessage, createConversation } from "../../lib/api";

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
  authToken?: string;
  authUser?: any;
  targetUserId?: number;
  taskId?: number;
}

export function ChatInterface({ contactName, contactRole, taskTitle, onBack, authToken, authUser, targetUserId, taskId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [chatError, setChatError] = useState<string | null>(null);

  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authToken || !authUser) return;

    const fetchChatData = async () => {
      try {
        // Fetch conversations
        const convRes = await getConversations(authToken);
        let activeConv = null;

        if (convRes.results && convRes.results.length > 0) {
          if (targetUserId) {
            // Find conversation with this user AND this specific task
            activeConv = convRes.results.find((c: any) => {
              const hasUser = c.participants.includes(targetUserId) || c.participants.includes(Number(targetUserId));
              const hasTask = taskId ? c.task === Number(taskId) : true;
              return hasUser && hasTask;
            });
          }
          
          if (!activeConv && !targetUserId) {
            activeConv = convRes.results[0];
          }
        }

        // If no existing conversation found but we have target user and task, create one
        if (!activeConv && targetUserId && taskId) {
           try {
             activeConv = await createConversation(authToken, {
               task: Number(taskId),
               participants: [Number(targetUserId)]
             });
           } catch (err: any) {
             console.error("Failed to create conversation", err);
             setChatError(err.message || "Failed to start conversation. The task or worker might be invalid.");
           }
        }

        if (activeConv) {
          setConversationId(activeConv.id);
          setChatError(null);

          // Fetch messages for this conversation
          const msgRes = await getMessages(authToken, activeConv.id);
          const backendMessages = msgRes.results || [];
          
          // Or if the backend returns messages inside the conversation object
          const messagesToUse = backendMessages.length > 0 ? backendMessages : (activeConv.messages || []);

          const formattedMessages: Message[] = messagesToUse.map((m: any) => ({
            id: String(m.id),
            sender: m.sender === authUser.id ? "me" : "other",
            text: m.content || m.text,
            time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            read: m.is_read || true,
            type: "text"
          }));
          setMessages(formattedMessages.reverse()); // Assuming oldest first or needing reversal
        }
      } catch (error) {
        console.error("Failed to load chat data", error);
      }
    };

    fetchChatData();
    // In a real app, you might want to poll or use WebSockets here
  }, [authToken, authUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!authToken) {
      setChatError("Authentication missing");
      return;
    }
    if (!conversationId) {
      if (!targetUserId) {
        setChatError("Please select a conversation or user to message first.");
      } else {
        setChatError("Failed to initialize conversation. Try refreshing.");
      }
      return;
    }
    if (!newMessage.trim()) return;

    const messageText = newMessage;
    setNewMessage("");
    setIsTyping(true);

    try {
      const sentMsg = await sendMessage(authToken, {
        conversation: conversationId,
        content: messageText
      });

      const message: Message = {
        id: String(sentMsg.id || Date.now()),
        sender: "me",
        text: messageText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false,
        type: "text"
      };

      setMessages(prev => [...prev, message]);
    } catch (error) {
      console.error("Failed to send message", error);
      // Could restore the message text here if failed
    } finally {
      setIsTyping(false);
    }
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

      {chatError && (
        <div className="bg-red-50 text-red-600 p-3 text-sm text-center border-b border-red-100">
          {chatError}
        </div>
      )}

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
                placeholder={conversationId ? "Type a message..." : "Select a conversation to start messaging..."}
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  if (chatError) setChatError(null);
                }}
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
                onClick={handleSendMessage}
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
