// 'use client';

// import { useSession } from 'next-auth/react';
// import { useEffect, useState } from 'react';
// import { Header } from '@/components/Layout/Header';
// import { StatusBar } from '@/components/Layout/StatusBar';
// import { WorldMap } from '@/components/map/WorldMap';
// import { SystemStatus, ZoneMarker } from '@/types';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { MapPin, Activity, Clock } from 'lucide-react';

// export default function HomePage() {
//   const { data: session } = useSession();
//   const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
//   const [selectedZone, setSelectedZone] = useState<ZoneMarker | null>(null);

//   useEffect(() => {
//     // Fetch system status
//     fetch('/api/status')
//       .then(res => res.json())
//       .then(setSystemStatus)
//       .catch(console.error);
//   }, []);

//   const handleZoneClick = (zone: ZoneMarker) => {
//     setSelectedZone(zone);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Header currentPage="home" />
//       {systemStatus && <StatusBar data={systemStatus} />}
      
//       <main className="container mx-auto px-4 py-6">
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//           {/* Map Section */}
//           <div className="lg:col-span-3">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center space-x-2">
//                   <MapPin className="h-5 w-5 text-teal-600" />
//                   <span>Zone Overview Map</span>
//                 </CardTitle>
//                 <p className="text-sm text-gray-600">
//                   Interactive map showing all water supply zones. Click on markers to view zone details.
//                 </p>
//               </CardHeader>
//               <CardContent>
//                 <WorldMap onZoneClick={handleZoneClick} />
//               </CardContent>
//             </Card>
//           </div>

//           {/* Sidebar */}
//           <div className="space-y-6">
//             {/* User Info */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg">Welcome</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-2">
//                   <div>
//                     <span className="text-sm text-gray-600">User:</span>
//                     <p className="font-medium">{session?.user?.name}</p>
//                   </div>
//                   <div>
//                     <span className="text-sm text-gray-600">Zone Access:</span>
//                     <p className="font-medium">{session?.user?.zone || 'All Zones'}</p>
//                   </div>
//                   <div>
//                     <span className="text-sm text-gray-600">Role:</span>
//                     <p className="font-medium">{session?.user?.role}</p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Quick Stats */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg flex items-center space-x-2">
//                   <Activity className="h-4 w-4" />
//                   <span>Quick Stats</span>
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-3">
//                   <div className="flex justify-between">
//                     <span className="text-sm text-gray-600">Total Stations</span>
//                     <span className="font-medium">{systemStatus?.total_tw || 0}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-sm text-gray-600">Active Sites</span>
//                     <span className="font-medium text-green-600">{systemStatus?.active_sites || 0}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-sm text-gray-600">Power Available</span>
//                     <span className="font-medium text-green-600">{systemStatus?.power_avail || 0}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-sm text-gray-600">Pumps Running</span>
//                     <span className="font-medium text-blue-600">{systemStatus?.pump_on || 0}</span>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Selected Zone Info */}
//             {selectedZone && (
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="text-lg flex items-center space-x-2">
//                     <MapPin className="h-4 w-4 text-teal-600" />
//                     <span>Selected Zone</span>
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-2">
//                     <div>
//                       <span className="text-sm text-gray-600">Zone Name:</span>
//                       <p className="font-medium">{selectedZone.name}</p>
//                     </div>
//                     <div>
//                       <span className="text-sm text-gray-600">Status:</span>
//                       <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ml-2 ${
//                         selectedZone.status === 'active' ? 'bg-green-100 text-green-800' :
//                         selectedZone.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
//                         'bg-red-100 text-red-800'
//                       }`}>
//                         {selectedZone.status}
//                       </span>
//                     </div>
//                     <div>
//                       <span className="text-sm text-gray-600">Stations:</span>
//                       <p className="font-medium">{selectedZone.stationCount}</p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             )}

//             {/* Last Update */}
//             <Card>
//               <CardContent className="pt-6">
//                 <div className="flex items-center space-x-2 text-sm text-gray-600">
//                   <Clock className="h-4 w-4" />
//                   <span>Last updated: {new Date().toLocaleTimeString()}</span>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }


'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Header } from '@/components/Layout/Header';
import { StatusBar } from '@/components/Layout/StatusBar';
import { WorldMap } from '@/components/map/WorldMap';
import { SystemStatus, ZoneMarker } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Activity, Clock } from 'lucide-react';

export default function HomePage() {
  const { data: session } = useSession();
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [selectedZone, setSelectedZone] = useState<ZoneMarker | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleTimeString());

  useEffect(() => {
    const fetchStatus = () => {
      fetch('/api/status')
        .then(res => res.json())
        .then(data => {
          setSystemStatus(data);
          setLastUpdated(new Date().toLocaleTimeString());
        })
        .catch(console.error);
    };

    fetchStatus(); // initial fetch
    const interval = setInterval(fetchStatus, 1000); // fetch every second

    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  const handleZoneClick = (zone: ZoneMarker) => {
    setSelectedZone(zone);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="home" />
      {systemStatus && <StatusBar data={systemStatus} />}

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-teal-600" />
                  <span>Zone Overview Map</span>
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Interactive map showing all water supply zones. Click on markers to view zone details.
                </p>
              </CardHeader>
              <CardContent>
                <WorldMap onZoneClick={handleZoneClick} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Welcome</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-600">User:</span>
                    <p className="font-medium">{session?.user?.name}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Zone Access:</span>
                    <p className="font-medium">{session?.user?.zone || 'All Zones'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Role:</span>
                    <p className="font-medium">{session?.user?.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Activity className="h-4 w-4" />
                  <span>Quick Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Stations</span>
                    <span className="font-medium">{systemStatus?.total_tw || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Active Sites</span>
                    <span className="font-medium text-green-600">{systemStatus?.active_sites || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Power Available</span>
                    <span className="font-medium text-green-600">{systemStatus?.power_avail || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Pumps Running</span>
                    <span className="font-medium text-blue-600">{systemStatus?.pump_on || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Selected Zone Info */}
            {selectedZone && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-teal-600" />
                    <span>Selected Zone</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600">Zone Name:</span>
                      <p className="font-medium">{selectedZone.name}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Status:</span>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ml-2 ${
                        selectedZone.status === 'active' ? 'bg-green-100 text-green-800' :
                        selectedZone.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {selectedZone.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Stations:</span>
                      <p className="font-medium">{selectedZone.stationCount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Last Update */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>Last updated: {lastUpdated}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
