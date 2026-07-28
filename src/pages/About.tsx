import { motion } from 'framer-motion';
import { Globe, Users, Zap, Shield, Target, Award } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { Card, CardContent } from '../components/ui/Card';

export default function About() {
  const stats = [
    { label: 'Global Data Centers', value: '45+', icon: Globe },
    { label: 'Active Developers', value: '150k+', icon: Users },
    { label: 'Uptime Guarantee', value: '99.99%', icon: Zap },
    { label: 'Security Certifications', value: '12', icon: Shield },
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl mix-blend-screen animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl mix-blend-screen animate-blob animation-delay-2000"></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Building the <span className="text-gradient">Future</span> of Cloud
            </h1>
            <p className="text-lg md:text-xl text-muted max-w-3xl mx-auto mb-10">
              We started NexusCloud with a simple belief: deploying and scaling applications shouldn't require an army of DevOps engineers. We are democratizing infrastructure for the modern web.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="py-12 border-y border-border/40 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm text-muted uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="prose prose-invert prose-lg max-w-none"
          >
            <h2 className="text-3xl font-bold text-white mb-6">Our Story</h2>
            <p className="text-muted leading-relaxed mb-6">
              Founded in 2024 by a team of ex-infrastructure engineers, NexusCloud was born out of frustration with the complexity of existing cloud providers. We spent too much time configuring VPCs, IAM roles, and Kubernetes clusters instead of building actual products.
            </p>
            <p className="text-muted leading-relaxed mb-12">
              Today, NexusCloud powers thousands of startups and enterprises, delivering a serverless experience that feels magical. By abstracting away the boilerplate while retaining the raw power of edge computing, we allow development teams to move faster than ever before.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card glass className="h-full">
                <CardContent className="pt-6">
                  <Target className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-3">Our Mission</h3>
                  <p className="text-muted">
                    To accelerate human progress by removing the friction between an idea and a globally scaled application.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card glass className="h-full">
                <CardContent className="pt-6">
                  <Award className="w-8 h-8 text-secondary mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-3">Our Values</h3>
                  <p className="text-muted">
                    We value developer experience above all else. We build tools that we love to use ourselves, prioritizing speed, security, and simplicity.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
