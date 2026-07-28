import React from 'react';
import { motion } from 'framer-motion';
import { 
  GitCommit, Github, TestTube, Box, Server, 
  CheckCircle2, Loader2, Play
} from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';
import { api } from '../lib/api';

const pipelineSteps = [
  { id: 'dev', name: 'Developer', icon: GitCommit, status: 'completed', time: '12s' },
  { id: 'git', name: 'GitHub', icon: Github, status: 'completed', time: '2s' },
  { id: 'actions', name: 'GitHub Actions', icon: Play, status: 'completed', time: '4s' },
  { id: 'test', name: 'Testing', icon: TestTube, status: 'completed', time: '45s' },
  { id: 'build', name: 'Docker Build', icon: Box, status: 'running', time: '1m 12s' },
  { id: 'hub', name: 'Docker Hub', icon: CloudUpload, status: 'pending', time: '-' },
  { id: 'deploy', name: 'AWS EC2', icon: Server, status: 'pending', time: '-' },
  { id: 'live', name: 'Application Live', icon: CheckCircle2, status: 'pending', time: '-' },
];

// Extracted missing icon
function CloudUpload(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <path d="M12 12v9" />
      <path d="m16 16-4-4-4 4" />
    </svg>
  );
}

const StepNode = ({ step, index, total }: { step: any, index: number, total: number }) => {
  const isCompleted = step.status === 'completed';
  const isRunning = step.status === 'running';
  const isPending = step.status === 'pending';
  
  return (
    <div className="flex flex-col items-center relative z-10 w-full">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: index * 0.1, type: 'spring' }}
        className={cn(
          "w-16 h-16 rounded-2xl flex items-center justify-center border-2 mb-4 relative shadow-lg",
          isCompleted ? "bg-success/20 border-success/50 text-success" : 
          isRunning ? "bg-primary/20 border-primary shadow-[0_0_20px_rgba(79,70,229,0.5)] text-primary" : 
          "bg-card border-border text-muted"
        )}
      >
        <step.icon className={cn("w-8 h-8", isRunning && "animate-pulse")} />
        
        {isRunning && (
          <div className="absolute -top-2 -right-2 bg-background rounded-full">
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
          </div>
        )}
        {isCompleted && (
          <div className="absolute -top-2 -right-2 bg-background rounded-full">
            <CheckCircle2 className="w-5 h-5 text-success" />
          </div>
        )}
      </motion.div>
      
      <div className="text-center">
        <h4 className={cn("font-semibold text-sm mb-1", isPending ? "text-muted" : "text-white")}>
          {step.name}
        </h4>
        <span className="text-xs text-muted block">{step.time}</span>
      </div>

      {index < total - 1 && (
        <div className="absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-border/50 hidden md:block">
          {(isCompleted || isRunning) && (
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: isCompleted ? '100%' : '50%' }}
              transition={{ duration: 1, delay: index * 0.1 }}
              className={cn("h-full", isCompleted ? "bg-success" : "bg-primary")}
            >
              {isRunning && (
                <div className="w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-[shimmer_1s_infinite]" />
              )}
            </motion.div>
          )}
        </div>
      )}
      
      {/* Mobile vertical line */}
      {index < total - 1 && (
        <div className="w-0.5 h-8 bg-border/50 my-2 md:hidden relative">
          {(isCompleted || isRunning) && (
            <motion.div 
              initial={{ height: 0 }}
              animate={{ height: isCompleted ? '100%' : '50%' }}
              transition={{ duration: 1, delay: index * 0.1 }}
              className={cn("w-full", isCompleted ? "bg-success" : "bg-primary")}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default function DeploymentPipeline() {
  const [buildStatus, setBuildStatus] = React.useState('running');
  const [deployment, setDeployment] = React.useState<any>(null);
  const logsRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const fetchDeployments = async () => {
      try {
        const response = await api.get('/deployments');
        if (response.data && response.data.length > 0) {
          setDeployment(response.data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch deployments", error);
      }
    };
    fetchDeployments();
  }, []);

  const handleCancel = () => {
    setBuildStatus('cancelled');
  };

  const scrollToLogs = () => {
    logsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Deployment Pipeline</h1>
          <p className="text-muted">Live CI/CD workflow for project: {deployment ? deployment.project_name : 'api-gateway'}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={scrollToLogs}>View Logs</Button>
          {buildStatus === 'running' ? (
             <Button variant="danger" onClick={handleCancel}>Cancel Build</Button>
          ) : (
             <Button variant="outline" disabled>Build Cancelled</Button>
          )}
        </div>
      </div>

      <Card glass className="mb-8">
        <CardHeader className="border-b border-border/30 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Production Release {deployment ? `v${deployment.version}` : 'v2.4.1'}</CardTitle>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-sm text-muted flex items-center">
                  <GitCommit className="w-4 h-4 mr-1" />
                  a1b2c3d
                </span>
                <span className="text-sm text-muted flex items-center">
                  Triggered by <img src="https://github.com/shadcn.png" className="w-5 h-5 rounded-full mx-2" alt="avatar"/> John Doe
                </span>
              </div>
            </div>
            {buildStatus === 'running' ? (
              <Badge variant="warning" className="px-3 py-1 text-sm bg-warning/20">
                In Progress (Build)
              </Badge>
            ) : (
              <Badge variant="danger" className="px-3 py-1 text-sm bg-danger/20">
                Cancelled
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-12 pb-16">
          <div className="flex flex-col md:flex-row items-center justify-between">
            {pipelineSteps.map((step, index) => (
              <StepNode 
                key={step.id} 
                step={step} 
                index={index} 
                total={pipelineSteps.length} 
              />
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Live Logs Terminal Simulation */}
      <div ref={logsRef}>
        <Card glass className="bg-black/60">
          <CardHeader className="border-b border-border/30 bg-black/40">
          <CardTitle className="text-sm font-mono flex items-center">
            <span className="w-2 h-2 rounded-full bg-danger mr-2"></span>
            <span className="w-2 h-2 rounded-full bg-warning mr-2"></span>
            <span className="w-2 h-2 rounded-full bg-success mr-4"></span>
            build.log
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 font-mono text-sm h-64 overflow-y-auto">
          <div className="space-y-2">
            <div className="text-muted">Step 1/8 : FROM node:18-alpine</div>
            <div className="text-success">---{'>'} 1234567890ab</div>
            <div className="text-muted">Step 2/8 : WORKDIR /app</div>
            <div className="text-success">---{'>'} Running in abcdef123456</div>
            <div className="text-success">---{'>'} 234567890abc</div>
            <div className="text-muted">Step 3/8 : COPY package*.json ./</div>
            <div className="text-success">---{'>'} 34567890abcd</div>
            <div className="text-muted">Step 4/8 : RUN npm ci</div>
            <div className="text-white">npm notice created a lockfile as package-lock.json. You should commit this file.</div>
            <div className="text-white">added 1243 packages in 45s</div>
            <div className="text-success">---{'>'} 4567890abcde</div>
            <div className="text-muted">Step 5/8 : COPY . .</div>
            <div className="text-success">---{'>'} 567890abcdef</div>
            <div className="text-muted flex items-center">
              Step 6/8 : RUN npm run build
              {buildStatus === 'running' ? (
                 <span className="inline-block w-2 h-4 bg-primary ml-2 animate-pulse"></span>
              ) : (
                 <span className="inline-block ml-2 text-danger">^C (Cancelled)</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </DashboardLayout>
  );
}
