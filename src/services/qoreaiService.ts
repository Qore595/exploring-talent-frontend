// QoreAI Service for handling conversation data and analysis
import apiClient from './api';

// Types for QoreAI API responses
export interface ConversationMessage {
  role: string;
  text: string;
  medium: string;
  callStageId: string;
  callStageMessageIndex: number;
  timespan?: {
    start: string;
    end: string;
  };
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
  userMessages: number;
  agentMessages: number;
  averageResponseTime: string;
  conversationDuration: string;
  technicalSkillsScore: number;
  communicationScore: number;
  problemSolvingScore: number;
  overallScore: number;
  keyTopics: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
}

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
        userMessages: 0,
        agentMessages: 0,
        averageResponseTime: '0s',
        conversationDuration: '0s',
        technicalSkillsScore: 0,
        communicationScore: 0,
        problemSolvingScore: 0,
        overallScore: 0,
        keyTopics: [],
        sentiment: 'neutral'
      };
    }

    const userMessages = messages.filter(msg => msg.role === 'MESSAGE_ROLE_USER').length;
    const agentMessages = messages.filter(msg => msg.role === 'MESSAGE_ROLE_AGENT').length;

    // Calculate conversation duration
    const firstMessage = messages[0];
    const lastMessage = messages[messages.length - 1];
    let duration = '0s';
    
    if (firstMessage?.timespan?.start && lastMessage?.timespan?.end) {
      const startTime = parseFloat(firstMessage.timespan.start.replace('s', ''));
      const endTime = parseFloat(lastMessage.timespan.end.replace('s', ''));
      duration = `${(endTime - startTime).toFixed(1)}s`;
    }

    // Simple analysis based on conversation content
    const allText = messages.map(msg => msg.text.toLowerCase()).join(' ');
    
    // Technical skills scoring (basic keyword analysis)
    const technicalKeywords = ['technical', 'programming', 'code', 'software', 'development', 'algorithm', 'database', 'api', 'framework'];
    const technicalScore = Math.min(100, technicalKeywords.filter(keyword => allText.includes(keyword)).length * 20);

    // Communication scoring (based on message length and clarity)
    const avgMessageLength = messages.reduce((sum, msg) => sum + msg.text.length, 0) / messages.length;
    const communicationScore = Math.min(100, Math.max(20, avgMessageLength / 2));

    // Problem solving scoring (based on question-answer patterns)
    const problemSolvingScore = Math.min(100, userMessages * 15 + agentMessages * 10);

    // Overall score
    const overallScore = Math.round((technicalScore + communicationScore + problemSolvingScore) / 3);

    // Extract key topics (simple keyword extraction)
    const keyTopics = ['Communication Skills', 'Technical Knowledge', 'Problem Solving'];
    if (allText.includes('experience')) keyTopics.push('Work Experience');
    if (allText.includes('project')) keyTopics.push('Project Discussion');

    // Sentiment analysis (basic)
    const positiveWords = ['good', 'great', 'excellent', 'yes', 'sure', 'definitely'];
    const negativeWords = ['no', 'bad', 'difficult', 'problem', 'issue'];
    const positiveCount = positiveWords.filter(word => allText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => allText.includes(word)).length;
    
    let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
    if (positiveCount > negativeCount) sentiment = 'positive';
    else if (negativeCount > positiveCount) sentiment = 'negative';

    return {
      totalMessages: messages.length,
      userMessages,
      agentMessages,
      averageResponseTime: '2.5s', // Default for now
      conversationDuration: duration,
      technicalSkillsScore: Math.round(technicalScore),
      communicationScore: Math.round(communicationScore),
      problemSolvingScore: Math.round(problemSolvingScore),
      overallScore,
      keyTopics,
      sentiment
    };
  }
};

export default qoreaiService;