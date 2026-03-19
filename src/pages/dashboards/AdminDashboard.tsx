import { Routes, Route } from 'react-router';
import { DashboardLayout } from '../../components/DashboardLayout';
import { Users, Calendar, FileText, BarChart } from 'lucide-react';
import { AdminUsers } from './admin/AdminUsers';
import { AdminEvents } from './admin/AdminEvents';
import { AdminApprovals } from './admin/AdminApprovals';
import { AdminReports } from './admin/AdminReports';
import { Settings } from './settings/Settings';

function AdminOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">System overview and management</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <Users className="w-8 h-8 text-blue-600 mb-2" />
          <p className="text-sm text-gray-600">Total Users</p>
          <p className="text-2xl font-bold">12,456</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <Calendar className="w-8 h-8 text-green-600 mb-2" />
          <p className="text-sm text-gray-600">Total Events</p>
          <p className="text-2xl font-bold">1,234</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <FileText className="w-8 h-8 text-orange-600 mb-2" />
          <p className="text-sm text-gray-600">Pending Approvals</p>
          <p className="text-2xl font-bold">23</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <BarChart className="w-8 h-8 text-purple-600 mb-2" />
          <p className="text-sm text-gray-600">Platform Revenue</p>
          <p className="text-2xl font-bold">$456K</p>
        </div>
      </div>
    </div>
  );
}

export function AdminDashboard() {
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<AdminOverview />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="events" element={<AdminEvents />} />
        <Route path="approvals" element={<AdminApprovals />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="settings" element={<Settings />} />
      </Routes>
    </DashboardLayout>
  );
}