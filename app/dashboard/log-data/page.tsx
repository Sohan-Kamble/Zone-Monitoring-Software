'use client';

import DashboardLayout from '../../../components/Layout/DashboardLayout';
import { Database, Download, Calendar } from 'lucide-react';

export default function LogDataPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Log Data</h1>
              <p className="text-gray-600">Access and analyze historical data logs</p>
            </div>
            <Database className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        {/* Data Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Data Export Options</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Station</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>All Stations</option>
                <option>Station 1001</option>
                <option>Station 2001</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data Type</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>All Data</option>
                <option>Live Data</option>
                <option>Log Data</option>
                <option>Event Data</option>
              </select>
            </div>
          </div>

          <button className="inline-flex items-center px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 btn-hover">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </button>
        </div>

        {/* Data Preview */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Data Preview</h2>
          <div className="text-center py-12 text-gray-500">
            <Database className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>Log data management functionality will be implemented in the next phase.</p>
            <p className="text-sm mt-2">This will include data export, filtering, and analysis tools.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}