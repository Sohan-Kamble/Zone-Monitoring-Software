'use client';

import DashboardLayout from '../../../components/Layout/DashboardLayout';
import { HardDrive, Plus, Settings, Wifi } from 'lucide-react';

export default function DeviceSetupPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Device Setup</h1>
              <p className="text-gray-600">Configure and manage station devices</p>
            </div>
            <HardDrive className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        {/* Device Configuration */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Settings className="w-5 h-5 text-gray-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Device Configuration</h2>
            </div>
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 btn-hover">
              <Plus className="w-4 h-4 mr-2" />
              Add Device
            </button>
          </div>

          {/* Sample Device List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Wifi className="w-5 h-5 text-green-500 mr-2" />
                  <span className="font-medium text-gray-900">Device 2001</span>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Online</span>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-medium">Type:</span> OHT_CAMPUS</p>
                <p><span className="font-medium">Station:</span> Campus Station</p>
                <p><span className="font-medium">Last Update:</span> 2 min ago</p>
              </div>
              <button className="w-full mt-3 px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200">
                Configure
              </button>
            </div>
          </div>
        </div>

        {/* Device Management */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Device Management</h2>
          <div className="text-center py-12 text-gray-500">
            <HardDrive className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>Advanced device management features will be implemented in the next phase.</p>
            <p className="text-sm mt-2">This will include device configuration, firmware updates, and monitoring.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}