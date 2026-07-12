import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Cloud, Server, Database, HardDrive, 
  Search, Plus, MoreVertical, Play, 
  Square, RefreshCw, Trash2, Shield
} from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
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

export default function CloudResources() {
  const [searchTerm, setSearchTerm] = useState('');
  const [resources, setResources] = useState<any[]>([]);
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchResources = async () => {
    try {
      const response = await api.get('/resources');
      setResources(response.data);
    } catch (error) {
      console.error("Failed to fetch resources", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchResources();
  }, []);

  const handleProvision = async () => {
    setIsProvisioning(true);
    try {
      const newResource = {
        name: `new-compute-node-${Math.floor(Math.random() * 100)}`,
        type: 'Compute (EC2)',
        region: 'us-east-1',
        ip: `192.168.1.${Math.floor(Math.random() * 100) + 20}`,
        cost_per_month: 45.0
      };
      await api.post('/resources', newResource);
      await fetchResources();
    } catch (error) {
      console.error("Failed to provision resource", error);
    } finally {
      setIsProvisioning(false);
    }
  };

  const filteredResources = resources.filter(resource => 
    resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Running':
      case 'Active':
        return <Badge variant="success">{status}</Badge>;
      case 'Stopped':
        return <Badge variant="warning">{status}</Badge>;
      case 'Failed':
        return <Badge variant="danger">{status}</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Cloud Resources</h1>
          <p className="text-muted">Manage and monitor your infrastructure assets.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleProvision}
            disabled={isProvisioning}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-[0_0_15px_rgba(6,182,212,0.4)] disabled:opacity-70 disabled:cursor-not-allowed min-w-[180px]"
          >
            {isProvisioning ? (
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                Provisioning...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Provision Resource
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard title="Total Resources" value={resources.length.toString()} icon={Cloud} colorClass="bg-gradient-to-br from-primary to-secondary" />
        <MetricCard title="Active Compute Nodes" value={resources.filter(r => r.type.includes('Compute') && r.status === 'Running').length.toString()} icon={Server} colorClass="bg-gradient-to-br from-success to-emerald-700" />
        <MetricCard title="Storage Volumes" value={resources.filter(r => r.type.includes('Storage')).length.toString()} icon={HardDrive} colorClass="bg-gradient-to-br from-warning to-amber-700" />
        <MetricCard title="Managed Databases" value={resources.filter(r => r.type.includes('Database')).length.toString()} icon={Database} colorClass="bg-gradient-to-br from-accent to-teal-700" />
      </div>

      {/* Resources Table */}
      <Card glass className="flex-1 min-h-[500px]">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>Resource Directory</CardTitle>
            <CardDescription>A complete list of your provisioned assets across all regions.</CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input 
              type="text" 
              placeholder="Filter resources..." 
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
                  <th className="px-6 py-4">Resource Name</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Region</th>
                  <th className="px-6 py-4">Internal IP</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filteredResources.length > 0 ? (
                  filteredResources.map((resource, index) => (
                    <motion.tr 
                      key={resource.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-white/5 transition-colors group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-md bg-card border border-border flex items-center justify-center shrink-0">
                            {resource.type.includes('EC2') ? <Server className="w-4 h-4 text-primary" /> : 
                             resource.type.includes('Database') ? <Database className="w-4 h-4 text-accent" /> :
                             resource.type.includes('Storage') ? <HardDrive className="w-4 h-4 text-warning" /> :
                             <Shield className="w-4 h-4 text-secondary" />}
                          </div>
                          <div>
                            <p className="font-medium text-white">{resource.name}</p>
                            <p className="text-xs text-muted font-mono">{resource.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">{resource.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">{resource.region}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-muted">{resource.ip}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(resource.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           {resource.status === 'Stopped' ? (
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
                            <button 
                              className="p-1.5 text-muted hover:text-danger hover:bg-danger/10 rounded transition-colors" 
                              title="Delete"
                              onClick={async () => {
                                await api.delete(`/resources/${resource.id}`);
                                await fetchResources();
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
                    <td colSpan={6} className="px-6 py-12 text-center text-muted">
                      No resources found matching your search criteria.
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
