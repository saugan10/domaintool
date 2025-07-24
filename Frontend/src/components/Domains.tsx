import React from 'react';
import { 
  Search, 
  Plus, 
  Calendar, 
  Trash2, 
  RefreshCw,
  Globe,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ExternalLink,
  ArrowLeft,
  Shield,
  Zap,
  Clock
} from 'lucide-react';
import { Domain, NavigationPage } from '../types';

interface DomainsProps {
  domains: Domain[];
  onNavigate: (page: NavigationPage) => void;
  onDeleteDomain: (domainId: string) => void;
}

export default function Domains({ domains, onNavigate, onDeleteDomain }: DomainsProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedDomain, setSelectedDomain] = React.useState<Domain | null>(null);

  const filteredDomains = domains.filter(domain =>
    domain.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    domain.registrar.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: Domain['status']) => {
    switch (status) {
      case 'active': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'expiring': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'expired': return 'text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getStatusIcon = (status: Domain['status']) => {
    switch (status) {
      case 'active': return <CheckCircle size={16} />;
      case 'expiring': return <AlertTriangle size={16} />;
      case 'expired': return <XCircle size={16} />;
      default: return <Globe size={16} />;
    }
  };

  const handleRenewDomain = (domainId: string) => {
    alert(`Renewing domain ${domains.find(d => d.id === domainId)?.name}`);
  };

  if (selectedDomain) {
    return (
      <div className="p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <button
            onClick={() => setSelectedDomain(null)}
            className="mb-8 text-blue-400 hover:text-blue-300 flex items-center space-x-2 transition-colors group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Domains</span>
          </button>

          {/* Domain Details */}
          <div className="bg-gradient-to-br from-[#111111] to-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {selectedDomain.name}
                </h1>
                <p className="text-gray-400 mt-2">Domain management and monitoring</p>
              </div>
              <div className="mt-4 sm:mt-0">
                <span className={`px-4 py-2 rounded-xl text-sm font-medium border flex items-center space-x-2 ${getStatusColor(selectedDomain.status)}`}>
                  {getStatusIcon(selectedDomain.status)}
                  <span className="capitalize">{selectedDomain.status}</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-6">
                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                      <Globe className="text-blue-400" size={16} />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Domain Info</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Registrar</span>
                      <span className="font-medium text-white">{selectedDomain.registrar}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Expiry Date</span>
                      <span className="font-medium text-white">{selectedDomain.expiryDate}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Days Remaining</span>
                      <span className={`font-medium ${
                        selectedDomain.daysRemaining <= 7 ? 'text-red-400' : 
                        selectedDomain.daysRemaining <= 30 ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {selectedDomain.daysRemaining} days
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Auto Renew</span>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${selectedDomain.autoRenew ? 'bg-emerald-400' : 'bg-gray-500'}`} />
                        <span className={`font-medium ${selectedDomain.autoRenew ? 'text-emerald-400' : 'text-gray-400'}`}>
                          {selectedDomain.autoRenew ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-lg flex items-center justify-center">
                      <Zap className="text-emerald-400" size={16} />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Website Status</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Status</span>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${
                          selectedDomain.isLive ? 'bg-emerald-400 shadow-lg shadow-emerald-400/50' : 'bg-red-400 shadow-lg shadow-red-400/50'
                        }`} />
                        <span className={`font-medium ${selectedDomain.isLive ? 'text-emerald-400' : 'text-red-400'}`}>
                          {selectedDomain.isLive ? 'Online' : 'Offline'}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Last Checked</span>
                      <div className="flex items-center space-x-2">
                        <Clock size={14} className="text-gray-500" />
                        <span className="font-medium text-white">5 minutes ago</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Response Time</span>
                      <span className="font-medium text-emerald-400">142ms</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 pt-6 border-t border-[#2A2A2A]">
              <button
                onClick={() => onNavigate('dns-records')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-blue-500/25"
              >
                <Globe size={18} />
                <span>DNS Records</span>
              </button>
              <button
                onClick={() => handleRenewDomain(selectedDomain.id)}
                className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-emerald-500/25"
              >
                <RefreshCw size={18} />
                <span>Renew Domain</span>
              </button>
              <button className="bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#3A3A3A] text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200">
                <ExternalLink size={18} />
                <span>Visit Website</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            My Domains
          </h1>
          <p className="text-gray-400 mt-2">Manage your domain portfolio</p>
        </div>
        <button
          onClick={() => onNavigate('add-domain')}
          className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-blue-500/25"
        >
          <Plus size={18} />
          <span>Add Domain</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search domains..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-[#111111] border border-[#2A2A2A] rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-400 transition-all duration-200"
        />
      </div>

      {/* Domain Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDomains.map((domain) => (
          <div key={domain.id} className="bg-gradient-to-br from-[#111111] to-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 hover:border-[#3A3A3A] hover:shadow-xl hover:shadow-black/20 transition-all duration-300 group">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
                  {domain.name}
                </h3>
                <p className="text-sm text-gray-400 mt-1">{domain.registrar}</p>
              </div>
              <span className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center space-x-1 ${getStatusColor(domain.status)}`}>
                {getStatusIcon(domain.status)}
                <span className="capitalize">{domain.status}</span>
              </span>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Expires</span>
                <span className="font-medium text-white">{domain.expiryDate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Days Left</span>
                <span className={`font-medium ${
                  domain.daysRemaining <= 7 ? 'text-red-400' : 
                  domain.daysRemaining <= 30 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {domain.daysRemaining > 0 ? `${domain.daysRemaining} days` : 'Expired'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Website</span>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    domain.isLive ? 'bg-emerald-400 shadow-lg shadow-emerald-400/50' : 'bg-red-400 shadow-lg shadow-red-400/50'
                  }`} />
                  <span className={`font-medium ${domain.isLive ? 'text-emerald-400' : 'text-red-400'}`}>
                    {domain.isLive ? 'Live' : 'Down'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#2A2A2A]">
              <button
                onClick={() => setSelectedDomain(domain)}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
              >
                View Details
              </button>
              <div className="flex items-center space-x-2">
                {domain.status !== 'expired' && (
                  <button
                    onClick={() => handleRenewDomain(domain.id)}
                    className="p-2 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all duration-200"
                  >
                    <RefreshCw size={16} />
                  </button>
                )}
                <button
                  onClick={() => onDeleteDomain(domain.id)}
                  className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDomains.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-500/20 to-gray-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Globe className="text-gray-400" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No domains found</h3>
          <p className="text-gray-400 mb-8">
            {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first domain.'}
          </p>
          <button
            onClick={() => onNavigate('add-domain')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 mx-auto transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-blue-500/25"
          >
            <Plus size={18} />
            <span>Add Domain</span>
          </button>
        </div>
      )}
    </div>
  );
}