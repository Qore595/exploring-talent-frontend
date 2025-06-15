// Type declarations for screening components
declare module './DownloadDialog' {
  import { FC } from 'react';
  
  export interface DownloadDialogProps {
    isOpen: boolean;
    onClose: () => void;
    candidate: {
      id: string;
      name: string;
      position: string;
      results: {
        technical: number;
        behavioral: number;
        communication: number;
        problemSolving: number;
        culturalFit: number;
        score: number;
        interviewDate: Date;
        duration: number;
        strengths: string[];
        weaknesses: string[];
        recommendations: string[];
        transcript?: string;
      };
    };
  }
  
  const DownloadDialog: FC<DownloadDialogProps>;
  export default DownloadDialog;
}

declare module './ComparisonDialog' {
  import { FC } from 'react';
  
  export interface ConversationMessage {
    id?: string;
    role: 'agent' | 'customer' | string;
    content: string;
    timestamp?: string;
    timespan?: {
      start: string;
      end: string;
    };
  }
  
  export interface ComparisonDialogProps {
    isOpen: boolean;
    onClose: () => void;
    candidate: {
      id: string;
      name: string;
      position: string;
      email?: string;
      score?: number;
      feedback?: string;
      results?: {
        technical: number;
        behavioral: number;
        communication: number;
        problemSolving: number;
        culturalFit: number;
        score: number;
        interviewDate?: Date;
        duration?: number;
        strengths?: string[];
        weaknesses?: string[];
        recommendations?: string[];
        transcript?: string;
      };
    };
  }
  
  const ComparisonDialog: FC<ComparisonDialogProps>;
  export default ComparisonDialog;
}
