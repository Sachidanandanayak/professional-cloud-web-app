import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Box, Cpu, Activity, AlertTriangle, 
  Search, Plus, MoreVertical, Play, 
  Square, RefreshCw, Trash2, Terminal
} from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { api } from '../lib/api';

// Mock Data removed, using API

const MetricCard = ({ title, value, icon: Icon, colorClass }: any) => (
  <Card hoverLift glass>
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-lg ${colorClass} flex items-center justify-center shadow-lg`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-muted">{title}</p>
        <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
      </div>
    </CardContent>
  </Card>
);

export default function Containers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [containers, setContainers] = useState<any[]>([]);
  const [isDeploying, setIsDeploying] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchContainers = async () => {
    try {
      const response = await api.get('/containers');
      setContainers(response.data);
    } catch (error) {
      console.error("Failed to fetch containers", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchContainers();
  }, []);

  const handleDeploy = async () => {
    setIsDeploying(true);
    try {
      const newContainer = {
        name: `new-service-${Math.floor(Math.random() * 100)}`,
        image: 'node:20-alpine',
        cpu: Math.floor(Math.random() * 20),
        memory: Math.floor(Math.random() * 40) + 10,
        uptime: 'Just now'
      };
      await api.post('/containers', newContainer);
      await fetchContainers();
    } catch (error) {
      console.error("Failed to deploy container", error);
    } finally {
      setIsDeploying(false);
    }
  };

  const filteredContainers = containers.filter(container => 
    container.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    container.image.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Running':
        return <Badge variant="success">{status}</Badge>;
      case 'Stopped':
        return <Badge variant="warning">{status}</Badge>;
      case 'Restarting':
        return <Badge variant="default" className="bg-accent/20 text-accent border-accent/20">{status}</Badge>;
      case 'Failed':
        return <Badge variant="danger">{status}</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const getProgressColor = (value: number) => {
    if (value > 85) return 'danger';
    if (value > 70) return 'warning';
    return 'primary';
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Container Workloads</h1>
          <p className="text-muted">Monitor and manage your containerized applications.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleDeploy}
            disabled={isDeploying}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-[0_0_15px_rgba(6,182,212,0.4)] disabled:opacity-70 disabled:cursor-not-allowed min-w-[180px]"
          >
            {isDeploying ? (
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                Deploying...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Deploy Container
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard title="Total Containers" value={containers.length.toString()} icon={Box} colorClass="bg-gradient-to-br from-primary to-secondary" />
        <MetricCard title="Running" value={containers.filter(c => c.status === 'Running').length.toString()} icon={Activity} colorClass="bg-gradient-to-br from-success to-emerald-700" />
        <MetricCard title="Avg CPU Load" value={`${containers.length ? Math.round(containers.reduce((acc, curr) => acc + curr.cpu, 0) / containers.length) : 0}%`} icon={Cpu} colorClass="bg-gradient-to-br from-warning to-amber-700" />
        <MetricCard title="Issues Detected" value={containers.filter(c => c.status === 'Failed' || c.status === 'Restarting').length.toString()} icon={AlertTriangle} colorClass="bg-gradient-to-br from-danger to-rose-700" />
      </div>

      {/* Containers Table */}
      <Card glass className="flex-1 min-h-[500px]">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>Workloads Directory</CardTitle>
            <CardDescription>A comprehensive view of all running and stopped containers.</CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input 
              type="text" 
              placeholder="Search containers..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/20 border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-white placeholder-muted"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/50 bg-black/20 text-xs uppercase tracking-wider text-muted font-medium">
                  <th className="px-6 py-4">Container</th>
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 w-48">CPU Usage</th>
                  <th className="px-6 py-4 w-48">Memory</th>
                  <th className="px-6 py-4">Uptime</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filteredContainers.length > 0 ? (
                  filteredContainers.map((container, index) => (
                    <motion.tr 
                      key={container.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-white/5 transition-colors group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-md bg-card border border-border flex items-center justify-center shrink-0">
                            <Box className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-white">{container.name}</p>
                            <p className="text-xs text-muted font-mono">{container.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted font-mono">{container.image}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(container.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                           <span className="text-xs text-muted w-8">{container.cpu}%</span>
                           <ProgressBar value={container.cpu} color={getProgressColor(container.cpu)} className="h-1.5 flex-1" />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                           <span className="text-xs text-muted w-8">{container.memory}%</span>
                           <ProgressBar value={container.memory} color={getProgressColor(container.memory)} className="h-1.5 flex-1" />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">{container.uptime}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                           {container.status !== 'Running' && container.status !== 'Restarting' ? (
                             <button className="p-1.5 text-muted hover:text-success hover:bg-success/10 rounded transition-colors" title="Start">
                               <Play className="w-4 h-4" />
                             </button>
                           ) : (
                             <button className="p-1.5 text-muted hover:text-warning hover:bg-warning/10 rounded transition-colors" title="Stop">
                               <Square className="w-4 h-4" />
                             </button>
                           )}
                           <button className="p-1.5 text-muted hover:text-primary hover:bg-primary/10 rounded transition-colors" title="Restart">
                             <RefreshCw className="w-4 h-4" />
                           </button>
                           <button className="p-1.5 text-muted hover:text-accent hover:bg-accent/10 rounded transition-colors" title="Logs">
                             <Terminal className="w-4 h-4" />
                           </button>
                           <button 
                             className="p-1.5 text-muted hover:text-danger hover:bg-danger/10 rounded transition-colors" 
                             title="Delete"
                             onClick={async () => {
                               await api.delete(`/containers/${container.id}`);
                               await fetchContainers();
                             }}
                           >
                             <Trash2 className="w-4 h-4" />
                           </button>
                           <button className="p-1.5 text-muted hover:text-white hover:bg-white/10 rounded transition-colors" title="More">
                             <MoreVertical className="w-4 h-4" />
                           </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-muted">
                      No containers found matching your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
