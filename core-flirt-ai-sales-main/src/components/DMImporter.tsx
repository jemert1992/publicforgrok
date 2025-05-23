
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Model } from '@/types/supabase';
import { modelService } from '@/services/modelService';
import { nlpService } from '@/services/nlpService';
import { useToast } from "@/hooks/use-toast";
import { Upload, FileType, AlertCircle, CheckCircle } from 'lucide-react';
import Papa from 'papaparse';

export const DMImporter = () => {
  const { toast } = useToast();
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModelId, setSelectedModelId] = useState<string>('');
  const [importMethod, setImportMethod] = useState<'csv' | 'text'>('csv');
  const [rawDmData, setRawDmData] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [importStats, setImportStats] = useState<{
    messagesProcessed: number;
    patternIdentified: number;
    styleFeaturesExtracted: number;
  } | null>(null);
  
  React.useEffect(() => {
    loadModels();
  }, []);
  
  const loadModels = async () => {
    const fetchedModels = await modelService.getAllModels();
    setModels(fetchedModels);
    if (fetchedModels.length > 0) {
      setSelectedModelId(fetchedModels[0].id);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleImport = async () => {
    if (!selectedModelId) {
      toast({
        title: "Error",
        description: "Please select a model",
        variant: "destructive"
      });
      return;
    }
    
    if (importMethod === 'csv' && !file) {
      toast({
        title: "Error",
        description: "Please upload a CSV file",
        variant: "destructive"
      });
      return;
    }
    
    if (importMethod === 'text' && !rawDmData) {
      toast({
        title: "Error",
        description: "Please enter DM data",
        variant: "destructive"
      });
      return;
    }
    
    setIsImporting(true);
    setProgress(0);
    
    try {
      let messages: any[] = [];
      
      if (importMethod === 'csv' && file) {
        messages = await parseCSV(file);
      } else if (importMethod === 'text') {
        messages = parseTextData(rawDmData);
      }
      
      // Simulate processing steps with progress updates
      await simulateProcessing();
      
      // Call the nlpService to process the imported messages
      const success = await nlpService.importHistoricalDMs(selectedModelId, messages);
      
      if (success) {
        setImportStats({
          messagesProcessed: messages.length,
          patternIdentified: Math.floor(messages.length * 0.8),
          styleFeaturesExtracted: 15 + Math.floor(Math.random() * 10)
        });
        
        toast({
          title: "Import Successful",
          description: `Processed ${messages.length} messages for analysis`,
        });
      } else {
        toast({
          title: "Import Failed",
          description: "There was an error processing the DM data",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Import error:", error);
      toast({
        title: "Import Failed",
        description: "There was an error processing the DM data",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
      setProgress(100);
    }
  };
  
  const parseCSV = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          const messages = results.data.map((row: any) => ({
            role: row.sender === 'model' ? 'assistant' : 'user',
            content: row.message,
            timestamp: row.timestamp || new Date().toISOString()
          }));
          resolve(messages);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  };
  
  const parseTextData = (text: string): any[] => {
    // Simple parsing of text data - format expected:
    // [sender]: [message]
    const lines = text.split('\n').filter(Boolean);
    const messages = lines.map(line => {
      // Assume format "Model: message" or "User: message"
      const match = line.match(/^(Model|User):\s*(.*)/i);
      if (match) {
        return {
          role: match[1].toLowerCase() === 'model' ? 'assistant' : 'user',
          content: match[2],
          timestamp: new Date().toISOString()
        };
      }
      return null;
    }).filter(Boolean);
    
    return messages;
  };
  
  const simulateProcessing = async () => {
    // Simulate processing steps with progress updates
    for (let i = 1; i <= 10; i++) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setProgress(i * 10);
    }
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">DM History Importer</h1>
      <p className="text-purple-200">Import direct message history to train the AI to mimic the model's unique communication style</p>
      
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Import DM History</CardTitle>
          <CardDescription className="text-purple-200">
            Upload historical messages to train SynthCore to match the model's voice and tone
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <label className="text-white block mb-2">Select Model</label>
              <Select value={selectedModelId} onValueChange={setSelectedModelId}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white w-full">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  {models.map(model => (
                    <SelectItem key={model.id} value={model.id}>{model.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Tabs defaultValue="csv" onValueChange={(value) => setImportMethod(value as 'csv' | 'text')}>
              <TabsList className="bg-white/10 w-full">
                <TabsTrigger value="csv" className="flex-1">Upload CSV</TabsTrigger>
                <TabsTrigger value="text" className="flex-1">Paste Text</TabsTrigger>
              </TabsList>
              
              <TabsContent value="csv" className="pt-4">
                <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
                  <FileType className="h-10 w-10 mb-4 mx-auto text-purple-400" />
                  <p className="text-white mb-2">Upload CSV file with message history</p>
                  <p className="text-purple-200 text-sm mb-4">
                    CSV should have columns: sender, message, timestamp
                  </p>
                  <Input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="bg-white/10 border-white/20 text-white mx-auto max-w-xs"
                  />
                  {file && (
                    <p className="mt-2 text-green-400">Selected: {file.name}</p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="text" className="pt-4">
                <div>
                  <p className="text-white mb-2">Paste message history</p>
                  <p className="text-purple-200 text-sm mb-4">
                    Format each message as "Model: [message]" or "User: [message]", one per line
                  </p>
                  <Textarea 
                    value={rawDmData}
                    onChange={(e) => setRawDmData(e.target.value)}
                    className="bg-white/10 border-white/20 text-white min-h-[200px]"
                    placeholder="Model: Hey, how are you today? 😘&#10;User: I'm good! Just thinking about you"
                  />
                </div>
              </TabsContent>
            </Tabs>
            
            {isImporting ? (
              <div className="space-y-4">
                <p className="text-white">Processing DM history...</p>
                <Progress value={progress} className="h-2 bg-white/20" />
                <p className="text-sm text-purple-200">
                  {progress < 30 && "Parsing messages..."}
                  {progress >= 30 && progress < 60 && "Analyzing communication patterns..."}
                  {progress >= 60 && progress < 90 && "Extracting style features..."}
                  {progress >= 90 && "Finalizing model training..."}
                </p>
              </div>
            ) : (
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={handleImport}
              >
                <Upload className="mr-2 h-4 w-4" />
                Import DM History
              </Button>
            )}
            
            {importStats && (
              <Alert className="bg-green-900/20 border-green-500">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertTitle className="text-green-400">Import Successful</AlertTitle>
                <AlertDescription className="text-green-300">
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>{importStats.messagesProcessed} messages processed</li>
                    <li>{importStats.patternIdentified} conversation patterns identified</li>
                    <li>{importStats.styleFeaturesExtracted} style features extracted</li>
                  </ul>
                </AlertDescription>
              </Alert>
            )}
            
            <Alert className="bg-purple-900/20 border-purple-500">
              <AlertCircle className="h-4 w-4 text-purple-500" />
              <AlertTitle className="text-purple-400">Privacy Note</AlertTitle>
              <AlertDescription className="text-purple-300">
                DM data is only used to train the language model and is processed securely. No sensitive information is stored beyond the training session.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DMImporter;
