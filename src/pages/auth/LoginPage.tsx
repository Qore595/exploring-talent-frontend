import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import LoginForm from '@/components/auth/LoginForm';

const LoginPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-recruit-primary/10 to-recruit-secondary/10 p-4">
      <div className="w-full max-w-4xl flex flex-col md:flex-row overflow-hidden rounded-lg shadow-lg">
        {/* Left Side - Form */}
        <div className="w-full md:w-1/2 bg-white p-8 flex items-center justify-center">
          <LoginForm />
        </div>

        {/* Right Side - Info */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-recruit-primary to-recruit-secondary p-8 text-white flex flex-col justify-center">
          <div>
            <h1 className="text-3xl font-bold mb-4">QORE Platform</h1>
            <p className="mb-6">
              AI-powered recruitment platform designed for US consulting companies. Streamline your hiring process with intelligent tools.
            </p>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-medium">Optimize Profit Margins</h3>
                  <p className="text-sm opacity-80">
                    Configure budget splits between client budget and candidate offers
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-medium">AI-Driven Screening</h3>
                  <p className="text-sm opacity-80">
                    Leverage SmartMatch AI for voice-based candidate screening
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-medium">Role-Based Dashboards</h3>
                  <p className="text-sm opacity-80">
                    Customized views for CEO, Branch Manager, Marketing Head, Marketing Supervisor, Marketing Recruiter, Marketing Associate, and Applicant
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
