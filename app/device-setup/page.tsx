'use client';

import { Header } from '@/components/Layout/Header';
import { StatusBar } from '@/components/Layout/StatusBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HardDrive, Cpu } from 'lucide-react';

export default function DeviceSetupPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="device-setup" />
      <StatusBar />
      
      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Device Setup</h1>
            <p className="text-gray-600">Configure and manage devices within stations</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <HardDrive className="h-5 w-5 text-teal-600" />
                <span>Device Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <Cpu className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Device setup interface will be implemented in the next phase</p>
                <p className="text-sm">This will allow adding and configuring devices within stations</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}