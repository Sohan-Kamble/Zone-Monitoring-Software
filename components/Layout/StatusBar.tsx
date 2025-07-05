'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { SystemStatus } from '@/types';

interface StatusBarProps {
  data?: SystemStatus;
}

export function StatusBar({ data }: StatusBarProps) {
  const [status, setStatus] = useState<SystemStatus>({
    total_tw: 0,
    power_avail: 0,
    power_fail: 0,
    active_sites: 0,
    inactive_sites: 0,
    auto_mode: 0,
    manual_mode: 0,
    pump_on: 0,
    pump_off: 0,
    trip_sites: 0
  });

  useEffect(() => {
    if (data) {
      setStatus(data);
    } else {
      // Fetch status data from API
      fetch('/api/status')
        .then(res => res.json())
        .then(setStatus)
        .catch(console.error);
    }
  }, [data]);

  const statusItems = [
    { label: 'No. of TW', value: status.total_tw, color: 'bg-teal-500' },
    { label: 'Power Avail', value: status.power_avail, color: 'bg-green-500' },
    { label: 'Power Fail', value: status.power_fail, color: 'bg-red-500' },
    { label: 'Active Sites', value: status.active_sites, color: 'bg-teal-500' },
    { label: 'Inactive Sites', value: status.inactive_sites, color: 'bg-red-500' },
    { label: 'Auto Mode', value: status.auto_mode, color: 'bg-green-500' },
    { label: 'Manual Mode', value: status.manual_mode, color: 'bg-red-500' },
    { label: 'Pump ON', value: status.pump_on, color: 'bg-green-500' },
    { label: 'Pump OFF', value: status.pump_off, color: 'bg-red-500' },
    { label: 'Trip Sites', value: status.trip_sites, color: 'bg-green-500' }
  ];

  return (
    <div className="px-4 py-3 bg-gray-50 border-b">
      <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-2">
        {statusItems.map((item, index) => (
          <Card key={index} className="p-2 text-center">
            <div className="text-xs font-medium text-gray-600 mb-1">
              {item.label}
            </div>
            <div className={`inline-flex items-center justify-center w-8 h-8 rounded text-white text-sm font-bold ${item.color}`}>
              {item.value}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}