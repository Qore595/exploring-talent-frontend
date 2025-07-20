import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import DocumentGroupForm from '@/components/documentation/DocumentGroupForm';
import { DocumentGroup } from '@/types/documentation';
import { documentationService } from '@/services/documentationService';

const EditDocumentGroupPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [group, setGroup] = useState<DocumentGroup | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      navigate('/document-groups');
      return;
    }

    fetchGroup();
  }, [id]);

  const fetchGroup = async () => {
    try {
      setLoading(true);
      const response = await documentationService.getDocumentGroupById(id!);
      setGroup(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch group',
        variant: 'destructive',
      });
      navigate('/document-groups');
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

  if (!group) {
    return null;
  }

  return <DocumentGroupForm group={group} mode="edit" />;
};

export default EditDocumentGroupPage;
