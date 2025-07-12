import React from 'react';
import { Calendar, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface Domain {
  id: string;
  name: string;
  status: 'active' | 'expiring' | 'expired';
  expiryDate: string;
  registrar?: string;
  autoRenew?: boolean;
}

interface DomainCardProps {
  domain: Domain;
  onRenew?: (domainId: string) => void;
  onManage?: (domainId: string) => void;
}

export default function DomainCard({ domain, onRenew, onManage }: DomainCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="quickbooks-badge-active">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </Badge>
        );
      case 'expiring':
        return (
          <Badge className="quickbooks-badge-warning">
            <Clock className="w-3 h-3 mr-1" />
            Expiring Soon
          </Badge>
        );
      case 'expired':
        return (
          <Badge className="quickbooks-badge-error">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Expired
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="quickbooks-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
              {domain.name}
            </CardTitle>
            {domain.registrar && (
              <p className="text-sm text-gray-600">
                Registered with {domain.registrar}
              </p>
            )}
          </div>
          {getStatusBadge(domain.status)}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Expires: {formatDate(domain.expiryDate)}</span>
          </div>

          {domain.autoRenew && (
            <div className="flex items-center text-sm text-green-600">
              <CheckCircle className="w-4 h-4 mr-2" />
              <span>Auto-renewal enabled</span>
            </div>
          )}

          <div className="flex space-x-2 pt-2">
            <button
              onClick={() => onManage?.(domain.id)}
              className="quickbooks-button-secondary text-sm"
            >
              Manage
            </button>
            {domain.status !== 'active' && (
              <button
                onClick={() => onRenew?.(domain.id)}
                className="quickbooks-button-primary text-sm"
              >
                Renew Now
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}