
export interface Conversation {
  id: string;
  subscriber_id: string;
  model_id: string;
  messages: Message[];
  last_interaction: string;
  created_at: string;
}

export interface Message {
  role: 'system' | 'assistant' | 'user';
  content: string;
  timestamp: string;
}

export interface Model {
  id: string;
  name: string;
  bio: Record<string, any>;
  preferences: Record<string, any>;
  services: Record<string, any>;
  no_go_topics: string[];
  created_at: string;
  updated_at: string;
}

export interface ContentItem {
  id: string;
  model_id: string;
  title: string;
  description: string | null;
  content_url: string;
  content_type: string;
  keywords: string[];
  price: number;
  created_at: string;
}

export interface Subscriber {
  id: string;
  external_id: string;
  name: string | null;
  tier: string;
  do_not_message: boolean;
  total_spent: number;
  last_purchase: string | null;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  subscriber_id: string;
  model_id: string;
  content_id: string | null;
  transaction_type: string;
  amount: number;
  external_transaction_id: string | null;
  created_at: string;
}
