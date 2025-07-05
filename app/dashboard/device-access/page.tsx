'use client';

import DashboardLayout from '../../../components/Layout/DashboardLayout';
import { Shield, Eye, Lock, Unlock } from 'lucide-react';

export default function DeviceAccessPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Device Access</h1>
              <p className="text-gray-600">Manage device access permissions and monitoring</p>
            </div>
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        {/* Access Control */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center mb-6">
            <Lock className="w-5 h-5 text-gray-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Access Control</h2>
          </div>

          {/* Sample Access List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <Unlock className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Zone 2 Devices</h3>
                  <p className="text-sm text-gray-600">3 devices • Full access granted</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full hover:bg-blue-200 transition-colors">
                  <Eye className="w-3 h-3 mr-1" />
                  Monitor
                </button>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Device Monitoring */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Device Monitoring</h2>
          <div className="text-center py-12 text-gray-500">
            <Shield className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>Device access management features will be implemented in the next phase.</p>
            <p className="text-sm mt-2">This will include access control, monitoring, and security management.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}