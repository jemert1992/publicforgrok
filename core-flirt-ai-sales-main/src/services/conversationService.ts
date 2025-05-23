
import { supabase } from '@/integrations/supabase/client';
import { Conversation, Message } from '@/types/supabase';
import { nlpService } from './nlpService';
import { contentService } from './contentService';
import { Json } from '@/integrations/supabase/types';

export const conversationService = {
  // Get conversation by ID
  getConversationById: async (id: string): Promise<Conversation | null> => {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching conversation:', error);
      return null;
    }
    
    // Convert the Json[] messages to Message[]
    const conversation = data as any;
    if (conversation && Array.isArray(conversation.messages)) {
      conversation.messages = conversation.messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp
      }));
    }
    
    return conversation as Conversation;
  },
  
  // Get conversations by subscriber
  getSubscriberConversations: async (subscriberId: string): Promise<Conversation[]> => {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('subscriber_id', subscriberId);
    
    if (error) {
      console.error('Error fetching subscriber conversations:', error);
      return [];
    }
    
    // Convert the Json[] messages to Message[] for each conversation
    const conversations = data as any[];
    conversations.forEach(conversation => {
      if (conversation && Array.isArray(conversation.messages)) {
        conversation.messages = conversation.messages.map((msg: any) => ({
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp
        }));
      }
    });
    
    return conversations as Conversation[];
  },
  
  // Create new conversation
  createConversation: async (subscriberId: string, modelId: string, initialMessage?: string): Promise<Conversation | null> => {
    const messages: any[] = [];
    
    if (initialMessage) {
      messages.push({
        role: 'assistant',
        content: initialMessage,
        timestamp: new Date().toISOString()
      });
    }
    
    const { data, error } = await supabase
      .from('conversations')
      .insert([{
        subscriber_id: subscriberId,
        model_id: modelId,
        messages
      }])
      .select();
    
    if (error) {
      console.error('Error creating conversation:', error);
      return null;
    }
    
    // Convert the Json[] messages to Message[]
    const conversation = data[0] as any;
    if (conversation && Array.isArray(conversation.messages)) {
      conversation.messages = conversation.messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp
      }));
    }
    
    return conversation as Conversation;
  },
  
  // Add message to conversation
  addMessage: async (
    conversationId: string, 
    message: Omit<Message, 'timestamp'>,
    modelData?: { bio: Record<string, any>, noGoTopics: string[] }
  ): Promise<Message | null> => {
    // Get the current conversation
    const conversation = await conversationService.getConversationById(conversationId);
    if (!conversation) return null;
    
    const newMessage: Message = {
      ...message,
      timestamp: new Date().toISOString()
    };
    
    // Add the message to the conversation
    const messages = [...conversation.messages, newMessage];
    
    // Convert Message[] to Json[] for storage
    const jsonMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp
    })) as any[];
    
    // Update the conversation
    const { error } = await supabase
      .from('conversations')
      .update({
        messages: jsonMessages,
        last_interaction: new Date().toISOString()
      })
      .eq('id', conversationId);
    
    if (error) {
      console.error('Error adding message to conversation:', error);
      return null;
    }
    
    // If this was a user message, generate an AI response
    if (message.role === 'user' && modelData) {
      const response = await nlpService.generateResponse(
        messages,
        modelData.bio,
        modelData.noGoTopics
      );
      
      // Check if we should send PPV content
      const shouldSendPPV = Math.random() > 0.7; // 30% chance to suggest PPV
      
      if (shouldSendPPV) {
        // Find relevant content based on conversation
        const contentId = await nlpService.matchContentToConversation(
          messages,
          conversation.model_id
        );
        
        if (contentId) {
          // Get content details
          const content = await contentService.getContentById(contentId);
          if (content) {
            // Add a message suggesting the PPV content
            const ppvMessage: Message = {
              role: 'assistant',
              content: `I have something special for you - a ${content.title} that I think you'll really enjoy! It's only $${content.price}. Want to see it?`,
              timestamp: new Date().toISOString()
            };
            
            await conversationService.addMessage(conversationId, ppvMessage);
            
            // In a real implementation, this would integrate with OnlyFans to send the PPV
            await contentService.sendPPVContent(content.id, conversation.subscriber_id);
          }
        }
      } else {
        // Just add the regular response
        const aiMessage: Message = {
          role: 'assistant',
          content: response,
          timestamp: new Date().toISOString()
        };
        
        await conversationService.addMessage(conversationId, aiMessage);
      }
    }
    
    return newMessage;
  },
  
  // Analyze conversation to determine optimal time for PPV content
  analyzeConversationForPPV: async (conversationId: string): Promise<boolean> => {
    const conversation = await conversationService.getConversationById(conversationId);
    if (!conversation) return false;
    
    const messages = conversation.messages;
    
    // Simple heuristic: If conversation has more than 5 messages and 
    // the last 3 messages have been exchanged in the last hour
    if (messages.length >= 5) {
      const recentMessages = messages.slice(-3);
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      
      const allRecent = recentMessages.every(msg => {
        const msgTime = new Date(msg.timestamp);
        return msgTime > oneHourAgo;
      });
      
      if (allRecent) {
        return true;
      }
    }
    
    return false;
  },
  
  // Initiate a conversation proactively
  initiateConversation: async (subscriberId: string, modelId: string): Promise<Conversation | null> => {
    // In a real implementation, this would check the best time to message based on user activity
    const openingLines = [
      "Hey there! I was just thinking about you...",
      "I just posted something new and thought you might want a sneak peek 😘",
      "Happy [day of week]! How's your day going?",
      "I'm feeling a bit lonely today... want to chat?",
      "I had a dream about you last night..."
    ];
    
    const randomOpening = openingLines[Math.floor(Math.random() * openingLines.length)];
    return conversationService.createConversation(subscriberId, modelId, randomOpening);
  }
};
