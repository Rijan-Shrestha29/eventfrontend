import { Routes, Route } from 'react-router';
import { DashboardLayout } from '../../components/DashboardLayout';
import { Calendar, Ticket, DollarSign, Users } from 'lucide-react';
import { OrganizerEvents } from './organizer/OrganizerEvents';
import { OrganizerArtists } from './organizer/OrganizerArtists';
import { OrganizerVenues } from './organizer/OrganizerVenues';
import { OrganizerAnalytics } from './organizer/OrganizerAnalytics';
import { Settings } from './settings/Settings';

function OrganizerOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Organizer Dashboard</h1>
        <p className="text-gray-600">Manage your events and track performance</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <Calendar className="w-8 h-8 text-blue-600 mb-2" />
          <p className="text-sm text-gray-600">Active Events</p>
          <p className="text-2xl font-bold">12</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <Ticket className="w-8 h-8 text-green-600 mb-2" />
          <p className="text-sm text-gray-600">Total Sales</p>
          <p className="text-2xl font-bold">3,456</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <DollarSign className="w-8 h-8 text-purple-600 mb-2" />
          <p className="text-sm text-gray-600">Revenue</p>
          <p className="text-2xl font-bold">$145,890</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <Users className="w-8 h-8 text-orange-600 mb-2" />
          <p className="text-sm text-gray-600">Total Attendees</p>
          <p className="text-2xl font-bold">15,432</p>
        </div>
      </div>
    </div>
  );
}

export function OrganizerDashboard() {
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<OrganizerOverview />} />
        <Route path="events" element={<OrganizerEvents />} />
        <Route path="artists" element={<OrganizerArtists />} />
        <Route path="venues" element={<OrganizerVenues />} />
        <Route path="analytics" element={<OrganizerAnalytics />} />
        <Route path="settings" element={<Settings />} />
      </Routes>
    </DashboardLayout>
  );
}