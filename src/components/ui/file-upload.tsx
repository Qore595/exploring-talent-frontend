import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { FileText, X, Download } from 'lucide-react';

interface FileUploadProps {
  accept?: string;
  maxSize?: number; // in bytes
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  onFileChange?: (file: File | null) => void;
}

export function FileUpload({
  accept = '.pdf,.doc,.docx',
  maxSize = 5 * 1024 * 1024, // 5MB default
  label = 'Upload File',
  value,
  onChange,
  onFileChange,
}: FileUploadProps) {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string>(value || '');
  const [fileName, setFileName] = useState<string>('');

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size
    if (file.size > maxSize) {
      toast({
        title: 'File too large',
        description: `Please upload a file smaller than ${Math.round(maxSize / (1024 * 1024))}MB`,
        variant: 'destructive',
      });
      return;
    }

    // Create a local URL for the file
    const url = URL.createObjectURL(file);
    console.log('Created local URL for file:', url);

    // Update state
    setSelectedFile(file);
    setFileUrl(url);
    setFileName(file.name);

    // Call onChange handlers
    if (onChange) onChange(url);
    if (onFileChange) onFileChange(file);

    toast({
      title: 'File uploaded',
      description: `${file.name} has been uploaded successfully`,
    });
  };

  // Clear the selected file
  const clearFile = () => {
    if (fileUrl && fileUrl.startsWith('blob:')) {
      URL.revokeObjectURL(fileUrl);
    }
    setSelectedFile(null);
    setFileUrl('');
    setFileName('');
    
    // Call onChange handlers
    if (onChange) onChange('');
    if (onFileChange) onFileChange(null);
  };

  // View the file
  const viewFile = () => {
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
  };

  // Download the file
  const downloadFile = () => {
    if (fileUrl && selectedFile) {
      const a = document.createElement('a');
      a.href = fileUrl;
      a.download = selectedFile.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className={selectedFile ? 'hidden' : ''}
          id={`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
        />

        {selectedFile && (
          <div className="flex items-center justify-between w-full p-2 border rounded-md bg-muted/20">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-md">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div className="text-sm">
                <p className="font-medium truncate max-w-[200px]">{fileName}</p>
                <p className="text-xs text-muted-foreground">
                  {selectedFile.size < 1024 * 1024
                    ? `${Math.round(selectedFile.size / 1024)} KB`
                    : `${Math.round((selectedFile.size / (1024 * 1024)) * 10) / 10} MB`}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={viewFile}
              >
                View
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={downloadFile}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        {selectedFile 
          ? `File uploaded locally: ${fileName}`
          : `Upload a file (max ${Math.round(maxSize / (1024 * 1024))}MB)`}
      </p>
    </div>
  );
}
