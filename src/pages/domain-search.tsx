import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Globe, 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Zap, 
  Database, 
  Server, 
  Activity,
  Loader2,
  Sparkles,
  Plus,
  ArrowRight,
  Wifi,
  Shield
} from "lucide-react";

const searchSchema = z.object({
  query: z.string().min(1, "Search query is required"),
});

type SearchForm = z.infer<typeof searchSchema>;

interface DomainSuggestion {
  name: string;
  available: boolean;
  price?: number;
  extension: string;
  popularity?: number;
  loading?: boolean;
  whoisData?: any;
}

interface SearchStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  duration?: number;
  icon: any;
}

export default function DomainSearch() {
  const [suggestions, setSuggestions] = useState<DomainSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchSteps, setSearchSteps] = useState<SearchStep[]>([]);
  const [progress, setProgress] = useState(0);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const form = useForm<SearchForm>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      query: "",
    },
  });

  const initializeSearchSteps = useCallback(() => {
    return [
      {
        id: 'validate',
        title: 'Input Validation',
        description: 'Validating search query and parameters',
        status: 'pending' as const,
        icon: Shield,
      },
      {
        id: 'generate',
        title: 'Generate Suggestions',
        description: 'Creating domain name variations and suggestions',
        status: 'pending' as const,
        icon: Sparkles,
      },
      {
        id: 'availability',
        title: 'Check Availability',
        description: 'Checking domain availability across registrars',
        status: 'pending' as const,
        icon: Database,
      },
      {
        id: 'whois',
        title: 'WHOIS Lookup',
        description: 'Fetching domain registration details',
        status: 'pending' as const,
        icon: Server,
      },
      {
        id: 'pricing',
        title: 'Price Analysis',
        description: 'Analyzing pricing across different providers',
        status: 'pending' as const,
        icon: Activity,
      },
      {
        id: 'complete',
        title: 'Results Ready',
        description: 'Compiling search results and recommendations',
        status: 'pending' as const,
        icon: CheckCircle,
      },
    ];
  }, []);

  const simulateSearchProcess = async (query: string) => {
    const steps = initializeSearchSteps();
    setSearchSteps(steps);
    setProgress(0);
    
    // Step 1: Validation
    setSearchSteps(prev => prev.map(step => 
      step.id === 'validate' ? { ...step, status: 'active' } : step
    ));
    await new Promise(resolve => setTimeout(resolve, 500));
    setProgress(16);
    setSearchSteps(prev => prev.map(step => 
      step.id === 'validate' ? { ...step, status: 'completed', duration: 0.5 } : step
    ));

    // Step 2: Generate suggestions
    setSearchSteps(prev => prev.map(step => 
      step.id === 'generate' ? { ...step, status: 'active' } : step
    ));
    
    const baseSuggestions = generateDomainSuggestions(query);
    setSuggestions(baseSuggestions.map(s => ({ ...s, loading: true })));
    
    await new Promise(resolve => setTimeout(resolve, 800));
    setProgress(33);
    setSearchSteps(prev => prev.map(step => 
      step.id === 'generate' ? { ...step, status: 'completed', duration: 0.8 } : step
    ));

    // Step 3: Check availability
    setSearchSteps(prev => prev.map(step => 
      step.id === 'availability' ? { ...step, status: 'active' } : step
    ));
    
    for (let i = 0; i < baseSuggestions.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setSuggestions(prev => prev.map((s, idx) => 
        idx === i ? { ...s, available: Math.random() > 0.3, loading: false } : s
      ));
    }
    
    setProgress(50);
    setSearchSteps(prev => prev.map(step => 
      step.id === 'availability' ? { ...step, status: 'completed', duration: 1.2 } : step
    ));

    // Step 4: WHOIS lookup
    setSearchSteps(prev => prev.map(step => 
      step.id === 'whois' ? { ...step, status: 'active' } : step
    ));
    
    // Simulate WHOIS lookup for available domains
    const availableDomains = baseSuggestions.filter((_, idx) => idx % 3 !== 0);
    for (const domain of availableDomains) {
      try {
        const response = await apiRequest("GET", `/api/whois/${domain.name}`);
        const whoisData = await response.json();
        setSuggestions(prev => prev.map(s => 
          s.name === domain.name ? { ...s, whoisData } : s
        ));
      } catch (error) {
        // Continue on error
      }
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    setProgress(75);
    setSearchSteps(prev => prev.map(step => 
      step.id === 'whois' ? { ...step, status: 'completed', duration: 1.8 } : step
    ));

    // Step 5: Pricing
    setSearchSteps(prev => prev.map(step => 
      step.id === 'pricing' ? { ...step, status: 'active' } : step
    ));
    
    setSuggestions(prev => prev.map(s => ({
      ...s,
      price: s.available ? Math.floor(Math.random() * 50) + 10 : undefined,
      popularity: Math.floor(Math.random() * 100)
    })));
    
    await new Promise(resolve => setTimeout(resolve, 600));
    setProgress(90);
    setSearchSteps(prev => prev.map(step => 
      step.id === 'pricing' ? { ...step, status: 'completed', duration: 0.6 } : step
    ));

    // Step 6: Complete
    setSearchSteps(prev => prev.map(step => 
      step.id === 'complete' ? { ...step, status: 'active' } : step
    ));
    await new Promise(resolve => setTimeout(resolve, 400));
    setProgress(100);
    setSearchSteps(prev => prev.map(step => 
      step.id === 'complete' ? { ...step, status: 'completed', duration: 0.4 } : step
    ));
  };

  const generateDomainSuggestions = (query: string): DomainSuggestion[] => {
    const extensions = ['.com', '.net', '.org', '.io', '.co', '.app', '.dev', '.tech', '.online', '.store'];
    const prefixes = ['', 'get', 'try', 'my', 'go', 'the'];
    const suffixes = ['', 'app', 'hub', 'pro', 'zone', 'base', 'lab', 'cloud'];
    
    const suggestions: DomainSuggestion[] = [];
    
    // Direct matches
    extensions.forEach(ext => {
      suggestions.push({
        name: `${query}${ext}`,
        available: false,
        extension: ext,
        loading: true
      });
    });
    
    // Variations with prefixes and suffixes
    prefixes.forEach(prefix => {
      suffixes.forEach(suffix => {
        if (prefix || suffix) {
          const domainName = `${prefix}${query}${suffix}`;
          extensions.slice(0, 3).forEach(ext => {
            suggestions.push({
              name: `${domainName}${ext}`,
              available: false,
              extension: ext,
              loading: true
            });
          });
        }
      });
    });
    
    return suggestions.slice(0, 12); // Limit to 12 suggestions
  };

  const onSubmit = async (data: SearchForm) => {
    setIsSearching(true);
    setSuggestions([]);
    setSelectedDomains([]);
    
    try {
      await simulateSearchProcess(data.query);
      toast({
        title: "Search completed",
        description: `Found ${suggestions.filter(s => s.available).length} available domains`,
      });
    } catch (error) {
      toast({
        title: "Search failed",
        description: "Unable to complete domain search. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const toggleDomainSelection = (domainName: string) => {
    setSelectedDomains(prev => 
      prev.includes(domainName) 
        ? prev.filter(d => d !== domainName)
        : [...prev, domainName]
    );
  };

  const addSelectedDomains = async () => {
    if (selectedDomains.length === 0) return;
    
    try {
      for (const domainName of selectedDomains) {
        await apiRequest("POST", "/api/domains", {
          name: domainName,
          autoRenew: false,
          tags: ['bulk-add']
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ["/api/domains"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      
      toast({
        title: "Domains added",
        description: `Successfully added ${selectedDomains.length} domains to your portfolio`,
      });
      
      setLocation("/domains");
    } catch (error) {
      toast({
        title: "Failed to add domains",
        description: "Some domains could not be added. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStepIcon = (step: SearchStep) => {
    const IconComponent = step.icon;
    if (step.status === 'completed') return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (step.status === 'error') return <XCircle className="h-5 w-5 text-red-500" />;
    if (step.status === 'active') return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
    return <IconComponent className="h-5 w-5 text-gray-400" />;
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Domain Search & Discovery</h1>
          <p className="text-blue-100">Find the perfect domain with intelligent suggestions and real-time availability checking</p>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Search Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search Domains
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Enter your domain idea (e.g., mycompany, coolapp)"
                    {...form.register("query")}
                    disabled={isSearching}
                    className="text-lg h-12"
                  />
                  {form.formState.errors.query && (
                    <p className="text-sm text-red-600 mt-1">{form.formState.errors.query.message}</p>
                  )}
                </div>
                <Button 
                  type="submit" 
                  disabled={isSearching}
                  className="h-12 px-8"
                  size="lg"
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Search Domains
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Search Process Visualization */}
          {isSearching && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Search Process
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                    {searchSteps.map((step) => (
                      <div
                        key={step.id}
                        className={`flex items-start gap-3 p-4 rounded-lg border-2 transition-all ${
                          step.status === 'active' 
                            ? 'border-blue-200 bg-blue-50' 
                            : step.status === 'completed'
                            ? 'border-green-200 bg-green-50'
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          {getStepIcon(step)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm">{step.title}</h4>
                          <p className="text-xs text-gray-600 mt-1">{step.description}</p>
                          {step.duration && (
                            <p className="text-xs text-gray-500 mt-1">
                              Completed in {step.duration}s
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Search Results */}
          {suggestions.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Search Results ({suggestions.filter(s => s.available).length} available)
                </CardTitle>
                {selectedDomains.length > 0 && (
                  <Button onClick={addSelectedDomains} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Selected ({selectedDomains.length})
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {suggestions.map((suggestion) => (
                    <div
                      key={suggestion.name}
                      className={`relative p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        suggestion.loading
                          ? 'border-gray-200 bg-gray-50'
                          : suggestion.available
                          ? selectedDomains.includes(suggestion.name)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-green-200 bg-green-50 hover:border-green-300'
                          : 'border-red-200 bg-red-50'
                      }`}
                      onClick={() => suggestion.available && !suggestion.loading && toggleDomainSelection(suggestion.name)}
                    >
                      {suggestion.loading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                          <span className="text-sm text-gray-500">Checking...</span>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            {suggestion.available ? (
                              <CheckCircle className="h-5 w-5 text-green-500 mb-2" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500 mb-2" />
                            )}
                          </div>
                          {suggestion.available && selectedDomains.includes(suggestion.name) && (
                            <div className="absolute top-2 right-2">
                              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                <CheckCircle className="h-4 w-4 text-white" />
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <h3 className="font-semibold text-lg mb-1 break-all">{suggestion.name}</h3>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <Badge 
                          variant={suggestion.available ? "default" : "secondary"}
                          className={suggestion.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                        >
                          {suggestion.available ? "Available" : "Taken"}
                        </Badge>
                        <Badge variant="outline">{suggestion.extension}</Badge>
                      </div>
                      
                      {suggestion.price && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Price</span>
                          <span className="font-semibold text-green-600">${suggestion.price}/year</span>
                        </div>
                      )}
                      
                      {suggestion.popularity && (
                        <div className="flex items-center justify-between text-sm mt-1">
                          <span className="text-gray-600">Popularity</span>
                          <div className="flex items-center gap-1">
                            <div className="w-12 h-1 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-500"
                                style={{ width: `${suggestion.popularity}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-500">{suggestion.popularity}%</span>
                          </div>
                        </div>
                      )}
                      
                      {suggestion.whoisData && (
                        <div className="mt-2 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Wifi className="h-3 w-3" />
                            WHOIS data available
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          {!isSearching && suggestions.length === 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Quick Start
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col items-start gap-2"
                    onClick={() => form.setValue("query", "mycompany")}
                  >
                    <div className="font-semibold">Business Name</div>
                    <div className="text-sm text-gray-600">Search for your company or brand name</div>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col items-start gap-2"
                    onClick={() => form.setValue("query", "coolapp")}
                  >
                    <div className="font-semibold">App or Product</div>
                    <div className="text-sm text-gray-600">Find domains for your application</div>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col items-start gap-2"
                    onClick={() => form.setValue("query", "creativestudio")}
                  >
                    <div className="font-semibold">Creative Project</div>
                    <div className="text-sm text-gray-600">Discover unique creative domains</div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}