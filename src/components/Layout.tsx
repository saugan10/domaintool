import React from 'react';
import { Home, Globe, Plus, Dna as Dns, Lightbulb, Receipt, Settings, Menu, X, Command } from 'lucide-react';
import { NavigationPage } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
}

interface NavItem {
  id: NavigationPage;
  label: string;
  icon: React.ReactNode;
  isSubItem?: boolean;
}

const navigationItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <Home size={18} /> },
  { id: 'domains', label: 'Domains', icon: <Globe size={18} /> },
  { id: 'add-domain', label: 'Add Domain', icon: <Plus size={18} />, isSubItem: true },
  { id: 'dns-records', label: 'DNS Records', icon: <Dns size={18} /> },
  { id: 'suggestions', label: 'Suggestions', icon: <Lightbulb size={18} /> },
  { id: 'invoices', label: 'Invoices', icon: <Receipt size={18} /> },
  { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
];

export default function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex">
      {/* Sidebar */}
      <div className={`bg-[#111111] border-r border-[#1F1F1F] transition-all duration-300 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed inset-y-0 left-0 z-50 w-64 lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-[#1F1F1F]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Command className="text-white" size={16} />
            </div>
            <span className="text-lg font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              DomainHub
            </span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        
        <nav className="mt-8 px-4">
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full group flex items-center space-x-3 px-3 py-2.5 text-left rounded-lg transition-all duration-200 ${
                  item.isSubItem ? 'ml-6' : ''
                } ${
                  currentPage === item.id
                    ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-white border border-blue-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-[#1A1A1A]'
                }`}
              >
                <span className={`transition-colors duration-200 ${
                  currentPage === item.id ? 'text-blue-400' : 'group-hover:text-white'
                }`}>
                  {item.icon}
                </span>
                <span className="font-medium text-sm">{item.label}</span>
                {currentPage === item.id && (
                  <div className="ml-auto w-1.5 h-1.5 bg-blue-400 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#1F1F1F]">
          <div className="flex items-center space-x-3 px-3 py-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-semibold">JD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">John Doe</p>
              <p className="text-xs text-gray-400 truncate">john@example.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top bar */}
        <header className="bg-[#111111]/80 backdrop-blur-xl border-b border-[#1F1F1F] h-16 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden text-gray-400 hover:text-white transition-colors"
            >
              <Menu size={18} />
            </button>
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span>All systems operational</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg">
              <Command size={14} className="text-gray-400" />
              <span className="text-xs text-gray-400">⌘K</span>
            </div>
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-semibold">JD</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-[#0A0A0A]">
          {children}
        </main>
      </div>
    </div>
  );
}