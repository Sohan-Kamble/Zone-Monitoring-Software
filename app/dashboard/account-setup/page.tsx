'use client';

import DashboardLayout from '../../../components/Layout/DashboardLayout';
import { Settings, Users, Plus, Edit, Trash2 } from 'lucide-react';

export default function AccountSetupPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Setup</h1>
              <p className="text-gray-600">Manage user accounts and permissions</p>
            </div>
            <Settings className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        {/* Account Management */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Users className="w-5 h-5 text-gray-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">User Accounts</h2>
            </div>
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 btn-hover">
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </button>
          </div>

          {/* Sample User List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Admin User</h3>
                  <p className="text-sm text-gray-600">admin@amrutpw.com • Administrator</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Active</span>
                <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h2>
          <div className="text-center py-12 text-gray-500">
            <Settings className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>Advanced account management features will be implemented in the next phase.</p>
            <p className="text-sm mt-2">This will include role management, permissions, and user administration.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}