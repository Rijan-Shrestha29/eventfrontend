import { useEffect, useState } from 'react';
import { Ticket, Heart, Calendar, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router';
import { DashboardLayout } from '../../../components/DashboardLayout';
import { DashboardCard } from '../../../components/DashboardCard';
import { DataTable } from '../../../components/DataTable';
import { statsApi, bookingsApi, eventsApi } from '../../../lib/mockApi';
import { useAuthStore, useWishlistStore } from '../../../lib/store';
import { Booking, Event, DashboardStats } from '../../../types';

export function AttendeeOverview() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { items: wishlistIds } = useWishlistStore();
  const [stats, setStats] = useState<DashboardStats>({});
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [wishlistEvents, setWishlistEvents] = useState<Event[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (!user) return;

    const [statsData, bookingsData, allEvents] = await Promise.all([
      statsApi.getByRole('attendee'),
      bookingsApi.getByUser(user.id),
      eventsApi.getAll(),
    ]);

    setStats(statsData);
    setBookings(bookingsData);
    
    const wishlist = allEvents.filter(e => wishlistIds.includes(e.id));
    setWishlistEvents(wishlist);
  };

  const upcomingBookings = bookings.filter(b => {
    if (!b.event) return false;
    return new Date(b.event.date) > new Date() && b.status === 'confirmed';
  });

  const bookingColumns = [
    { 
      header: 'Event', 
      accessor: (row: Booking) => (
        <div className="flex items-center gap-3">
          <img src={row.event?.banner} alt="" className="w-12 h-12 object-cover rounded" />
          <div>
            <p className="font-semibold">{row.event?.title}</p>
            <p className="text-sm text-gray-500">{row.ticketType}</p>
          </div>
        </div>
      )
    },
    { 
      header: 'Date', 
      accessor: (row: Booking) => {
        if (!row.event) return '';
        return new Date(row.event.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      }
    },
    { 
      header: 'Quantity', 
      accessor: (row: Booking) => `${row.quantity}x` 
    },
    { 
      header: 'Amount', 
      accessor: (row: Booking) => `$${row.totalAmount}` 
    },
    { 
      header: 'Status', 
      accessor: (row: Booking) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
          row.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
          row.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
          'bg-yellow-100 text-yellow-800'
        }`}>
          {row.status}
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: (row: Booking) => (
        <button
          onClick={() => navigate(`/events/${row.eventId}`)}
          className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
        >
          View
        </button>
      )
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
          <p className="text-gray-600">Track your bookings and explore new events</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard
            title="Upcoming Events"
            value={stats.upcomingEvents?.toString() || '0'}
            icon={Calendar}
            color="#3B82F6"
          />
          <DashboardCard
            title="Total Spent"
            value={`$${stats.totalSpent || 0}`}
            icon={DollarSign}
            color="#10B981"
          />
          <DashboardCard
            title="Events Attended"
            value={stats.eventsAttended?.toString() || '0'}
            icon={Ticket}
            color="#8B5CF6"
          />
          <DashboardCard
            title="Saved Events"
            value={stats.savedEvents?.toString() || wishlistIds.length}
            icon={Heart}
            color="#F59E0B"
          />
        </div>

        {/* Upcoming Bookings */}
        {upcomingBookings.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
            <DataTable
              data={upcomingBookings}
              columns={bookingColumns}
              itemsPerPage={5}
            />
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Upcoming Events</h3>
            <p className="text-gray-600 mb-6">Discover amazing events happening around you</p>
            <button
              onClick={() => navigate('/events')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Browse Events
            </button>
          </div>
        )}

        {/* Wishlist */}
        {wishlistEvents.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Saved Events</h2>
              <button
                onClick={() => navigate('/attendee/wishlist')}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                View All
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {wishlistEvents.slice(0, 3).map((event) => (
                <div key={event.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                  <img src={event.banner} alt={event.title} className="w-full h-40 object-cover" />
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">{event.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                    <button
                      onClick={() => navigate(`/events/${event.id}`)}
                      className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      View Event
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}