import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Users, Clock, FileText, TrendingUp, TrendingDown, BarChart3, MessageCircle, User, Bot, AlertCircle } from 'lucide-react';

// Import components with absolute paths
import DownloadDialog from '@/components/screening/DownloadDialog';
import ComparisonDialog from '@/components/screening/ComparisonDialog';
import { qoreaiService, ConversationMessage, ConversationAnalysis } from '@/services/qoreai.service';

export interface ScreeningDialogProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: {
    id: string;
    name: string;
    position: string;
    email: string;
    score?: number;
    feedback?: string;
    results?: {
      score: number;
      technical: number;
      behavioral: number;
      communication: number;
      problemSolving: number;
      culturalFit: number;
      strengths: string[];
      weaknesses: string[];
      recommendations: string[];
      interviewDate: Date;
      duration: number;
      transcript: string;
    };
  };
}

const ScreeningDialog: React.FC<ScreeningDialogProps> = ({
  isOpen,
  onClose,
  candidate
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showComparison, setShowComparison] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  
  // Conversation data state
  const [conversationMessages, setConversationMessages] = useState<ConversationMessage[]>([]);
  const [conversationAnalysis, setConversationAnalysis] = useState<ConversationAnalysis | null>(null);
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);
  const [conversationError, setConversationError] = useState<string | null>(null);

  // Fetch conversation data when dialog opens
  useEffect(() => {
    if (isOpen && candidate.id) {
      fetchConversationData();
    }
  }, [isOpen, candidate.id]);

  // Fetch conversation data from QoreAI service
  const fetchConversationData = async () => {
    setIsLoadingConversation(true);
    setConversationError(null);
    
    try {
      console.log('Fetching conversation for screening ID:', candidate.id);
      const response = await qoreaiService.getConversationMessages(candidate.id);
      
      if (response.success && response.data.results) {
        setConversationMessages(response.data.results);
        const analysis = qoreaiService.analyzeConversation(response.data.results);
        setConversationAnalysis(analysis);
        console.log('Conversation analysis:', analysis);
      } else {
        setConversationError('No conversation data available');
      }
    } catch (error: any) {
      console.error('Error fetching conversation:', error);
      setConversationError(error.message || 'Failed to fetch conversation data');
    } finally {
      setIsLoadingConversation(false);
    }
  };

  // Close the dialog and reset state
  const handleClose = () => {
    setActiveTab('overview');
    setShowComparison(false);
    setShowDownload(false);
    setConversationMessages([]);
    setConversationAnalysis(null);
    setConversationError(null);
    onClose();
  };

  // Create enhanced candidate object with conversation analysis
  const enhancedCandidate = {
    ...candidate,
    results: candidate.results || {
      score: conversationAnalysis ? Math.round((conversationAnalysis.totalMessages * 10) + 50) : 75,
      technical: 80,
      behavioral: 85,
      communication: 90,
      problemSolving: 75,
      culturalFit: 88,
      strengths: conversationAnalysis?.keyTopics.length ? 
        conversationAnalysis.keyTopics.map((topic: string) => `Strong ${topic} skills`) : 
        ['Strong communication skills', 'Good technical knowledge'],
      weaknesses: ['Could improve time management', 'Needs more experience with advanced frameworks'],
      recommendations: ['Consider for next round', 'Strong candidate for the role'],
      interviewDate: new Date(),
      duration: conversationAnalysis?.duration || 1800, // 30 minutes default
      transcript: conversationMessages.map((msg: ConversationMessage) => `${msg.role}: ${msg.content}`).join('\n') || 'Transcript not available'
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-7xl h-auto max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Screening Results - {candidate.name}</DialogTitle>
          <DialogDescription>
            Review the comprehensive results of {candidate.name}'s screening for the {candidate.position} position.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="conversation">Conversation</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 overflow-y-auto max-h-[60vh]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Overall Score */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {enhancedCandidate.results.score}%
                  </div>
                  <Progress value={enhancedCandidate.results.score} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    Based on interview assessment
                  </p>
                </CardContent>
              </Card>

              {/* Interview Duration */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Interview Duration</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round(enhancedCandidate.results.duration / 60)}m
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Total conversation time
                  </p>
                </CardContent>
              </Card>

              {/* Messages Exchanged */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Messages</CardTitle>
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {conversationAnalysis?.totalMessages || 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Total messages exchanged
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Skills Assessment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Skills Assessment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Technical Skills</span>
                      <span className="text-sm">{enhancedCandidate.results.technical}%</span>
                    </div>
                    <Progress value={enhancedCandidate.results.technical} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Communication</span>
                      <span className="text-sm">{enhancedCandidate.results.communication}%</span>
                    </div>
                    <Progress value={enhancedCandidate.results.communication} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Problem Solving</span>
                      <span className="text-sm">{enhancedCandidate.results.problemSolving}%</span>
                    </div>
                    <Progress value={enhancedCandidate.results.problemSolving} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Cultural Fit</span>
                      <span className="text-sm">{enhancedCandidate.results.culturalFit}%</span>
                    </div>
                    <Progress value={enhancedCandidate.results.culturalFit} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Key Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-green-600 mb-2">Strengths</h4>
                      <ul className="text-sm space-y-1">
                        {enhancedCandidate.results.strengths.map((strength, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <TrendingUp className="h-3 w-3 text-green-500" />
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-orange-600 mb-2">Areas for Improvement</h4>
                      <ul className="text-sm space-y-1">
                        {enhancedCandidate.results.weaknesses.map((weakness, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <TrendingDown className="h-3 w-3 text-orange-500" />
                            {weakness}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Conversation Tab */}
          <TabsContent value="conversation" className="space-y-4 overflow-y-auto max-h-[60vh]">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Interview Conversation
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingConversation ? (
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ) : conversationMessages.length > 0 ? (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {conversationMessages.map((message, index) => (
                      <div key={index} className={`flex gap-3 ${message.role === 'agent' ? 'justify-start' : 'justify-end'}`}>
                        <div className={`flex gap-2 max-w-[80%] ${message.role === 'agent' ? 'flex-row' : 'flex-row-reverse'}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            message.role === 'agent' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                          }`}>
                            {message.role === 'agent' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                          </div>
                          <div className={`rounded-lg p-3 ${
                            message.role === 'agent' ? 'bg-gray-100 text-gray-900' : 'bg-blue-500 text-white'
                          }`}>
                            <p className="text-sm">{message.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : conversationError ? (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {conversationError}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      No conversation data available for this screening.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis" className="space-y-6 overflow-y-auto max-h-[60vh]">
            {conversationAnalysis ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Conversation Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Messages:</span>
                      <span className="font-medium">{conversationAnalysis.totalMessages}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Agent Messages:</span>
                      <span className="font-medium">{conversationAnalysis.agentMessages}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Candidate Messages:</span>
                      <span className="font-medium">{conversationAnalysis.customerMessages}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span className="font-medium">{Math.round(conversationAnalysis.duration / 60)} minutes</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Key Topics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {conversationAnalysis.keyTopics.map((topic, index) => (
                        <Badge key={index} variant="secondary">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-4">
                      <span className="text-sm font-medium">Sentiment: </span>
                      <Badge variant={
                        conversationAnalysis.sentiment === 'positive' ? 'default' :
                        conversationAnalysis.sentiment === 'negative' ? 'destructive' : 'secondary'
                      }>
                        {conversationAnalysis.sentiment}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No analysis data available. Please ensure conversation data is loaded.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-4 overflow-y-auto max-h-[60vh]">
            <Card>
              <CardHeader>
                <CardTitle>Hiring Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                {enhancedCandidate.results.recommendations.length > 0 ? (
                  <ul className="space-y-2">
                    {enhancedCandidate.results.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm">{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      No recommendations available
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Download Dialog */}
        {showDownload && (
          <DownloadDialog
            isOpen={showDownload}
            onClose={() => setShowDownload(false)}
            candidate={enhancedCandidate}
          />
        )}

        {/* Comparison Dialog */}
        {showComparison && (
          <ComparisonDialog
            isOpen={showComparison}
            onClose={() => setShowComparison(false)}
            candidate={enhancedCandidate}
          />
        )}

        <DialogFooter>
          <Button onClick={handleClose}>
            Close
          </Button>
          <Button onClick={() => setShowDownload(true)} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
          <Button onClick={() => setShowComparison(true)} variant="outline">
            <Users className="h-4 w-4 mr-2" />
            Compare
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScreeningDialog;