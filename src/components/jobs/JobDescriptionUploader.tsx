import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, X, FileUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

interface JobDescriptionUploaderProps {
  onParsedData: (data: {
    title?: string;
    description?: string;
    requirements?: string;
    responsibilities?: string;
    benefits?: string;
    minSalary?: string;
    maxSalary?: string;
    isRemote?: boolean;
    employmentType?: string;
  }) => void;
}

const JobDescriptionUploader: React.FC<JobDescriptionUploaderProps> = ({ onParsedData }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [parsing, setParsing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Check file type
    const fileType = selectedFile.type;
    if (
      fileType !== 'application/pdf' &&
      fileType !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' &&
      fileType !== 'application/msword'
    ) {
      setError('Please upload a PDF or Word document');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setFile(selectedFile);
    setError(null);
    setSuccess(false);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);
    setError(null);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate upload completion
    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      setUploading(false);
      setParsing(true);

      // Simulate parsing
      setTimeout(() => {
        setParsing(false);
        setSuccess(true);

        // Mock parsed data based on file name
        const mockParsedData = getMockParsedData(file.name);
        onParsedData(mockParsedData);

        toast({
          title: "Document Parsed Successfully",
          description: "The job description has been extracted and filled in the form.",
        });
      }, 1500);
    }, 2000);
  };

  const handleReset = () => {
    setFile(null);
    setUploading(false);
    setUploadProgress(0);
    setParsing(false);
    setSuccess(false);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Mock function to generate parsed data based on file name
  const getMockParsedData = (fileName: string) => {
    // Default data
    const data = {
      title: "Software Engineer",
      description: "We are looking for a skilled Software Engineer to join our development team. The ideal candidate will have experience in building high-quality, scalable applications and working with modern frameworks.",
      requirements: "Bachelor's degree in Computer Science or related field\n5+ years of experience in software development\nProficiency in JavaScript, TypeScript, and React\nExperience with RESTful APIs and microservices\nStrong problem-solving skills and attention to detail",
      responsibilities: "Design, develop, and maintain software applications\nCollaborate with cross-functional teams to define and implement new features\nWrite clean, maintainable, and efficient code\nTroubleshoot and debug applications\nStay up-to-date with emerging trends and technologies",
      benefits: "Competitive salary and benefits package\nFlexible work arrangements\nProfessional development opportunities\nModern office environment\nHealth and wellness programs",
      minSalary: "80000",
      maxSalary: "120000",
      isRemote: true,
      employmentType: "full-time"
    };

    // If filename contains "marketing", return marketing-related job
    if (fileName.toLowerCase().includes("marketing")) {
      return {
        title: "Marketing Manager",
        description: "We are seeking a talented Marketing Manager to lead our marketing initiatives. The ideal candidate will have a proven track record of developing successful marketing campaigns and driving brand awareness.",
        requirements: "Bachelor's degree in Marketing or related field\n5+ years of experience in marketing roles\nExcellent communication and presentation skills\nExperience with digital marketing platforms\nStrong analytical and project management skills",
        responsibilities: "Develop and implement marketing strategies\nManage marketing campaigns from concept to execution\nAnalyze market trends and competitor activities\nOversee social media and content marketing initiatives\nMeasure and report on performance of marketing campaigns",
        benefits: "Competitive salary and benefits package\nFlexible work arrangements\nProfessional development opportunities\nModern office environment\nHealth and wellness programs",
        minSalary: "75000",
        maxSalary: "110000",
        isRemote: false,
        employmentType: "full-time"
      };
    }

    // If filename contains "part-time" or "contract", adjust employment type
    if (fileName.toLowerCase().includes("part-time")) {
      data.employmentType = "part-time";
      data.minSalary = "40000";
      data.maxSalary = "60000";
    } else if (fileName.toLowerCase().includes("contract")) {
      data.employmentType = "contract";
      data.minSalary = "90000";
      data.maxSalary = "150000";
    }

    return data;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        />
        <Button 
          variant="outline" 
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || parsing}
        >
          <Upload className="h-4 w-4 mr-2" />
          Select File
        </Button>
        <Button 
          onClick={handleUpload} 
          disabled={!file || uploading || parsing || success}
        >
          <FileUp className="h-4 w-4 mr-2" />
          Upload & Parse
        </Button>
        {(file || error || success) && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleReset}
            disabled={uploading || parsing}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {file && (
        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB • {file.type.split('/')[1].toUpperCase()}
                  </p>
                </div>
              </div>
              <div>
                {success && <CheckCircle className="h-5 w-5 text-green-500" />}
                {error && <AlertCircle className="h-5 w-5 text-red-500" />}
              </div>
            </div>

            {uploading && (
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            {parsing && (
              <div className="mt-4 flex items-center space-x-2">
                <div className="animate-spin">
                  <Upload className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm">Parsing document...</span>
              </div>
            )}

            {success && (
              <div className="mt-4 text-sm text-green-600 flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                Document parsed successfully! Form has been filled with the extracted data.
              </div>
            )}

            {error && (
              <div className="mt-4 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                {error}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default JobDescriptionUploader;
