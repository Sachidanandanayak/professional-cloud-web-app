import React from 'react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell
} from 'recharts';
import { 
  ArrowUpRight, ArrowDownRight, Users, Server, Database,
  Activity, Cloud, Zap, Github, Cpu, HardDrive
} from 'lucide-react';
import { motion } from 'framer-motion';
import DashboardLayout from '../layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { api } from '../lib/api';

// Mock Data for cost & activity
const costData = [
  { name: 'Compute', value: 400 },
  { name: 'Storage', value: 300 },
  { name: 'Network', value: 300 },
  { name: 'Database', value: 200 },
];

const COLORS = ['#06b6d4', '#0ea5e9', '#14b8a6', '#3b82f6'];

const recentActivity = [
  { id: 1, type: 'deploy', project: 'frontend-app', env: 'production', status: 'success', time: '2m ago' },
  { id: 2, type: 'alert', project: 'api-gateway', msg: 'High CPU usage detected', time: '15m ago' },
  { id: 3, type: 'scale', project: 'auth-service', desc: 'Scaled up to 3 instances', time: '1h ago' },
  { id: 4, type: 'deploy', project: 'backend-worker', env: 'staging', status: 'failed', time: '2h ago' },
];

const MetricCard = ({ title, value, change, icon: Icon, trend }: any) => (
  <Card hoverLift glass>
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.2)]">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div className={trend === 'up' ? 'text-success' : 'text-danger'}>
          <span className="flex items-center text-sm font-medium">
            {trend === 'up' ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
            {change}
          </span>
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-muted">{title}</p>
        <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
      </div>
    </CardContent>
  </Card>
);

export default function Dashboard() {
  const [summary, setSummary] = React.useState<any>(null);
  const [stats, setStats] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, statsRes] = await Promise.all([
          api.get('/dashboard/summary'),
          api.get('/dashboard/statistics')
        ]);
        setSummary(summaryRes.data);
        setStats(statsRes.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Dashboard</h1>
          <p className="text-muted">Welcome back! Here's what's happening with your projects.</p>
        </div>
        <div className="flex gap-3">
          <Badge variant="success" className="px-3 py-1.5 text-sm">
            <span className="w-2 h-2 rounded-full bg-success mr-2 animate-pulse"></span>
            All Systems Operational
          </Badge>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard title="Total Deployments" value={loading ? "..." : summary?.total_deployments || 0} change="+1" icon={Activity} trend="up" />
        <MetricCard title="Active Resources" value={loading ? "..." : summary?.active_resources || 0} change="+2" icon={Server} trend="up" />
        <MetricCard title="Healthy Services" value={loading ? "..." : summary?.healthy_services || 0} change="+0" icon={Zap} trend="up" />
        <MetricCard title="Monthly Cost" value={loading ? "..." : `$${summary?.monthly_cost || 0}`} change="+$0" icon={Cloud} trend="up" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        {/* Main Chart */}
        <Card glass className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Traffic Overview</CardTitle>
            <CardDescription>Network requests across all projects in the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.length ? stats : [{ time: '00:00', cpu: 0, memory: 0 }]} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                  <XAxis dataKey="time" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'rgba(6, 8, 22, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="cpu" name="CPU %" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorRequests)" />
                  <Area type="monotone" dataKey="memory" name="Memory %" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorMemory)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card glass>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Current resource utilization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="flex items-center text-white"><Cpu className="w-4 h-4 mr-2 text-primary" /> CPU Usage</span>
                <span className="text-muted">64%</span>
              </div>
              <ProgressBar value={64} color="primary" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="flex items-center text-white"><Database className="w-4 h-4 mr-2 text-secondary" /> Memory (RAM)</span>
                <span className="text-muted">82%</span>
              </div>
              <ProgressBar value={82} color="warning" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="flex items-center text-white"><HardDrive className="w-4 h-4 mr-2 text-accent" /> Storage</span>
                <span className="text-muted">34%</span>
              </div>
              <ProgressBar value={34} color="success" />
            </div>

            <div className="pt-4 border-t border-border/50">
              <h4 className="text-sm font-medium mb-4">Cost Breakdown</h4>
              <div className="h-[120px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={costData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={55}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {costData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: 'rgba(6, 8, 22, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '4px 8px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card glass>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest events across your infrastructure</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {recentActivity.map((activity, index) => (
              <motion.div 
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4 relative"
              >
                {index !== recentActivity.length - 1 && (
                  <div className="absolute left-4 top-10 bottom-[-24px] w-[1px] bg-border/50"></div>
                )}
                <div className="relative z-10 w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(255,255,255,0.05)] backdrop-blur-md">
                  {activity.type === 'deploy' && <Github className="w-4 h-4 text-primary" />}
                  {activity.type === 'alert' && <Activity className="w-4 h-4 text-warning" />}
                  {activity.type === 'scale' && <Server className="w-4 h-4 text-success" />}
                </div>
                <div className="flex-1 pb-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-white">
                      {activity.type === 'deploy' ? `Deployed to ${activity.project}` :
                       activity.type === 'alert' ? `Alert on ${activity.project}` :
                       `Scaled ${activity.project}`}
                    </p>
                    <span className="text-xs text-muted">{activity.time}</span>
                  </div>
                  <div className="flex items-center mt-1">
                    {activity.env && (
                      <Badge variant={activity.env === 'production' ? 'default' : 'outline'} className="mr-2 px-2 py-0">
                        {activity.env}
                      </Badge>
                    )}
                    {activity.status && (
                      <Badge variant={activity.status === 'success' ? 'success' : 'danger'} className="mr-2 px-2 py-0">
                        {activity.status}
                      </Badge>
                    )}
                    {activity.msg && <p className="text-sm text-muted">{activity.msg}</p>}
                    {activity.desc && <p className="text-sm text-muted">{activity.desc}</p>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
