
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Subscriber } from '@/types/supabase';
import { subscriberService } from '@/services/subscriberService';
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, Ban, Eye, DollarSign } from 'lucide-react';

export const SubscriberManager = () => {
  const { toast } = useToast();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState<Subscriber[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingSubscriber, setIsAddingSubscriber] = useState(false);
  const [showDNMOnly, setShowDNMOnly] = useState(false);

  // New subscriber form state
  const [newName, setNewName] = useState('');
  const [newExternalId, setNewExternalId] = useState('');
  const [newTier, setNewTier] = useState('regular');

  useEffect(() => {
    loadSubscribers();
  }, []);

  useEffect(() => {
    filterSubscribers();
  }, [subscribers, searchTerm, showDNMOnly]);

  const loadSubscribers = async () => {
    const fetchedSubscribers = await subscriberService.getAllSubscribers();
    setSubscribers(fetchedSubscribers);
  };

  const filterSubscribers = () => {
    let filtered = subscribers;
    
    if (showDNMOnly) {
      filtered = filtered.filter(sub => sub.do_not_message);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(sub => 
        (sub.name && sub.name.toLowerCase().includes(term)) || 
        sub.external_id.toLowerCase().includes(term)
      );
    }
    
    setFilteredSubscribers(filtered);
  };

  const handleAddSubscriber = async () => {
    if (!newExternalId) {
      toast({
        title: "Error",
        description: "External ID is required",
        variant: "destructive"
      });
      return;
    }

    const newSubscriber = await subscriberService.addSubscriber({
      external_id: newExternalId,
      name: newName || null,
      tier: newTier,
      do_not_message: false,
      total_spent: 0,
      last_purchase: null
    });

    if (newSubscriber) {
      toast({
        title: "Success",
        description: "Subscriber added successfully"
      });
      setNewName('');
      setNewExternalId('');
      setNewTier('regular');
      setIsAddingSubscriber(false);
      loadSubscribers();
    } else {
      toast({
        title: "Error",
        description: "Failed to add subscriber",
        variant: "destructive"
      });
    }
  };

  const handleToggleDNM = async (subscriber: Subscriber) => {
    const success = await subscriberService.toggleDoNotMessage(
      subscriber.id, 
      !subscriber.do_not_message
    );
    
    if (success) {
      toast({
        title: subscriber.do_not_message ? "Subscriber Removed from DNM" : "Subscriber Added to DNM",
        description: subscriber.do_not_message 
          ? "The subscriber can now receive messages" 
          : "The subscriber will not receive automated messages"
      });
      loadSubscribers();
    } else {
      toast({
        title: "Error",
        description: "Failed to update DNM status",
        variant: "destructive"
      });
    }
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'whale':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Whale</Badge>;
      case 'vip':
        return <Badge className="bg-purple-500 hover:bg-purple-600">VIP</Badge>;
      default:
        return <Badge variant="outline">Regular</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Subscriber Management</h1>
        <Button 
          className="bg-purple-600 hover:bg-purple-700"
          onClick={() => setIsAddingSubscriber(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Subscriber
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 w-4 h-4" />
          <Input
            placeholder="Search subscribers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-purple-300"
          />
        </div>
        <div className="flex items-center gap-2">
          <Switch 
            checked={showDNMOnly} 
            onCheckedChange={setShowDNMOnly} 
            id="dnm-filter"
          />
          <label htmlFor="dnm-filter" className="text-white cursor-pointer">
            Show DNM list only
          </label>
        </div>
      </div>

      {isAddingSubscriber && (
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Add New Subscriber</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-white">External ID (OnlyFans ID) *</label>
              <Input 
                value={newExternalId} 
                onChange={(e) => setNewExternalId(e.target.value)} 
                placeholder="Enter subscriber's platform ID"
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-white">Name</label>
              <Input 
                value={newName} 
                onChange={(e) => setNewName(e.target.value)} 
                placeholder="Enter subscriber's name"
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-white">Tier</label>
              <div className="flex gap-2">
                <Button 
                  variant={newTier === 'regular' ? 'default' : 'outline'}
                  onClick={() => setNewTier('regular')}
                  className="flex-1"
                >
                  Regular
                </Button>
                <Button 
                  variant={newTier === 'vip' ? 'default' : 'outline'}
                  onClick={() => setNewTier('vip')}
                  className="flex-1"
                >
                  VIP
                </Button>
                <Button 
                  variant={newTier === 'whale' ? 'default' : 'outline'}
                  onClick={() => setNewTier('whale')}
                  className="flex-1"
                >
                  Whale
                </Button>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-2">
              <Button 
                variant="outline" 
                onClick={() => setIsAddingSubscriber(false)}
              >
                Cancel
              </Button>
              <Button 
                className="bg-purple-600 hover:bg-purple-700"
                onClick={handleAddSubscriber}
              >
                Add Subscriber
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSubscribers.length > 0 ? filteredSubscribers.map((subscriber) => (
          <Card key={subscriber.id} className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-purple-600">
                      {subscriber.name ? subscriber.name.slice(0, 2).toUpperCase() : subscriber.external_id.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-white font-medium">
                      {subscriber.name || 'Anonymous'}
                    </h3>
                    <p className="text-purple-300 text-xs">
                      ID: {subscriber.external_id}
                    </p>
                  </div>
                </div>
                {getTierBadge(subscriber.tier)}
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-purple-300 text-sm">Total Spent</span>
                  <span className="text-green-400 font-bold">${subscriber.total_spent}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-purple-300 text-sm">Last Purchase</span>
                  <span className="text-white text-sm">
                    {subscriber.last_purchase ? new Date(subscriber.last_purchase).toLocaleDateString() : 'Never'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-purple-300 text-sm">Do Not Message</span>
                  <Switch 
                    checked={subscriber.do_not_message} 
                    onCheckedChange={() => handleToggleDNM(subscriber)}
                  />
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button variant="outline" className="flex-1">
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Button>
                <Button className="bg-green-600 hover:bg-green-700 flex-1">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Sales
                </Button>
              </div>
            </CardContent>
          </Card>
        )) : (
          <div className="col-span-full text-center py-12 text-purple-300 bg-white/5 rounded-lg">
            {searchTerm ? 'No subscribers match your search.' : 'No subscribers found.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriberManager;
