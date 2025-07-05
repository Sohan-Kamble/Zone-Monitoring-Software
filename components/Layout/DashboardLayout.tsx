'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Home, 
  BarChart3, 
  FileText, 
  Database, 
  AlertTriangle, 
  Settings, 
  HardDrive, 
  Shield, 
  LogOut,
  Menu,
  X,
  Droplets,
  Building2
} from 'lucide-react';
//import { User } from '';
//import { User } from '@/types/user';
import type { User } from '../../types/user';
//import type { User } from '../../types/user';
interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Dashboard', href: '/dashboard/overview', icon: BarChart3 },
  { name: 'Zone Report', href: '/dashboard/zone-report', icon: FileText },
  { name: 'System Log', href: '/dashboard/system-log', icon: Database },
  { name: 'Log Data', href: '/dashboard/log-data', icon: Database },
  { name: 'Alert Data', href: '/dashboard/alert-data', icon: AlertTriangle },
  { name: 'Account Setup', href: '/dashboard/account-setup', icon: Settings },
  { name: 'Device Setup', href: '/dashboard/device-setup', icon: HardDrive },
  { name: 'Device Access', href: '/dashboard/device-access', icon: Shield },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statusData, setStatusData] = useState({
    activePumps: 0,
    totalStations: 0,
    onlineDevices: 0,
    alerts: 0,
    waterFlow: 0,
    pressure: 0,
    temperature: 0,
    powerStatus: 0,
    networkStatus: 0,
    systemHealth: 0
  });
  
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
    fetchStatusData();
    
    // Set up real-time updates
    const interval = setInterval(fetchStatusData, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatusData = async () => {
    try {
      const response = await fetch('/api/live-data');
      if (response.ok) {
        const data = await response.json();
        // Process live data to calculate status metrics
        const liveData = data.liveData || [];
        
        setStatusData({
          activePumps: liveData.filter((item: any) => item.P46 > 0).length,
          totalStations: liveData.length,
          onlineDevices: liveData.filter((item: any) => 
            new Date(item.eTimeStamp) > new Date(Date.now() - 5 * 60 * 1000)
          ).length,
          alerts: liveData.filter((item: any) => item.P1 > 0 || item.P6 > 0).length,
          waterFlow: liveData.reduce((sum: number, item: any) => sum + (item.P4 || 0), 0),
          pressure: Math.round(liveData.reduce((sum: number, item: any) => sum + (item.P69 || 0), 0) / liveData.length || 0),
          temperature: Math.round(liveData.reduce((sum: number, item: any) => sum + (item.P150 || 0), 0) / liveData.length || 0),
          powerStatus: liveData.filter((item: any) => item.P106 > 0 && item.P107 > 0).length,
          networkStatus: liveData.filter((item: any) => 
            new Date(item.eTimeStamp) > new Date(Date.now() - 2 * 60 * 1000)
          ).length,
          systemHealth: Math.round((liveData.filter((item: any) => 
            new Date(item.eTimeStamp) > new Date(Date.now() - 5 * 60 * 1000)
          ).length / liveData.length) * 100) || 0
        });
      }
    } catch (error) {
      console.error('Failed to fetch status data:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <Droplets className="w-8 h-8 text-blue-600 mr-2" />
            <span className="text-xl font-bold text-gray-800">AMRUT PW</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 flex flex-col overflow-y-auto">
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon className={`mr-3 w-5 h-5 ${isActive ? 'text-blue-700' : 'text-gray-400'}`} />
                  {item.name}
                </a>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{user?.user_name}</p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-700 rounded-lg hover:bg-red-50 transition-colors duration-200"
            >
              <LogOut className="mr-3 w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center ml-4 lg:ml-0">
                <h1 className="text-2xl font-bold text-gray-900">Water Management System</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.company_name}</p>
                <p className="text-xs text-gray-500">Zone: {user?.zone}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Status indicators */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full status-pulse"></div>
              <span className="text-sm font-medium text-gray-700">Active Pumps: {statusData.activePumps}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Stations: {statusData.totalStations}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Online: {statusData.onlineDevices}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Alerts: {statusData.alerts}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Flow: {statusData.waterFlow.toFixed(1)}L/s</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Pressure: {statusData.pressure} PSI</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Temp: {statusData.temperature}°C</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Power: {statusData.powerStatus}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Network: {statusData.networkStatus}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Health: {statusData.systemHealth}%</span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}