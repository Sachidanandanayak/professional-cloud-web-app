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
import PrivateRoute from './components/PrivateRoute';

const queryClient = new QueryClient();

// Minimal placeholder for legal/policy pages
const SimplePlaceholder = ({ title, desc }: { title: string; desc: string }) => (
  <div className="min-h-screen bg-background flex items-center justify-center text-center px-4">
    <div>
      <h1 className="text-4xl font-bold text-white mb-4">{title}</h1>
      <p className="text-muted text-lg mb-8">{desc}</p>
      <a href="/" className="text-primary hover:underline">← Back to Home</a>
    </div>
  </div>
);



function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/features" element={<Navigate to="/" replace />} />
          <Route path="/about" element={<About />} />
          <Route path="/documentation" element={<Documentation />} />

          {/* Legal Routes */}
          <Route path="/terms" element={<SimplePlaceholder title="Terms of Service" desc="Our terms of service will be published here." />} />
          <Route path="/privacy" element={<SimplePlaceholder title="Privacy Policy" desc="Our privacy policy will be published here." />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected Dashboard Routes */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/dashboard/deployments" element={<PrivateRoute><DeploymentPipeline /></PrivateRoute>} />
          <Route path="/dashboard/monitoring" element={<PrivateRoute><Monitoring /></PrivateRoute>} />
          <Route path="/dashboard/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
          <Route path="/dashboard/resources" element={<PrivateRoute><CloudResources /></PrivateRoute>} />
          <Route path="/dashboard/containers" element={<PrivateRoute><Containers /></PrivateRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
