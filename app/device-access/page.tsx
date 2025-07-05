'use client';

import { Header } from '@/components/Layout/Header';
import { StatusBar } from '@/components/Layout/StatusBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Monitor } from 'lucide-react';

export default function DeviceAccessPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="device-access" />
      <StatusBar />
      
      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Device Access</h1>
            <p className="text-gray-600">Monitor and control device access within your zone</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-teal-600" />
                <span>Device Access Control</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <Monitor className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Device access management will be implemented in the next phase</p>
                <p className="text-sm">This will show all devices in your zone with access controls</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}