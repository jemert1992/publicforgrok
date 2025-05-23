
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Upload, Video, Image as ImageIcon, Tag, DollarSign } from 'lucide-react';

interface ContentItem {
  id: string;
  type: 'video' | 'image';
  title: string;
  tags: string[];
  price: number;
  views: number;
  revenue: number;
  thumbnail: string;
}

export const ContentManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  
  const [content] = useState<ContentItem[]>([
    {
      id: '1',
      type: 'video',
      title: 'Exclusive Behind the Scenes',
      tags: ['exclusive', 'behind-scenes', 'personal'],
      price: 25,
      views: 45,
      revenue: 1125,
      thumbnail: '/placeholder.svg'
    },
    {
      id: '2',
      type: 'image',
      title: 'Glamour Photo Set',
      tags: ['glamour', 'photoshoot', 'artistic'],
      price: 15,
      views: 78,
      revenue: 1170,
      thumbnail: '/placeholder.svg'
    },
    {
      id: '3',
      type: 'video',
      title: 'Custom Request Fulfilled',
      tags: ['custom', 'request', 'personal'],
      price: 50,
      views: 23,
      revenue: 1150,
      thumbnail: '/placeholder.svg'
    }
  ]);

  const filteredContent = content.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Search and Upload */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 w-4 h-4" />
          <Input
            placeholder="Search content by title or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-purple-300"
          />
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Upload className="w-4 h-4 mr-2" />
          Upload New Content
        </Button>
      </div>

      <Tabs defaultValue="gallery" className="space-y-4">
        <TabsList className="bg-white/10 backdrop-blur-sm">
          <TabsTrigger value="gallery">Content Gallery</TabsTrigger>
          <TabsTrigger value="analytics">Performance</TabsTrigger>
          <TabsTrigger value="tags">Tag Management</TabsTrigger>
        </TabsList>

        <TabsContent value="gallery">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContent.map((item) => (
              <Card 
                key={item.id} 
                className="bg-white/10 backdrop-blur-sm border-white/20 cursor-pointer hover:bg-white/15 transition-all"
                onClick={() => setSelectedContent(item)}
              >
                <CardHeader className="pb-2">
                  <div className="aspect-video bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                    {item.type === 'video' ? (
                      <Video className="w-8 h-8 text-white" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-white" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-sm text-white mb-2">{item.title}</CardTitle>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-purple-300">{item.views} views</span>
                    <span className="text-green-400 font-bold">${item.price}</span>
                  </div>
                  <div className="text-xs text-purple-300 mt-1">
                    Revenue: ${item.revenue}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {content.map((item) => (
              <Card key={item.id} className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white text-sm">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-purple-300">Views:</span>
                    <span className="text-white font-bold">{item.views}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-300">Revenue:</span>
                    <span className="text-green-400 font-bold">${item.revenue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-300">Conversion:</span>
                    <span className="text-white font-bold">
                      {((item.revenue / item.price / item.views) * 100).toFixed(1)}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tags">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Popular Tags</CardTitle>
              <CardDescription className="text-purple-200">
                Manage and optimize your content tags
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {['exclusive', 'personal', 'custom', 'glamour', 'behind-scenes', 'artistic', 'request', 'photoshoot'].map((tag) => (
                  <div key={tag} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                    <Badge variant="outline" className="border-white/20 text-white">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                    <span className="text-xs text-purple-300">
                      {Math.floor(Math.random() * 20) + 1}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
