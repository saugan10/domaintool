export interface Domain {
  id: string;
  name: string;
  registrar: string;
  status: 'active' | 'expired' | 'expiring';
  expiryDate: string;
  daysRemaining: number;
  isLive: boolean;
  autoRenew: boolean;
}

export interface DNSRecord {
  id: string;
  type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'NS';
  name: string;
  value: string;
  ttl: number;
  status: 'active' | 'inactive';
}

export interface Invoice {
  id: string;
  domain: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'failed';
  receiptUrl?: string;
}

export interface DomainSuggestion {
  name: string;
  available: boolean;
  price: number;
  registrar: string;
  extension: string;
}

export type NavigationPage = 
  | 'dashboard' 
  | 'domains' 
  | 'add-domain' 
  | 'dns-records' 
  | 'suggestions' 
  | 'invoices' 
  | 'settings';

export interface AddDomainState {
  step: 1 | 2 | 3 | 4;
  domain: string;
  domainInfo: {
    registrar: string;
    expiryDate: string;
    owner: string;
  } | null;
  verificationTxt: string;
  isVerified: boolean;
}