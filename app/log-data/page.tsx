'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Layout/Header';
import { StatusBar } from '@/components/Layout/StatusBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Database, Search, Download, Calendar } from 'lucide-react';

export default function LogDataPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStation, setSelectedStation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchLogs();
    
    // Set default dates (last 7 days)
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 7);
    
    setEndDate(end.toISOString().split('T')[0]);
    setStartDate(start.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    filterLogs();
  }, [logs, searchTerm, selectedStation, startDate, endDate]);

  const fetchLogs = async () => {
    try {
      // Fetch historical data from LOGS table
      const response = await fetch('/api/historical-data?station=1001&startDate=2024-01-01&endDate=2024-12-31');
      const data = await response.json();
      setLogs(data);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterLogs = () => {
    let filtered = logs;

    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.STN.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedStation) {
      filtered = filtered.filter(log => log.STN === selectedStation);
    }

    if (startDate && endDate) {
      filtered = filtered.filter(log => {
        const logDate = new Date(log.eTimeStamp);
        return logDate >= new Date(startDate) && logDate <= new Date(endDate);
      });
    }

    setFilteredLogs(filtered);
  };

  const exportLogs = () => {
    const csvContent = [
      ['Station', 'Timestamp', 'P1', 'P4', 'P46', 'P47', 'P69', 'P150'].join(','),
      ...filteredLogs.map(log => [
        log.STN,
        new Date(log.eTimeStamp).toLocaleString(),
        log.P1 || 0,
        log.P4 || 0,
        log.P46 || 0,
        log.P47 || 0,
        log.P69 || 0,
        log.P150 || 0
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `log-data-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const getUniqueStations = () => {
    return [...new Set(logs.map(log => log.STN))];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="log-data" />
      <StatusBar />
      
      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Log Data</h1>
            <p className="text-gray-600">Access historical data logs and analytics</p>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-teal-600" />
                <span>Data Filters</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="search">Search Station</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="search"
                      placeholder="Search stations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="station">Station</Label>
                  <select
                    id="station"
                    value={selectedStation}
                    onChange={(e) => setSelectedStation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">All Stations</option>
                    {getUniqueStations().map(station => (
                      <option key={station} value={station}>{station}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
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

          {/* Data Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Historical Data Logs</span>
                <Badge variant="secondary">{filteredLogs.length} records</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading log data...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Station</th>
                        <th className="text-left py-3 px-4">Timestamp</th>
                        <th className="text-left py-3 px-4">Temperature (P1)</th>
                        <th className="text-left py-3 px-4">Voltage (P4)</th>
                        <th className="text-left py-3 px-4">Pump Status (P46)</th>
                        <th className="text-left py-3 px-4">Mode (P47)</th>
                        <th className="text-left py-3 px-4">Water Level (P69)</th>
                        <th className="text-left py-3 px-4">Flow Rate (P150)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLogs.slice(0, 100).map((log, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{log.STN}</td>
                          <td className="py-3 px-4">{new Date(log.eTimeStamp).toLocaleString()}</td>
                          <td className="py-3 px-4">{Number(log.P1 || 0).toFixed(1)}°C</td>
                          <td className="py-3 px-4">{Number(log.P4 || 0).toFixed(1)}V</td>
                          <td className="py-3 px-4">
                            <Badge variant={log.P46 === 1 ? 'default' : 'secondary'}>
                              {log.P46 === 1 ? 'ON' : 'OFF'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={log.P47 === 1 ? 'default' : 'secondary'}>
                              {log.P47 === 1 ? 'AUTO' : 'MANUAL'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">{Number(log.P69 || 0).toFixed(1)}%</td>
                          <td className="py-3 px-4">{Number(log.P150 || 0).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {filteredLogs.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No log data found matching your criteria.
                    </div>
                  )}
                  
                  {filteredLogs.length > 100 && (
                    <div className="text-center py-4 text-gray-500">
                      Showing first 100 records of {filteredLogs.length} total records.
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}