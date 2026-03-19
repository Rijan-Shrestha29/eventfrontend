import { Routes, Route } from 'react-router';
import { DashboardLayout } from '../../components/DashboardLayout';
import { Calendar, DollarSign, Star, Music, Bell } from 'lucide-react';
import { ArtistPerformances } from './artist/ArtistPerformances';
import { ArtistPortfolio } from './artist/ArtistPortfolio';
import { ArtistEarnings } from './artist/ArtistEarnings';
import { Settings } from './settings/Settings';

function ArtistOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Artist Dashboard</h1>
        <p className="text-gray-600">Manage your performances and earnings</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <Calendar className="w-8 h-8 text-blue-600 mb-2" />
          <p className="text-sm text-gray-600">Upcoming Gigs</p>
          <p className="text-2xl font-bold">12</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <DollarSign className="w-8 h-8 text-green-600 mb-2" />
          <p className="text-sm text-gray-600">Total Earnings</p>
          <p className="text-2xl font-bold">$45,780</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <Star className="w-8 h-8 text-yellow-600 mb-2" />
          <p className="text-sm text-gray-600">Average Rating</p>
          <p className="text-2xl font-bold">4.8</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <Music className="w-8 h-8 text-purple-600 mb-2" />
          <p className="text-sm text-gray-600">Total Events</p>
          <p className="text-2xl font-bold">48</p>
        </div>
      </div>
    </div>
  );
}

function ArtistInvitations() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Invitations</h1>
      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600">No new invitations</p>
      </div>
    </div>
  );
}

export function ArtistDashboard() {
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<ArtistOverview />} />
        <Route path="performances" element={<ArtistPerformances />} />
        <Route path="invitations" element={<ArtistInvitations />} />
        <Route path="portfolio" element={<ArtistPortfolio />} />
        <Route path="earnings" element={<ArtistEarnings />} />
        <Route path="settings" element={<Settings />} />
      </Routes>
    </DashboardLayout>
  );
}