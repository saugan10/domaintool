import React from 'react';
import { 
  Lightbulb, 
  Search, 
  RefreshCw, 
  ExternalLink,
  CheckCircle,
  XCircle,
  Star,
  TrendingUp,
  Sparkles,
  Zap,
  Target
} from 'lucide-react';
import { DomainSuggestion } from '../types';
import { mockSuggestions } from '../data/mockData';

export default function Suggestions() {
  const [projectDescription, setProjectDescription] = React.useState('');
  const [preferredStyle, setPreferredStyle] = React.useState<'catchy' | 'professional' | 'tech' | 'creative'>('professional');
  const [suggestions, setSuggestions] = React.useState<DomainSuggestion[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasSearched, setHasSearched] = React.useState(false);

  const styles = [
    { 
      id: 'professional', 
      label: 'Professional', 
      description: 'Clean, business-focused names',
      icon: <Target size={20} />,
      gradient: 'from-blue-500/20 to-indigo-500/20',
      border: 'border-blue-500/20'
    },
    { 
      id: 'catchy', 
      label: 'Catchy', 
      description: 'Memorable, brandable names',
      icon: <Zap size={20} />,
      gradient: 'from-purple-500/20 to-pink-500/20',
      border: 'border-purple-500/20'
    },
    { 
      id: 'tech', 
      label: 'Tech', 
      description: 'Modern, technical sounding names',
      icon: <Sparkles size={20} />,
      gradient: 'from-emerald-500/20 to-cyan-500/20',
      border: 'border-emerald-500/20'
    },
    { 
      id: 'creative', 
      label: 'Creative', 
      description: 'Unique, artistic names',
      icon: <Lightbulb size={20} />,
      gradient: 'from-amber-500/20 to-orange-500/20',
      border: 'border-amber-500/20'
    },
  ] as const;

  const handleGenerateSuggestions = async () => {
    if (!projectDescription.trim()) return;

    setIsLoading(true);
    setHasSearched(true);

    setTimeout(() => {
      setSuggestions(mockSuggestions);
      setIsLoading(false);
    }, 2000);
  };

  const handlePurchase = (suggestion: DomainSuggestion) => {
    window.open(`https://${suggestion.registrar.toLowerCase()}.com/search?domain=${suggestion.name}${suggestion.extension}`, '_blank');
  };

  const getRegistrarColor = (registrar: string) => {
    switch (registrar.toLowerCase()) {
      case 'namecheap': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'godaddy': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'cloudflare': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center">
            <Lightbulb className="text-amber-400" size={24} />
          </div>
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Domain Suggestions
        </h1>
        <p className="text-gray-400 mt-3">Get AI-powered domain suggestions and find the best registrar deals</p>
      </div>

      {/* Input Form */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-[#111111] to-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-8 space-y-8">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Project Description
            </label>
            <textarea
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="Describe your project or business (e.g., 'A modern AI-powered task management app for teams')"
              rows={4}
              className="w-full px-6 py-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-400 resize-none transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-4">
              Preferred Style
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {styles.map((style) => (
                <label key={style.id} className="relative group cursor-pointer">
                  <input
                    type="radio"
                    name="style"
                    value={style.id}
                    checked={preferredStyle === style.id}
                    onChange={(e) => setPreferredStyle(e.target.value as any)}
                    className="sr-only"
                  />
                  <div className={`p-6 border-2 rounded-xl transition-all duration-200 ${
                    preferredStyle === style.id 
                      ? `bg-gradient-to-br ${style.gradient} ${style.border}` 
                      : 'border-[#2A2A2A] hover:border-[#3A3A3A] bg-[#1A1A1A]'
                  }`}>
                    <div className="flex items-start space-x-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        preferredStyle === style.id ? 'bg-white/10' : 'bg-[#2A2A2A]'
                      }`}>
                        <span className={preferredStyle === style.id ? 'text-white' : 'text-gray-400'}>
                          {style.icon}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{style.label}</h3>
                        <p className="text-sm text-gray-400 mt-1">{style.description}</p>
                      </div>
                      {preferredStyle === style.id && (
                        <CheckCircle className="text-blue-400" size={20} />
                      )}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerateSuggestions}
            disabled={!projectDescription.trim() || isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-blue-500/50 disabled:to-purple-600/50 text-white py-4 rounded-xl flex items-center justify-center space-x-3 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-blue-500/25"
          >
            {isLoading ? (
              <RefreshCw className="animate-spin" size={20} />
            ) : (
              <Search size={20} />
            )}
            <span className="font-medium">{isLoading ? 'Generating Suggestions...' : 'Generate Suggestions'}</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-16">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-400 border-t-transparent"></div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl animate-pulse"></div>
          </div>
          <p className="text-gray-400">Our AI is analyzing your project and generating perfect domain suggestions...</p>
        </div>
      )}

      {/* Results */}
      {hasSearched && !isLoading && suggestions.length > 0 && (
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-white">Domain Suggestions</h2>
            <p className="text-gray-400 mt-2">Here are some great options for your project</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="bg-gradient-to-br from-[#111111] to-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 hover:border-[#3A3A3A] hover:shadow-xl hover:shadow-black/20 transition-all duration-300 group">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
                      {suggestion.name}{suggestion.extension}
                    </h3>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getRegistrarColor(suggestion.registrar)}`}>
                        {suggestion.registrar}
                      </span>
                      {index === 0 && (
                        <span className="flex items-center space-x-1 text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-lg">
                          <Star size={12} fill="currentColor" />
                          <span className="text-xs font-medium">Recommended</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="ml-4">
                    {suggestion.available ? (
                      <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center">
                        <CheckCircle className="text-emerald-400" size={20} />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center">
                        <XCircle className="text-red-400" size={20} />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Availability</span>
                    <span className={`font-medium ${suggestion.available ? 'text-emerald-400' : 'text-red-400'}`}>
                      {suggestion.available ? 'Available' : 'Taken'}
                    </span>
                  </div>
                  {suggestion.available && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Annual Price</span>
                      <span className="font-semibold text-white">${suggestion.price}</span>
                    </div>
                  )}
                </div>

                {suggestion.available ? (
                  <button
                    onClick={() => handlePurchase(suggestion)}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-xl flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-blue-500/25"
                  >
                    <ExternalLink size={16} />
                    <span>Purchase Domain</span>
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full bg-[#1A1A1A] border border-[#2A2A2A] text-gray-500 py-3 rounded-xl cursor-not-allowed"
                  >
                    Domain Unavailable
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Pro Tips */}
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="text-blue-400" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-blue-300 mb-4">Pro Tips for Domain Selection</h3>
                <ul className="text-sm text-blue-200/80 space-y-2">
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                    <span>Choose domains that are easy to spell and remember</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                    <span>Consider multiple extensions (.com, .io, .app) for brand protection</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                    <span>Shorter domains are generally better for branding</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                    <span>Avoid hyphens and numbers if possible</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                    <span>Check trademark conflicts before purchasing</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {hasSearched && !isLoading && suggestions.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-500/20 to-gray-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lightbulb className="text-gray-400" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No suggestions found</h3>
          <p className="text-gray-400">
            Try adjusting your project description or preferred style.
          </p>
        </div>
      )}
    </div>
  );
}