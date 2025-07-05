'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import DashboardLayout from '../../../components/Layout/DashboardLayout';
import { Activity, Gauge, Thermometer, Droplets, Zap, RefreshCw } from 'lucide-react';

function LiveMimicContent() {
  const searchParams = useSearchParams();
  const zone = searchParams.get('zone');
  const station = searchParams.get('station');

  const [liveData, setLiveData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    fetchLiveData();
    const interval = setInterval(fetchLiveData, 5000); // every 5s
    return () => clearInterval(interval);
  }, [station]);

  const fetchLiveData = async () => {
    try {
      const url = station 
        ? `/api/live-data?station=${encodeURIComponent(station)}`
        : '/api/live-data';
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setLiveData(data.liveData[0] || null);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error('Failed to fetch live data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatValue = (value: number, unit: string = '') => {
    if (value === null || value === undefined) return 'N/A';
    return `${value.toFixed(2)}${unit}`;
  };

  const getStatusColor = (value: number, threshold: number = 0) => {
    return value > threshold ? 'text-green-600' : 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading live data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Live Mimic Diagram</h1>
            <p className="text-gray-600">
              Real-time monitoring for {zone ? `Zone: ${zone}` : station ? `Station: ${station}` : 'All Systems'}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">Last Update</p>
              <p className="text-sm font-medium text-gray-900">{lastUpdate.toLocaleTimeString()}</p>
            </div>
            <button
              onClick={fetchLiveData}
              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {liveData ? (
        <>
          {/* System Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatusCard label="Water Flow" value={liveData.P4} icon={Droplets} unit="L/s" />
            <StatusCard label="Pressure" value={liveData.P69} icon={Gauge} unit="PSI" />
            <StatusCard label="Temperature" value={liveData.P150} icon={Thermometer} unit="°C" />
            <StatusCard label="Power Status" value={liveData.P106 > 0 && liveData.P107 > 0 ? 1 : 0} icon={Zap} unit="" />
          </div>

          {/* Parameters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <Activity className="w-5 h-5 text-gray-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Live Parameters</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Array.from({ length: 20 }, (_, i) => {
                const paramKey = `P${i + 1}`;
                const value = liveData[paramKey];
                return (
                  <div key={paramKey} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase">{paramKey}</p>
                    <p className={`text-lg font-semibold ${getStatusColor(value || 0)}`}>
                      {formatValue(value || 0)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mimic Placeholder */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">System Mimic Diagram</h2>
            <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Activity className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Interactive mimic diagram will be implemented in the next phase.</p>
                <p className="text-sm mt-2">This will include real-time visual representation of the water system.</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center py-12 text-gray-500">
            <Activity className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>No live data available for the selected system.</p>
            <p className="text-sm mt-2">Please check the system connection and try again.</p>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusCard({
  label,
  value,
  icon: Icon,
  unit = '',
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  unit?: string;
}) {
  const getStatusColor = (value: number, threshold: number = 0) =>
    value > threshold ? 'text-green-600' : 'text-red-600';

  const formatValue = (value: number, unit: string = '') => {
    if (value === null || value === undefined) return 'N/A';
    return `${value.toFixed(2)}${unit}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Icon className="w-5 h-5 text-blue-600" />
          </div>
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className={`text-2xl font-semibold ${getStatusColor(value || 0)}`}>
            {value > 1 && label === 'Power Status' ? 'ON' : formatValue(value || 0, unit)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LiveMimicPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={<div className="p-6 text-gray-500">Loading mimic data...</div>}>
        <LiveMimicContent />
      </Suspense>
    </DashboardLayout>
  );
}


// 'use client';

// import { useState, useEffect } from 'react';
// import { useSearchParams } from 'next/navigation';
// import DashboardLayout from '../../../components/Layout/DashboardLayout';
// import { Activity, Gauge, Thermometer, Droplets, Zap, RefreshCw } from 'lucide-react';

// export default function LiveMimicPage() {
//   const searchParams = useSearchParams();
//   const zone = searchParams.get('zone');
//   const station = searchParams.get('station');
  
//   const [liveData, setLiveData] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

//   useEffect(() => {
//     fetchLiveData();
    
//     // Set up real-time updates every 5 seconds
//     const interval = setInterval(fetchLiveData, 5000);
    
//     return () => clearInterval(interval);
//   }, [station]);

//   const fetchLiveData = async () => {
//     try {
//       const url = station 
//         ? `/api/live-data?station=${encodeURIComponent(station)}`
//         : '/api/live-data';
      
//       const response = await fetch(url);
//       if (response.ok) {
//         const data = await response.json();
//         setLiveData(data.liveData[0] || null);
//         setLastUpdate(new Date());
//       }
//     } catch (error) {
//       console.error('Failed to fetch live data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatValue = (value: number, unit: string = '') => {
//     if (value === null || value === undefined) return 'N/A';
//     return `${value.toFixed(2)}${unit}`;
//   };

//   const getStatusColor = (value: number, threshold: number = 0) => {
//     if (value > threshold) return 'text-green-600';
//     return 'text-red-600';
//   };

//   if (loading) {
//     return (
//       <DashboardLayout>
//         <div className="flex items-center justify-center h-64">
//           <div className="text-center">
//             <div className="spinner mx-auto mb-4"></div>
//             <p className="text-gray-600">Loading live data...</p>
//           </div>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   return (
//     <DashboardLayout>
//       <div className="space-y-6">
//         {/* Header */}
//         <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900 mb-2">Live Mimic Diagram</h1>
//               <p className="text-gray-600">
//                 Real-time monitoring for {zone ? `Zone: ${zone}` : station ? `Station: ${station}` : 'All Systems'}
//               </p>
//             </div>
//             <div className="flex items-center space-x-4">
//               <div className="text-right">
//                 <p className="text-sm text-gray-500">Last Update</p>
//                 <p className="text-sm font-medium text-gray-900">{lastUpdate.toLocaleTimeString()}</p>
//               </div>
//               <button
//                 onClick={fetchLiveData}
//                 className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
//               >
//                 <RefreshCw className="w-5 h-5" />
//               </button>
//             </div>
//           </div>
//         </div>

//         {liveData ? (
//           <>
//             {/* System Status Overview */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//                 <div className="flex items-center">
//                   <div className="flex-shrink-0">
//                     <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
//                       <Droplets className="w-5 h-5 text-blue-600" />
//                     </div>
//                   </div>
//                   <div className="ml-4">
//                     <p className="text-sm font-medium text-gray-500">Water Flow</p>
//                     <p className={`text-2xl font-semibold ${getStatusColor(liveData.P4 || 0)}`}>
//                       {formatValue(liveData.P4 || 0, ' L/s')}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//                 <div className="flex items-center">
//                   <div className="flex-shrink-0">
//                     <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
//                       <Gauge className="w-5 h-5 text-green-600" />
//                     </div>
//                   </div>
//                   <div className="ml-4">
//                     <p className="text-sm font-medium text-gray-500">Pressure</p>
//                     <p className={`text-2xl font-semibold ${getStatusColor(liveData.P69 || 0)}`}>
//                       {formatValue(liveData.P69 || 0, ' PSI')}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//                 <div className="flex items-center">
//                   <div className="flex-shrink-0">
//                     <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
//                       <Thermometer className="w-5 h-5 text-orange-600" />
//                     </div>
//                   </div>
//                   <div className="ml-4">
//                     <p className="text-sm font-medium text-gray-500">Temperature</p>
//                     <p className={`text-2xl font-semibold ${getStatusColor(liveData.P150 || 0)}`}>
//                       {formatValue(liveData.P150 || 0, '°C')}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//                 <div className="flex items-center">
//                   <div className="flex-shrink-0">
//                     <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
//                       <Zap className="w-5 h-5 text-yellow-600" />
//                     </div>
//                   </div>
//                   <div className="ml-4">
//                     <p className="text-sm font-medium text-gray-500">Power Status</p>
//                     <p className={`text-2xl font-semibold ${getStatusColor(liveData.P106 || 0)}`}>
//                       {(liveData.P106 > 0 && liveData.P107 > 0) ? 'ON' : 'OFF'}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Detailed Parameters */}
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//               <div className="flex items-center mb-6">
//                 <Activity className="w-5 h-5 text-gray-600 mr-2" />
//                 <h2 className="text-lg font-semibold text-gray-900">Live Parameters</h2>
//               </div>

//               <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
//                 {Array.from({ length: 20 }, (_, i) => {
//                   const paramKey = `P${i + 1}`;
//                   const value = liveData[paramKey];
//                   return (
//                     <div key={paramKey} className="bg-gray-50 rounded-lg p-3">
//                       <p className="text-xs font-medium text-gray-500 uppercase">{paramKey}</p>
//                       <p className={`text-lg font-semibold ${getStatusColor(value || 0)}`}>
//                         {formatValue(value || 0)}
//                       </p>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* Mimic Diagram Placeholder */}
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//               <h2 className="text-lg font-semibold text-gray-900 mb-4">System Mimic Diagram</h2>
//               <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
//                 <div className="text-center text-gray-500">
//                   <Activity className="w-16 h-16 mx-auto mb-4 text-gray-300" />
//                   <p>Interactive mimic diagram will be implemented in the next phase.</p>
//                   <p className="text-sm mt-2">This will include real-time visual representation of the water system.</p>
//                 </div>
//               </div>
//             </div>
//           </>
//         ) : (
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//             <div className="text-center py-12 text-gray-500">
//               <Activity className="w-16 h-16 mx-auto mb-4 text-gray-300" />
//               <p>No live data available for the selected system.</p>
//               <p className="text-sm mt-2">Please check the system connection and try again.</p>
//             </div>
//           </div>
//         )}
//       </div>
//     </DashboardLayout>
//   );
// }