import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Model, ContentItem } from '@/types/supabase';
import { modelService } from '@/services/modelService';
import { contentService } from '@/services/contentService';
import { useToast } from "@/hooks/use-toast";
import { Plus, Save, Trash2, Tag, Image, Video, X } from 'lucide-react';

export const ContentManager = () => {
  const { toast } = useToast();
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModelId, setSelectedModelId] = useState<string>('');
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [isAddingContent, setIsAddingContent] = useState(false);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  
  // Form state for new/edit content
  const [contentTitle, setContentTitle] = useState('');
  const [contentDescription, setContentDescription] = useState('');
  const [contentUrl, setContentUrl] = useState('');
  const [contentType, setContentType] = useState('image');
  const [contentPrice, setContentPrice] = useState('');
  const [contentKeywords, setContentKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState('');

  useEffect(() => {
    loadModels();
  }, []);

  useEffect(() => {
    if (selectedModelId) {
      loadModelContent(selectedModelId);
    }
  }, [selectedModelId]);

  const loadModels = async () => {
    const fetchedModels = await modelService.getAllModels();
    setModels(fetchedModels);
    if (fetchedModels.length > 0 && !selectedModelId) {
      setSelectedModelId(fetchedModels[0].id);
    }
  };

  const loadModelContent = async (modelId: string) => {
    const fetchedContent = await contentService.getModelContent(modelId);
    setContents(fetchedContent);
  };

  const handleAddKeyword = () => {
    if (newKeyword && !contentKeywords.includes(newKeyword)) {
      setContentKeywords([...contentKeywords, newKeyword]);
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setContentKeywords(contentKeywords.filter(k => k !== keyword));
  };

  const resetContentForm = () => {
    setContentTitle('');
    setContentDescription('');
    setContentUrl('');
    setContentType('image');
    setContentPrice('');
    setContentKeywords([]);
    setNewKeyword('');
    setSelectedContent(null);
  };

  const handleCreateContent = async () => {
    if (!selectedModelId || !contentTitle || !contentUrl || !contentPrice) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    const priceValue = parseFloat(contentPrice);
    if (isNaN(priceValue)) {
      toast({
        title: "Error",
        description: "Price must be a valid number",
        variant: "destructive"
      });
      return;
    }

    const newContent = {
      model_id: selectedModelId,
      title: contentTitle,
      description: contentDescription,
      content_url: contentUrl,
      content_type: contentType,
      keywords: contentKeywords,
      price: priceValue
    };

    if (selectedContent) {
      // Update existing content
      const success = await contentService.updateContent(selectedContent.id, newContent);
      if (success) {
        toast({
          title: "Success",
          description: "Content updated successfully"
        });
        resetContentForm();
        setIsAddingContent(false);
        loadModelContent(selectedModelId);
      } else {
        toast({
          title: "Error",
          description: "Failed to update content",
          variant: "destructive"
        });
      }
    } else {
      // Add new content
      const addedContent = await contentService.addContent(newContent);
      if (addedContent) {
        toast({
          title: "Success",
          description: "Content added successfully"
        });
        resetContentForm();
        setIsAddingContent(false);
        loadModelContent(selectedModelId);
      } else {
        toast({
          title: "Error",
          description: "Failed to add content",
          variant: "destructive"
        });
      }
    }
  };

  const handleDeleteContent = async (contentId: string) => {
    const success = await contentService.deleteContent(contentId);
    if (success) {
      toast({
        title: "Success",
        description: "Content deleted successfully"
      });
      loadModelContent(selectedModelId);
    } else {
      toast({
        title: "Error",
        description: "Failed to delete content",
        variant: "destructive"
      });
    }
  };

  const handleEditContent = (content: ContentItem) => {
    setSelectedContent(content);
    setContentTitle(content.title);
    setContentDescription(content.description || '');
    setContentUrl(content.content_url);
    setContentType(content.content_type);
    setContentPrice(content.price.toString());
    setContentKeywords(content.keywords);
    setIsAddingContent(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Content Manager</h1>
        <Button 
          className="bg-purple-600 hover:bg-purple-700"
          onClick={() => {
            resetContentForm();
            setIsAddingContent(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Content
        </Button>
      </div>

      <div className="mb-4">
        <Select value={selectedModelId} onValueChange={setSelectedModelId}>
          <SelectTrigger className="bg-white/10 border-white/20 text-white w-[250px]">
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent>
            {models.map((model) => (
              <SelectItem key={model.id} value={model.id}>{model.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isAddingContent ? (
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white">
              {selectedContent ? "Edit Content" : "Add New Content"}
            </CardTitle>
            <CardDescription className="text-purple-200">
              {selectedContent ? "Update content details" : "Create new content for pay-per-view"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-white">Title*</label>
              <Input 
                value={contentTitle}
                onChange={(e) => setContentTitle(e.target.value)}
                placeholder="Enter content title"
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-white">Description</label>
              <Textarea 
                value={contentDescription}
                onChange={(e) => setContentDescription(e.target.value)}
                placeholder="Enter content description"
                className="bg-white/10 border-white/20 text-white min-h-[80px]"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-white">Content URL*</label>
              <Input 
                value={contentUrl}
                onChange={(e) => setContentUrl(e.target.value)}
                placeholder="Enter URL to content"
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-white">Content Type*</label>
              <Select value={contentType} onValueChange={setContentType}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-white">Price* ($)</label>
              <Input 
                value={contentPrice}
                onChange={(e) => setContentPrice(e.target.value)}
                placeholder="Enter price"
                type="number"
                min="0"
                step="0.01"
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-white">Keywords</label>
              <div className="flex gap-2">
                <Input 
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  placeholder="Add keywords"
                  className="bg-white/10 border-white/20 text-white flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddKeyword();
                    }
                  }}
                />
                <Button 
                  variant="outline"
                  onClick={handleAddKeyword}
                >
                  <Tag className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {contentKeywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1 flex items-center gap-1">
                    {keyword}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-4 w-4 p-0 ml-1" 
                      onClick={() => handleRemoveKeyword(keyword)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  resetContentForm();
                  setIsAddingContent(false);
                }}
              >
                Cancel
              </Button>
              <Button 
                className="bg-purple-600 hover:bg-purple-700"
                onClick={handleCreateContent}
              >
                <Save className="mr-2 h-4 w-4" />
                {selectedContent ? "Update Content" : "Add Content"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contents.length > 0 ? contents.map((content) => (
            <Card key={content.id} className="bg-white/10 backdrop-blur-sm border-white/20">
              <div className="aspect-video bg-gradient-to-br from-purple-500 to-blue-500 rounded-t-lg flex items-center justify-center">
                {content.content_type === 'video' ? (
                  <Video className="w-12 h-12 text-white" />
                ) : (
                  <Image className="w-12 h-12 text-white" />
                )}
              </div>
              <CardContent className="pt-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-white font-medium">{content.title}</h3>
                  <Badge>${content.price.toFixed(2)}</Badge>
                </div>
                
                {content.description && (
                  <p className="text-purple-200 text-sm mb-3">{content.description}</p>
                )}
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {content.keywords.map((keyword, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditContent(content)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDeleteContent(content.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )) : (
            <div className="col-span-full text-center py-12 text-purple-300 bg-white/5 rounded-lg">
              No content found. Click "Add Content" to create new pay-per-view content.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ContentManager;
