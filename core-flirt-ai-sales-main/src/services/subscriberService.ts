
import { supabase } from '@/integrations/supabase/client';
import { Subscriber, Transaction } from '@/types/supabase';

export const subscriberService = {
  // Get all subscribers
  getAllSubscribers: async (): Promise<Subscriber[]> => {
    const { data, error } = await supabase
      .from('subscribers')
      .select('*');
    
    if (error) {
      console.error('Error fetching subscribers:', error);
      return [];
    }
    
    return data as Subscriber[];
  },
  
  // Get subscriber by ID
  getSubscriberById: async (id: string): Promise<Subscriber | null> => {
    const { data, error } = await supabase
      .from('subscribers')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching subscriber:', error);
      return null;
    }
    
    return data as Subscriber;
  },
  
  // Add new subscriber
  addSubscriber: async (subscriber: Omit<Subscriber, 'id' | 'created_at' | 'updated_at'>): Promise<Subscriber | null> => {
    const { data, error } = await supabase
      .from('subscribers')
      .insert([subscriber])
      .select();
    
    if (error) {
      console.error('Error adding subscriber:', error);
      return null;
    }
    
    return data[0] as Subscriber;
  },
  
  // Update subscriber
  updateSubscriber: async (id: string, updates: Partial<Subscriber>): Promise<boolean> => {
    const { error } = await supabase
      .from('subscribers')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) {
      console.error('Error updating subscriber:', error);
      return false;
    }
    
    return true;
  },
  
  // Add/remove subscriber from DNM list
  toggleDoNotMessage: async (id: string, status: boolean): Promise<boolean> => {
    return subscriberService.updateSubscriber(id, { do_not_message: status });
  },
  
  // Get subscriber's transaction history
  getSubscriberTransactions: async (id: string): Promise<Transaction[]> => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('subscriber_id', id);
    
    if (error) {
      console.error('Error fetching subscriber transactions:', error);
      return [];
    }
    
    return data as Transaction[];
  },
  
  // Get subscribers not in DNM list
  getMessagingEligibleSubscribers: async (): Promise<Subscriber[]> => {
    const { data, error } = await supabase
      .from('subscribers')
      .select('*')
      .eq('do_not_message', false);
    
    if (error) {
      console.error('Error fetching eligible subscribers:', error);
      return [];
    }
    
    return data as Subscriber[];
  },
  
  // Record a tip from a subscriber
  recordTip: async (subscriberId: string, modelId: string, amount: number): Promise<boolean> => {
    // Update the subscriber's total spent
    // Define explicit types for the RPC parameters
    interface IncrementSpentParams {
      subscriber_id: string;
      amount: number;
    }

    const { error: updateError } = await supabase
      .rpc<void, IncrementSpentParams>('increment_subscriber_spent', {
        subscriber_id: subscriberId,
        amount: amount
      });
    
    if (updateError) {
      console.error('Error updating subscriber spent:', updateError);
      return false;
    }
    
    // Record the transaction
    const { error } = await supabase
      .from('transactions')
      .insert([{
        subscriber_id: subscriberId,
        model_id: modelId,
        transaction_type: 'tip',
        amount,
        external_transaction_id: `mock-${Date.now()}`
      }]);
    
    if (error) {
      console.error('Error recording tip transaction:', error);
      return false;
    }
    
    return true;
  }
};
