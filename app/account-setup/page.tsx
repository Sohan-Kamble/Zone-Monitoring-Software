'use client';

import { Header } from '@/components/Layout/Header';
import { StatusBar } from '@/components/Layout/StatusBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Users } from 'lucide-react';

export default function AccountSetupPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="account-setup" />
      <StatusBar />
      
      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Account Setup</h1>
            <p className="text-gray-600">Manage user accounts and permissions</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-teal-600" />
                <span>Account Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Account management system will be implemented in the next phase</p>
                <p className="text-sm">This will include user creation, role management, and permissions</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}