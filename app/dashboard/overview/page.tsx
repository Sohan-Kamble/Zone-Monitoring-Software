'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/Layout/DashboardLayout';
import { Station } from '../../../types';
import { Search, Filter, Eye, MapPin, Activity, Clock } from 'lucide-react';

export default function DashboardOverviewPage() {
  const [stations, setStations] = useState<Station[]>([]);
  const [filteredStations, setFilteredStations] = useState<Station[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStations();
  }, []);

  useEffect(() => {
    filterStations();
  }, [stations, searchTerm, statusFilter]);

  const fetchStations = async () => {
    try {
      const response = await fetch('/api/stations');
      if (response.ok) {
        const data = await response.json();
        setStations(data.stations);
      }
    } catch (error) {
      console.error('Failed to fetch stations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterStations = () => {
    let filtered = stations;

    if (searchTerm) {
      filtered = filtered.filter(station =>
        station.STN_NAME.toLowerCase().includes(searchTerm.toLowerCase()) ||
        station.STN_ADDRESS1.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      // Add status filtering logic based on live data
      // For now, we'll simulate status
      filtered = filtered.filter(station => {
        const isOnline = Math.random() > 0.2; // 80% online simulation
        return statusFilter === 'online' ? isOnline : !isOnline;
      });
    }

    setFilteredStations(filtered);
  };

  const handleGoLive = (station: Station) => {
    window.location.href = `/dashboard/live-mimic?station=${encodeURIComponent(station.STN_NAME)}`;
  };

  const getStatusColor = (station: Station) => {
    // Simulate status based on station data
    const isOnline = Math.random() > 0.2;
    return isOnline ? 'bg-green-500' : 'bg-red-500';
  };

  const getStatusText = (station: Station) => {
    const isOnline = Math.random() > 0.2;
    return isOnline ? 'Online' : 'Offline';
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
              <p className="text-gray-600">Monitor and manage all water stations</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">{filteredStations.length}</p>
                <p className="text-sm text-gray-500">Active Stations</p>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search stations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStations.map((station) => (
            <div key={station.STN_NAME} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{station.STN_NAME}</h3>
                  <p className="text-sm text-gray-600">{station.STN_ADDRESS0}</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${getStatusColor(station)} status-pulse`}></div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{station.STN_ADDRESS1}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Activity className="w-4 h-4 mr-2" />
                  <span>Type: {station.TYPE}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Status: {getStatusText(station)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <p className="text-gray-500">Pump Capacity</p>
                  <p className="font-medium text-gray-900">{station.PUMP_CAPACITY}</p>
                </div>
                <div>
                  <p className="text-gray-500">Operator</p>
                  <p className="font-medium text-gray-900">{station.OPERATOR_NAME}</p>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleGoLive(station)}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 btn-hover"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Go Live
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredStations.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No stations found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}