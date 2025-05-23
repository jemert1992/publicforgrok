
import { supabase } from '@/integrations/supabase/client';
import { ContentItem } from '@/types/supabase';

export const contentService = {
  // Get all content for a model
  getModelContent: async (modelId: string): Promise<ContentItem[]> => {
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .eq('model_id', modelId);
    
    if (error) {
      console.error('Error fetching model content:', error);
      return [];
    }
    
    return data as ContentItem[];
  },
  
  // Get content by ID
  getContentById: async (contentId: string): Promise<ContentItem | null> => {
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .eq('id', contentId)
      .single();
    
    if (error) {
      console.error('Error fetching content:', error);
      return null;
    }
    
    return data as ContentItem;
  },
  
  // Add new content to the vault
  addContent: async (content: Omit<ContentItem, 'id' | 'created_at'>): Promise<ContentItem | null> => {
    const { data, error } = await supabase
      .from('content')
      .insert([content])
      .select();
    
    if (error) {
      console.error('Error adding content:', error);
      return null;
    }
    
    return data[0] as ContentItem;
  },
  
  // Update existing content
  updateContent: async (contentId: string, updates: Partial<ContentItem>): Promise<boolean> => {
    const { error } = await supabase
      .from('content')
      .update(updates)
      .eq('id', contentId);
    
    if (error) {
      console.error('Error updating content:', error);
      return false;
    }
    
    return true;
  },
  
  // Delete content
  deleteContent: async (contentId: string): Promise<boolean> => {
    const { error } = await supabase
      .from('content')
      .delete()
      .eq('id', contentId);
    
    if (error) {
      console.error('Error deleting content:', error);
      return false;
    }
    
    return true;
  },
  
  // Find content by keywords
  findContentByKeywords: async (modelId: string, keywords: string[]): Promise<ContentItem[]> => {
    if (!keywords.length) return [];
    
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .eq('model_id', modelId)
      .filter('keywords', 'cs', `{${keywords.join(',')}}`);
    
    if (error) {
      console.error('Error finding content by keywords:', error);
      return [];
    }
    
    return data as ContentItem[];
  },
  
  // Send PPV content to a subscriber
  sendPPVContent: async (contentId: string, subscriberId: string): Promise<boolean> => {
    // In a real implementation, this would integrate with OnlyFans API
    console.log(`Sending PPV content ${contentId} to subscriber ${subscriberId}`);
    
    // Get content details
    const content = await contentService.getContentById(contentId);
    if (!content) return false;
    
    // Record the transaction
    const { error } = await supabase
      .from('transactions')
      .insert([{
        subscriber_id: subscriberId,
        model_id: content.model_id,
        content_id: contentId,
        transaction_type: 'ppv_sent',
        amount: content.price,
        external_transaction_id: `mock-${Date.now()}`
      }]);
    
    if (error) {
      console.error('Error recording PPV transaction:', error);
      return false;
    }
    
    return true;
  }
};
