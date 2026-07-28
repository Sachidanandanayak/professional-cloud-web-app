import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthLayout from '../layouts/AuthLayout';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Button } from '../components/ui/Button';

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (_data: FormValues) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsSuccess(true);
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
                  <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
                  <p className="text-muted text-sm">Enter your email and we'll send you a reset link</p>
                </div>

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

                  <Button type="submit" className="w-full mt-6" isLoading={isLoading}>
                    Send Reset Link
                  </Button>
                </form>

                <div className="mt-8 text-center">
                  <Link to="/login" className="inline-flex items-center text-sm text-muted hover:text-primary transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to log in
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
            <Card glass className="border-success/30">
              <CardContent className="pt-10 pb-8 flex flex-col items-center">
                <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10 text-success" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Check your email</h2>
                <p className="text-muted text-center mb-8">
                  We've sent a password reset link to your email address.
                </p>
                <Link to="/login">
                  <Button variant="outline" className="px-8">
                    Return to Log In
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
}
