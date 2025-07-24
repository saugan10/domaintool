import { Domain, DNSRecord, Invoice, DomainSuggestion } from '../types';

export const mockDomains: Domain[] = [
  {
    id: '1',
    name: 'myawesome-startup.com',
    registrar: 'Namecheap',
    status: 'active',
    expiryDate: '2025-03-15',
    daysRemaining: 78,
    isLive: true,
    autoRenew: true,
  },
  {
    id: '2',
    name: 'tech-solutions.io',
    registrar: 'GoDaddy',
    status: 'expiring',
    expiryDate: '2025-02-01',
    daysRemaining: 35,
    isLive: true,
    autoRenew: false,
  },
  {
    id: '3',
    name: 'old-project.net',
    registrar: 'Cloudflare',
    status: 'expired',
    expiryDate: '2024-12-10',
    daysRemaining: -18,
    isLive: false,
    autoRenew: false,
  },
  {
    id: '4',
    name: 'portfolio-site.dev',
    registrar: 'Google Domains',
    status: 'active',
    expiryDate: '2025-08-22',
    daysRemaining: 208,
    isLive: true,
    autoRenew: true,
  },
];

export const mockDNSRecords: { [domain: string]: DNSRecord[] } = {
  'myawesome-startup.com': [
    {
      id: '1',
      type: 'A',
      name: '@',
      value: '192.168.1.1',
      ttl: 300,
      status: 'active',
    },
    {
      id: '2',
      type: 'CNAME',
      name: 'www',
      value: 'myawesome-startup.com',
      ttl: 300,
      status: 'active',
    },
    {
      id: '3',
      type: 'MX',
      name: '@',
      value: '10 mail.myawesome-startup.com',
      ttl: 3600,
      status: 'active',
    },
    {
      id: '4',
      type: 'TXT',
      name: '@',
      value: 'v=spf1 include:_spf.google.com ~all',
      ttl: 300,
      status: 'active',
    },
  ],
  'tech-solutions.io': [
    {
      id: '5',
      type: 'A',
      name: '@',
      value: '203.0.113.1',
      ttl: 600,
      status: 'active',
    },
    {
      id: '6',
      type: 'CNAME',
      name: 'api',
      value: 'api-server.tech-solutions.io',
      ttl: 300,
      status: 'active',
    },
  ],
};

export const mockInvoices: Invoice[] = [
  {
    id: '1',
    domain: 'myawesome-startup.com',
    amount: 12.99,
    date: '2024-12-15',
    status: 'paid',
    receiptUrl: '#receipt-1',
  },
  {
    id: '2',
    domain: 'tech-solutions.io',
    amount: 45.00,
    date: '2024-11-28',
    status: 'paid',
    receiptUrl: '#receipt-2',
  },
  {
    id: '3',
    domain: 'portfolio-site.dev',
    amount: 18.99,
    date: '2024-10-10',
    status: 'pending',
  },
];

export const mockSuggestions: DomainSuggestion[] = [
  {
    name: 'innovatetech',
    available: true,
    price: 12.99,
    registrar: 'Namecheap',
    extension: '.com',
  },
  {
    name: 'techinnova',
    available: true,
    price: 15.99,
    registrar: 'GoDaddy',
    extension: '.com',
  },
  {
    name: 'innovatech',
    available: false,
    price: 0,
    registrar: '',
    extension: '.com',
  },
  {
    name: 'innovatetech',
    available: true,
    price: 25.99,
    registrar: 'Cloudflare',
    extension: '.io',
  },
];