
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Model, Subscriber, ContentItem, Message } from '@/types/supabase';
import { modelService } from '@/services/modelService';
import { subscriberService } from '@/services/subscriberService';
import { contentService } from '@/services/contentService';
import { nlpService } from '@/services/nlpService';
import { useToast } from "@/hooks/use-toast";
import { Send, Sparkles, DollarSign, Image, Video } from 'lucide-react';

export const AIChatSimulator = () => {
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [models, setModels] = useState<Model[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [selectedModelId, setSelectedModelId] = useState<string>('');
  const [selectedSubscriberId, setSelectedSubscriberId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [suggestedContents, setSuggestedContents] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadModelsAndSubscribers();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (selectedModelId && messages.length > 0) {
      suggestContent();
    }
  }, [selectedModelId, messages]);

  const loadModelsAndSubscribers = async () => {
    const fetchedModels = await modelService.getAllModels();
    setModels(fetchedModels);
    if (fetchedModels.length > 0) {
      setSelectedModelId(fetchedModels[0].id);
    }
    
    const fetchedSubscribers = await subscriberService.getMessagingEligibleSubscribers();
    setSubscribers(fetchedSubscribers);
    if (fetchedSubscribers.length > 0) {
      setSelectedSubscriberId(fetchedSubscribers[0].id);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    if (!selectedModelId || !selectedSubscriberId) {
      toast({
        title: "Error",
        description: "Please select a model and subscriber",
        variant: "destructive"
      });
      return;
    }

    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Get selected model details for no-go topics
      const model = await modelService.getModelById(selectedModelId);
      if (!model) {
        throw new Error("Selected model not found");
      }

      // Generate AI response
      const allMessages = [...messages, userMessage];
      const response = await nlpService.generateResponse(
        allMessages,
        model.bio,
        model.no_go_topics
      );

      // Add AI response
      setTimeout(() => {
        const aiMessage: Message = {
          role: 'assistant',
          content: response,
          timestamp: new Date().toISOString()
        };
        
        setMessages(prevMessages => [...prevMessages, aiMessage]);
        setIsLoading(false);
      }, 500);

    } catch (error) {
      console.error("Error generating response:", error);
      toast({
        title: "Error",
        description: "Failed to generate response",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const suggestContent = async () => {
    if (messages.length < 2) return;

    // Extract keywords from recent messages
    const recentMessages = messages.slice(-3);
    const combinedText = recentMessages.map(m => m.content).join(" ");
    const words = combinedText.toLowerCase().split(/\s+/);
    const keywords = words.filter(w => w.length > 3).slice(0, 5);

    if (keywords.length > 0) {
      const content = await contentService.findContentByKeywords(selectedModelId, keywords);
      setSuggestedContents(content);
    }
  };

  const handleSendPPV = async (content: ContentItem) => {
    if (!selectedSubscriberId) return;
    
    // Add a message suggesting the PPV content
    const ppvMessage: Message = {
      role: 'assistant',
      content: `I have something special for you - a ${content.title} that I think you'll really enjoy! It's only $${content.price}. Want to see it?`,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prevMessages => [...prevMessages, ppvMessage]);
    
    // Simulate sending PPV content
    const success = await contentService.sendPPVContent(content.id, selectedSubscriberId);
    
    if (success) {
      toast({
        title: "PPV Sent",
        description: `Successfully sent "${content.title}" PPV content`
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to send PPV content",
        variant: "destructive"
      });
    }
  };

  const handleStartNewConversation = () => {
    setMessages([]);
    setSuggestedContents([]);
    // Add a greeting message
    const greetings = [
      "Hey there! How are you doing today? 😊",
      "Hi! I was just thinking about you...",
      "Hello! So glad you're here. What's on your mind?",
      "Hey babe, I've been waiting to chat with you!"
    ];
    
    const greeting: Message = {
      role: 'assistant',
      content: greetings[Math.floor(Math.random() * greetings.length)],
      timestamp: new Date().toISOString()
    };
    
    setMessages([greeting]);
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4 text-purple-300" />;
      case 'image':
        return <Image className="w-4 h-4 text-purple-300" />;
      default:
        return <Image className="w-4 h-4 text-purple-300" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">AI Chat Simulator</h1>
        <Button 
          className="bg-purple-600 hover:bg-purple-700"
          onClick={handleStartNewConversation}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          New Conversation
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="border-b border-white/10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Chat Interface</CardTitle>
                <div className="flex gap-4">
                  <Select value={selectedModelId} onValueChange={setSelectedModelId}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white w-[160px]">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      {models.map(model => (
                        <SelectItem key={model.id} value={model.id}>{model.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedSubscriberId} onValueChange={setSelectedSubscriberId}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white w-[180px]">
                      <SelectValue placeholder="Select subscriber" />
                    </SelectTrigger>
                    <SelectContent>
                      {subscribers.map(sub => (
                        <SelectItem key={sub.id} value={sub.id}>
                          {sub.name || sub.external_id}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[500px] flex flex-col">
                <div className="flex-1 overflow-y-auto p-4">
                  {messages.length > 0 ? (
                    <div className="space-y-4">
                      {messages.map((message, index) => (
                        <div 
                          key={index}
                          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[70%] ${
                            message.role === 'user' 
                              ? 'bg-purple-600 text-white' 
                              : 'bg-white/20 text-white'
                          } p-3 rounded-lg`}>
                            <div className="whitespace-pre-wrap">{message.content}</div>
                            <div className="text-xs mt-1 opacity-70 text-right">
                              {formatTimestamp(message.timestamp)}
                            </div>
                          </div>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="bg-white/20 text-white p-3 rounded-lg">
                            <div className="flex space-x-2">
                              <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100"></div>
                              <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200"></div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center text-purple-300">
                        <Sparkles className="mx-auto h-12 w-12 mb-3 opacity-50" />
                        <p>Start a new conversation or select an existing one</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="border-t border-white/10 p-4">
                  <div className="flex gap-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="bg-white/10 border-white/20 text-white"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button 
                      className="bg-purple-600 hover:bg-purple-700"
                      onClick={handleSendMessage}
                      disabled={isLoading}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Tabs defaultValue="content">
            <TabsList className="bg-white/10 backdrop-blur-sm w-full">
              <TabsTrigger value="content" className="flex-1">Suggested Content</TabsTrigger>
              <TabsTrigger value="tips" className="flex-1">Tips</TabsTrigger>
            </TabsList>
            
            <TabsContent value="content">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-4">
                  {suggestedContents.length > 0 ? (
                    <div className="space-y-3">
                      {suggestedContents.map(content => (
                        <Card key={content.id} className="bg-white/5 border-white/10">
                          <CardContent className="p-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {getContentIcon(content.content_type)}
                              <div>
                                <h4 className="text-white text-sm font-medium">{content.title}</h4>
                                <p className="text-purple-300 text-xs">${content.price}</p>
                              </div>
                            </div>
                            <Button 
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleSendPPV(content)}
                            >
                              Send PPV
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-purple-300">
                      <Image className="mx-auto h-12 w-12 mb-3 opacity-50" />
                      <p>No suggested content yet</p>
                      <p className="text-xs mt-1">Content will be suggested based on conversation</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="tips">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="text-center py-4 text-purple-300">
                      <DollarSign className="mx-auto h-12 w-12 mb-3 opacity-50" />
                      <p>Request tips from subscribers</p>
                    </div>
                    
                    <div className="space-y-2">
                      {[5, 10, 20, 50, 100].map(amount => (
                        <Button 
                          key={amount}
                          variant="outline"
                          className="w-full border-green-500 text-green-400 hover:bg-green-900/20"
                          onClick={() => {
                            const tipMessage: Message = {
                              role: 'assistant',
                              content: `Would you like to send a $${amount} tip? It would make my day 💕`,
                              timestamp: new Date().toISOString()
                            };
                            setMessages(prevMessages => [...prevMessages, tipMessage]);
                          }}
                        >
                          Request ${amount} Tip
                        </Button>
                      ))}
                    </div>
                    
                    <div className="pt-2 border-t border-white/10">
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          const tipMessage: Message = {
                            role: 'assistant',
                            content: "Let's start a sexting session? Send a tip to begin 😘",
                            timestamp: new Date().toISOString()
                          };
                          setMessages(prevMessages => [...prevMessages, tipMessage]);
                        }}
                      >
                        <Sparkles className="mr-2 h-4 w-4" />
                        Suggest Sexting Session
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AIChatSimulator;
