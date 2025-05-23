
import { supabase } from '@/integrations/supabase/client';
import { Transaction } from '@/types/supabase';

export const revenueService = {
  // Get all transactions
  getAllTransactions: async (): Promise<Transaction[]> => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
    
    return data as Transaction[];
  },
  
  // Get transactions by model
  getModelTransactions: async (modelId: string): Promise<Transaction[]> => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('model_id', modelId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching model transactions:', error);
      return [];
    }
    
    return data as Transaction[];
  },
  
  // Get revenue summary by model
  getRevenueByModel: async (modelId: string): Promise<Record<string, number>> => {
    const transactions = await revenueService.getModelTransactions(modelId);
    
    const summary = {
      totalRevenue: 0,
      ppvRevenue: 0,
      tipRevenue: 0,
      subscriptionRevenue: 0
    };
    
    transactions.forEach(transaction => {
      summary.totalRevenue += transaction.amount;
      
      switch (transaction.transaction_type) {
        case 'ppv':
          summary.ppvRevenue += transaction.amount;
          break;
        case 'tip':
          summary.tipRevenue += transaction.amount;
          break;
        case 'subscription':
          summary.subscriptionRevenue += transaction.amount;
          break;
      }
    });
    
    return summary;
  },
  
  // Get total revenue
  getTotalRevenue: async (): Promise<number> => {
    const { data, error } = await supabase
      .from('transactions')
      .select('amount');
    
    if (error) {
      console.error('Error fetching total revenue:', error);
      return 0;
    }
    
    return data.reduce((total, transaction) => total + transaction.amount, 0);
  },
  
  // Get revenue by time period
  getRevenueByTimePeriod: async (startDate: Date, endDate: Date): Promise<number> => {
    const { data, error } = await supabase
      .from('transactions')
      .select('amount')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());
    
    if (error) {
      console.error('Error fetching revenue by time period:', error);
      return 0;
    }
    
    return data.reduce((total, transaction) => total + transaction.amount, 0);
  },
  
  // Record a new transaction
  recordTransaction: async (transaction: Omit<Transaction, 'id' | 'created_at'>): Promise<Transaction | null> => {
    const { data, error } = await supabase
      .from('transactions')
      .insert([transaction])
      .select();
    
    if (error) {
      console.error('Error recording transaction:', error);
      return null;
    }
    
    return data[0] as Transaction;
  }
};
