import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Lock, User, Github, Chrome, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthLayout from '../layouts/AuthLayout';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { api, ApiError } from '../lib/api';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  terms: z.boolean().refine(val => val === true, 'You must accept the terms'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [registerError, setRegisterError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch('password', '');
  
  // Calculate password strength
  const getPasswordStrength = () => {
    let score = 0;
    if (password.length >= 8) score += 25;
    if (password.match(/[A-Z]/)) score += 25;
    if (password.match(/[0-9]/)) score += 25;
    if (password.match(/[^A-Za-z0-9]/)) score += 25;
    return score;
  };

  const strength = getPasswordStrength();
  const strengthColor = strength < 50 ? 'danger' : strength < 75 ? 'warning' : 'success';

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setRegisterError(null);
    try {
      const response = await api.post('/auth/register', {
        email: data.email,
        password: data.password,
        is_active: true,
        is_superuser: false,
        full_name: data.name
      });
      
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      if (error instanceof ApiError) {
        setRegisterError(error.message);
      } else {
        setRegisterError('An unexpected error occurred during registration');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <Card glass className="border-white/10">
              <CardContent className="pt-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Create an account</h2>
                  <p className="text-muted text-sm">Start building your cloud infrastructure today</p>
                </div>

                {registerError && (
                  <div className="mb-4 p-3 bg-danger/10 border border-danger/50 text-danger text-sm rounded-lg">
                    {registerError}
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      icon={<User />}
                      {...register('name')}
                      className={errors.name ? 'border-danger focus-visible:ring-danger' : ''}
                    />
                    {errors.name && <p className="text-danger text-xs mt-1">{errors.name.message}</p>}
                  </div>

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
                    {errors.email && <p className="text-danger text-xs mt-1">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      icon={<Lock />}
                      {...register('password')}
                      className={errors.password ? 'border-danger focus-visible:ring-danger' : ''}
                    />
                    {password.length > 0 && (
                      <div className="mt-2">
                        <ProgressBar value={strength} color={strengthColor} className="h-1" />
                        <p className="text-xs text-muted mt-1 text-right">
                          {strength < 50 ? 'Weak' : strength < 75 ? 'Good' : 'Strong'}
                        </p>
                      </div>
                    )}
                    {errors.password && <p className="text-danger text-xs mt-1">{errors.password.message}</p>}
                  </div>

                  <div className="flex items-start space-x-2 py-2">
                    <input
                      type="checkbox"
                      id="terms"
                      className="mt-1 rounded border-border/50 bg-black/20 text-primary focus:ring-primary h-4 w-4"
                      {...register('terms')}
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-relaxed text-muted peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I agree to the <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                    </label>
                  </div>
                  {errors.terms && <p className="text-danger text-xs">{errors.terms.message}</p>}

                  <Button type="submit" className="w-full" isLoading={isLoading}>
                    Create Account
                  </Button>
                </form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border/50" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted">Or sign up with</span>
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
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary hover:underline">
                    Sign in
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-24 h-24 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-success" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Account Created!</h2>
            <p className="text-muted text-lg mb-8">Redirecting you to your dashboard...</p>
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
}
