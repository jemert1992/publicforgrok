
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Crown, Shield, DollarSign, MessageSquare, Ban } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Client {
  id: string;
  username: string;
  tier: 'vip' | 'regular' | 'whale';
  totalSpent: number;
  messageCount: number;
  lastActive: string;
  status: 'active' | 'blocked' | 'dnm';
  avatar: string;
}

export const ClientManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  
  const [clients] = useState<Client[]>([
    {
      id: '1',
      username: 'VIP_User_456',
      tier: 'vip',
      totalSpent: 2340,
      messageCount: 156,
      lastActive: '5 min ago',
      status: 'active',
      avatar: '/placeholder.svg'
    },
    {
      id: '2',
      username: 'Whale_Collector',
      tier: 'whale',
      totalSpent: 8750,
      messageCount: 89,
      lastActive: '2 hours ago',
      status: 'active',
      avatar: '/placeholder.svg'
    },
    {
      id: '3',
      username: 'Regular_Customer',
      tier: 'regular',
      totalSpent: 450,
      messageCount: 34,
      lastActive: '1 day ago',
      status: 'active',
      avatar: '/placeholder.svg'
    },
    {
      id: '4',
      username: 'Problem_User',
      tier: 'regular',
      totalSpent: 120,
      messageCount: 67,
      lastActive: '3 days ago',
      status: 'blocked',
      avatar: '/placeholder.svg'
    },
    {
      id: '5',
      username: 'DNM_Client',
      tier: 'whale',
      totalSpent: 5600,
      messageCount: 23,
      lastActive: '1 week ago',
      status: 'dnm',
      avatar: '/placeholder.svg'
    }
  ]);

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = selectedTab === 'all' || 
                      (selectedTab === 'vip' && client.tier === 'vip') ||
                      (selectedTab === 'whales' && client.tier === 'whale') ||
                      (selectedTab === 'dnm' && client.status === 'dnm') ||
                      (selectedTab === 'blocked' && client.status === 'blocked');
    return matchesSearch && matchesTab;
  });

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'whale': return <Crown className="w-4 h-4 text-yellow-400" />;
      case 'vip': return <Shield className="w-4 h-4 text-purple-400" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'blocked': return 'bg-red-500';
      case 'dnm': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const handleToggleDNM = (clientId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'dnm' ? 'active' : 'dnm';
    toast({
      title: newStatus === 'dnm' ? "Added to DNM List" : "Removed from DNM List",
      description: `Client has been ${newStatus === 'dnm' ? 'added to' : 'removed from'} the Do Not Message list.`,
    });
  };

  const handleBlockClient = (clientId: string) => {
    toast({
      title: "Client Blocked",
      description: "Client has been blocked from messaging.",
      variant: "destructive"
    });
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 w-4 h-4" />
          <Input
            placeholder="Search clients by username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-purple-300"
          />
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="bg-white/10 backdrop-blur-sm">
          <TabsTrigger value="all">All Clients</TabsTrigger>
          <TabsTrigger value="whales">Whales</TabsTrigger>
          <TabsTrigger value="vip">VIP</TabsTrigger>
          <TabsTrigger value="dnm">DNM List</TabsTrigger>
          <TabsTrigger value="blocked">Blocked</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredClients.map((client) => (
              <Card key={client.id} className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={client.avatar} />
                        <AvatarFallback className="bg-purple-600">
                          {client.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-white text-sm">{client.username}</CardTitle>
                          {getTierIcon(client.tier)}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(client.status)}`} />
                          <span className="text-xs text-purple-300">{client.lastActive}</span>
                        </div>
                      </div>
                    </div>
                    <Badge 
                      variant={client.tier === 'whale' ? 'default' : 'secondary'}
                      className="capitalize"
                    >
                      {client.tier}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-400" />
                      <span className="text-white font-bold">${client.totalSpent}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-blue-400" />
                      <span className="text-white">{client.messageCount} msgs</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={client.status === 'dnm' ? 'default' : 'outline'}
                      onClick={() => handleToggleDNM(client.id, client.status)}
                      className="flex-1"
                    >
                      {client.status === 'dnm' ? 'Remove from DNM' : 'Add to DNM'}
                    </Button>
                    {client.status !== 'blocked' && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleBlockClient(client.id)}
                      >
                        <Ban className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
