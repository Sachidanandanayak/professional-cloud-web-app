import React from 'react';
import { User, Bell, Shield, Key, CreditCard, AlertTriangle, Loader2, Check } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Badge } from '../components/ui/Badge';
import { cn } from '../lib/utils';

export default function Settings() {
  const [activeTab, setActiveTab] = React.useState('profile');
  const [isSaving, setIsSaving] = React.useState(false);
  const [isSaved, setIsSaved] = React.useState(false);

  const [avatar, setAvatar] = React.useState<string | null>(() => localStorage.getItem('userAvatar') || null);
  const [firstName, setFirstName] = React.useState(() => localStorage.getItem('userFirstName') || 'John');
  const [lastName, setLastName] = React.useState(() => localStorage.getItem('userLastName') || 'Doe');
  const [email, setEmail] = React.useState(() => localStorage.getItem('userEmail') || 'john@example.com');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSave = () => {
    setIsSaving(true);
    // Save to localStorage
    if (avatar) localStorage.setItem('userAvatar', avatar);
    localStorage.setItem('userFirstName', firstName);
    localStorage.setItem('userLastName', lastName);
    localStorage.setItem('userEmail', email);

    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }, 1500);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'api-keys', name: 'API Keys', icon: Key },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'billing', name: 'Billing', icon: CreditCard },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Settings</h1>
        <p className="text-muted">Manage your account settings and preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Navigation */}
        <div className="w-full md:w-64 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium",
                activeTab === tab.id 
                  ? "bg-primary/20 text-primary" 
                  : "text-muted hover:bg-white/5 hover:text-white"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="flex-1 space-y-6">
          {activeTab === 'profile' && (
            <Card glass>
              <CardHeader>
                <CardTitle>Profile Details</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-20 h-20 rounded-full border-2 border-border/50 bg-transparent flex shrink-0 overflow-hidden items-center justify-center">
                    {avatar ? (
                      <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : null}
                  </div>
                  <div>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      accept="image/png, image/jpeg, image/gif" 
                      className="hidden" 
                    />
                    <Button 
                      variant="outline" 
                      className="mb-2 bg-transparent border-border/50 hover:bg-white/5"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Change Avatar
                    </Button>
                    <p className="text-xs text-muted">JPG, GIF or PNG. Max size of 800K</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </CardContent>
              <CardFooter className="border-t border-border/30 pt-6">
                <Button onClick={handleSave} disabled={isSaving || isSaved}>
                  {isSaving ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                  ) : isSaved ? (
                    <><Check className="w-4 h-4 mr-2" /> Saved</>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </CardFooter>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card glass>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Update your password and secure your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
              </CardContent>
              <CardFooter className="border-t border-border/30 pt-6 flex justify-between items-center">
                <Button>Update Password</Button>
                <Button variant="outline">Enable Two-Factor Auth</Button>
              </CardFooter>
            </Card>
          )}

          {/* Danger Zone */}
          {activeTab === 'security' && (
            <Card glass className="border-danger/50">
              <CardHeader>
                <CardTitle className="text-danger flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Danger Zone
                </CardTitle>
                <CardDescription>Irreversible actions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                <Button variant="danger">Delete Account</Button>
              </CardContent>
            </Card>
          )}

          {activeTab === 'api-keys' && (
             <Card glass>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>Manage your API keys for external integrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-black/40 rounded-lg border border-border mb-4">
                   <div>
                     <p className="text-sm font-medium text-white mb-1">Production Key</p>
                     <p className="text-xs text-muted font-mono">sk_live_••••••••••••••••••••••••</p>
                   </div>
                   <div className="flex gap-2">
                     <Button variant="outline" size="sm">Reveal</Button>
                     <Button variant="outline" size="sm">Revoke</Button>
                   </div>
                </div>
                <Button>Generate New Key</Button>
              </CardContent>
             </Card>
          )}

          {activeTab === 'notifications' && (
            <Card glass>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose what updates you want to receive.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div className="flex items-center justify-between">
                   <div>
                     <p className="font-medium text-white">Email Notifications</p>
                     <p className="text-sm text-muted">Receive daily reports and alerts via email.</p>
                   </div>
                   <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary cursor-pointer" />
                 </div>
                 <div className="flex items-center justify-between">
                   <div>
                     <p className="font-medium text-white">Push Notifications</p>
                     <p className="text-sm text-muted">Get real-time alerts in your browser.</p>
                   </div>
                   <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary cursor-pointer" />
                 </div>
                 <div className="flex items-center justify-between">
                   <div>
                     <p className="font-medium text-white">SMS Alerts</p>
                     <p className="text-sm text-muted">For critical security and downtime alerts.</p>
                   </div>
                   <input type="checkbox" className="w-5 h-5 accent-primary cursor-pointer" />
                 </div>
              </CardContent>
              <CardFooter className="border-t border-border/30 pt-6">
                <Button onClick={handleSave} disabled={isSaving || isSaved}>
                  {isSaving ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                  ) : isSaved ? (
                    <><Check className="w-4 h-4 mr-2" /> Saved</>
                  ) : (
                    "Save Preferences"
                  )}
                </Button>
              </CardFooter>
            </Card>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-6">
              <Card glass>
                <CardHeader>
                  <CardTitle>Current Plan</CardTitle>
                  <CardDescription>You are currently on the Pro plan.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white">$49.00 <span className="text-sm font-normal text-muted">/ month</span></h3>
                      <p className="text-sm text-muted mt-1">Up to 10 team members and 500GB storage.</p>
                    </div>
                    <Badge variant="primary">Pro Plan</Badge>
                  </div>
                  <Button variant="outline" className="w-full sm:w-auto">Upgrade Plan</Button>
                </CardContent>
              </Card>

              <Card glass>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                  <CardDescription>Manage how you pay for your subscription.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-black/40 rounded-lg border border-border">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-white/10 rounded flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Visa ending in 4242</p>
                        <p className="text-xs text-muted">Expires 12/2028</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
