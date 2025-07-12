
import React from 'react';
import { Bell, Search, Settings, User } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface QuickBooksHeaderProps {
  title: string;
  subtitle?: string;
}

export default function QuickBooksHeader({ title, subtitle }: QuickBooksHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
          {subtitle && (
            <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              placeholder="Search..." 
              className="pl-10 w-64 quickbooks-input"
            />
          </div>
          
          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
            <Bell className="w-5 h-5" />
          </Button>
          
          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
            <Settings className="w-5 h-5" />
          </Button>
          
          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
