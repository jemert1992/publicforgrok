
import { supabase } from '@/integrations/supabase/client';
import { Model } from '@/types/supabase';

export const modelService = {
  // Get all models
  getAllModels: async (): Promise<Model[]> => {
    const { data, error } = await supabase
      .from('models')
      .select('*');
    
    if (error) {
      console.error('Error fetching models:', error);
      return [];
    }
    
    return data as Model[];
  },
  
  // Get model by ID
  getModelById: async (id: string): Promise<Model | null> => {
    const { data, error } = await supabase
      .from('models')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching model:', error);
      return null;
    }
    
    return data as Model;
  },
  
  // Add new model
  addModel: async (model: Omit<Model, 'id' | 'created_at' | 'updated_at'>): Promise<Model | null> => {
    const { data, error } = await supabase
      .from('models')
      .insert([model])
      .select();
    
    if (error) {
      console.error('Error adding model:', error);
      return null;
    }
    
    return data[0] as Model;
  },
  
  // Update model
  updateModel: async (id: string, updates: Partial<Model>): Promise<boolean> => {
    const { error } = await supabase
      .from('models')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) {
      console.error('Error updating model:', error);
      return false;
    }
    
    return true;
  },
  
  // Add no-go topic for model
  addNoGoTopic: async (id: string, topic: string): Promise<boolean> => {
    const model = await modelService.getModelById(id);
    if (!model) return false;
    
    const updatedTopics = [...model.no_go_topics, topic];
    
    return modelService.updateModel(id, { no_go_topics: updatedTopics });
  },
  
  // Remove no-go topic for model
  removeNoGoTopic: async (id: string, topic: string): Promise<boolean> => {
    const model = await modelService.getModelById(id);
    if (!model) return false;
    
    const updatedTopics = model.no_go_topics.filter(t => t !== topic);
    
    return modelService.updateModel(id, { no_go_topics: updatedTopics });
  },
  
  // Update model bio
  updateModelBio: async (id: string, bioData: Record<string, any>): Promise<boolean> => {
    return modelService.updateModel(id, { bio: bioData });
  },
  
  // Update model services
  updateModelServices: async (id: string, services: Record<string, any>): Promise<boolean> => {
    return modelService.updateModel(id, { services });
  }
};
