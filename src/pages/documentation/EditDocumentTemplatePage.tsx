import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import DocumentTemplateForm from '@/components/documentation/DocumentTemplateForm';
import { DocumentTemplate } from '@/types/documentation';
import { documentationService } from '@/services/documentationService';

const EditDocumentTemplatePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [template, setTemplate] = useState<DocumentTemplate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      navigate('/document-templates');
      return;
    }

    fetchTemplate();
  }, [id]);

  const fetchTemplate = async () => {
    try {
      setLoading(true);
      const response = await documentationService.getDocumentTemplateById(id!);
      setTemplate(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch template',
        variant: 'destructive',
      });
      navigate('/document-templates');
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

  if (!template) {
    return null;
  }

  return <DocumentTemplateForm template={template} mode="edit" />;
};

export default EditDocumentTemplatePage;
