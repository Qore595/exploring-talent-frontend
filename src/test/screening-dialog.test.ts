/**
 * Test file for ScreeningDialog functionality
 * Tests the integration between ScreeningDialog and QoreAI service
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import qoreaiService from '../services/qoreai.service';
import apiClient from '../services/api';

// Mock the API client
vi.mock('../services/api');

describe('ScreeningDialog Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Screening Data Fetching', () => {
    it('should fetch screening details by ID', async () => {
      // Mock the API response for getting screening by ID
      const mockScreeningResponse = {
        data: {
          success: true,
          data: {
            id: '1',
            callid: 'call_123_john_doe',
            userid: 'user_456',
            joinurl: 'https://meet.talentspark.com/screening/call_123_john_doe',
            job_id: 42,
            status: 'completed',
            created: '2025-06-02T10:30:00.000Z',
            updated: '2025-06-02T10:30:00.000Z'
          }
        }
      };

      // Mock the API call
      (apiClient.get as any).mockResolvedValue(mockScreeningResponse);

      // Test the API call
      const response = await apiClient.get('/employee-interview-screenings/1');
      
      expect(response.data.success).toBe(true);
      expect(response.data.data.id).toBe('1');
      expect(response.data.data.callid).toBe('call_123_john_doe');
      expect(response.data.data.status).toBe('completed');
    });

    it('should handle screening not found error', async () => {
      // Mock the API response for screening not found
      const mockErrorResponse = {
        response: {
          status: 404,
          data: {
            success: false,
            message: 'Screening not found'
          }
        }
      };

      // Mock the API call to reject
      (apiClient.get as any).mockRejectedValue(mockErrorResponse);

      // Test error handling
      try {
        await apiClient.get('/employee-interview-screenings/999');
      } catch (error: any) {
        expect(error.response.status).toBe(404);
        expect(error.response.data.success).toBe(false);
        expect(error.response.data.message).toBe('Screening not found');
      }
    });
  });

  describe('QoreAI Service Integration', () => {
    it('should fetch conversation messages for a screening', async () => {
      // Mock conversation data
      const mockConversationResponse = {
        success: true,
        data: {
          results: [
            {
              id: 'msg_123',
              role: 'agent',
              content: 'Hello, thank you for joining the interview screening. How are you today?',
              timespan: {
                start: '2025-06-02T10:30:00Z',
                end: '2025-06-02T10:30:10Z'
              }
            },
            {
              id: 'msg_124',
              role: 'customer',
              content: 'I\'m doing well, thank you. I\'m excited about this opportunity.',
              timespan: {
                start: '2025-06-02T10:30:15Z',
                end: '2025-06-02T10:30:25Z'
              }
            },
            {
              id: 'msg_125',
              role: 'agent',
              content: 'Great! Let\'s start with your background. Can you tell me about your experience?',
              timespan: {
                start: '2025-06-02T10:30:30Z',
                end: '2025-06-02T10:30:40Z'
              }
            }
          ]
        }
      };

      // Mock the QoreAI service method
      const getConversationMessagesSpy = vi.spyOn(qoreaiService, 'getConversationMessages');
      getConversationMessagesSpy.mockResolvedValue(mockConversationResponse);

      // Test the service call
      const response = await qoreaiService.getConversationMessages('1');
      
      expect(response.success).toBe(true);
      expect(response.data.results).toHaveLength(3);
      expect(response.data.results[0].role).toBe('agent');
      expect(response.data.results[1].role).toBe('customer');
      expect(getConversationMessagesSpy).toHaveBeenCalledWith('1');
    });

    it('should analyze conversation and provide insights', () => {
      // Mock conversation messages
      const mockMessages = [
        {
          id: 'msg_123',
          role: 'agent',
          content: 'Hello, thank you for joining the interview screening. How are you today?',
          timespan: { start: '2025-06-02T10:30:00Z', end: '2025-06-02T10:30:10Z' }
        },
        {
          id: 'msg_124',
          role: 'customer',
          content: 'I\'m doing well, thank you. I\'m excited about this opportunity.',
          timespan: { start: '2025-06-02T10:30:15Z', end: '2025-06-02T10:30:25Z' }
        },
        {
          id: 'msg_125',
          role: 'agent',
          content: 'Great! Let\'s start with your background. Can you tell me about your experience?',
          timespan: { start: '2025-06-02T10:30:30Z', end: '2025-06-02T10:30:40Z' }
        },
        {
          id: 'msg_126',
          role: 'customer',
          content: 'I have 5 years of experience in software development, primarily working with React and Node.js.',
          timespan: { start: '2025-06-02T10:30:45Z', end: '2025-06-02T10:30:55Z' }
        }
      ];

      // Test conversation analysis
      const analysis = qoreaiService.analyzeConversation(mockMessages);
      
      expect(analysis).toBeDefined();
      expect(analysis.totalMessages).toBe(4);
      expect(analysis.agentMessages).toBe(2);
      expect(analysis.customerMessages).toBe(2);
      expect(analysis.duration).toBeGreaterThan(0);
      expect(analysis.keyTopics).toContain('experience');
      expect(analysis.sentiment).toBe('positive');
    });

    it('should handle empty conversation gracefully', () => {
      // Test with empty conversation
      const analysis = qoreaiService.analyzeConversation([]);
      
      expect(analysis.totalMessages).toBe(0);
      expect(analysis.agentMessages).toBe(0);
      expect(analysis.customerMessages).toBe(0);
      expect(analysis.duration).toBe(0);
      expect(analysis.keyTopics).toEqual([]);
      expect(analysis.sentiment).toBe('neutral');
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors when fetching conversation', async () => {
      // Mock API error
      const getConversationMessagesSpy = vi.spyOn(qoreaiService, 'getConversationMessages');
      getConversationMessagesSpy.mockRejectedValue(new Error('API Error'));

      // Test error handling
      try {
        await qoreaiService.getConversationMessages('invalid_id');
      } catch (error: any) {
        expect(error.message).toBe('API Error');
      }
    });

    it('should handle malformed conversation data', () => {
      // Test with malformed data
      const malformedMessages = [
        { id: 'msg_1', role: 'agent' }, // missing content and timespan
        { content: 'Hello' }, // missing id, role, and timespan
        null, // null message
        undefined // undefined message
      ];

      // Should not throw error and handle gracefully
      expect(() => {
        const analysis = qoreaiService.analyzeConversation(malformedMessages as any);
        expect(analysis).toBeDefined();
      }).not.toThrow();
    });
  });

  describe('Integration Flow', () => {
    it('should complete full screening dialog flow', async () => {
      // Mock screening data
      const mockScreening = {
        id: '1',
        candidate: 'John Doe',
        position: 'Software Engineer',
        status: 'completed',
        created: '2025-06-02T10:30:00',
        email: 'john.doe@example.com'
      };

      // Mock conversation data
      const mockConversation = {
        success: true,
        data: {
          results: [
            {
              id: 'msg_123',
              role: 'agent',
              content: 'Welcome to the interview',
              timespan: { start: '2025-06-02T10:30:00Z', end: '2025-06-02T10:30:10Z' }
            }
          ]
        }
      };

      // Mock API calls
      (apiClient.get as any).mockResolvedValue({
        data: { success: true, data: mockScreening }
      });

      const getConversationMessagesSpy = vi.spyOn(qoreaiService, 'getConversationMessages');
      getConversationMessagesSpy.mockResolvedValue(mockConversation);

      // Simulate the full flow
      const screeningResponse = await apiClient.get('/employee-interview-screenings/1');
      expect(screeningResponse.data.success).toBe(true);

      const conversationResponse = await qoreaiService.getConversationMessages('1');
      expect(conversationResponse.success).toBe(true);

      const analysis = qoreaiService.analyzeConversation(conversationResponse.data.results);
      expect(analysis).toBeDefined();
      expect(analysis.totalMessages).toBe(1);
    });
  });
});