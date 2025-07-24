import React from 'react';
import { 
  Search, 
  CheckCircle, 
  AlertCircle, 
  Copy, 
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  Globe,
  Sparkles,
  Shield,
  Zap
} from 'lucide-react';
import { AddDomainState, NavigationPage } from '../types';

interface AddDomainProps {
  onNavigate: (page: NavigationPage) => void;
  onAddDomain: (domain: string) => void;
}

export default function AddDomain({ onNavigate, onAddDomain }: AddDomainProps) {
  const [state, setState] = React.useState<AddDomainState>({
    step: 1,
    domain: '',
    domainInfo: null,
    verificationTxt: '',
    isVerified: false
  });

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSearchDomain = async () => {
    if (!state.domain.trim()) {
      setError('Please enter a domain name');
      return;
    }

    setIsLoading(true);
    setError('');

    setTimeout(() => {
      setState(prev => ({
        ...prev,
        step: 2,
        domainInfo: {
          registrar: 'Namecheap',
          expiryDate: '2025-12-15',
          owner: 'John Doe'
        }
      }));
      setIsLoading(false);
    }, 1500);
  };

  const handleProceedToVerification = () => {
    const txtRecord = `domain-verification-${Math.random().toString(36).substr(2, 9)}`;
    setState(prev => ({
      ...prev,
      step: 3,
      verificationTxt: txtRecord
    }));
  };

  const handleVerifyDomain = async () => {
    setIsLoading(true);
    
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        isVerified: true
      }));
      setIsLoading(false);
      
      setTimeout(() => {
        setState(prev => ({ ...prev, step: 4 }));
      }, 1000);
    }, 2000);
  };

  const handleFinish = () => {
    onAddDomain(state.domain);
    onNavigate('domains');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const steps = [
    { number: 1, title: 'Search', icon: <Search size={16} /> },
    { number: 2, title: 'Review', icon: <Globe size={16} /> },
    { number: 3, title: 'Verify', icon: <Shield size={16} /> },
    { number: 4, title: 'Complete', icon: <Sparkles size={16} /> },
  ];

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Add New Domain
          </h1>
          <p className="text-gray-400 mt-3">Follow the steps to add and verify your domain</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                  state.step >= step.number 
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25' 
                    : 'bg-[#1A1A1A] border border-[#2A2A2A] text-gray-400'
                }`}>
                  {state.step > step.number ? <CheckCircle size={18} /> : step.icon}
                </div>
                <span className={`text-xs mt-2 font-medium ${
                  state.step >= step.number ? 'text-white' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 transition-all duration-300 ${
                  state.step > step.number ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-[#2A2A2A]'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-gradient-to-br from-[#111111] to-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-8">
          {/* Step 1: Search Domain */}
          {state.step === 1 && (
            <div className="space-y-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Search className="text-blue-400" size={24} />
                </div>
                <h2 className="text-2xl font-semibold text-white">Search Your Domain</h2>
                <p className="text-gray-400 mt-3">Enter the domain name you want to add to your portfolio</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Domain Name
                  </label>
                  <input
                    type="text"
                    value={state.domain}
                    onChange={(e) => setState(prev => ({ ...prev, domain: e.target.value }))}
                    placeholder="example.com"
                    className="w-full px-6 py-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-400 transition-all duration-200"
                  />
                </div>

                {error && (
                  <div className="flex items-center space-x-3 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  onClick={handleSearchDomain}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-blue-500/50 disabled:to-purple-600/50 text-white py-4 rounded-xl flex items-center justify-center space-x-3 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-blue-500/25"
                >
                  {isLoading ? (
                    <RefreshCw className="animate-spin" size={20} />
                  ) : (
                    <Search size={20} />
                  )}
                  <span className="font-medium">{isLoading ? 'Searching...' : 'Search Domain'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Manual Review */}
          {state.step === 2 && state.domainInfo && (
            <div className="space-y-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Globe className="text-emerald-400" size={24} />
                </div>
                <h2 className="text-2xl font-semibold text-white">Domain Information</h2>
                <p className="text-gray-400 mt-3">Review the details for <strong className="text-white">{state.domain}</strong></p>
              </div>

              <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6 space-y-4">
                {[
                  { label: 'Domain', value: state.domain },
                  { label: 'Registrar', value: state.domainInfo.registrar },
                  { label: 'Expiry Date', value: state.domainInfo.expiryDate },
                  { label: 'Owner', value: state.domainInfo.owner }
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2">
                    <span className="text-gray-400">{item.label}</span>
                    <span className="font-medium text-white">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setState(prev => ({ ...prev, step: 1 }))}
                  className="flex-1 bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#3A3A3A] text-white py-4 rounded-xl flex items-center justify-center space-x-2 transition-all duration-200"
                >
                  <ArrowLeft size={18} />
                  <span>Back</span>
                </button>
                <button
                  onClick={handleProceedToVerification}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-4 rounded-xl flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-blue-500/25"
                >
                  <span>Continue</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Ownership Verification */}
          {state.step === 3 && (
            <div className="space-y-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Shield className="text-amber-400" size={24} />
                </div>
                <h2 className="text-2xl font-semibold text-white">Verify Domain Ownership</h2>
                <p className="text-gray-400 mt-3">Add this TXT record to verify you own <strong className="text-white">{state.domain}</strong></p>
              </div>

              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6">
                <h3 className="font-semibold text-blue-300 mb-4 flex items-center space-x-2">
                  <Zap size={18} />
                  <span>DNS TXT Record</span>
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'Name/Host', value: '@' },
                    { label: 'Value', value: state.verificationTxt }
                  ].map((record, index) => (
                    <div key={index} className="flex items-center justify-between bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4">
                      <div>
                        <p className="text-sm font-medium text-gray-300">{record.label}</p>
                        <p className="text-sm text-gray-400 font-mono break-all mt-1">{record.value}</p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(record.value)}
                        className="text-blue-400 hover:text-blue-300 p-2 hover:bg-blue-500/10 rounded-lg transition-all duration-200"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-6">
                <h4 className="font-semibold text-amber-300 mb-3">Instructions:</h4>
                <ol className="text-sm text-amber-200/80 space-y-2 list-decimal list-inside">
                  <li>Log in to your domain registrar's control panel</li>
                  <li>Navigate to DNS management for {state.domain}</li>
                  <li>Add a new TXT record with the values above</li>
                  <li>Save the changes and wait for DNS propagation (up to 48 hours)</li>
                  <li>Click "Verify Domain" below to check the record</li>
                </ol>
              </div>

              {state.isVerified && (
                <div className="flex items-center space-x-3 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                  <CheckCircle size={20} />
                  <span className="font-medium">Domain verification successful!</span>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={() => setState(prev => ({ ...prev, step: 2 }))}
                  className="flex-1 bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#3A3A3A] text-white py-4 rounded-xl flex items-center justify-center space-x-2 transition-all duration-200"
                >
                  <ArrowLeft size={18} />
                  <span>Back</span>
                </button>
                <button
                  onClick={handleVerifyDomain}
                  disabled={isLoading || state.isVerified}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 disabled:from-emerald-500/50 disabled:to-green-600/50 text-white py-4 rounded-xl flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-emerald-500/25"
                >
                  {isLoading ? (
                    <RefreshCw className="animate-spin" size={18} />
                  ) : (
                    <CheckCircle size={18} />
                  )}
                  <span>{isLoading ? 'Verifying...' : state.isVerified ? 'Verified' : 'Verify Domain'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Final Confirmation */}
          {state.step === 4 && (
            <div className="space-y-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="text-emerald-400" size={24} />
                </div>
                <h2 className="text-2xl font-semibold text-white">Domain Added Successfully!</h2>
                <p className="text-gray-400 mt-3">
                  <strong className="text-white">{state.domain}</strong> has been added to your portfolio
                </p>
              </div>

              <div className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-xl p-6">
                <h3 className="font-semibold text-emerald-300 mb-4">What's Next?</h3>
                <ul className="text-sm text-emerald-200/80 space-y-2">
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                    <span>Your domain is now being monitored for expiration</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                    <span>Website status checks will run automatically</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                    <span>You'll receive renewal reminders before expiration</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                    <span>DNS records are available for management</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={handleFinish}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-4 rounded-xl flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-blue-500/25"
              >
                <span>Go to Domains</span>
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}