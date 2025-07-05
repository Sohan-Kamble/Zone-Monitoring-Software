'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Home, 
  BarChart3, 
  MapPin, 
  FileText, 
  Database, 
  AlertTriangle, 
  Settings, 
  HardDrive, 
  Shield,
  LogOut,
  Droplets
} from 'lucide-react';

const navigationItems = [
  { id: 'home', label: 'Home', icon: Home, href: '/' },
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3, href: '/dashboard' },
  { id: 'zone', label: 'Zone', icon: MapPin, href: '/zone' },
  { id: 'system-log', label: 'System Log', icon: FileText, href: '/system-log' },
  { id: 'log-data', label: 'Log Data', icon: Database, href: '/log-data' },
  { id: 'alert-data', label: 'Alert Data', icon: AlertTriangle, href: '/alert-data' },
  { id: 'account-setup', label: 'Account Setup', icon: Settings, href: '/account-setup' },
  { id: 'device-setup', label: 'Device Setup', icon: HardDrive, href: '/device-setup' },
  { id: 'device-access', label: 'Device Access', icon: Shield, href: '/device-access' },
];

interface HeaderProps {
  currentPage?: string;
}

export function Header({ currentPage = 'home' }: HeaderProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  const handleLogout = async () => {
    setIsLoading(true);
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <header className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 shadow-lg">
      {/* Top section with title and logos */}
      <div className="bg-teal-700 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Droplets className="h-8 w-8 text-white" />
              <div className="text-white">
                <h1 className="text-lg font-bold tracking-wide">AMRUT WATER SUPPLY SCHEME</h1>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full"></div>
            </div>
            <div className="text-white text-sm font-medium">MCOM TECHNOLOGY</div>
          </div>
        </div>
      </div>

      {/* Navigation section */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <nav className="flex space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => handleNavigation(item.href)}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-white text-teal-700 shadow-md" 
                      : "text-white hover:bg-white/10"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              );
            })}
          </nav>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            disabled={isLoading}
            className="flex items-center space-x-2 text-white hover:bg-white/10 px-3 py-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}