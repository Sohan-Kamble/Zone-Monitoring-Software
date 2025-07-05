'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Layout/Header';
import { StatusBar } from '@/components/Layout/StatusBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, Server, User, Activity, Download, Search } from 'lucide-react';

interface SystemLog {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'debug';
  category: string;
  message: string;
  user?: string;
  station?: string;
  details?: string;
}

export default function SystemLogPage() {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    generateSystemLogs();
    const interval = setInterval(generateSystemLogs, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterLogs();
  }, [logs, searchTerm, selectedLevel, selectedCategory]);

  const generateSystemLogs = async () => {
    try {
      // Generate realistic system logs
      const mockLogs: SystemLog[] = [
        {
          id: '1',
          timestamp: new Date(),
          level: 'info',
          category: 'Authentication',
          message: 'User login successful',
          user: 'admin',
          details: 'Login from IP: 192.168.1.100'
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 300000),
          level: 'warning',
          category: 'Data Collection',
          message: 'Station communication timeout',
          station: '1001',
          details: 'Timeout after 30 seconds, retrying...'
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 600000),
          level: 'error',
          category: 'Database',
          message: 'Failed to insert data record',
          station: '2001',
          details: 'Connection pool exhausted'
        },
        {
          id: '4',
          timestamp: new Date(Date.now() - 900000),
          level: 'info',
          category: 'System',
          message: 'Scheduled backup completed',
          details: 'Backup size: 2.5GB, Duration: 45 minutes'
        },
        {
          id: '5',
          timestamp: new Date(Date.now() - 1200000),
          level: 'debug',
          category: 'API',
          message: 'Live data request processed',
          station: '1001',
          details: 'Response time: 150ms'
        },
        {
          id: '6',
          timestamp: new Date(Date.now() - 1500000),
          level: 'warning',
          category: 'Alert System',
          message: 'High water level threshold exceeded',
          station: '1001',
          details: 'Current level: 95%, Threshold: 90%'
        },
        {
          id: '7',
          timestamp: new Date(Date.now() - 1800000),
          level: 'info',
          category: 'Maintenance',
          message: 'Pump maintenance scheduled',
          station: '2001',
          user: 'technician',
          details: 'Scheduled for next Tuesday 10:00 AM'
        },
        {
          id: '8',
          timestamp: new Date(Date.now() - 2100000),
          level: 'error',
          category: 'Communication',
          message: 'MODBUS communication error',
          station: '1001',
          details: 'Error code: 0x03, Function: Read Holding Registers'
        }
      ];

      setLogs(mockLogs);
    } catch (error) {
      console.error('Error generating system logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterLogs = () => {
    let filtered = logs;

    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.station && log.station.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (log.user && log.user.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedLevel) {
      filtered = filtered.filter(log => log.level === selectedLevel);
    }

    if (selectedCategory) {
      filtered = filtered.filter(log => log.category === selectedCategory);
    }

    setFilteredLogs(filtered);
  };

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'Level', 'Category', 'Message', 'User', 'Station', 'Details'].join(','),
      ...filteredLogs.map(log => [
        log.timestamp.toISOString(),
        log.level,
        log.category,
        `"${log.message}"`,
        log.user || '',
        log.station || '',
        `"${log.details || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `system-logs-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'debug': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error': return '🔴';
      case 'warning': return '🟡';
      case 'info': return '🔵';
      case 'debug': return '⚪';
      default: return '⚪';
    }
  };

  const getUniqueCategories = () => {
    return [...new Set(logs.map(log => log.category))];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="system-log" />
      <StatusBar />
      
      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">System Log</h1>
            <p className="text-gray-600">View system events and operational logs</p>
          </div>

          {/* Log Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="text-red-600">🔴</div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">
                      {logs.filter(log => log.level === 'error').length}
                    </div>
                    <div className="text-sm text-gray-600">Errors</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="text-yellow-600">🟡</div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-600">
                      {logs.filter(log => log.level === 'warning').length}
                    </div>
                    <div className="text-sm text-gray-600">Warnings</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="text-blue-600">🔵</div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {logs.filter(log => log.level === 'info').length}
                    </div>
                    <div className="text-sm text-gray-600">Info</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Server className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="text-2xl font-bold text-green-600">{logs.length}</div>
                    <div className="text-sm text-gray-600">Total Logs</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-teal-600" />
                <span>Log Filters</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="search">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="search"
                      placeholder="Search logs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="level">Log Level</Label>
                  <select
                    id="level"
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">All Levels</option>
                    <option value="error">Error</option>
                    <option value="warning">Warning</option>
                    <option value="info">Info</option>
                    <option value="debug">Debug</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">All Categories</option>
                    {getUniqueCategories().map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>&nbsp;</Label>
                  <Button onClick={exportLogs} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Logs List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>System Logs</span>
                <Badge variant="secondary">{filteredLogs.length} entries</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading system logs...</p>
                </div>
              ) : filteredLogs.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No logs found matching your criteria</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredLogs.map((log) => (
                    <div key={log.id} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="text-lg">{getLevelIcon(log.level)}</div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <Badge className={getLevelColor(log.level)}>
                                {log.level.toUpperCase()}
                              </Badge>
                              <Badge variant="outline">{log.category}</Badge>
                              <span className="text-sm text-gray-500">
                                {log.timestamp.toLocaleString()}
                              </span>
                            </div>
                            <p className="font-medium text-gray-900 mb-1">{log.message}</p>
                            {log.details && (
                              <p className="text-sm text-gray-600 mb-2">{log.details}</p>
                            )}
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              {log.user && (
                                <div className="flex items-center space-x-1">
                                  <User className="h-3 w-3" />
                                  <span>User: {log.user}</span>
                                </div>
                              )}
                              {log.station && (
                                <div className="flex items-center space-x-1">
                                  <Activity className="h-3 w-3" />
                                  <span>Station: {log.station}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}