import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Pages
import Landing from './pages/Landing';
import Documentation from './pages/Documentation';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import DeploymentPipeline from './pages/DeploymentPipeline';
import Monitoring from './pages/Monitoring';
import Settings from './pages/Settings';
import CloudResources from './pages/CloudResources';
import Containers from './pages/Containers';
import NotFound from './pages/NotFound';
import DashboardLayout from './layouts/DashboardLayout';

const queryClient = new QueryClient();

// Placeholder for other pages to avoid routing errors
const PlaceholderPage = ({ title }: { title: string }) => (
  <DashboardLayout>
    <div className="flex items-center justify-center h-full min-h-[60vh] text-center">
      <div>
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        <p className="text-muted">This section is currently under development.</p>
      </div>
    </div>
  </DashboardLayout>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/features" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/documentation" element={<Documentation />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/deployments" element={<DeploymentPipeline />} />
          <Route path="/dashboard/monitoring" element={<Monitoring />} />
          <Route path="/dashboard/settings" element={<Settings />} />
          
          {/* Placeholders for remaining requested sidebar routes */}
          <Route path="/dashboard/resources" element={<CloudResources />} />
          <Route path="/dashboard/containers" element={<Containers />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
