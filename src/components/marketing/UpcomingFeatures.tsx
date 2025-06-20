import React from 'react';
import { 
  ChartBar, 
  FileText, 
  AlertCircle, 
  Calculator, 
  MessageSquare, 
  Users, 
  Video, 
  MessagesSquare,
  FileSignature
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  number: number;
  eta?: string;
}

const FeatureCard = ({ icon, title, description, number, eta }: FeatureProps) => (
  <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
    <CardContent className="p-6">
      <div className="flex items-start">
        <div className="mr-4 p-2 bg-primary/10 rounded-lg text-primary">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-medium mb-1"><span className="mr-2">{number}.</span>{title}</h3>
          <p className="text-sm text-gray-600 mb-3">{description}</p>
          {eta && (
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary">
              Coming {eta}
            </div>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

export const UpcomingFeatures = () => {
  const features = [
    {
      icon: <ChartBar className="h-6 w-6" />,
      title: "Sales Component",
      description: "Advanced analytics and sales management tools to optimize your business revenue streams.",
      number: 1,
      eta: "Q3 2026"
    },
    {
      icon: <FileSignature className="h-6 w-6" />,
      title: "Documentation Generator",
      description: "Automated generation of customized Documentations for new hires.",
      number: 2,
      eta: "Q4 2026"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Employer and Employee Communication Agent",
      description: "Streamlined communication channels between employers and employees for enhanced productivity.",
      number: 3,
      eta: "Q3 2026"
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "H1B Document Validator",
      description: "AI-powered document validation to ensure your H1B filings are complete and error-free.",
      number: 4,
      eta: "Q4 2026"
    },
    {
      icon: <AlertCircle className="h-6 w-6" />,
      title: "H1B RFE Predictor",
      description: "Predictive analytics to identify potential RFE triggers before submission.",
      number: 5,
      eta: "Q4 2026"
    },
    {
      icon: <MessagesSquare className="h-6 w-6" />,
      title: "Mock up Interview for Visa Appointments",
      description: "Interactive mock interviews to prepare candidates for visa appointments with real scenarios.",
      number: 6,
      eta: "Q4 2026"
    },
    {
      icon: <Calculator className="h-6 w-6" />,
      title: "Tax Filing Predictor",
      description: "Smart tax filing insights and predictive tools for employers and employees.",
      number: 7,
      eta: "Q2 2026"
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "WhatsApp Messaging Agent",
      description: "Seamless WhatsApp integration for client communication and automated updates.",
      number: 8,
      eta: "Q3 2026"
    },
    {
      icon: <Video className="h-6 w-6" />,
      title: "Video Interview Agent",
      description: "AI-powered interview scheduling, preparation, and feedback system.",
      number: 9,
      eta: "Q3 2026"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "VMS Integration",
      description: "Seamless integration with Vendor Management Systems to streamline vendor and contractor management.",
      number: 10,
      eta: "Q4 2026"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Coming Soon to QORE</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          We're constantly improving our platform with innovative features designed to streamline your operations and enhance productivity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <FeatureCard 
            key={index} 
            icon={feature.icon} 
            title={feature.title} 
            description={feature.description} 
            number={feature.number}
            eta={feature.eta} 
          />
        ))}
      </div>
    </div>
  );
};

export default UpcomingFeatures;
