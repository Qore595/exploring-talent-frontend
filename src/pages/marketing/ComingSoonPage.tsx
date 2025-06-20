import React from 'react';
import { Button } from '@/components/ui/button';
import UpcomingFeatures from '@/components/marketing/UpcomingFeatures';
import { ArrowRight, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

const ComingSoonPage = () => {
  const [email, setEmail] = React.useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would connect to your notification system
    alert(`Thank you for subscribing! We'll notify ${email} when new features launch.`);
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                The Future of QORE
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Discover our roadmap of innovative features designed to transform your business operations and streamline immigration processes.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild>
                  <a href="#features">
                    Explore Features <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/dashboard">
                    Return to Dashboard
                  </Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="/images/illustrations/product-roadmap.svg" 
                alt="Product Roadmap Illustration" 
                className="w-full max-w-lg mx-auto"
                onError={(e) => {
                  // Fallback if image doesn't exist
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16">
        <UpcomingFeatures />
      </section>
      
      {/* Notification Signup */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto max-w-4xl text-center px-4">
          <Bell className="w-12 h-12 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Be the first to know when we launch new features. Subscribe to our notifications and we'll keep you informed.
          </p>
          
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <Button type="submit">
              Notify Me
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default ComingSoonPage;
