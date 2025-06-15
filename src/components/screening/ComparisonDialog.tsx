import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export type ComparisonDialogProps = {
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
};

const ComparisonDialog = ({
  isOpen,
  onClose,
  candidate,
}: ComparisonDialogProps) => {
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [comparisonData, setComparisonData] = useState<any[]>([]);

  const handleCompare = () => {
    if (!candidate.results) {
      toast({
        title: 'No results available',
        description: 'Candidate screening results are not yet available.',
        variant: 'destructive',
      });
      return;
    }

    // Fetch comparison data for selected candidates
    const mockData = [
      {
        name: candidate.name,
        technical: candidate.results?.technical || 0,
        behavioral: candidate.results?.behavioral || 0,
        communication: candidate.results?.communication || 0,
        problemSolving: candidate.results?.problemSolving || 0,
        culturalFit: candidate.results?.culturalFit || 0,
        score: candidate.results?.score || 0,
        position: candidate.position,
      },
    ];
    setComparisonData(mockData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Compare Candidates</DialogTitle>
          <DialogDescription>
            Compare {candidate.name} with other candidates
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Candidate selection */}
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Select Candidates</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCandidates.includes(candidate.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedCandidates([...selectedCandidates, candidate.id]);
                    } else {
                      setSelectedCandidates(
                        selectedCandidates.filter((id) => id !== candidate.id)
                      );
                    }
                  }}
                  className="rounded border-gray-300 text-primary h-4 w-4"
                />
                <span className="font-medium">{candidate.name}</span>
                <span className="text-sm text-gray-500">({candidate.position})</span>
              </label>
            </div>
          </div>

          {/* Comparison results */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Comparison Results</h3>
              <Button 
                onClick={handleCompare}
                disabled={selectedCandidates.length === 0}
                className="flex items-center gap-2"
              >
                Compare Selected
              </Button>
            </div>

            {comparisonData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {comparisonData.map((data) => (
                  <Card key={data.name} className="shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{data.name}</CardTitle>
                      <p className="text-sm text-gray-500">{candidate.position}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Technical</span>
                          <span className="font-medium">{data.technical}%</span>
                        </div>
                        <Progress value={data.technical} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Behavioral</span>
                          <span className="font-medium">{data.behavioral}%</span>
                        </div>
                        <Progress value={data.behavioral} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Communication</span>
                          <span className="font-medium">{data.communication}%</span>
                        </div>
                        <Progress value={data.communication} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Problem Solving</span>
                          <span className="font-medium">{data.problemSolving}%</span>
                        </div>
                        <Progress value={data.problemSolving} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Cultural Fit</span>
                          <span className="font-medium">{data.culturalFit}%</span>
                        </div>
                        <Progress value={data.culturalFit} className="h-2" />
                      </div>
                      
                      <div className="pt-2 mt-4 border-t">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Overall Score</span>
                          <div className="text-2xl font-bold text-primary">
                            {data.score}%
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Select candidates and click "Compare" to see the results</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ComparisonDialog;
