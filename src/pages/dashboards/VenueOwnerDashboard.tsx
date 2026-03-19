import { Routes, Route } from 'react-router';
import { DashboardLayout } from '../../components/DashboardLayout';
import { MapPin, Calendar, DollarSign, BarChart } from 'lucide-react';
import { VenueOwnerVenues } from './venue/VenueOwnerVenues';
import { VenueOwnerBookings } from './venue/VenueOwnerBookings';
import { VenueOwnerAnalytics } from './venue/VenueOwnerAnalytics';
import { Settings } from './settings/Settings';

function VenueOwnerOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Venue Owner Dashboard</h1>
        <p className="text-gray-600">Manage your venues and bookings</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <MapPin className="w-8 h-8 text-blue-600 mb-2" />
          <p className="text-sm text-gray-600">My Venues</p>
          <p className="text-2xl font-bold">3</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <Calendar className="w-8 h-8 text-green-600 mb-2" />
          <p className="text-sm text-gray-600">Active Bookings</p>
          <p className="text-2xl font-bold">28</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <DollarSign className="w-8 h-8 text-purple-600 mb-2" />
          <p className="text-sm text-gray-600">Revenue</p>
          <p className="text-2xl font-bold">$87,650</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <BarChart className="w-8 h-8 text-orange-600 mb-2" />
          <p className="text-sm text-gray-600">Occupancy Rate</p>
          <p className="text-2xl font-bold">78%</p>
        </div>
      </div>
    </div>
  );
}

export function VenueOwnerDashboard() {
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<VenueOwnerOverview />} />
        <Route path="venues" element={<VenueOwnerVenues />} />
        <Route path="bookings" element={<VenueOwnerBookings />} />
        <Route path="analytics" element={<VenueOwnerAnalytics />} />
        <Route path="settings" element={<Settings />} />
      </Routes>
    </DashboardLayout>
  );
}