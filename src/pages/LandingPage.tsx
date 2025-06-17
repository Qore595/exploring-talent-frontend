import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Bot, CheckCircle2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { EnhancedHero } from '@/components/landing/EnhancedHero';
import { EnhancedFeatures } from '@/components/landing/EnhancedFeatures';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { CtaSection } from '@/components/landing/CtaSection';
import { Footer } from '@/components/landing/Footer';
import { UpcomingFeatures } from '@/components/marketing/UpcomingFeatures';

const LandingPage = () => {
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
            <Bot className="h-8 w-8 text-recruit-primary mr-2" />
            <span className="text-xl font-bold bg-gradient-to-r from-recruit-primary to-recruit-secondary bg-clip-text text-transparent">
              QORE
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden md:flex items-center space-x-8"
          >
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200">
              Features
            </a>
            <a href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200">
              Testimonials
            </a>
            <a href="#upcoming-features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200">
              <span className="relative">
                Coming Soon
                <span className="absolute -top-1 -right-7 px-1.5 py-0.5 rounded-full text-xs bg-primary text-white">New</span>
              </span>
            </a>
            <Link to="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200">
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

      {/* Hero Section with advanced animations */}
      <EnhancedHero />

      {/* Stats Section - New */}
      <section className="py-12 bg-gradient-to-r from-recruit-primary/5 to-recruit-secondary/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-recruit-primary mb-2">500+</div>
              <div className="text-sm text-muted-foreground">Companies Trust Us</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-recruit-primary mb-2">10k+</div>
              <div className="text-sm text-muted-foreground">Successful Placements</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-recruit-primary mb-2">95%</div>
              <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-recruit-primary mb-2">30%</div>
              <div className="text-sm text-muted-foreground">Time Saved</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features section with enhanced animations */}
      <section id="features">
        <EnhancedFeatures />
      </section>

      {/* Testimonials section */}
      <section id="testimonials">
        <TestimonialsSection />
      </section>

      {/* Call to action section */}
      <section id="cta">
        <CtaSection />
      </section>

      {/* Benefits section with enhanced visuals */}
      <section id="benefits" className="py-20 bg-gradient-to-br from-recruit-primary/10 to-recruit-secondary/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose QORE</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform offers distinct advantages for US consulting firms looking to optimize their recruitment process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&q=80&w=1500&auto=format&fit=crop"
                alt="Team collaborating using QORE"
                className="rounded-xl shadow-lg"
              />
            </div>

            <div className="space-y-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <CheckCircle2 className="h-6 w-6 text-recruit-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Increased Profit Margins</h3>
                  <p className="text-muted-foreground">
                    Maximize the difference between client budgets and candidate offers with transparent profit calculations.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <CheckCircle2 className="h-6 w-6 text-recruit-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Reduced Time-to-Hire</h3>
                  <p className="text-muted-foreground">
                    Accelerate the recruitment process with AI screening and workflow automation, cutting hiring time by up to 40%.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <CheckCircle2 className="h-6 w-6 text-recruit-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Better Candidate Quality</h3>
                  <p className="text-muted-foreground">
                    AI-powered matching ensures only the most qualified candidates move through your pipeline.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <CheckCircle2 className="h-6 w-6 text-recruit-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Complete Data Security</h3>
                  <p className="text-muted-foreground">
                    On-premise deployment ensures your sensitive candidate and client data never leaves your infrastructure.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User Roles section */}
      <section id="roles" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Role-Based Dashboards</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              QORE provides customized experiences for everyone involved in the recruitment process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-3">Company Admin</h3>
              <p className="text-muted-foreground mb-4">
                Oversee the entire recruitment operation with high-level metrics on team performance, hiring stats, and financial data.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                  <span>Total employees and candidates</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                  <span>Financial overview and profit margins</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                  <span>Team performance metrics</span>
                </li>
              </ul>
              <Link to="/login">
                <Button variant="outline" className="w-full">View Demo</Button>
              </Link>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-3">Hiring Manager</h3>
              <p className="text-muted-foreground mb-4">
                Manage budgets, set profit splits, and track your team's hiring progress in real time.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                  <span>Budget allocation and profit configuration</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                  <span>Team performance tracking</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                  <span>Recruitment pipeline visibility</span>
                </li>
              </ul>
              <Link to="/login">
                <Button variant="outline" className="w-full">View Demo</Button>
              </Link>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-3">Talent Scout</h3>
              <p className="text-muted-foreground mb-4">
                Upload resumes, manage screenings, and track candidates throughout the hiring process.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                  <span>Resume and JD management</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                  <span>TalentPulse screening administration</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                  <span>Candidate pipeline management</span>
                </li>
              </ul>
              <Link to="/login">
                <Button variant="outline" className="w-full">View Demo</Button>
              </Link>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-3">Team Member</h3>
              <p className="text-muted-foreground mb-4">
                Access candidate information, conduct interviews, and provide structured feedback.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                  <span>Interview scheduling and management</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                  <span>Candidate evaluation tools</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                  <span>Feedback submission</span>
                </li>
              </ul>
              <Link to="/login">
                <Button variant="outline" className="w-full">View Demo</Button>
              </Link>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-3">Applicant</h3>
              <p className="text-muted-foreground mb-4">
                Create an account, monitor application status, complete screenings, and respond to interview invitations.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                  <span>Easy self-registration</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                  <span>Application progress tracking</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                  <span>AI screening participation</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                  <span>Interview and offer management</span>
                </li>
              </ul>
              <Link to="/register">
                <Button variant="outline" className="w-full">Create Account</Button>
              </Link>
            </div>

            <div className="relative bg-gradient-to-br from-recruit-primary/80 to-recruit-secondary/80 p-8 rounded-xl shadow-sm border border-recruit-primary/20 text-white overflow-hidden">
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-3">Ready to Transform Your Recruitment?</h3>
                <p className="mb-6 text-white/90">
                  Experience the power of AI-driven recruitment tailored for consulting companies.
                </p>
                <Link to="/login">
                  <Button variant="secondary" className="w-full">Get Started Today</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Features Section */}
      <section id="upcoming-features" className="py-20 bg-gradient-to-br from-recruit-primary/5 to-recruit-secondary/5">
        <div className="container mx-auto px-4 text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Sparkles className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Coming Soon</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Exciting New Features on the Horizon</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We're constantly innovating to bring you the most powerful recruitment tools in the industry.
          </p>
        </div>
        
        <UpcomingFeatures />
      </section>

      {/* Enhanced CTA section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(40deg,transparent_25%,rgba(68,51,238,0.1)_50%,transparent_75%)] opacity-50"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-fade-in">
            Ready to Optimize Your Recruitment Process?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto animate-fade-in [animation-delay:200ms]">
            Join leading consulting firms using QORE to find better candidates,
            increase margins, and streamline hiring.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register">
              <Button
                size="lg"
                className="rounded-full animate-pulse-slow bg-gradient-to-r from-recruit-primary to-recruit-secondary hover:opacity-90"
              >
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full text-white border-white hover:bg-white/10 animate-fade-in [animation-delay:400ms]"
            >
              Request a Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
