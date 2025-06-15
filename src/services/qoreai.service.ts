// QoreAI Service for handling conversation data and analysis
import apiClient from './api';

// Types for QoreAI API responses
export interface ConversationMessage {
  id: string;
  role: string;
  content?: string;
  text?: string;
  message?: string;
  transcript?: string;
  timespan?: {
    start: string;
    end: string;
  };
  [key: string]: any; // Allow for additional properties
}

export interface ConversationResponse {
  success: boolean;
  source: string;
  data: {
    next?: string | null;
    previous?: string | null;
    total: number;
    results: ConversationMessage[];
  };
  timestamp: string;
  qoreIntegrationVersion: string;
}

export interface ConversationAnalysis {
  totalMessages: number;
  agentMessages: number;
  customerMessages: number;
  duration: number;
  keyTopics: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
}

const commonWords = new Set([
  // Articles
  'a', 'an', 'the',
  
  // Common pronouns
  'i', 'me', 'my', 'mine', 'myself',
  'you', 'your', 'yours', 'yourself',
  'he', 'him', 'his', 'himself',
  'she', 'her', 'hers', 'herself',
  'it', 'its', 'itself',
  'we', 'us', 'our', 'ours', 'ourselves',
  'they', 'them', 'their', 'theirs', 'themselves',
  
  // Common prepositions
  'about', 'above', 'across', 'after', 'against', 'along', 'among', 'around', 'at', 
  'before', 'behind', 'below', 'beneath', 'beside', 'between', 'beyond', 'by',
  'concerning', 'considering', 'despite', 'down', 'during', 'except', 'for', 'from',
  'in', 'inside', 'into', 'like', 'near', 'of', 'off', 'on', 'onto', 'out', 'outside',
  'over', 'past', 'regarding', 'round', 'since', 'through', 'throughout', 'to', 'toward',
  'under', 'underneath', 'until', 'up', 'upon', 'with', 'within', 'without',
  
  // Common conjunctions
  'and', 'but', 'or', 'nor', 'for', 'so', 'yet',
  'after', 'although', 'as', 'because', 'before', 'if', 'since', 'than', 'that',
  'though', 'till', 'unless', 'until', 'when', 'where', 'whether', 'while',
  
  // Common auxiliary verbs
  'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'having',
  'do', 'does', 'did', 'doing',
  'can', 'could', 'may', 'might', 'must', 'shall', 'should', 'will', 'would',
  
  // Other common words
  'also', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such',
  'no', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can',
  'will', 'just', 'don', 'should', 'now', 'd', 'll', 'm', 'o', 're', 've', 'y', 'ain',
  'aren', 'couldn', 'didn', 'doesn', 'hadn', 'hasn', 'haven', 'isn', 'ma', 'mightn',
  'mustn', 'needn', 'shan', 'shouldn', 'wasn', 'weren', 'won', 'wouldn',
  
  // Common words from the conversation context
  'hello', 'hi', 'hey', 'thanks', 'thank', 'please', 'okay', 'ok', 'yes', 'no', 'maybe',
  'well', 'right', 'like', 'just', 'really', 'actually', 'basically', 'literally',
  'basically', 'exactly', 'probably', 'possibly', 'maybe', 'perhaps', 'usually',
  'often', 'sometimes', 'never', 'always', 'already', 'still', 'yet', 'even', 'also',
  'very', 'quite', 'rather', 'pretty', 'fairly', 'too', 'enough', 'much', 'many',
  'more', 'most', 'some', 'any', 'no', 'none', 'all', 'both', 'neither', 'either',
  'each', 'every', 'few', 'several', 'such', 'what', 'which', 'who', 'whom', 'whose',
  'this', 'that', 'these', 'those', 'here', 'there', 'when', 'where', 'why', 'how',
  'whence', 'wherever', 'whenever', 'however', 'whatever', 'whichever', 'whoever',
  'whomever', 'whosever', 'whether', 'while', 'whilst', 'although', 'though', 'even',
  'even if', 'even though', 'despite', 'in spite of', 'because', 'since', 'as',
  'because of', 'due to', 'so that', 'in order that', 'lest', 'unless', 'until',
  'till', 'when', 'whenever', 'while', 'where', 'wherever', 'after', 'before',
  'since', 'once', 'as soon as', 'as long as', 'till', 'until', 'by the time',
  'now that', 'in case', 'so that', 'in order that', 'that', 'if', 'unless',
  'provided that', 'supposing', 'as if', 'as though', 'as', 'because', 'since',
  'so', 'therefore', 'thus', 'hence', 'as a result', 'consequently', 'for this reason',
  'in order to', 'so as to', 'so that', 'in order that', 'lest', 'for fear that',
  'in case', 'provided that', 'providing that', 'on condition that', 'unless',
  'as long as', 'so long as', 'supposing', 'assuming', 'in case', 'given that',
  'in the event that', 'only if', 'whether or not', 'even if', 'as if', 'as though',
  'how', 'what', 'when', 'where', 'which', 'who', 'whom', 'whose', 'why', 'whether'
]);

// QoreAI service
export const qoreaiService = {
  // Get conversation messages for a screening
  // First fetches the screening to get the actual call ID, then fetches conversation data
  getConversationMessages: async (screeningId: string): Promise<ConversationResponse> => {
    try {
      console.log('Fetching conversation for screening ID:', screeningId);
      
      // First, get the screening record to find the actual call ID
      const screeningResponse = await apiClient.get(`/employee-interview-screenings/${screeningId}`);
      
      if (!screeningResponse.data.success || !screeningResponse.data.data) {
        throw new Error('Screening not found');
      }
      
      const screening = screeningResponse.data.data;
      const callId = screening.callid;
      
      if (!callId) {
        throw new Error('No call ID found for this screening');
      }
      
      console.log('Fetching conversation for call ID:', callId);
      
      // Now fetch the conversation data using the actual call ID
      const response = await apiClient.get(`/qoreai/calls/${callId}/messages`);
      console.log('QoreAI API response:', response.data);
      
      // Check if we have a transcript in the screening data that we can use
      if (screening.transcript) {
        console.log('Found transcript in screening data');
        // If we have a transcript, format it as a conversation message
        response.data.data = response.data.data || { results: [] };
        response.data.data.results = [
          {
            id: 'transcript-1',
            role: 'system',
            content: screening.transcript,
            timestamp: new Date().toISOString(),
            source: 'screening_transcript'
          }
        ];
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Error fetching conversation:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch conversation data');
    }
  },

  // Analyze conversation data to generate insights
  analyzeConversation: (messages: ConversationMessage[]): ConversationAnalysis => {
    if (!messages || messages.length === 0) {
      return {
        totalMessages: 0,
        agentMessages: 0,
        customerMessages: 0,
        duration: 0,
        keyTopics: [],
        sentiment: 'neutral'
      };
    }

    // Filter out system messages and empty content
    const validMessages = messages.filter(msg => 
      msg.role !== 'system' && (msg.content || msg.text || msg.message || msg.transcript)
    );

    const totalMessages = validMessages.length;
    const agentMessages = validMessages.filter(msg => 
      ['agent', 'assistant', 'system'].includes(msg.role?.toLowerCase() || '')
    ).length;
    
    const customerMessages = validMessages.filter(msg => 
      ['user', 'candidate', 'customer'].includes(msg.role?.toLowerCase() || '')
    );

    // Calculate actual duration from timestamps if available
    let duration = 0;
    if (messages.length > 1) {
      const sortedMessages = [...messages].sort((a, b) => 
        new Date(a.timestamp || 0).getTime() - new Date(b.timestamp || 0).getTime()
      );
      
      const firstMessage = sortedMessages[0];
      const lastMessage = sortedMessages[sortedMessages.length - 1];
      
      if (firstMessage.timestamp && lastMessage.timestamp) {
        const start = new Date(firstMessage.timestamp);
        const end = new Date(lastMessage.timestamp);
        duration = Math.round((end.getTime() - start.getTime()) / 1000); // in seconds
      }
    }
    
    // If we couldn't calculate duration, fall back to a reasonable estimate
    if (duration <= 0) {
      duration = Math.max(30, totalMessages * 15); // At least 30 seconds, ~15s per message
    }

    // Extract key topics using TF-IDF like approach
    const wordFrequency: Record<string, number> = {};
    const documentFrequency: Record<string, number> = {};
    
    validMessages.forEach(msg => {
      const content = (msg.content || msg.text || msg.message || msg.transcript || '').toLowerCase();
      if (!content) return;
      
      const words = content
        .replace(/[^\w\s]|_/g, '') // Remove punctuation
        .split(/\s+/)
        .filter(word => word.length > 3 && !commonWords.has(word));
      
      const uniqueWords = new Set(words);
      
      // Update document frequency (count in how many messages each word appears)
      uniqueWords.forEach(word => {
        documentFrequency[word] = (documentFrequency[word] || 0) + 1;
      });
      
      // Update term frequency (count in current message)
      words.forEach(word => {
        wordFrequency[word] = (wordFrequency[word] || 0) + 1;
      });
    });
    
    // Calculate TF-IDF scores
    const tfidfScores = Object.entries(wordFrequency).map(([word, count]) => {
      const tf = count / totalMessages; // Term frequency
      const idf = Math.log(validMessages.length / (documentFrequency[word] || 1)); // Inverse document frequency
      return { word, score: tf * idf };
    });
    
    // Sort by score and get top 5 key topics
    const keyTopics = tfidfScores
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(item => item.word);
    
    // Simple sentiment analysis based on word presence
    const positiveWords = ['great', 'excellent', 'good', 'impressive', 'well', 'perfect', 'amazing', 'wonderful'];
    const negativeWords = ['bad', 'poor', 'terrible', 'awful', 'disappointing', 'weak', 'concern'];
    
    let sentimentScore = 0;
    const allContent = validMessages
      .map(msg => (msg.content || msg.text || msg.message || msg.transcript || '').toLowerCase())
      .join(' ');
    
    positiveWords.forEach(word => {
      if (allContent.includes(word)) sentimentScore++;
    });
    
    negativeWords.forEach(word => {
      if (allContent.includes(word)) sentimentScore--;
    });
    
    const sentiment = sentimentScore > 0 ? 'positive' : sentimentScore < 0 ? 'negative' : 'neutral';
    
    return {
      totalMessages,
      agentMessages,
      customerMessages: customerMessages.length,
      duration,
      keyTopics: keyTopics.length > 0 ? keyTopics : ['No key topics identified'],
      sentiment
    };
  }
};

export default qoreaiService;