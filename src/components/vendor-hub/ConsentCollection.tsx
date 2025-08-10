// Consent and Signature Collection Component
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  PenTool,
  CheckCircle,
  AlertTriangle,
  FileText,
  Download,
  RefreshCw,
  Clock,
  Shield,
  Eye,
  Trash2,
  Calendar
} from 'lucide-react';
import { ConsentRecord } from '@/types/vendor';

interface ConsentCollectionProps {
  vendorId: string;
  pocId: string;
  vendorName: string;
  pocName: string;
  pocEmail: string;
  consentType: 'PoC Update' | 'Data Processing' | 'Communication';
  onConsentCollected?: (consent: ConsentRecord) => void;
  className?: string;
}

const ConsentCollection: React.FC<ConsentCollectionProps> = ({
  vendorId,
  pocId,
  vendorName,
  pocName,
  pocEmail,
  consentType,
  onConsentCollected,
  className
}) => {
  const [isCollecting, setIsCollecting] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [signature, setSignature] = useState<string>('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [existingConsents, setExistingConsents] = useState<ConsentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockConsents: ConsentRecord[] = [
      {
        id: '1',
        vendorId,
        pocId,
        consentType: 'PoC Update',
        consentGiven: true,
        consentDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0...',
        digitalSignature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
        documentHash: 'sha256:abc123...',
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        metadata: {
          pocName,
          pocEmail,
          vendorName,
          consentVersion: '1.0'
        },
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      }
    ];

    setTimeout(() => {
      setExistingConsents(mockConsents);
      setIsLoading(false);
    }, 1000);
  }, [vendorId, pocId, pocName, pocEmail, vendorName]);

  // Canvas drawing functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      setSignature(canvas.toDataURL());
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setSignature('');
      }
    }
  };

  const handleSubmitConsent = async () => {
    if (!consentGiven || !signature) {
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Replace with actual API call
      const consentRecord: ConsentRecord = {
        id: Date.now().toString(),
        vendorId,
        pocId,
        consentType,
        consentGiven,
        consentDate: new Date(),
        ipAddress: '192.168.1.100', // This would come from the server
        userAgent: navigator.userAgent,
        digitalSignature: signature,
        documentHash: 'sha256:' + btoa(signature + Date.now()), // Mock hash
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        metadata: {
          pocName,
          pocEmail,
          vendorName,
          consentVersion: '1.0',
          additionalNotes
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      setExistingConsents(prev => [consentRecord, ...prev]);
      onConsentCollected?.(consentRecord);
      setIsCollecting(false);
      setConsentGiven(false);
      setSignature('');
      setAdditionalNotes('');
      clearSignature();
    } catch (error) {
      console.error('Failed to submit consent:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getConsentStatusBadge = (consent: ConsentRecord) => {
    const isExpired = consent.expiryDate && consent.expiryDate < new Date();
    const isRevoked = consent.revokedDate;
    
    if (isRevoked) {
      return (
        <Badge variant="destructive">
          <Trash2 className="h-3 w-3 mr-1" />
          Revoked
        </Badge>
      );
    }
    
    if (isExpired) {
      return (
        <Badge variant="warning">
          <Clock className="h-3 w-3 mr-1" />
          Expired
        </Badge>
      );
    }
    
    return (
      <Badge variant="success">
        <CheckCircle className="h-3 w-3 mr-1" />
        Active
      </Badge>
    );
  };

  const getConsentTypeDescription = (type: string) => {
    const descriptions = {
      'PoC Update': 'Consent to update point of contact information and receive validation communications.',
      'Data Processing': 'Consent for processing and storing personal and business contact information.',
      'Communication': 'Consent to receive automated communications and notifications from our system.'
    };
    return descriptions[type as keyof typeof descriptions] || 'General consent for vendor operations.';
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading consent records...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const activeConsent = existingConsents.find(c => 
    c.consentType === consentType && 
    c.consentGiven && 
    (!c.expiryDate || c.expiryDate > new Date()) &&
    !c.revokedDate
  );

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-5 w-5" />
          <span>Consent & Signatures</span>
        </CardTitle>
        <CardDescription>
          Manage consent collection and digital signatures for {pocName} at {vendorName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Consent Status */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Current Status: {consentType}</h4>
          
          {activeConsent ? (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Valid consent on file. Collected on {activeConsent.consentDate.toLocaleDateString()}
                {activeConsent.expiryDate && (
                  <>, expires on {activeConsent.expiryDate.toLocaleDateString()}</>
                )}
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant="warning">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                No valid consent on file for {consentType.toLowerCase()}. Collection required.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <Separator />

        {/* Collect New Consent */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Collect New Consent</h4>
            <Dialog open={isCollecting} onOpenChange={setIsCollecting}>
              <DialogTrigger asChild>
                <Button>
                  <PenTool className="h-4 w-4 mr-2" />
                  Collect Consent
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Consent Collection: {consentType}</DialogTitle>
                  <DialogDescription>
                    Collect digital consent and signature from {pocName} ({pocEmail})
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Consent Text */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Consent Agreement</h4>
                    <div className="p-4 border rounded-lg bg-muted/50">
                      <p className="text-sm">
                        {getConsentTypeDescription(consentType)}
                      </p>
                      <p className="text-sm mt-2">
                        By providing your digital signature below, you acknowledge that you have read, 
                        understood, and agree to the terms outlined above.
                      </p>
                    </div>
                  </div>

                  {/* Consent Checkbox */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="consent"
                      checked={consentGiven}
                      onCheckedChange={(checked) => setConsentGiven(checked as boolean)}
                    />
                    <Label htmlFor="consent" className="text-sm">
                      I provide my consent for the purposes described above
                    </Label>
                  </div>

                  {/* Digital Signature */}
                  {consentGiven && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium">Digital Signature</h4>
                      <div className="border rounded-lg p-4 space-y-3">
                        <canvas
                          ref={canvasRef}
                          width={400}
                          height={150}
                          className="border border-dashed border-muted-foreground/50 w-full cursor-crosshair"
                          onMouseDown={startDrawing}
                          onMouseMove={draw}
                          onMouseUp={stopDrawing}
                          onMouseLeave={stopDrawing}
                        />
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">
                            Please sign above using your mouse or touch device
                          </p>
                          <Button variant="outline" size="sm" onClick={clearSignature}>
                            Clear
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Additional Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any additional context or notes..."
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCollecting(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmitConsent}
                    disabled={!consentGiven || !signature || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Submit Consent
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Separator />

        {/* Consent History */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Consent History</h4>
          
          {existingConsents.length > 0 ? (
            <div className="space-y-3">
              {existingConsents.map((consent) => (
                <div key={consent.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{consent.consentType}</Badge>
                      {getConsentStatusBadge(consent)}
                    </div>
                    <div className="flex items-center space-x-2">
                      {consent.digitalSignature && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View Signature
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Digital Signature</DialogTitle>
                              <DialogDescription>
                                Signed on {consent.consentDate.toLocaleString()}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex justify-center p-4">
                              <img 
                                src={consent.digitalSignature} 
                                alt="Digital Signature" 
                                className="border rounded-lg max-w-full"
                              />
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Consent Date:</span>
                      <span>{consent.consentDate.toLocaleString()}</span>
                    </div>
                    
                    {consent.expiryDate && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Expires:</span>
                        <span>{consent.expiryDate.toLocaleDateString()}</span>
                      </div>
                    )}
                    
                    {consent.revokedDate && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Revoked:</span>
                        <span>{consent.revokedDate.toLocaleDateString()}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">IP Address:</span>
                      <span className="font-mono text-xs">{consent.ipAddress}</span>
                    </div>
                    
                    {consent.documentHash && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Document Hash:</span>
                        <span className="font-mono text-xs">{consent.documentHash.substring(0, 20)}...</span>
                      </div>
                    )}
                  </div>
                  
                  {consent.metadata?.additionalNotes && (
                    <div className="mt-2 pt-2 border-t">
                      <p className="text-xs text-muted-foreground">
                        <strong>Notes:</strong> {consent.metadata.additionalNotes}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No consent records found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConsentCollection;
