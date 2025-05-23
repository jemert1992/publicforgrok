
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Pause, MessageCircle, Send, Eye } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Conversation {
  id: string;
  clientName: string;
  status: 'active' | 'paused' | 'waiting';
  lastMessage: string;
  timestamp: string;
  revenue: number;
  messageCount: number;
}

export const ConversationDashboard = () => {
  const { toast } = useToast();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [conversations] = useState<Conversation[]>([
    {
      id: '1',
      clientName: 'Client_123',
      status: 'active',
      lastMessage: 'Looking forward to your content!',
      timestamp: '2 minutes ago',
      revenue: 150,
      messageCount: 24
    },
    {
      id: '2',
      clientName: 'VIP_User_456',
      status: 'waiting',
      lastMessage: 'That sounds amazing...',
      timestamp: '15 minutes ago',
      revenue: 300,
      messageCount: 45
    },
    {
      id: '3',
      clientName: 'Regular_789',
      status: 'paused',
      lastMessage: 'I\'ll check back later',
      timestamp: '1 hour ago',
      revenue: 75,
      messageCount: 12
    }
  ]);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    
    toast({
      title: "Message Sent",
      description: "Your message has been sent to the client.",
    });
    setMessageInput('');
  };

  const handleSendPPV = () => {
    toast({
      title: "PPV Content Sent",
      description: "Pay-per-view content has been sent to the client.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'waiting': return 'bg-yellow-500';
      case 'paused': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Conversations List */}
      <div className="lg:col-span-1">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Active Conversations</CardTitle>
            <CardDescription className="text-purple-200">
              Manage ongoing client interactions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className={`p-4 rounded-lg cursor-pointer transition-all hover:bg-white/10 ${
                  selectedConversation === conv.id ? 'bg-white/20' : 'bg-white/5'
                }`}
                onClick={() => setSelectedConversation(conv.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white">{conv.clientName}</span>
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(conv.status)}`} />
                </div>
                <p className="text-sm text-purple-200 mb-2 truncate">{conv.lastMessage}</p>
                <div className="flex justify-between text-xs text-purple-300">
                  <span>{conv.timestamp}</span>
                  <span>${conv.revenue}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Chat Interface */}
      <div className="lg:col-span-2">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Conversation Interface
            </CardTitle>
            {selectedConversation && (
              <div className="flex gap-2">
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <Play className="w-4 h-4 mr-2" />
                  Resume
                </Button>
                <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </Button>
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700" onClick={handleSendPPV}>
                  <Eye className="w-4 h-4 mr-2" />
                  Send PPV
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {selectedConversation ? (
              <div className="space-y-4">
                {/* Message History */}
                <div className="bg-black/20 rounded-lg p-4 h-64 overflow-y-auto">
                  <div className="space-y-3">
                    <div className="text-right">
                      <div className="bg-purple-600 text-white p-2 rounded-lg inline-block max-w-xs">
                        Hey there! How's your day going? 😘
                      </div>
                      <div className="text-xs text-purple-300 mt-1">You - 5 min ago</div>
                    </div>
                    <div className="text-left">
                      <div className="bg-white/20 text-white p-2 rounded-lg inline-block max-w-xs">
                        Great! Your last content was amazing 🔥
                      </div>
                      <div className="text-xs text-purple-300 mt-1">Client - 3 min ago</div>
                    </div>
                    <div className="text-right">
                      <div className="bg-purple-600 text-white p-2 rounded-lg inline-block max-w-xs">
                        I'm glad you enjoyed it! I have something even better for you 😏
                      </div>
                      <div className="text-xs text-purple-300 mt-1">You - 2 min ago</div>
                    </div>
                  </div>
                </div>

                {/* Message Composer */}
                <div className="space-y-3">
                  <Select>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Choose message template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flirty">Flirty Response</SelectItem>
                      <SelectItem value="content-tease">Content Tease</SelectItem>
                      <SelectItem value="ppv-offer">PPV Offer</SelectItem>
                      <SelectItem value="tip-request">Tip Request</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Type your message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-purple-300"
                    />
                    <Button onClick={handleSendMessage} className="bg-purple-600 hover:bg-purple-700">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-purple-300">
                Select a conversation to start chatting
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
