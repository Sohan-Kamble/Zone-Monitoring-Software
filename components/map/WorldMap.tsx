'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { ZoneMarker } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Users, Activity } from 'lucide-react';

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

interface WorldMapProps {
  onZoneClick?: (zone: ZoneMarker) => void;
}

export function WorldMap({ onZoneClick }: WorldMapProps) {
  const [markers, setMarkers] = useState<ZoneMarker[]>([]);
  const [selectedZone, setSelectedZone] = useState<ZoneMarker | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Mock zone data - in production, this would come from your API
    const mockZones: ZoneMarker[] = [
      {
        id: '1001',
        name: 'Kanji Kauya',
        latitude: 27.388602649475065,
        longitude: 81.7906098047835,
        status: 'active',
        stationCount: 1
      },
      // Add more zones as needed
    ];
    
    setMarkers(mockZones);
  }, []);

  const handleZoneClick = (zone: ZoneMarker) => {
    setSelectedZone(zone);
    onZoneClick?.(zone);
  };

  const getMarkerColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981'; // green
      case 'warning': return '#f59e0b'; // yellow
      case 'inactive': return '#ef4444'; // red
      default: return '#6b7280'; // gray
    }
  };

  if (!isClient) {
    return (
      <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-96 rounded-lg overflow-hidden border">
      <MapContainer
        center={[20.5937, 78.9629]} // Center of India
        zoom={5}
        className="w-full h-full"
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {markers.map((zone) => (
          <Marker
            key={zone.id}
            position={[zone.latitude, zone.longitude]}
            eventHandlers={{
              click: () => handleZoneClick(zone)
            }}
          >
            <Popup>
              <Card className="w-64 border-0 shadow-none">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-teal-600" />
                    <span>{zone.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Status:</span>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        zone.status === 'active' ? 'bg-green-100 text-green-800' :
                        zone.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {zone.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Stations:</span>
                      <span className="text-xs font-medium">{zone.stationCount}</span>
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full mt-2"
                      onClick={() => handleZoneClick(zone)}
                    >
                      Show More Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Zone info panel */}
      {selectedZone && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 w-72">
          <h3 className="font-semibold text-lg mb-2 flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-teal-600" />
            {selectedZone.name}
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Zone ID:</span>
              <span className="text-sm font-medium">{selectedZone.id}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Status:</span>
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                selectedZone.status === 'active' ? 'bg-green-100 text-green-800' :
                selectedZone.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {selectedZone.status}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Stations:</span>
              <span className="text-sm font-medium flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {selectedZone.stationCount}
              </span>
            </div>
            <Button 
              className="w-full mt-3"
              onClick={() => {
                // Navigate to live mimic page
                window.location.href = `/mimic/${selectedZone.id}`;
              }}
            >
              <Activity className="h-4 w-4 mr-2" />
              Go Live
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

