import React from 'react';
import { 
  Globe, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Calendar,
  TrendingUp,
  Activity,
  Plus,
  ExternalLink,
  ArrowUpRight,
  Zap,
  Shield
} from 'lucide-react';
import { Domain, NavigationPage } from '../types';

interface DashboardProps {
  domains: Domain[];
  onNavigate: (page: NavigationPage) => void;
}

export default function Dashboard({ domains, onNavigate }: DashboardProps) {
  const activeDomains = domains.filter(d => d.status === 'active');
  const expiringDomains = domains.filter(d => d.status === 'expiring');
  const expiredDomains = domains.filter(d => d.status === 'expired');
  const liveDomains = domains.filter(d => d.isLive);

  const upcomingRenewals = domains
    .filter(d => d.daysRemaining > 0 && d.daysRemaining <= 30)
    .sort((a, b) => a.daysRemaining - b.daysRemaining);

  const recentActivity = [
    { domain: 'myawesome-startup.com', action: 'Domain verified', time: '2h', type: 'success' },
    { domain: 'tech-solutions.io', action: 'SSL renewed', time: '1d', type: 'success' },
    { domain: 'old-project.net', action: 'Domain expired', time: '3d', type: 'error' },
    { domain: 'portfolio-site.dev', action: 'DNS updated', time: '1w', type: 'info' },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-400 mt-2">Monitor and manage your domain portfolio</p>
        </div>
        <button
          onClick={() => onNavigate('add-domain')}
          className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-blue-500/25"
        >
          <Plus size={18} />
          <span className="font-medium">Add Domain</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-[#111111] to-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 hover:border-[#3A3A3A] transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Total Domains</p>
              <p className="text-3xl font-bold text-white mt-1">{domains.length}</p>
              <p className="text-xs text-emerald-400 mt-2 flex items-center">
                <TrendingUp size={12} className="mr-1" />
                +12% from last month
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Globe className="text-blue-400" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#111111] to-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 hover:border-[#3A3A3A] transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Active</p>
              <p className="text-3xl font-bold text-emerald-400 mt-1">{activeDomains.length}</p>
              <p className="text-xs text-gray-500 mt-2">Healthy domains</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <CheckCircle className="text-emerald-400" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#111111] to-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 hover:border-[#3A3A3A] transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Expiring Soon</p>
              <p className="text-3xl font-bold text-amber-400 mt-1">{expiringDomains.length}</p>
              <p className="text-xs text-amber-400 mt-2">Needs attention</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <AlertTriangle className="text-amber-400" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#111111] to-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 hover:border-[#3A3A3A] transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Live Sites</p>
              <p className="text-3xl font-bold text-blue-400 mt-1">{liveDomains.length}</p>
              <p className="text-xs text-blue-400 mt-2">Online now</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Activity className="text-blue-400" size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Renewals */}
        <div className="bg-gradient-to-br from-[#111111] to-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 hover:border-[#3A3A3A] transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center">
                <Calendar className="text-purple-400" size={20} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Upcoming Renewals</h2>
                <p className="text-sm text-gray-400">Domains expiring soon</p>
              </div>
            </div>
          </div>
          
          {upcomingRenewals.length > 0 ? (
            <div className="space-y-3">
              {upcomingRenewals.slice(0, 5).map((domain) => (
                <div key={domain.id} className="flex items-center justify-between p-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl hover:border-[#3A3A3A] transition-all duration-200 group">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      domain.daysRemaining <= 7 ? 'bg-red-400' : 
                      domain.daysRemaining <= 14 ? 'bg-amber-400' : 'bg-emerald-400'
                    }`} />
                    <div>
                      <p className="font-medium text-white group-hover:text-blue-400 transition-colors">{domain.name}</p>
                      <p className="text-sm text-gray-400">{domain.registrar}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${
                      domain.daysRemaining <= 7 ? 'text-red-400' : 
                      domain.daysRemaining <= 14 ? 'text-amber-400' : 'text-white'
                    }`}>
                      {domain.daysRemaining}d
                    </p>
                    <p className="text-xs text-gray-500">{domain.expiryDate}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Shield className="mx-auto h-12 w-12 text-gray-600 mb-3" />
              <p className="text-gray-400">All domains are up to date</p>
            </div>
          )}
        </div>

        {/* Website Status */}
        <div className="bg-gradient-to-br from-[#111111] to-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 hover:border-[#3A3A3A] transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-xl flex items-center justify-center">
                <Zap className="text-emerald-400" size={20} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Website Status</h2>
                <p className="text-sm text-gray-400">Live monitoring</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            {domains.slice(0, 5).map((domain) => (
              <div key={domain.id} className="flex items-center justify-between p-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl hover:border-[#3A3A3A] transition-all duration-200 group">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    domain.isLive ? 'bg-emerald-400 shadow-lg shadow-emerald-400/50' : 'bg-red-400 shadow-lg shadow-red-400/50'
                  }`} />
                  <div>
                    <p className="font-medium text-white group-hover:text-blue-400 transition-colors">{domain.name}</p>
                    <p className="text-sm text-gray-400">
                      {domain.isLive ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                  <ExternalLink size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gradient-to-br from-[#111111] to-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 hover:border-[#3A3A3A] transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
              <Activity className="text-blue-400" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
              <p className="text-sm text-gray-400">Latest domain events</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center space-x-4 p-3 rounded-xl hover:bg-[#1A1A1A] transition-colors duration-200 group">
              <div className={`w-2 h-2 rounded-full ${
                activity.type === 'success' ? 'bg-emerald-400 shadow-lg shadow-emerald-400/50' :
                activity.type === 'error' ? 'bg-red-400 shadow-lg shadow-red-400/50' : 'bg-blue-400 shadow-lg shadow-blue-400/50'
              }`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">{activity.domain}</p>
                <p className="text-sm text-gray-400">{activity.action}</p>
              </div>
              <div className="flex items-center space-x-2">
                <p className="text-xs text-gray-500">{activity.time}</p>
                <ArrowUpRight size={14} className="text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}