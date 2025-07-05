'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Layout/Header';
import { StatusBar } from '@/components/Layout/StatusBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Activity, MapPin, Clock, Play } from 'lucide-react';
import { Station, SystemStatus } from '@/types';

export default function DashboardPage() {
  const [stations, setStations] = useState<Station[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStations, setFilteredStations] = useState<Station[]>([]);

  useEffect(() => {
    // Fetch system status and stations
    fetch('/api/status')
      .then(res => res.json())
      .then(setSystemStatus)
      .catch(console.error);

    fetch('/api/stations')
      .then(res => res.json())
      .then(data => {
        setStations(data);
        setFilteredStations(data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const filtered = stations.filter(station =>
      station.STN_NAME.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.STN_ADDRESS1.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStations(filtered);
  }, [searchTerm, stations]);

  const getStationStatus = (station: Station) => {
    // Mock status logic - in production, this would check live data
    const statuses = ['active', 'inactive', 'warning'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  const handleGoLive = (stationId: string) => {
    window.location.href = `/mimic/${stationId}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="dashboard" />
      {systemStatus && <StatusBar data={systemStatus} />}
      
      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Monitor and manage all zones and stations</p>
            </div>
            
            {/* Search */}
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search zones or stations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Stations</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stations.length}</div>
                <p className="text-xs text-muted-foreground">
                  Across all zones
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Stations</CardTitle>
                <Activity className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{systemStatus?.active_sites || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Currently operational
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pump Operations</CardTitle>
                <Activity className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{systemStatus?.pump_on || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Pumps running
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Power Status</CardTitle>
                <Activity className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{systemStatus?.power_avail || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Sites with power
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Stations Table */}
          <Card>
            <CardHeader>
              <CardTitle>Station Management</CardTitle>
              <p className="text-sm text-gray-600">
                Monitor all stations and their operational status
              </p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Station Name</th>
                      <th className="text-left py-3 px-4">Zone</th>
                      <th className="text-left py-3 px-4">Type</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Operator</th>
                      <th className="text-left py-3 px-4">Last Update</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStations.map((station, index) => {
                      const status = getStationStatus(station);
                      return (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{station.STN_NAME}</td>
                          <td className="py-3 px-4">{station.STN_ADDRESS1}</td>
                          <td className="py-3 px-4">{station.TYPE}</td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={status === 'active' ? 'default' : status === 'warning' ? 'secondary' : 'destructive'}
                              className={
                                status === 'active' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                                status === 'warning' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' :
                                'bg-red-100 text-red-800 hover:bg-red-100'
                              }
                            >
                              {status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">{station.OPERATOR_NAME}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{new Date().toLocaleDateString()}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Button
                              size="sm"
                              onClick={() => handleGoLive(station.STN_NAME)}
                              className="bg-teal-600 hover:bg-teal-700"
                            >
                              <Play className="h-3 w-3 mr-1" />
                              Go Live
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                
                {filteredStations.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No stations found matching your search criteria.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}