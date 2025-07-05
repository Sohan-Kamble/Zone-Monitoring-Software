'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { FileText, Download, Calendar, TrendingUp, Activity, Droplets } from 'lucide-react';

interface AdvancedReportProps {
  zone?: string;
}

export function AdvancedReport({ zone }: AdvancedReportProps) {
  const [selectedZone, setSelectedZone] = useState(zone || '');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Set default dates (last 7 days)
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 7);
    
    setEndDate(end.toISOString().split('T')[0]);
    setStartDate(start.toISOString().split('T')[0]);
  }, []);

  const generateReport = async () => {
    if (!selectedZone || !startDate || !endDate) return;
    
    setLoading(true);
    try {
      // Fetch stations in the zone
      const stationsResponse = await fetch(`/api/stations?zone=${selectedZone}`);
      const stations = await stationsResponse.json();
      
      // Generate mock report data based on real structure
      const mockData = {
        summary: {
          totalStations: stations.length,
          activeStations: Math.floor(stations.length * 0.8),
          totalUptime: 95.5,
          avgWaterLevel: 75.2,
          totalPumpHours: 168.5,
          energyConsumption: 1250.8
        },
        dailyTrends: Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
          waterLevel: 70 + Math.random() * 20,
          pumpHours: 20 + Math.random() * 8,
          energy: 150 + Math.random() * 50
        })),
        stationPerformance: stations.map((station: any) => ({
          name: station.STN_NAME,
          uptime: 90 + Math.random() * 10,
          avgLevel: 70 + Math.random() * 25,
          pumpHours: 15 + Math.random() * 10,
          alerts: Math.floor(Math.random() * 5)
        })),
        alerts: [
          { type: 'Low Water Level', station: 'Station A', time: '2 hours ago', severity: 'high' },
          { type: 'Power Fluctuation', station: 'Station B', time: '5 hours ago', severity: 'medium' },
          { type: 'Pump Maintenance Due', station: 'Station C', time: '1 day ago', severity: 'low' }
        ]
      };
      
      setReportData(mockData);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    if (!reportData) return;
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `water-supply-report-${selectedZone}-${startDate}-to-${endDate}.json`;
    link.click();
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      {/* Report Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-teal-600" />
            <span>Advanced Report Generator</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zone">Select Zone</Label>
              <select
                id="zone"
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Select Zone</option>
                <option value="ZONE 1">Zone 1</option>
                <option value="ZONE 2">Zone 2</option>
                <option value="ZONE 3">Zone 3</option>
                <option value="PAYAGPUR">PAYAGPUR</option>
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
              <div className="flex space-x-2">
                <Button 
                  onClick={generateReport} 
                  disabled={loading}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  {loading ? 'Generating...' : 'Generate'}
                </Button>
                {reportData && (
                  <Button variant="outline" onClick={exportReport}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {reportData && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-teal-600">{reportData.summary.totalStations}</div>
                <div className="text-sm text-gray-600">Total Stations</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">{reportData.summary.activeStations}</div>
                <div className="text-sm text-gray-600">Active Stations</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">{reportData.summary.totalUptime}%</div>
                <div className="text-sm text-gray-600">System Uptime</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-cyan-600">{reportData.summary.avgWaterLevel}%</div>
                <div className="text-sm text-gray-600">Avg Water Level</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-purple-600">{reportData.summary.totalPumpHours}h</div>
                <div className="text-sm text-gray-600">Pump Hours</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-orange-600">{reportData.summary.energyConsumption} kWh</div>
                <div className="text-sm text-gray-600">Energy Used</div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-teal-600" />
                  <span>Daily Trends</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={reportData.dailyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="waterLevel" stroke="#8884d8" name="Water Level %" />
                    <Line type="monotone" dataKey="pumpHours" stroke="#82ca9d" name="Pump Hours" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Station Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-teal-600" />
                  <span>Station Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={reportData.stationPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="uptime" fill="#8884d8" name="Uptime %" />
                    <Bar dataKey="avgLevel" fill="#82ca9d" name="Avg Water Level %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Alerts and Station Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-red-600" />
                  <span>Recent Alerts</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reportData.alerts.map((alert: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{alert.type}</div>
                        <div className="text-sm text-gray-600">{alert.station} • {alert.time}</div>
                      </div>
                      <Badge variant={
                        alert.severity === 'high' ? 'destructive' :
                        alert.severity === 'medium' ? 'secondary' : 'default'
                      }>
                        {alert.severity}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Station Details Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Droplets className="h-5 w-5 text-teal-600" />
                  <span>Station Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Station</th>
                        <th className="text-left py-2">Uptime</th>
                        <th className="text-left py-2">Avg Level</th>
                        <th className="text-left py-2">Alerts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.stationPerformance.slice(0, 5).map((station: any, index: number) => (
                        <tr key={index} className="border-b">
                          <td className="py-2 font-medium">{station.name}</td>
                          <td className="py-2">{station.uptime.toFixed(1)}%</td>
                          <td className="py-2">{station.avgLevel.toFixed(1)}%</td>
                          <td className="py-2">
                            <Badge variant={station.alerts > 2 ? 'destructive' : 'default'}>
                              {station.alerts}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}