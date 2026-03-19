import { Routes, Route } from 'react-router';
import { DashboardLayout } from '../../components/DashboardLayout';
import { Ticket, Heart, Calendar, TrendingUp } from 'lucide-react';
import { AttendeeTickets } from './attendee/AttendeeTickets';
import { AttendeeWishlist } from './attendee/AttendeeWishlist';
import { AttendeeHistory } from './attendee/AttendeeHistory';
import { Settings } from './settings/Settings';

function AttendeeOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Attendee Dashboard</h1>
        <p className="text-gray-600">Manage your tickets and bookings</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <Ticket className="w-8 h-8 text-blue-600 mb-2" />
          <p className="text-sm text-gray-600">Active Tickets</p>
          <p className="text-2xl font-bold">8</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <Heart className="w-8 h-8 text-red-600 mb-2" />
          <p className="text-sm text-gray-600">Wishlist</p>
          <p className="text-2xl font-bold">15</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <Calendar className="w-8 h-8 text-green-600 mb-2" />
          <p className="text-sm text-gray-600">Past Events</p>
          <p className="text-2xl font-bold">24</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <TrendingUp className="w-8 h-8 text-purple-600 mb-2" />
          <p className="text-sm text-gray-600">Total Spent</p>
          <p className="text-2xl font-bold">$1,245</p>
        </div>
      </div>
    </div>
  );
}

export function AttendeeDashboard() {
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<AttendeeOverview />} />
        <Route path="tickets" element={<AttendeeTickets />} />
        <Route path="wishlist" element={<AttendeeWishlist />} />
        <Route path="history" element={<AttendeeHistory />} />
        <Route path="settings" element={<Settings />} />
      </Routes>
    </DashboardLayout>
  );
}