import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Footer } from '@/components/landing/Footer';

const PricingPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      {/* Header with glassmorphism effect */}
      <header className="fixed top-0 z-50 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 py-4 shadow-sm">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <Link to="/">
              <div className="flex items-center">
                <Bot className="h-8 w-8 text-recruit-primary mr-2" />
                <span className="text-xl font-bold bg-gradient-to-r from-recruit-primary to-recruit-secondary bg-clip-text text-transparent">
                  QORE
                </span>
              </div>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden md:flex items-center space-x-8"
          >
            <Link to="/#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200">
              Features
            </Link>
            <Link to="/#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200">
              Testimonials
            </Link>
            <Link to="/coming-soon" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200">
              <span className="relative">
                Coming Soon
                <span className="absolute -top-1 -right-7 px-1.5 py-0.5 rounded-full text-xs bg-primary text-white">New</span>
              </span>
            </Link>
            <Link to="/pricing" className="text-sm font-medium text-foreground font-bold transition-colors duration-200">
              Pricing
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-4"
          >
            <Link to="/login">
              <Button variant="outline" className="hover:scale-105 transition-transform duration-200">
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button className="hover:scale-105 transition-transform duration-200 bg-gradient-to-r from-recruit-primary to-recruit-secondary hover:opacity-90">
                Get Started
              </Button>
            </Link>
          </motion.div>
        </div>
      </header>
      
      <main className="mt-20">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Choose the plan that fits your business needs. All plans include core features with different scales and capabilities.
          </p>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-12">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <div className="border rounded-lg p-8 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="text-center mb-6">
                <h3 className="font-bold text-lg mb-1">Starter</h3>
                <div className="text-3xl font-bold">$299<span className="text-lg text-muted-foreground font-normal">/month</span></div>
                <p className="text-muted-foreground mt-2">Perfect for small businesses just getting started</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Up to 10 active job postings</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Basic AI resume screening</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Standard profit calculator</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Up to 5 team members</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Basic reporting</span>
                </li>
              </ul>
              <Button className="w-full" asChild>
                <Link to="/register">Get Started</Link>
              </Button>
            </div>

            {/* Professional Plan */}
            <div className="border-2 border-primary rounded-lg p-8 bg-white shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 text-sm font-medium">
                Most Popular
              </div>
              <div className="text-center mb-6">
                <h3 className="font-bold text-lg mb-1">Professional</h3>
                <div className="text-3xl font-bold">$799<span className="text-lg text-muted-foreground font-normal">/month</span></div>
                <p className="text-muted-foreground mt-2">Ideal for growing consulting firms</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Unlimited job postings</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Advanced AI screening + matching</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Enhanced profit calculator with forecasting</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Up to 20 team members</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Comprehensive reporting & analytics</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Team performance tracking</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Priority support</span>
                </li>
              </ul>
              <Button className="w-full bg-primary hover:bg-primary/90" asChild>
                <Link to="/register">Get Started</Link>
              </Button>
            </div>

            {/* Enterprise Plan */}
            <div className="border rounded-lg p-8 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="text-center mb-6">
                <h3 className="font-bold text-lg mb-1">Enterprise</h3>
                <div className="text-3xl font-bold">Custom</div>
                <p className="text-muted-foreground mt-2">For larger organizations with custom needs</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Everything in Professional</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Unlimited team members</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Custom integration with your HR systems</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>White-labeling options</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Dedicated account manager</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Custom AI models trained on your data</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>24/7 premium support</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-bold mb-10 text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Can I change plans later?</h3>
              <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Is there a free trial?</h3>
              <p className="text-gray-600">We offer a 14-day free trial on all our plans so you can try before committing.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">How does billing work?</h3>
              <p className="text-gray-600">We offer monthly and annual billing options. Annual plans come with a 20% discount compared to monthly billing.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">What kind of support do you offer?</h3>
              <p className="text-gray-600">All plans include email support. Professional plans and above include priority support with faster response times. Enterprise plans include a dedicated account manager.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/10">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Recruitment Process?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join hundreds of US consulting firms already using QORE to streamline their operations.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/register">Start Your Free Trial</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>
      </main>

      <Footer />
    </div>
  );
};

export default PricingPage;
