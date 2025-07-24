import React from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Domains from './components/Domains';
import AddDomain from './components/AddDomain';
import DNSRecords from './components/DNSRecords';
import Suggestions from './components/Suggestions';
import Invoices from './components/Invoices';
import Settings from './components/Settings';
import { NavigationPage, Domain } from './types';
import { mockDomains } from './data/mockData';

function App() {
  const [currentPage, setCurrentPage] = React.useState<NavigationPage>('dashboard');
  const [domains, setDomains] = React.useState<Domain[]>(mockDomains);

  const handleAddDomain = (domainName: string) => {
    const newDomain: Domain = {
      id: String(domains.length + 1),
      name: domainName,
      registrar: 'Namecheap', // Default registrar
      status: 'active',
      expiryDate: '2025-12-15',
      daysRemaining: 365,
      isLive: true,
      autoRenew: false,
    };
    setDomains(prev => [...prev, newDomain]);
  };

  const handleDeleteDomain = (domainId: string) => {
    if (confirm('Are you sure you want to delete this domain?')) {
      setDomains(prev => prev.filter(d => d.id !== domainId));
    }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard domains={domains} onNavigate={setCurrentPage} />;
      case 'domains':
        return (
          <Domains 
            domains={domains} 
            onNavigate={setCurrentPage}
            onDeleteDomain={handleDeleteDomain}
          />
        );
      case 'add-domain':
        return (
          <AddDomain 
            onNavigate={setCurrentPage}
            onAddDomain={handleAddDomain}
          />
        );
      case 'dns-records':
        return <DNSRecords />;
      case 'suggestions':
        return <Suggestions />;
      case 'invoices':
        return <Invoices />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard domains={domains} onNavigate={setCurrentPage} />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderCurrentPage()}
    </Layout>
  );
}

export default App;