'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Header } from '@/components/Layout/Header';
import { StatusBar } from '@/components/Layout/StatusBar';
import { MimicDiagram } from '@/components/mimic/MimicDiagram';
import { LiveDataChart } from '@/components/charts/LiveDataChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, Gauge, Thermometer, Droplets, Zap, RefreshCw } from 'lucide-react';

export default function MimicPage() {
  const params = useParams();
  const stationId = params.id as string;
  const [liveData, setLiveData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const response = await fetch(`/api/live-data?station=${stationId}`);
        const data = await response.json();
        if (data.length > 0) {
          setLiveData(data[0]);
          setLastUpdate(new Date());
        }
      } catch (error) {
        console.error('Error fetching live data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveData();
    const interval = setInterval(fetchLiveData, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [stationId]);

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setLastUpdate(new Date());
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <StatusBar />
      
      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Live Mimic - Station {stationId}</h1>
              <p className="text-gray-600">Real-time monitoring and control interface</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </div>
              <Button onClick={refreshData} disabled={loading} size="sm">
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          {/* Live Data Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Water Level</CardTitle>
                <Droplets className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{liveData?.P69?.toFixed(1) || '0.0'}%</div>
                <p className="text-xs text-muted-foreground">
                  {liveData?.P69 > 80 ? 'High' : liveData?.P69 > 50 ? 'Normal' : 'Low'} level
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Voltage</CardTitle>
                <Zap className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{liveData?.P4?.toFixed(1) || '0.0'}V</div>
                <p className="text-xs text-muted-foreground">
                  {liveData?.P4 > 220 ? 'Stable' : 'Low'} voltage
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pump Status</CardTitle>
                <Activity className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Badge variant={liveData?.P46 === 1 ? 'default' : 'secondary'}>
                    {liveData?.P46 === 1 ? 'RUNNING' : 'STOPPED'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Mode: {liveData?.P47 === 1 ? 'Auto' : 'Manual'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Temperature</CardTitle>
                <Thermometer className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{liveData?.P1?.toFixed(1) || '25.0'}°C</div>
                <p className="text-xs text-muted-foreground">Ambient temp</p>
              </CardContent>
            </Card>
          </div>

          {/* Mimic Diagram */}
          <MimicDiagram station={stationId} />

          {/* Live Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LiveDataChart 
              station={stationId} 
              parameter="P69" 
              title="Water Level Trend" 
              color="#3b82f6"
            />
            <LiveDataChart 
              station={stationId} 
              parameter="P4" 
              title="Voltage Trend" 
              color="#eab308"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LiveDataChart 
              station={stationId} 
              parameter="P1" 
              title="Temperature Trend" 
              color="#ef4444"
            />
            <LiveDataChart 
              station={stationId} 
              parameter="P150" 
              title="Flow Rate Trend" 
              color="#10b981"
            />
          </div>

          {/* System Parameters */}
          {liveData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Gauge className="h-5 w-5 text-teal-600" />
                  <span>System Parameters</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {Object.entries(liveData)
                    .filter(([key]) => key.startsWith('P') && key !== 'P1' && key !== 'P4' && key !== 'P46' && key !== 'P47' && key !== 'P69')
                    .slice(0, 12)
                    .map(([key, value]) => (
                      <div key={key} className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-gray-700">{Number(value).toFixed(2)}</div>
                        <div className="text-xs text-gray-500">{key}</div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}