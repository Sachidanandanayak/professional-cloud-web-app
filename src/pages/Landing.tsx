import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Cloud, Server, Shield, Zap, CheckCircle2, Globe, Box, Cpu } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import MainLayout from '../layouts/MainLayout';

export default function Landing() {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);

  const features = [
    {
      icon: <Zap className="w-6 h-6 text-warning" />,
      title: "Edge Acceleration",
      description: "Deploy globally in milliseconds with our advanced edge network covering 250+ cities."
    },
    {
      icon: <Shield className="w-6 h-6 text-success" />,
      title: "Enterprise Security",
      description: "Bank-grade encryption, DDoS protection, and continuous compliance monitoring out of the box."
    },
    {
      icon: <Server className="w-6 h-6 text-primary" />,
      title: "Auto-Scaling Compute",
      description: "Intelligent resource allocation that scales instantly with your traffic demands."
    }
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl mix-blend-screen animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl mix-blend-screen animate-blob animation-delay-2000"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Badge className="mb-6">v2.0 is now live 🚀</Badge>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8">
              The Cloud Platform for <br className="hidden md:block" />
              <span className="text-gradient">Modern Teams</span>
            </h1>
            <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10">
              Build, deploy, and scale your applications with unprecedented speed. 
              Experience the next generation of serverless infrastructure.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base group">
                  Start Deploying Free
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/documentation">
                <Button size="lg" variant="glass" className="w-full sm:w-auto h-12 px-8 text-base">
                  Read Documentation
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Dashboard Preview floating illustration */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mt-20 relative mx-auto max-w-5xl perspective-1000"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10"></div>
            <motion.div 
              style={{ rotateX: 10, rotateZ: -1 }}
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="glass-card overflow-hidden border-border/50 shadow-2xl relative z-0"
            >
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070" 
                alt="Dashboard Preview" 
                className="w-full h-auto opacity-80 mix-blend-luminosity"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 mix-blend-overlay"></div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-border/40 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Requests per second", value: "2.5M+" },
              { label: "Global Edge Locations", value: "250+" },
              { label: "Uptime SLA", value: "99.99%" },
              { label: "Developers", value: "150k+" },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm text-muted uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Everything you need to scale</h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              Our comprehensive suite of tools empowers your team to build faster and manage less infrastructure.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
              >
                <Card hoverLift className="h-full bg-card/40 border-border/40">
                  <CardContent className="pt-8 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-center mx-auto mb-6 shadow-lg">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/10"></div>
         <div className="container mx-auto px-4 relative z-10 text-center">
           <h2 className="text-4xl md:text-6xl font-bold mb-8">Ready to deploy?</h2>
           <p className="text-xl text-muted mb-10 max-w-2xl mx-auto">
             Join thousands of developers building the future on NexusCloud.
           </p>
           <Link to="/register">
             <Button size="lg" className="h-14 px-10 text-lg shadow-[0_0_40px_rgba(79,70,229,0.4)] hover:shadow-[0_0_60px_rgba(79,70,229,0.6)] transition-shadow">
               Start your free trial
             </Button>
           </Link>
         </div>
      </section>
    </MainLayout>
  );
}
