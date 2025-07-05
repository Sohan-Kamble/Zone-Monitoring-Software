'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Layout/Header';
import { StatusBar } from '@/components/Layout/StatusBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Bell, Clock, MapPin, Zap, Droplets } from 'lucide-react';

interface Alert {
  id: string;
  type: string;
  station: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  acknowledged: boolean;
}

export default function AlertDataPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateMockAlerts();
    const interval = setInterval(generateMockAlerts, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const generateMockAlerts = async () => {
    try {
      // Fetch live data to generate realistic alerts
      const response = await fetch('/api/live-data');
      const liveData = await response.json();
      
      const mockAlerts: Alert[] = [];
      
      liveData.forEach((data: any, index: number) => {
        // Generate alerts based on actual data conditions
        if (data.P4 < 200) { // Low voltage
          mockAlerts.push({
            id: `alert-${index}-voltage`,
            type: 'Power Issue',
            station: data.STN,
            message: `Low voltage detected: ${data.P4}V`,
            severity: data.P4 < 180 ? 'critical' : 'high',
            timestamp: new Date(Date.now() - Math.random() * 3600000),
            acknowledged: Math.random() > 0.7
          });
        }
        
        if (data.P69 < 30) { // Low water level
          mockAlerts.push({
            id: `alert-${index}-water`,
            type: 'Water Level',
            station: data.STN,
            message: `Low water level: ${data.P69}%`,
            severity: data.P69 < 20 ? 'critical' : 'high',
            timestamp: new Date(Date.now() - Math.random() * 3600000),
            acknowledged: Math.random() > 0.6
          });
        }
        
        if (data.P46 === 0 && data.P69 < 50) { // Pump not running when water level is low
          mockAlerts.push({
            id: `alert-${index}-pump`,
            type: 'Pump Status',
            station: data.STN,
            message: 'Pump not running despite low water level',
            severity: 'medium',
            timestamp: new Date(Date.now() - Math.random() * 3600000),
            acknowledged: Math.random() > 0.8
          });
        }
      });
      
      // Add some additional system alerts
      const systemAlerts = [
        {
          id: 'sys-1',
          type: 'Communication',
          station: 'System',
          message: 'Communication timeout with Station 2001',
          severity: 'medium' as const,
          timestamp: new Date(Date.now() - 1800000),
          acknowledged: false
        },
        {
          id: 'sys-2',
          type: 'Maintenance',
          station: '1001',
          message: 'Scheduled maintenance due in 2 days',
          severity: 'low' as const,
          timestamp: new Date(Date.now() - 900000),
          acknowledged: true
        }
      ];
      
      setAlerts([...mockAlerts, ...systemAlerts].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
    } catch (error) {
      console.error('Error generating alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'Power Issue': return <Zap className="h-4 w-4" />;
      case 'Water Level': return <Droplets className="h-4 w-4" />;
      case 'Pump Status': return <Bell className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const criticalAlerts = alerts.filter(alert => alert.severity === 'critical' && !alert.acknowledged);
  const highAlerts = alerts.filter(alert => alert.severity === 'high' && !alert.acknowledged);
  const unacknowledgedAlerts = alerts.filter(alert => !alert.acknowledged);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="alert-data" />
      <StatusBar />
      
      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Alert Data</h1>
            <p className="text-gray-600">Monitor system alerts and notifications</p>
          </div>

          {/* Alert Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <div>
                    <div className="text-2xl font-bold text-red-600">{criticalAlerts.length}</div>
                    <div className="text-sm text-gray-600">Critical Alerts</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-orange-600" />
                  <div>
                    <div className="text-2xl font-bold text-orange-600">{highAlerts.length}</div>
                    <div className="text-sm text-gray-600">High Priority</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{unacknowledgedAlerts.length}</div>
                    <div className="text-sm text-gray-600">Unacknowledged</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="text-2xl font-bold text-green-600">{alerts.length}</div>
                    <div className="text-sm text-gray-600">Total Alerts</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alerts List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-teal-600" />
                <span>System Alerts</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading alerts...</p>
                </div>
              ) : alerts.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No alerts at this time</p>
                  <p className="text-sm">All systems are operating normally</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-lg border-l-4 ${getSeverityColor(alert.severity)} ${
                        alert.acknowledged ? 'opacity-60' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="mt-1">
                            {getAlertIcon(alert.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold">{alert.type}</h3>
                              <Badge variant={
                                alert.severity === 'critical' ? 'destructive' :
                                alert.severity === 'high' ? 'secondary' : 'default'
                              }>
                                {alert.severity.toUpperCase()}
                              </Badge>
                              {alert.acknowledged && (
                                <Badge variant="outline">ACKNOWLEDGED</Badge>
                              )}
                            </div>
                            <p className="text-gray-700 mb-2">{alert.message}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-3 w-3" />
                                <span>Station: {alert.station}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>{alert.timestamp.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        {!alert.acknowledged && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => acknowledgeAlert(alert.id)}
                          >
                            Acknowledge
                          </Button>
                        )}
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