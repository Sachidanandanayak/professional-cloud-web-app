import React, { useState } from 'react';
import { Search, ChevronRight, BookOpen, Terminal, Shield, Zap, Code } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { Input } from '../components/ui/Input';

export default function Documentation() {
  const [activeSection, setActiveSection] = useState('getting-started');

  const navSections = [
    {
      title: 'Introduction',
      items: [
        { id: 'getting-started', name: 'Getting Started', icon: BookOpen },
        { id: 'core-concepts', name: 'Core Concepts', icon: Zap },
      ]
    },
    {
      title: 'Guides',
      items: [
        { id: 'deployment', name: 'Deployment Pipeline', icon: Terminal },
        { id: 'security', name: 'Security & Access', icon: Shield },
      ]
    },
    {
      title: 'Reference',
      items: [
        { id: 'api', name: 'API Reference', icon: Code },
      ]
    }
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8 min-h-[calc(100vh-4rem)]">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0 space-y-8">
          <div className="sticky top-24">
            <div className="mb-6">
              <Input 
                placeholder="Search documentation..." 
                icon={<Search />}
                className="bg-black/20"
              />
            </div>
            
            <nav className="space-y-6">
              {navSections.map((section, idx) => (
                <div key={idx}>
                  <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
                    {section.title}
                  </h4>
                  <ul className="space-y-1">
                    {section.items.map((item) => (
                      <li key={item.id}>
                        <button
                          onClick={() => setActiveSection(item.id)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                            activeSection === item.id 
                              ? 'bg-primary/20 text-primary font-medium' 
                              : 'text-muted hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <item.icon className="w-4 h-4" />
                          {item.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 max-w-4xl pt-2 pb-16">
          {activeSection === 'getting-started' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-4xl font-bold text-white mb-4">Getting Started</h1>
              <p className="text-lg text-muted mb-8">
                Welcome to the NexusCloud documentation. This guide will help you set up your first project and deploy it to our global edge network in minutes.
              </p>

              <h2 className="text-2xl font-semibold text-white mb-4 mt-12">1. Install the CLI</h2>
              <p className="text-muted mb-4">
                The NexusCloud CLI provides a seamless way to manage your infrastructure and deployments directly from your terminal.
              </p>
              <div className="bg-black/40 border border-border/50 rounded-lg p-4 mb-8 font-mono text-sm">
                <span className="text-primary">$</span> npm install -g nexuscloud-cli
              </div>

              <h2 className="text-2xl font-semibold text-white mb-4 mt-12">2. Authenticate</h2>
              <p className="text-muted mb-4">
                Login to your account to authorize the CLI.
              </p>
              <div className="bg-black/40 border border-border/50 rounded-lg p-4 mb-8 font-mono text-sm">
                <span className="text-primary">$</span> nexus login
              </div>

              <h2 className="text-2xl font-semibold text-white mb-4 mt-12">3. Initialize your Project</h2>
              <p className="text-muted mb-4">
                Navigate to your project directory and run the init command. We automatically detect your framework (React, Next.js, Vue, etc.).
              </p>
              <div className="bg-black/40 border border-border/50 rounded-lg p-4 mb-8 font-mono text-sm">
                <span className="text-primary">$</span> cd my-awesome-app<br />
                <span className="text-primary">$</span> nexus init
              </div>

              <div className="mt-12 p-6 bg-primary/10 border border-primary/20 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
                  <Zap className="w-5 h-5 text-primary mr-2" /> 
                  Ready for production?
                </h3>
                <p className="text-muted mb-4">
                  Once your project is configured, a simple <code className="bg-black/30 px-1.5 py-0.5 rounded">nexus deploy --prod</code> is all it takes to go live globally.
                </p>
              </div>
            </div>
          )}

          {activeSection !== 'getting-started' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-[60vh] flex flex-col items-center justify-center text-center">
              <BookOpen className="w-16 h-16 text-muted mb-4 opacity-50" />
              <h2 className="text-2xl font-bold text-white mb-2">Documentation in Progress</h2>
              <p className="text-muted max-w-md mx-auto">
                We're currently writing this section. Check back soon for detailed guides and API references!
              </p>
            </div>
          )}
        </main>
      </div>
    </MainLayout>
  );
}
