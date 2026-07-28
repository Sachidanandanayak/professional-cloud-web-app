import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Lock, Github, Chrome } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Button } from '../components/ui/Button';
import { api, ApiError } from '../lib/api';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  // Redirect back to the page the user tried to visit before being redirected to login
  const from = (location.state as any)?.from?.pathname || '/dashboard';
  const [isLoading, setIsLoading] = React.useState(false);
  const [loginError, setLoginError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setLoginError(null);
    try {
      const response = await api.post('/auth/login', {
        email: data.email,
        password: data.password
      });
      
      // Store token
      if (response.data?.access_token) {
        localStorage.setItem('accessToken', response.data.access_token);
        // Store user profile for display in DashboardLayout
        const user = response.data?.user;
        if (user) {
          const nameParts = (user.full_name || '').split(' ');
          localStorage.setItem('userFirstName', nameParts[0] || '');
          localStorage.setItem('userLastName', nameParts.slice(1).join(' ') || '');
          localStorage.setItem('userEmail', user.email || '');
        }
        navigate(from, { replace: true });
      } else {
        setLoginError('Invalid response from server');
      }
    } catch (error) {
      if (error instanceof ApiError) {
        setLoginError(error.message);
      } else {
        setLoginError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card glass className="border-white/10">
        <CardContent className="pt-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Welcome back</h2>
            <p className="text-muted text-sm">Enter your credentials to access your account</p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 bg-danger/10 border border-danger/50 text-danger text-sm rounded-lg">
              {loginError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                icon={<Mail />}
                {...register('email')}
                className={errors.email ? 'border-danger focus-visible:ring-danger' : ''}
              />
              {errors.email && (
                <p className="text-danger text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                icon={<Lock />}
                {...register('password')}
                className={errors.password ? 'border-danger focus-visible:ring-danger' : ''}
              />
              {errors.password && (
                <p className="text-danger text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center space-x-2 py-2">
              <input
                type="checkbox"
                id="rememberMe"
                className="rounded border-border/50 bg-black/20 text-primary focus:ring-primary h-4 w-4"
                {...register('rememberMe')}
              />
              <label
                htmlFor="rememberMe"
                className="text-sm font-medium leading-none text-muted peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me for 30 days
              </label>
            </div>

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Sign In
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" type="button" className="w-full">
              <Github className="mr-2 h-4 w-4" />
              Github
            </Button>
            <Button variant="outline" type="button" className="w-full">
              <Chrome className="mr-2 h-4 w-4" />
              Google
            </Button>
          </div>

          <div className="mt-6 text-center text-sm text-muted">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
