import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatDate, getStatusColor, getStatusText, getDaysUntilExpiry } from "@/lib/utils";
import { Globe, Calendar, Building, RefreshCw, Edit, Trash2 } from "lucide-react";
import type { DomainWithStats } from "@shared/schema";

interface DomainCardProps {
  domain: DomainWithStats;
  showActions?: boolean;
  loading?: boolean;
  handleRenew?: (domainId: string) => Promise<void>;
}

export default function DomainCard({ domain, showActions = false, loading = false, handleRenew }: DomainCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const renewDomainMutation = useMutation({
    mutationFn: async () => {
      // Create Razorpay order
      const orderResponse = await apiRequest("POST", "/api/payments/create-order", {
        domainId: domain.id,
        amount: 1000, // $10 for renewal
      });
      const orderData = await orderResponse.json();

      // In a real app, this would open Razorpay payment modal
      // For now, we'll simulate a successful payment
      const verifyResponse = await apiRequest("POST", "/api/payments/verify", {
        paymentId: "pay_" + Date.now(),
        orderId: orderData.orderId,
        signature: "dummy_signature",
        domainId: domain.id,
        amount: 1000,
      });

      return verifyResponse.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/domains"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Domain renewed",
        description: `${domain.name} has been successfully renewed for 1 year.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Renewal failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const deleteDomainMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("DELETE", `/api/domains/${domain.id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/domains"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Domain deleted",
        description: `${domain.name} has been removed from your portfolio.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const daysRemaining = domain.expiryDate ? getDaysUntilExpiry(domain.expiryDate) : null;
  const statusClass = getStatusColor(domain.status);



  return (
    <Card className="card-hover">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-gray-400" />
            <h4 className="font-medium text-gray-900 truncate">{domain.name}</h4>
          </div>
          <Badge className={statusClass}>
            {getStatusText(domain.status)}
          </Badge>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 flex items-center gap-1">
              <Building className="h-3 w-3" />
              Registrar:
            </span>
            <span className="text-gray-900 font-medium">
              {domain.registrar || "Unknown"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-500 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {domain.status === "expired" ? "Expired:" : "Expires:"}
            </span>
            <span className="text-gray-900 font-medium">
              {domain.expiryDate ? formatDate(domain.expiryDate) : "Unknown"}
            </span>
          </div>

          {daysRemaining !== null && (
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">
                  {daysRemaining < 0 
                    ? `${Math.abs(daysRemaining)} days overdue`
                    : `${daysRemaining} days remaining`
                  }
                </span>
                <span className="text-xs font-medium text-gray-900">
                  {Math.round(domain.progressPercentage)}%
                </span>
              </div>
              <Progress 
                value={domain.progressPercentage} 
                className="h-2"
              />
            </div>
          )}
        </div>

        {showActions && (
          <div className="mt-4 flex flex-col gap-2">
            {(domain.status === "expiring" || domain.status === "expired") && (
            <Button 
              size="sm" 
              className="w-full"
              onClick={() => handleRenew(domain.id)}
              disabled={loading}
            >
              {loading ? "Processing..." : "Renew Now"}
            </Button>
          )}
            <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => renewDomainMutation.mutate()}
              disabled={renewDomainMutation.isPending}
              className="flex-1"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              {domain.status === "expired" ? "Restore" : "Renew"}
            </Button>
            <Button variant="outline" size="sm" disabled>
              <Edit className="h-3 w-3" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => deleteDomainMutation.mutate()}
              disabled={deleteDomainMutation.isPending}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}