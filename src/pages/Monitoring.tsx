import { useState, useEffect } from 'react';
import { 
  LineChart, Line, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { Activity, Cpu, Database, HardDrive, Wifi, AlertTriangle } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

// Helper to generate initial random data
const generateData = (count: number, base: number, variance: number) => {
  return Array.from({ length: count }).map((_, i) => ({
    time: `${i}s ago`,
    value: Math.max(0, Math.min(100, base + (Math.random() * variance * 2 - variance)))
  })).reverse();
};

export default function Monitoring() {
  const [cpuData, setCpuData] = useState(generateData(20, 45, 10));
  const [ramData, setRamData] = useState(generateData(20, 75, 5));
  const [networkData, setNetworkData] = useState(generateData(20, 200, 50)); // in Mbps

  // Real-time update simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuData(current => {
        const next = [...current.slice(1)];
        next.push({ 
          time: 'now', 
          value: Math.max(0, Math.min(100, next[next.length - 1].value + (Math.random() * 20 - 10))) 
        });
        return next;
      });
      
      setRamData(current => {
        const next = [...current.slice(1)];
        next.push({ 
          time: 'now', 
          value: Math.max(0, Math.min(100, next[next.length - 1].value + (Math.random() * 4 - 2))) 
        });
        return next;
      });

      setNetworkData(current => {
        const next = [...current.slice(1)];
        next.push({ 
          time: 'now', 
          value: Math.max(0, next[next.length - 1].value + (Math.random() * 100 - 50)) 
        });
        return next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const currentCpu = cpuData[cpuData.length - 1].value;
  const currentRam = ramData[ramData.length - 1].value;

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Real-time Monitoring</h1>
          <p className="text-muted">Live metrics across your infrastructure cluster</p>
        </div>
        <div className="flex gap-3">
          <Badge variant={currentCpu > 80 ? "danger" : currentCpu > 60 ? "warning" : "success"} className="px-3 py-1.5 text-sm">
            <Activity className="w-4 h-4 mr-2" />
            Cluster Health: {currentCpu > 80 ? 'Critical' : currentCpu > 60 ? 'Warning' : 'Healthy'}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* CPU Chart */}
        <Card glass className={currentCpu > 80 ? "border-danger/50" : ""}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center">
                <Cpu className="w-5 h-5 mr-2 text-primary" />
                CPU Usage
              </CardTitle>
              <span className="text-2xl font-bold">{Math.round(currentCpu)}%</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cpuData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <YAxis domain={[0, 100]} stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(6, 8, 22, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                    labelStyle={{ display: 'none' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke={currentCpu > 80 ? "#EF4444" : currentCpu > 60 ? "#F59E0B" : "#06B6D4"} 
                    strokeWidth={3} 
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* RAM Chart */}
        <Card glass className={currentRam > 90 ? "border-danger/50" : ""}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center">
                <Database className="w-5 h-5 mr-2 text-secondary" />
                Memory Usage
              </CardTitle>
              <span className="text-2xl font-bold">{Math.round(currentRam)}%</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ramData}>
                  <defs>
                    <linearGradient id="colorRam" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <YAxis domain={[0, 100]} stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(6, 8, 22, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                    labelStyle={{ display: 'none' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#14B8A6" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorRam)" 
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Network Chart */}
        <Card glass>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center">
                <Wifi className="w-5 h-5 mr-2 text-accent" />
                Network Traffic
              </CardTitle>
              <span className="text-2xl font-bold">{Math.round(networkData[networkData.length - 1].value)} <span className="text-sm font-normal text-muted">Mbps</span></span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={networkData}>
                   <defs>
                    <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(6, 8, 22, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                    labelStyle={{ display: 'none' }}
                  />
                  <Area 
                    type="stepAfter" 
                    dataKey="value" 
                    stroke="#06B6D4" 
                    strokeWidth={2} 
                    fillOpacity={1} 
                    fill="url(#colorNet)" 
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Alerts */}
      <Card glass>
        <CardHeader>
          <CardTitle>System Alerts</CardTitle>
          <CardDescription>Recent warnings and critical events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-lg bg-warning/10 border border-warning/20">
              <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-warning mb-1">High Memory Usage - Node Pool A</h4>
                <p className="text-sm text-muted">Memory usage has exceeded 80% for more than 5 minutes. Consider scaling the node pool.</p>
                <span className="text-xs text-muted block mt-2">12 mins ago</span>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-lg bg-white/5 border border-white/10">
              <HardDrive className="w-5 h-5 text-muted shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-white mb-1">Automated Backup Completed</h4>
                <p className="text-sm text-muted">Database volume db-prod-primary successfully backed up to S3.</p>
                <span className="text-xs text-muted block mt-2">3 hours ago</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
