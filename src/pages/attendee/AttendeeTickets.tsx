import { useEffect, useState } from 'react';
import { Ticket, Download, Calendar, MapPin, QrCode } from 'lucide-react';
import { useNavigate } from 'react-router';
import { bookingsApi } from '../../../lib/mockApi';
import { useAuthStore } from '../../../lib/store';
import { Booking } from '../../../types';

export function AttendeeTickets() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    if (!user) return;
    const data = await bookingsApi.getByUser(user.id);
    setBookings(data);
  };

  const filterBookings = () => {
    const now = new Date();
    switch (filter) {
      case 'upcoming':
        return bookings.filter(b => b.event && new Date(b.event.date) >= now && b.status === 'confirmed');
      case 'past':
        return bookings.filter(b => b.event && new Date(b.event.date) < now);
      default:
        return bookings;
    }
  };

  const filteredBookings = filterBookings();

  const handleDownloadTicket = (booking: Booking) => {
    alert(`Downloading ticket for ${booking.event?.title}. In a real app, this would generate a PDF with QR code.`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Tickets</h1>
        <p className="text-gray-600">View and manage your event tickets</p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow-md p-2 inline-flex gap-2">
        <button
          onClick={() => setFilter('upcoming')}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
            filter === 'upcoming'
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setFilter('past')}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
            filter === 'past'
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Past
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          All
        </button>
      </div>

      {/* Tickets List */}
      {filteredBookings.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/3">
                  <img
                    src={booking.event?.banner}
                    alt={booking.event?.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:w-2/3 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{booking.event?.title}</h3>
                      <div className="space-y-2 text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {booking.event?.date && new Date(booking.event.date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{booking.event?.venue?.name}</span>
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        booking.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : booking.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Ticket Type</p>
                      <p className="font-semibold">{booking.ticketType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Quantity</p>
                      <p className="font-semibold">{booking.quantity}x</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Paid</p>
                      <p className="font-semibold">${booking.totalAmount}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleDownloadTicket(booking)}
                      className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download Ticket
                    </button>
                    <button
                      onClick={() => navigate(`/events/${booking.eventId}`)}
                      className="px-6 py-2 border-2 border-gray-300 rounded-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-colors"
                    >
                      View Event
                    </button>
                    <button
                      className="flex items-center gap-2 px-6 py-2 border-2 border-gray-300 rounded-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-colors"
                    >
                      <QrCode className="w-4 h-4" />
                      Show QR
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            No {filter !== 'all' ? filter : ''} tickets found
          </h3>
          <p className="text-gray-600 mb-6">Start exploring amazing events</p>
          <button
            onClick={() => navigate('/events')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Browse Events
          </button>
        </div>
      )}
    </div>
  );
}