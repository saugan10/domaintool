import React from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Key, 
  Mail,
  Smartphone,
  Save,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Copy,
  RefreshCw
} from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = React.useState<'profile' | 'notifications' | 'security'>('profile');
  const [showApiKey, setShowApiKey] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    timezone: 'America/New_York',
    renewalAlerts: true,
    expirationAlerts: true,
    dnsChangeAlerts: true,
    emailNotifications: true,
    smsNotifications: false,
    twoFactorEnabled: false,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const apiKey = 'dk_live_51H1jXmFYBrQaB7BQvQcOv2wNH8wY9jKcvQe8W1zKvTdLd8YzNrO6pBKzPqJ4';

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'security', label: 'Security', icon: <Shield size={18} /> },
  ] as const;

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (section: string) => {
    alert(`${section} settings saved successfully!`);
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
  };

  const generateNewApiKey = () => {
    alert('New API key generated! Make sure to update your applications.');
  };

  const enable2FA = () => {
    alert('Two-factor authentication setup initiated. Check your email for instructions.');
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Account Settings
        </h1>
        <p className="text-gray-400 mt-2">Manage your account preferences and security settings</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#2A2A2A]">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-all duration-200 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-8">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-gradient-to-br from-[#111111] to-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                  <User className="text-blue-400" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Profile Information</h2>
                  <p className="text-gray-400">Update your personal details</p>
                </div>
              </div>
              <button
                onClick={() => handleSave('Profile')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-blue-500/25"
              >
                <Save size={18} />
                <span>Save Changes</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {[
                { label: 'Full Name', field: 'name', type: 'text' },
                { label: 'Email Address', field: 'email', type: 'email' },
                { label: 'Phone Number', field: 'phone', type: 'tel' },
              ].map((input) => (
                <div key={input.field}>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    {input.label}
                  </label>
                  <input
                    type={input.type}
                    value={formData[input.field as keyof typeof formData] as string}
                    onChange={(e) => handleInputChange(input.field, e.target.value)}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white transition-all duration-200"
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Timezone
                </label>
                <select
                  value={formData.timezone}
                  onChange={(e) => handleInputChange('timezone', e.target.value)}
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white"
                >
                  <option value="America/New_York">Eastern Time (UTC-5)</option>
                  <option value="America/Chicago">Central Time (UTC-6)</option>
                  <option value="America/Denver">Mountain Time (UTC-7)</option>
                  <option value="America/Los_Angeles">Pacific Time (UTC-8)</option>
                  <option value="Europe/London">London (UTC+0)</option>
                  <option value="Europe/Paris">Paris (UTC+1)</option>
                  <option value="Asia/Tokyo">Tokyo (UTC+9)</option>
                </select>
              </div>
            </div>

            {/* API Key Section */}
            <div className="pt-8 border-t border-[#2A2A2A]">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-xl flex items-center justify-center">
                  <Key className="text-emerald-400" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">API Access</h3>
                  <p className="text-gray-400">Manage your API credentials</p>
                </div>
              </div>
              <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-medium text-gray-300">API Key</label>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="text-gray-400 hover:text-white p-2 hover:bg-[#2A2A2A] rounded-lg transition-all duration-200"
                    >
                      {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <button
                      onClick={copyApiKey}
                      className="text-blue-400 hover:text-blue-300 p-2 hover:bg-blue-500/10 rounded-lg transition-all duration-200"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
                <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-4 font-mono text-sm text-gray-300 mb-4">
                  {showApiKey ? apiKey : '•'.repeat(48)}
                </div>
                <button
                  onClick={generateNewApiKey}
                  className="text-red-400 hover:text-red-300 text-sm font-medium flex items-center space-x-2 p-2 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                >
                  <RefreshCw size={16} />
                  <span>Generate New Key</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="bg-gradient-to-br from-[#111111] to-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl flex items-center justify-center">
                  <Bell className="text-amber-400" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Notification Preferences</h2>
                  <p className="text-gray-400">Configure how you receive alerts</p>
                </div>
              </div>
              <button
                onClick={() => handleSave('Notification')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-blue-500/25"
              >
                <Save size={18} />
                <span>Save Changes</span>
              </button>
            </div>

            <div className="space-y-8">
              {/* Alert Types */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-6">Alert Types</h3>
                <div className="space-y-4">
                  {[
                    { key: 'renewalAlerts', title: 'Renewal Reminders', desc: 'Get notified before your domains expire' },
                    { key: 'expirationAlerts', title: 'Expiration Alerts', desc: 'Alert when domains have expired' },
                    { key: 'dnsChangeAlerts', title: 'DNS Changes', desc: 'Monitor DNS record modifications' },
                  ].map((alert) => (
                    <label key={alert.key} className="flex items-start space-x-4 p-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl hover:border-[#3A3A3A] transition-all duration-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData[alert.key as keyof typeof formData] as boolean}
                        onChange={(e) => handleInputChange(alert.key, e.target.checked)}
                        className="mt-1 w-4 h-4 text-blue-600 bg-[#2A2A2A] border-[#3A3A3A] rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <div>
                        <span className="text-sm font-medium text-white">{alert.title}</span>
                        <p className="text-sm text-gray-400 mt-1">{alert.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Delivery Methods */}
              <div className="pt-8 border-t border-[#2A2A2A]">
                <h3 className="text-lg font-semibold text-white mb-6">Delivery Methods</h3>
                <div className="space-y-4">
                  {[
                    { key: 'emailNotifications', title: 'Email Notifications', icon: <Mail size={18} /> },
                    { key: 'smsNotifications', title: 'SMS Notifications', icon: <Smartphone size={18} /> },
                  ].map((method) => (
                    <label key={method.key} className="flex items-center space-x-4 p-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl hover:border-[#3A3A3A] transition-all duration-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData[method.key as keyof typeof formData] as boolean}
                        onChange={(e) => handleInputChange(method.key, e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-[#2A2A2A] border-[#3A3A3A] rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <div className="text-gray-400">
                        {method.icon}
                      </div>
                      <span className="text-sm font-medium text-white">{method.title}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-8">
            {/* Password Change */}
            <div className="bg-gradient-to-br from-[#111111] to-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-xl flex items-center justify-center">
                    <Shield className="text-red-400" size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">Change Password</h2>
                    <p className="text-gray-400">Update your account password</p>
                  </div>
                </div>
                <button
                  onClick={() => handleSave('Password')}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-blue-500/25"
                >
                  <Save size={18} />
                  <span>Update Password</span>
                </button>
              </div>

              <div className="space-y-6 max-w-md">
                {[
                  { label: 'Current Password', field: 'currentPassword', showToggle: true },
                  { label: 'New Password', field: 'newPassword' },
                  { label: 'Confirm New Password', field: 'confirmPassword' },
                ].map((input) => (
                  
                  <div key={input.field}>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      {input.label}
                    </label>
                    <div className="relative">
                      <input
                        type={input.showToggle && showPassword ? 'text' : 'password'}
                        value={formData[input.field as keyof typeof formData] as string}
                        onChange={(e) => handleInputChange(input.field, e.target.value)}
                        className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white pr-12 transition-all duration-200"
                      />
                      {input.showToggle && (
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Two-Factor Authentication */}
            <div className="bg-gradient-to-br from-[#111111] to-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-xl flex items-center justify-center">
                  <Shield className="text-emerald-400" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Two-Factor Authentication</h2>
                  <p className="text-gray-400">Add an extra layer of security</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-6 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl">
                <div className="flex items-center space-x-4">
                  {formData.twoFactorEnabled ? (
                    <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center">
                      <CheckCircle className="text-emerald-400" size={20} />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center">
                      <AlertTriangle className="text-amber-400" size={20} />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-white">
                      {formData.twoFactorEnabled ? 'Enabled' : 'Not Enabled'}
                    </p>
                    <p className="text-sm text-gray-400">
                      {formData.twoFactorEnabled 
                        ? 'Your account is protected with two-factor authentication'
                        : 'Add an extra layer of security to your account'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={enable2FA}
                  className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    formData.twoFactorEnabled
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                  }`}
                >
                  {formData.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                </button>
              </div>
            </div>

            {/* Security Tips */}
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                  <Shield className="text-blue-400" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-300 mb-4">Security Best Practices</h3>
                  <ul className="text-sm text-blue-200/80 space-y-2">
                    {[
                      'Use a strong, unique password for your account',
                      'Enable two-factor authentication for additional security',
                      'Keep your API keys secure and rotate them regularly',
                      'Monitor your account activity and notifications',
                      'Log out from shared or public computers',
                    ].map((tip, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}