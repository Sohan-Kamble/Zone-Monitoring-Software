'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Droplets, Gauge, Thermometer, Zap, AlertTriangle } from 'lucide-react';

interface MimicDiagramProps {
  station: string;
}

interface LiveData {
  STN: string;
  eTimeStamp: string;
  P1: number;
  P4: number; // Voltage
  P46: number; // Pump status
  P47: number; // Auto/Manual mode
  P69: number; // Water level
  [key: string]: any;
}

export function MimicDiagram({ station }: MimicDiagramProps) {
  const [liveData, setLiveData] = useState<LiveData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const response = await fetch(`/api/live-data?station=${station}`);
        const data = await response.json();
        if (data.length > 0) {
          setLiveData(data[0]);
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
  }, [station]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-teal-600" />
            <span>Live Mimic Diagram</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!liveData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-teal-600" />
            <span>Live Mimic Diagram</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No live data available for station {station}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const pumpStatus = liveData.P46 === 1 ? 'running' : 'stopped';
  const mode = liveData.P47 === 1 ? 'auto' : 'manual';
  const voltage = liveData.P4 || 0;
  const waterLevel = liveData.P69 || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5 text-teal-600" />
          <span>Live Mimic Diagram - Station {station}</span>
        </CardTitle>
        <div className="text-sm text-gray-600">
          Last updated: {new Date(liveData.eTimeStamp).toLocaleString()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg p-8 h-96">
          {/* Water Tank */}
          <div className="absolute top-4 right-8 w-32 h-40 border-4 border-blue-600 rounded-lg bg-gradient-to-t from-blue-400 to-blue-200 flex flex-col justify-end">
            <div 
              className="bg-blue-600 rounded-b transition-all duration-1000"
              style={{ height: `${Math.min(waterLevel, 100)}%` }}
            />
            <div className="absolute top-2 left-2 text-white font-bold text-sm">
              <Droplets className="h-4 w-4 inline mr-1" />
              {waterLevel.toFixed(1)}%
            </div>
          </div>

          {/* Pump */}
          <div className="absolute bottom-8 left-8 w-24 h-24">
            <div className={`w-full h-full rounded-full border-4 flex items-center justify-center transition-all duration-500 ${
              pumpStatus === 'running' 
                ? 'border-green-500 bg-green-100 animate-pulse' 
                : 'border-gray-400 bg-gray-100'
            }`}>
              <Activity className={`h-8 w-8 ${
                pumpStatus === 'running' ? 'text-green-600' : 'text-gray-400'
              }`} />
            </div>
            <div className="text-center mt-2">
              <Badge variant={pumpStatus === 'running' ? 'default' : 'secondary'}>
                {pumpStatus.toUpperCase()}
              </Badge>
            </div>
          </div>

          {/* Pipes */}
          <div className="absolute bottom-20 left-32 w-32 h-2 bg-gray-400 rounded"></div>
          <div className="absolute bottom-20 right-40 w-2 h-32 bg-gray-400 rounded"></div>
          <div className="absolute top-44 right-40 w-32 h-2 bg-gray-400 rounded"></div>

          {/* Control Panel */}
          <div className="absolute top-4 left-4 bg-white rounded-lg p-4 shadow-lg">
            <h3 className="font-semibold mb-3">Control Panel</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-yellow-600" />
                <span className="text-sm">Voltage: {voltage.toFixed(1)}V</span>
              </div>
              <div className="flex items-center space-x-2">
                <Gauge className="h-4 w-4 text-blue-600" />
                <span className="text-sm">Mode: </span>
                <Badge variant={mode === 'auto' ? 'default' : 'secondary'}>
                  {mode.toUpperCase()}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Thermometer className="h-4 w-4 text-red-600" />
                <span className="text-sm">Temp: {(liveData.P1 || 25).toFixed(1)}°C</span>
              </div>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="absolute bottom-4 right-4 space-y-2">
            <div className={`w-4 h-4 rounded-full ${voltage > 0 ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
            <div className={`w-4 h-4 rounded-full ${pumpStatus === 'running' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <div className={`w-4 h-4 rounded-full ${mode === 'auto' ? 'bg-blue-500' : 'bg-yellow-500'}`}></div>
          </div>
        </div>

        {/* Real-time Parameters */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{waterLevel.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Water Level</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{voltage.toFixed(1)}V</div>
            <div className="text-sm text-gray-600">Voltage</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{(liveData.P1 || 25).toFixed(1)}°C</div>
            <div className="text-sm text-gray-600">Temperature</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{(liveData.P150 || 0).toFixed(1)}</div>
            <div className="text-sm text-gray-600">Flow Rate</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}