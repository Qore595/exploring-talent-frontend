import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import ManualDocumentForm from '@/components/documentation/ManualDocumentForm';
import { ManualDocument } from '@/types/documentation';
import { documentationService } from '@/services/documentationService';

const EditManualDocumentPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [document, setDocument] = useState<ManualDocument | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      navigate('/manual-documents');
      return;
    }

    fetchDocument();
  }, [id]);

  const fetchDocument = async () => {
    try {
      setLoading(true);
      const response = await documentationService.getManualDocumentById(id!);
      setDocument(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch document',
        variant: 'destructive',
      });
      navigate('/manual-documents');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!document) {
    return null;
  }

  return <ManualDocumentForm document={document} mode="edit" />;
};

export default EditManualDocumentPage;
