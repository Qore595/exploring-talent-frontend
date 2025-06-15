import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { useState } from 'react';

export type DownloadDialogProps = {
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
      transcript: string;
    };
  };
};

const DownloadDialog = ({
  isOpen,
  onClose,
  candidate,
}: DownloadDialogProps) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const generateReport = () => {
    const report = `TalentPulse Screening Report - ${candidate.name}

Position: ${candidate.position}
Date: ${format(candidate.results.interviewDate, 'MMMM d, yyyy')}
Duration: ${candidate.results.duration} minutes

Overall Score: ${candidate.results.score}%

Technical Skills: ${candidate.results.technical}%
Behavioral Skills: ${candidate.results.behavioral}%
Communication: ${candidate.results.communication}%
Problem Solving: ${candidate.results.problemSolving}%
Cultural Fit: ${candidate.results.culturalFit}%

Strengths:
${candidate.results.strengths.map((strength, index) => `${index + 1}. ${strength}`).join('\n')}

Areas for Improvement:
${candidate.results.weaknesses.map((weakness, index) => `${index + 1}. ${weakness}`).join('\n')}

Recommendations:
${candidate.results.recommendations.map((recommendation, index) => `${index + 1}. ${recommendation}`).join('\n')}

Transcript:
${candidate.results.transcript || 'No transcript available'}
`;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${candidate.name}-screening-report.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Download Screening Report</DialogTitle>
          <DialogDescription>
            Preview and download the screening report for {candidate.name}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Overall Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{candidate.results.score}%</div>
              <Progress value={candidate.results.score} className="h-2 mt-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Key Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Technical</span>
                  <span>{candidate.results.technical}%</span>
                </div>
                <Progress value={candidate.results.technical} className="h-2" />
                
                <div className="flex justify-between">
                  <span>Behavioral</span>
                  <span>{candidate.results.behavioral}%</span>
                </div>
                <Progress value={candidate.results.behavioral} className="h-2" />
                
                <div className="flex justify-between">
                  <span>Communication</span>
                  <span>{candidate.results.communication}%</span>
                </div>
                <Progress value={candidate.results.communication} className="h-2" />
                
                <div className="flex justify-between">
                  <span>Problem Solving</span>
                  <span>{candidate.results.problemSolving}%</span>
                </div>
                <Progress value={candidate.results.problemSolving} className="h-2" />
                
                <div className="flex justify-between">
                  <span>Cultural Fit</span>
                  <span>{candidate.results.culturalFit}%</span>
                </div>
                <Progress value={candidate.results.culturalFit} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-4 space-y-2">
          <h3 className="text-lg font-semibold">Strengths</h3>
          <div className="space-y-1">
            {candidate.results.strengths.map((strength, index) => (
              <Badge key={index} variant="outline">
                {strength}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="mt-4 space-y-2">
          <h3 className="text-lg font-semibold">Areas for Improvement</h3>
          <div className="space-y-1">
            {candidate.results.weaknesses.map((weakness, index) => (
              <Badge key={index} variant="destructive" className="bg-red-50 text-red-700">
                {weakness}
              </Badge>
            ))}
          </div>
        </div>
        
        <DialogFooter>
          <Button
            onClick={generateReport}
            disabled={isDownloading}
            className="w-full"
          >
            {isDownloading ? 'Downloading...' : 'Download Report'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Export the component as default
export default DownloadDialog;
