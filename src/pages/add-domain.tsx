import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Globe, X, Plus, Loader } from "lucide-react";

const addDomainSchema = z.object({
  name: z.string().min(1, "Domain name is required").regex(/^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*$/, "Invalid domain format"),
  autoRenew: z.boolean().default(false),
});

type AddDomainForm = z.infer<typeof addDomainSchema>;

export default function AddDomain() {
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [whoisData, setWhoisData] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const form = useForm<AddDomainForm>({
    resolver: zodResolver(addDomainSchema),
    defaultValues: {
      name: "",
      autoRenew: false,
    },
  });

  const addDomainMutation = useMutation({
    mutationFn: async (data: AddDomainForm & { tags: string[] }) => {
      const response = await apiRequest("POST", "/api/domains", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/domains"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Domain added",
        description: "Your domain has been successfully added to your portfolio.",
      });
      setLocation("/domains");
    },
    onError: (error) => {
      toast({
        title: "Failed to add domain",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const handleWhoisLookup = async () => {
    const domainName = form.getValues("name");
    if (!domainName) {
      toast({
        title: "Enter domain name",
        description: "Please enter a domain name before looking up WHOIS data.",
        variant: "destructive",
      });
      return;
    }

    setIsLookingUp(true);
    try {
      const response = await apiRequest("GET", `/api/whois/${domainName}`);
      const data = await response.json();
      setWhoisData(data);
      
      if (data.registrar || data.expiryDate) {
        toast({
          title: "WHOIS data found",
          description: "Domain information has been retrieved successfully.",
        });
      } else {
        toast({
          title: "Limited WHOIS data",
          description: "Some domain information could not be retrieved.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "WHOIS lookup failed",
        description: "Could not retrieve domain information. You can still add the domain manually.",
        variant: "destructive",
      });
    } finally {
      setIsLookingUp(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const onSubmit = async (data: AddDomainForm) => {
    addDomainMutation.mutate({ ...data, tags });
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 bg-white shadow border-b p-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">Add Domain</h1>
          <p className="text-gray-600">Add a new domain to your portfolio</p>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Domain Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Domain Name</Label>
                  <div className="flex gap-2">
                    <Input
                      id="name"
                      placeholder="example.com"
                      {...form.register("name")}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleWhoisLookup}
                      disabled={isLookingUp}
                    >
                      {isLookingUp ? (
                        <Loader className="h-4 w-4 animate-spin" />
                      ) : (
                        "Lookup WHOIS"
                      )}
                    </Button>
                  </div>
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
                  )}
                </div>

                {whoisData && (
                  <Card className="bg-blue-50 border-blue-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-blue-900">
                        WHOIS Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-blue-800">Registrar:</span>
                          <span className="ml-2 text-blue-700">
                            {whoisData.registrar || "Not available"}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-blue-800">Expiry Date:</span>
                          <span className="ml-2 text-blue-700">
                            {whoisData.expiryDate 
                              ? new Date(whoisData.expiryDate).toLocaleDateString()
                              : "Not available"
                            }
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                    />
                    <Button type="button" variant="outline" onClick={addTag} size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 text-gray-500 hover:text-gray-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="autoRenew"
                    {...form.register("autoRenew")}
                  />
                  <Label htmlFor="autoRenew">Enable auto-renewal</Label>
                </div>

                <div className="flex gap-4 pt-6">
                  <Button
                    type="submit"
                    disabled={addDomainMutation.isPending}
                    className="flex-1"
                  >
                    {addDomainMutation.isPending ? "Adding Domain..." : "Add Domain"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setLocation("/domains")}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
