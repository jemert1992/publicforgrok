
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Model } from '@/types/supabase';
import { modelService } from '@/services/modelService';
import { useToast } from "@/hooks/use-toast";
import { Plus, X, Save } from 'lucide-react';

export const ModelsManagement = () => {
  const { toast } = useToast();
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [newModelName, setNewModelName] = useState('');
  const [newNoGoTopic, setNewNoGoTopic] = useState('');
  const [bioData, setBioData] = useState<Record<string, string>>({});
  const [serviceData, setServiceData] = useState<Record<string, string>>({});
  const [isCreatingModel, setIsCreatingModel] = useState(false);

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    const fetchedModels = await modelService.getAllModels();
    setModels(fetchedModels);
  };

  const handleSelectModel = (model: Model) => {
    setSelectedModel(model);
    setBioData(model.bio);
    setServiceData(model.services);
  };

  const handleCreateModel = async () => {
    if (!newModelName) {
      toast({
        title: "Error",
        description: "Model name is required",
        variant: "destructive"
      });
      return;
    }

    const newModel = await modelService.addModel({
      name: newModelName,
      bio: {},
      preferences: {},
      services: {},
      no_go_topics: []
    });

    if (newModel) {
      toast({
        title: "Success",
        description: "Model created successfully"
      });
      setNewModelName('');
      setIsCreatingModel(false);
      loadModels();
    } else {
      toast({
        title: "Error",
        description: "Failed to create model",
        variant: "destructive"
      });
    }
  };

  const handleAddNoGoTopic = async () => {
    if (!selectedModel || !newNoGoTopic) return;

    const success = await modelService.addNoGoTopic(selectedModel.id, newNoGoTopic);
    if (success) {
      toast({
        title: "Success",
        description: "No-go topic added"
      });
      setNewNoGoTopic('');
      loadModels();
      // Update selected model with the new topic
      const updatedModel = await modelService.getModelById(selectedModel.id);
      if (updatedModel) {
        setSelectedModel(updatedModel);
      }
    } else {
      toast({
        title: "Error",
        description: "Failed to add no-go topic",
        variant: "destructive"
      });
    }
  };

  const handleRemoveNoGoTopic = async (topic: string) => {
    if (!selectedModel) return;

    const success = await modelService.removeNoGoTopic(selectedModel.id, topic);
    if (success) {
      toast({
        title: "Success",
        description: "No-go topic removed"
      });
      loadModels();
      // Update selected model with the new topics list
      const updatedModel = await modelService.getModelById(selectedModel.id);
      if (updatedModel) {
        setSelectedModel(updatedModel);
      }
    } else {
      toast({
        title: "Error",
        description: "Failed to remove no-go topic",
        variant: "destructive"
      });
    }
  };

  const handleSaveBio = async () => {
    if (!selectedModel) return;

    const success = await modelService.updateModelBio(selectedModel.id, bioData);
    if (success) {
      toast({
        title: "Success",
        description: "Bio updated successfully"
      });
      loadModels();
    } else {
      toast({
        title: "Error",
        description: "Failed to update bio",
        variant: "destructive"
      });
    }
  };

  const handleSaveServices = async () => {
    if (!selectedModel) return;

    const success = await modelService.updateModelServices(selectedModel.id, serviceData);
    if (success) {
      toast({
        title: "Success",
        description: "Services updated successfully"
      });
      loadModels();
    } else {
      toast({
        title: "Error",
        description: "Failed to update services",
        variant: "destructive"
      });
    }
  };

  const handleBioChange = (key: string, value: string) => {
    setBioData(prev => ({ ...prev, [key]: value }));
  };

  const handleServiceChange = (key: string, value: string) => {
    setServiceData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Models Management</h1>
        <Button 
          className="bg-purple-600 hover:bg-purple-700"
          onClick={() => setIsCreatingModel(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Model
        </Button>
      </div>

      {isCreatingModel && (
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Create New Model</CardTitle>
            <CardDescription className="text-purple-200">
              Enter the details for the new model
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-white">Model Name</label>
              <Input 
                value={newModelName} 
                onChange={(e) => setNewModelName(e.target.value)} 
                placeholder="Enter model name"
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreatingModel(false)}>
                Cancel
              </Button>
              <Button 
                className="bg-purple-600 hover:bg-purple-700"
                onClick={handleCreateModel}
              >
                Create Model
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Models</CardTitle>
              <CardDescription className="text-purple-200">
                Select a model to manage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {models.map((model) => (
                <div 
                  key={model.id} 
                  className={`p-4 rounded-lg cursor-pointer transition-all hover:bg-white/10 ${
                    selectedModel?.id === model.id ? 'bg-white/20' : 'bg-white/5'
                  }`}
                  onClick={() => handleSelectModel(model)}
                >
                  <h3 className="text-white font-medium">{model.name}</h3>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {model.no_go_topics.map((topic) => (
                      <Badge key={topic} variant="outline" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {selectedModel ? (
            <Tabs defaultValue="profile" className="space-y-4">
              <TabsList className="bg-white/10 backdrop-blur-sm">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="no-go">No-Go Topics</TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Model Profile</CardTitle>
                    <CardDescription className="text-purple-200">
                      Manage {selectedModel.name}'s profile information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-white">Name</label>
                      <Input 
                        value={selectedModel.name} 
                        disabled 
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-white">Age</label>
                      <Input 
                        value={bioData.age || ''} 
                        onChange={(e) => handleBioChange('age', e.target.value)} 
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-white">Location</label>
                      <Input 
                        value={bioData.location || ''} 
                        onChange={(e) => handleBioChange('location', e.target.value)} 
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-white">Bio</label>
                      <Textarea 
                        value={bioData.description || ''} 
                        onChange={(e) => handleBioChange('description', e.target.value)} 
                        className="bg-white/10 border-white/20 text-white min-h-[100px]"
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        className="bg-purple-600 hover:bg-purple-700"
                        onClick={handleSaveBio}
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Save Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="content">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Content Management</CardTitle>
                    <CardDescription className="text-purple-200">
                      Manage content for {selectedModel.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-10 text-purple-200">
                      Visit the Content tab to manage {selectedModel.name}'s content
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="services">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Services</CardTitle>
                    <CardDescription className="text-purple-200">
                      Manage services offered by {selectedModel.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-white">Custom Videos</label>
                      <Input 
                        value={serviceData.customVideos || ''} 
                        onChange={(e) => handleServiceChange('customVideos', e.target.value)} 
                        placeholder="Price or description"
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-white">Sexting</label>
                      <Input 
                        value={serviceData.sexting || ''} 
                        onChange={(e) => handleServiceChange('sexting', e.target.value)} 
                        placeholder="Price or description"
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-white">Video Calls</label>
                      <Input 
                        value={serviceData.videoCalls || ''} 
                        onChange={(e) => handleServiceChange('videoCalls', e.target.value)} 
                        placeholder="Price or description"
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        className="bg-purple-600 hover:bg-purple-700"
                        onClick={handleSaveServices}
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Save Services
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="no-go">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">No-Go Topics</CardTitle>
                    <CardDescription className="text-purple-200">
                      Manage topics to filter from conversations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input 
                        value={newNoGoTopic} 
                        onChange={(e) => setNewNoGoTopic(e.target.value)} 
                        placeholder="Enter topic to filter"
                        className="bg-white/10 border-white/20 text-white flex-1"
                      />
                      <Button 
                        className="bg-purple-600 hover:bg-purple-700"
                        onClick={handleAddNoGoTopic}
                      >
                        Add Topic
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      {selectedModel.no_go_topics.map((topic) => (
                        <Badge key={topic} variant="outline" className="flex items-center gap-1 px-3 py-1">
                          {topic}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => handleRemoveNoGoTopic(topic)} 
                          />
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 h-full flex items-center justify-center">
              <CardContent className="text-center py-10 text-purple-200">
                Select a model from the list or create a new one
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModelsManagement;
