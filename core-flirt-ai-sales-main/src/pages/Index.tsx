
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConversationDashboard } from "@/components/ConversationDashboard";
import { RevenueDashboard } from "@/components/RevenueDashboard";
import { ContentManagement } from "@/components/ContentManagement";
import { ClientManagement } from "@/components/ClientManagement";
import { Analytics } from "@/components/Analytics";
import { MessageSquare, DollarSign, Image, Users, BarChart3, Settings, Bot } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">SynthCore Dashboard</h1>
          <p className="text-purple-200">Advanced Chatbot Management Platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link to="/models">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all cursor-pointer">
              <CardHeader className="pb-2">
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-purple-300" />
                  Models Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-200 text-sm">
                  Manage model profiles, preferences, and no-go topics
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/content">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all cursor-pointer">
              <CardHeader className="pb-2">
                <CardTitle className="text-white flex items-center gap-2">
                  <Image className="w-5 h-5 text-blue-300" />
                  Content Manager
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-200 text-sm">
                  Create and organize PPV content with keyword matching
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/subscribers">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all cursor-pointer">
              <CardHeader className="pb-2">
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-300" />
                  Subscriber Manager
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-200 text-sm">
                  Manage subscribers, DNM list, and subscriber tiers
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/chat">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all cursor-pointer">
              <CardHeader className="pb-2">
                <CardTitle className="text-white flex items-center gap-2">
                  <Bot className="w-5 h-5 text-pink-300" />
                  Chat Simulator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-200 text-sm">
                  Test AI conversations and PPV sending in real-time
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <Tabs defaultValue="conversations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-fit lg:grid-cols-5 bg-white/10 backdrop-blur-sm">
            <TabsTrigger value="conversations" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Conversations</span>
            </TabsTrigger>
            <TabsTrigger value="revenue" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <span className="hidden sm:inline">Revenue</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              <span className="hidden sm:inline">Content</span>
            </TabsTrigger>
            <TabsTrigger value="clients" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Clients</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="conversations">
            <ConversationDashboard />
          </TabsContent>

          <TabsContent value="revenue">
            <RevenueDashboard />
          </TabsContent>

          <TabsContent value="content">
            <ContentManagement />
          </TabsContent>

          <TabsContent value="clients">
            <ClientManagement />
          </TabsContent>

          <TabsContent value="analytics">
            <Analytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
