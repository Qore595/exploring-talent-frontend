import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Building,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Shield,
  AlertTriangle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { useVendorAuth } from '@/context/VendorAuthContext';
import { VendorLoginRequest } from '@/types/vendor-portal';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required').email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
  mfaCode: z.string().optional(),
  rememberMe: z.boolean().default(false)
});

type LoginFormData = z.infer<typeof loginSchema>;

const VendorLogin: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useVendorAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showMFA, setShowMFA] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
      mfaCode: '',
      rememberMe: false
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsSubmitting(true);
      setLoginError(null);

      const credentials: VendorLoginRequest = {
        username: data.username,
        password: data.password,
        mfaCode: data.mfaCode,
        rememberMe: data.rememberMe
      };

      const response = await login(credentials);

      if (response.success) {
        navigate('/vendor-portal/dashboard');
      } else if (response.requiresMfa) {
        setShowMFA(true);
        setLoginError(null);
      } else {
        setLoginError(response.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/vendor-portal/forgot-password');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <Building className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-gray-900">Vendor Portal</h1>
          </div>
          <p className="text-gray-600">
            Secure access for vendor partners
          </p>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your vendor account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Username Field */}
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            {...field}
                            type="email"
                            placeholder="vendor@company.com"
                            className="pl-10"
                            disabled={isSubmitting}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            {...field}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            className="pl-10 pr-10"
                            disabled={isSubmitting}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isSubmitting}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* MFA Field (conditional) */}
                {showMFA && (
                  <FormField
                    control={form.control}
                    name="mfaCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>MFA Code</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Shield className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              {...field}
                              type="text"
                              placeholder="Enter 6-digit code"
                              className="pl-10"
                              maxLength={6}
                              disabled={isSubmitting}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-gray-500">
                          Enter the 6-digit code from your authenticator app
                        </p>
                      </FormItem>
                    )}
                  />
                )}

                {/* Remember Me */}
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-normal">
                          Remember me for 30 days
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                {/* Error Alert */}
                {loginError && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{loginError}</AlertDescription>
                  </Alert>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || isLoading}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>

                {/* Forgot Password */}
                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    className="text-sm"
                    onClick={handleForgotPassword}
                    disabled={isSubmitting}
                  >
                    Forgot your password?
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-blue-900 flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                Demo Credentials
              </h3>
              <div className="text-xs text-blue-700 space-y-1">
                <p><strong>Email:</strong> vendor@techcorp.com</p>
                <p><strong>Password:</strong> password123</p>
                <p className="text-blue-600">Use these credentials to explore the vendor portal</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 space-y-2">
          <p>
            Need help? Contact your account manager or{' '}
            <Link to="/support" className="text-primary hover:underline">
              technical support
            </Link>
          </p>
          <Separator />
          <p>
            © 2024 Staffing Operations Platform. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VendorLogin;
