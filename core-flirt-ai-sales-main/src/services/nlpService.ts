
import { Message } from '@/types/supabase';
import { supabase } from '@/integrations/supabase/client';

export const nlpService = {
  // Generate appropriate response based on conversation context
  generateResponse: async (
    conversationHistory: Message[],
    modelBio: Record<string, any>,
    noGoTopics: string[]
  ): Promise<string> => {
    // In a real implementation, this would call an NLP API
    console.log('Generating response based on:', { conversationHistory, modelBio, noGoTopics });
    
    // Filter out messages containing no-go topics
    const lastMessage = conversationHistory[conversationHistory.length - 1];
    if (lastMessage && lastMessage.role === 'user') {
      const containsNoGoTopic = noGoTopics.some(topic => 
        lastMessage.content.toLowerCase().includes(topic.toLowerCase())
      );
      
      if (containsNoGoTopic) {
        return "I'd prefer not to talk about that. Tell me about your day instead?";
      }
    }
    
    // In production, we would call an actual AI model (Llama 3, GPT, etc.)
    // that's been fine-tuned on the model's historical DMs
    
    // We would pass:
    // 1. The conversation history for context
    // 2. The model's bio/personality data
    // 3. Response style parameters (flirtiness level, emoji frequency, etc.)
    
    // Mock personalized responses based on bio and style
    const personalizedResponses = getPersonalizedResponses(modelBio);
    
    // In a real implementation, we'd analyze the conversation context
    // to select an appropriate response category
    return personalizedResponses[Math.floor(Math.random() * personalizedResponses.length)];
  },
  
  // Match content based on conversation context
  matchContentToConversation: async (
    conversationHistory: Message[],
    modelId: string,
    keywords: string[] = []
  ): Promise<string | null> => {
    console.log('Matching content for keywords:', keywords);
    
    // Extract potential keywords from the last few messages
    const recentMessages = conversationHistory.slice(-3);
    const extractedKeywords = recentMessages.flatMap(msg => {
      const words = msg.content.toLowerCase().split(/\s+/);
      return words.filter(word => word.length > 3); // Simple keyword extraction
    });
    
    // Combine extracted keywords with provided keywords
    const allKeywords = [...new Set([...extractedKeywords, ...keywords])];
    
    // Query content based on keywords
    if (allKeywords.length > 0) {
      const { data: matchedContent } = await supabase
        .from('content')
        .select('id')
        .eq('model_id', modelId)
        .contains('keywords', allKeywords)
        .limit(1);
      
      return matchedContent && matchedContent.length > 0 ? matchedContent[0].id : null;
    }
    
    return null;
  },
  
  // Import and analyze historical DMs to learn model's style
  importHistoricalDMs: async (
    modelId: string,
    dmHistory: any[]
  ): Promise<boolean> => {
    console.log(`Importing ${dmHistory.length} historical messages for model ${modelId}`);
    
    // In production, we would:
    // 1. Process the DM history for patterns (emoji usage, sentence length, vocabulary, etc.)
    // 2. Extract key phrases and responses
    // 3. Use this data to fine-tune a language model
    // 4. Store the model's style parameters in the database
    
    // Mock implementation - store basic style parameters
    const styleParameters = analyzeModelStyle(dmHistory);
    
    // Store the style parameters in the model's preferences
    const { error } = await supabase
      .from('models')
      .update({
        preferences: {
          ...styleParameters,
          lastUpdated: new Date().toISOString()
        }
      })
      .eq('id', modelId);
    
    return !error;
  },
  
  // Analyze sentiment in subscriber messages
  analyzeSubscriberSentiment: (message: string): Record<string, number> => {
    // In production, this would use a real sentiment analysis model
    // For now, we'll use a simple keyword-based approach
    
    const sentiments = {
      excited: 0,
      interested: 0,
      hesitant: 0,
      negative: 0
    };
    
    const excitedKeywords = ['wow', 'amazing', 'awesome', 'yes', 'please', 'love', '!', '😍', '🔥'];
    const interestedKeywords = ['what', 'how', 'tell', 'show', 'more', '?', 'interested', 'curious'];
    const hesitantKeywords = ['maybe', 'idk', 'i don\'t know', 'not sure', 'expensive', 'cost', 'later'];
    const negativeKeywords = ['no', 'don\'t', 'won\'t', 'can\'t', 'expensive', 'too much'];
    
    const lowerMessage = message.toLowerCase();
    
    excitedKeywords.forEach(keyword => {
      if (lowerMessage.includes(keyword)) sentiments.excited += 1;
    });
    
    interestedKeywords.forEach(keyword => {
      if (lowerMessage.includes(keyword)) sentiments.interested += 1;
    });
    
    hesitantKeywords.forEach(keyword => {
      if (lowerMessage.includes(keyword)) sentiments.hesitant += 1;
    });
    
    negativeKeywords.forEach(keyword => {
      if (lowerMessage.includes(keyword)) sentiments.negative += 1;
    });
    
    return sentiments;
  },
  
  // Determine optimal time to send PPV content
  determinePPVOpportunity: (
    conversationHistory: Message[],
    subscriberSentiment: Record<string, number>
  ): boolean => {
    // In production, this would use a machine learning model trained on successful PPV interactions
    // For now, we use heuristics:
    
    // 1. Check message count (don't send PPV too early)
    if (conversationHistory.length < 4) return false;
    
    // 2. Check subscriber sentiment (prefer excited or interested)
    if (subscriberSentiment.negative > 1 || subscriberSentiment.hesitant > 2) return false;
    if (subscriberSentiment.excited < 1 && subscriberSentiment.interested < 1) return false;
    
    // 3. Check time since last PPV attempt
    const lastPPVAttempt = conversationHistory.findIndex(msg => 
      msg.role === 'assistant' && msg.content.includes('PPV')
    );
    
    if (lastPPVAttempt !== -1) {
      const messagesSinceLastPPV = conversationHistory.length - lastPPVAttempt;
      if (messagesSinceLastPPV < 8) return false; // Don't send PPV again too soon
    }
    
    // Random factor to avoid being too predictable (30% chance when other conditions met)
    return Math.random() > 0.7;
  }
};

// Helper functions

function getPersonalizedResponses(modelBio: Record<string, any>): string[] {
  // Generate responses that match the model's persona
  // In production, these would be generated by the fine-tuned language model
  
  // Extract style information from the model's bio
  const useEmojis = modelBio.preferences?.emojiFrequency === 'high';
  const flirtLevel = modelBio.preferences?.flirtLevel || 'medium';
  
  // Base responses
  let responses = [
    "I've been thinking about you recently...",
    "How's your day going?",
    "I just got done with a photoshoot and wanted to say hi",
    "You always know what to say to make me smile",
    "I'm feeling a bit lonely tonight"
  ];
  
  // Personalize based on flirt level
  if (flirtLevel === 'high') {
    responses = responses.concat([
      "I just got out of the shower and I'm feeling a bit lonely...",
      "I have a special video for you that I think you'll really enjoy",
      "What are you wearing right now?",
      "I've got something special to show you if you're interested..."
    ]);
  }
  
  // Add emojis if the model uses them frequently
  if (useEmojis) {
    responses = responses.map(response => {
      const emojis = ['😘', '💋', '❤️', '😍', '🔥', '👀', '💦'];
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      return `${response} ${randomEmoji}`;
    });
  }
  
  return responses;
}

function analyzeModelStyle(dmHistory: any[]): Record<string, any> {
  // Analyze the model's messaging style from historical DMs
  // In production, this would be a sophisticated ML process
  
  // Count emojis
  let emojiCount = 0;
  const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;
  
  // Count message characteristics
  let totalMessages = 0;
  let totalWords = 0;
  let totalChars = 0;
  let flirtyPhraseCount = 0;
  
  const flirtyPhrases = [
    'babe', 'sexy', 'hot', 'love', 'miss', 'kiss', 'touch', 'feel',
    'body', 'special', 'private', 'just for you', 'thinking of you'
  ];
  
  dmHistory.forEach(dm => {
    if (dm.role === 'assistant') {
      totalMessages++;
      
      const content = dm.content || '';
      const words = content.split(/\s+/).filter(Boolean);
      totalWords += words.length;
      totalChars += content.length;
      
      // Count emojis
      const emojis = content.match(emojiRegex);
      if (emojis) emojiCount += emojis.length;
      
      // Count flirty phrases
      flirtyPhrases.forEach(phrase => {
        if (content.toLowerCase().includes(phrase)) flirtyPhraseCount++;
      });
    }
  });
  
  // Calculate style parameters
  const avgMessageLength = totalMessages ? totalWords / totalMessages : 0;
  const emojiFrequency = totalMessages ? emojiCount / totalMessages : 0;
  const flirtiness = totalMessages ? flirtyPhraseCount / totalMessages : 0;
  
  return {
    avgMessageLength,
    emojiFrequency: emojiFrequency > 0.5 ? 'high' : emojiFrequency > 0.1 ? 'medium' : 'low',
    flirtLevel: flirtiness > 0.5 ? 'high' : flirtiness > 0.2 ? 'medium' : 'low',
    messageComplexity: avgMessageLength > 15 ? 'high' : avgMessageLength > 8 ? 'medium' : 'low'
  };
}
