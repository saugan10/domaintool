import React from 'react';
import { 
  Search, 
  RefreshCw, 
  Download, 
  Filter,
  ChevronDown,
  Globe,
  Copy,
  Eye,
  EyeOff,
  Code,
  Database
} from 'lucide-react';
import { DNSRecord } from '../types';
import { mockDNSRecords } from '../data/mockData';

export default function DNSRecords() {
  const [selectedDomain, setSelectedDomain] = React.useState<string>('myawesome-startup.com');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedType, setSelectedType] = React.useState<string>('all');
  const [showRawJSON, setShowRawJSON] = React.useState(false);

  const domains = Object.keys(mockDNSRecords);
  const records = mockDNSRecords[selectedDomain] || [];

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || record.type === selectedType;
    return matchesSearch && matchesType;
  });

  const recordTypes = ['all', ...Array.from(new Set(records.map(r => r.type)))];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleRefresh = () => {
    alert('DNS records refreshed!');
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(filteredRecords, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `${selectedDomain}-dns-records.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const getRecordTypeColor = (type: string) => {
    switch (type) {
      case 'A': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'CNAME': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'MX': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'TXT': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            DNS Records
          </h1>
          <p className="text-gray-400 mt-2">Manage and inspect DNS records for your domains</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <button
            onClick={() => setShowRawJSON(!showRawJSON)}
            className="bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#3A3A3A] text-white px-4 py-2.5 rounded-xl flex items-center space-x-2 transition-all duration-200"
          >
            {showRawJSON ? <EyeOff size={16} /> : <Code size={16} />}
            <span>{showRawJSON ? 'Hide JSON' : 'Show JSON'}</span>
          </button>
        </div>
      </div>

      {/* Domain Selection */}
      <div className="bg-gradient-to-br from-[#111111] to-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
            <Database className="text-blue-400" size={20} />
          </div>
          <h2 className="text-lg font-semibold text-white">Select Domain</h2>
        </div>
        <div className="relative">
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="w-full md:w-auto px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white appearance-none pr-10"
          >
            {domains.map((domain) => (
              <option key={domain} value={domain}>{domain}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-gradient-to-br from-[#111111] to-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-12 pr-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-400"
              />
            </div>

            {/* Type Filter */}
            <div className="relative">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white appearance-none pr-10"
              >
                {recordTypes.map((type) => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Types' : type}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              className="bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#3A3A3A] text-white px-4 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200"
            >
              <RefreshCw size={16} />
              <span>Refresh</span>
            </button>
            <button
              onClick={handleExport}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-blue-500/25"
            >
              <Download size={16} />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Raw JSON View */}
      {showRawJSON && (
        <div className="bg-gradient-to-br from-[#111111] to-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Raw JSON Data</h2>
            <button
              onClick={() => copyToClipboard(JSON.stringify(filteredRecords, null, 2))}
              className="text-blue-400 hover:text-blue-300 flex items-center space-x-2 transition-colors"
            >
              <Copy size={16} />
              <span>Copy</span>
            </button>
          </div>
          <pre className="bg-[#0A0A0A] border border-[#2A2A2A] text-emerald-400 p-6 rounded-xl overflow-x-auto text-sm font-mono">
            {JSON.stringify(filteredRecords, null, 2)}
          </pre>
        </div>
      )}

      {/* DNS Records Table */}
      <div className="bg-gradient-to-br from-[#111111] to-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 bg-[#1A1A1A] border-b border-[#2A2A2A]">
          <h2 className="text-lg font-semibold text-white">
            DNS Records for {selectedDomain} ({filteredRecords.length})
          </h2>
        </div>

        {filteredRecords.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#1A1A1A] border-b border-[#2A2A2A]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Value</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">TTL</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2A2A]">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-[#1A1A1A] transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1.5 text-xs font-medium rounded-lg border ${getRecordTypeColor(record.type)}`}>
                        {record.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-white font-mono">
                      {record.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300 font-mono max-w-xs truncate">
                      {record.value}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {record.ttl}s
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1.5 text-xs font-medium rounded-lg border ${
                        record.status === 'active' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : 'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => copyToClipboard(record.value)}
                        className="text-blue-400 hover:text-blue-300 p-2 hover:bg-blue-500/10 rounded-lg transition-all duration-200"
                      >
                        <Copy size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-500/20 to-gray-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Globe className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No DNS records found</h3>
            <p className="text-gray-400">
              {searchTerm || selectedType !== 'all' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'This domain has no DNS records configured.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}