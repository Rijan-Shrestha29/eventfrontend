import { useNavigate, useLocation } from 'react-router';
import { CheckCircle, Download, Calendar as CalendarIcon, Share2, Ticket } from 'lucide-react';
import { useEffect, useState } from 'react';
import { bookingsApi } from '../lib/mockApi';
import { Booking } from '../types';

export function BookingConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { bookingIds, totalAmount } = location.state || {};

  useEffect(() => {
    const loadBookings = async () => {
      if (bookingIds && bookingIds.length > 0) {
        try {
          const bookingData = await Promise.all(
            bookingIds.map((id: string) => bookingsApi.getById(id))
          );
          setBookings(bookingData);
        } catch (error) {
          console.error('Failed to load bookings:', error);
        }
      }
      setLoading(false);
    };

    loadBookings();
  }, [bookingIds]);

  const handleDownload = () => {
    alert('Ticket download feature - In a real app, this would generate a PDF with QR code');
  };

  const handleAddToCalendar = () => {
    alert('Add to calendar feature - In a real app, this would create a calendar event');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Event Booking',
        text: 'I just booked tickets on Eventory!',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Success Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-8 text-center text-white">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
          <p className="text-green-100 text-lg">Your tickets have been successfully booked</p>
        </div>

        {/* Booking Details */}
        <div className="p-8">
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Booking Information</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Booking ID:</span>
                <span className="font-semibold">#BK-{Date.now()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Booking Date:</span>
                <span className="font-semibold">{new Date().toLocaleDateString()}</span>
              </div>
              {totalAmount && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Paid:</span>
                  <span className="font-semibold text-green-600">${totalAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Number of Tickets:</span>
                <span className="font-semibold">{bookings.reduce((sum, b) => sum + b.quantity, 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                  Confirmed
                </span>
              </div>
            </div>
          </div>

          {/* Booked Events */}
          {bookings.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3">Your Tickets</h3>
              <div className="space-y-3">
                {bookings.map((booking) => (
                  <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex gap-4">
                      {booking.event?.banner && (
                        <img
                          src={booking.event.banner}
                          alt={booking.event.title}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold">{booking.event?.title}</h4>
                        <p className="text-sm text-gray-600">
                          {booking.ticketType} × {booking.quantity}
                        </p>
                        <p className="text-sm text-gray-600">
                          {booking.event?.date && new Date(booking.event.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${booking.totalAmount}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* QR Code Placeholder */}
          <div className="bg-gray-50 rounded-xl p-8 mb-6 text-center">
            <div className="w-48 h-48 bg-white border-4 border-gray-200 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <div className="text-gray-400">
                <svg className="w-32 h-32" viewBox="0 0 100 100" fill="currentColor">
                  <rect x="0" y="0" width="20" height="20" />
                  <rect x="25" y="0" width="15" height="20" />
                  <rect x="45" y="0" width="10" height="20" />
                  <rect x="60" y="0" width="20" height="20" />
                  <rect x="85" y="0" width="15" height="20" />
                  <rect x="0" y="25" width="15" height="15" />
                  <rect x="20" y="25" width="20" height="15" />
                  <rect x="45" y="25" width="10" height="15" />
                  <rect x="60" y="25" width="15" height="15" />
                  <rect x="80" y="25" width="20" height="15" />
                  <rect x="0" y="45" width="10" height="10" />
                  <rect x="15" y="45" width="20" height="10" />
                  <rect x="40" y="45" width="20" height="10" />
                  <rect x="65" y="45" width="15" height="10" />
                  <rect x="85" y="45" width="15" height="10" />
                  <rect x="0" y="60" width="20" height="20" />
                  <rect x="25" y="60" width="15" height="20" />
                  <rect x="45" y="60" width="10" height="20" />
                  <rect x="60" y="60" width="20" height="20" />
                  <rect x="85" y="60" width="15" height="20" />
                  <rect x="0" y="85" width="15" height="15" />
                  <rect x="20" y="85" width="20" height="15" />
                  <rect x="45" y="85" width="10" height="15" />
                  <rect x="60" y="85" width="15" height="15" />
                  <rect x="80" y="85" width="20" height="15" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-600">Scan this QR code at the venue for entry</p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <button
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <Download className="w-5 h-5" />
              Download Ticket
            </button>
            <button
              onClick={handleAddToCalendar}
              className="flex items-center justify-center gap-2 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-colors"
            >
              <CalendarIcon className="w-5 h-5" />
              Add to Calendar
            </button>
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-colors"
            >
              <Share2 className="w-5 h-5" />
              Share
            </button>
          </div>

          {/* Important Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">Important Information</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• A confirmation email has been sent to your email address</li>
              <li>• Please arrive 30 minutes before the event starts</li>
              <li>• Bring a valid ID along with your ticket</li>
              <li>• These tickets are non-transferable</li>
            </ul>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/attendee/tickets')}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <Ticket className="w-5 h-5" />
              View My Tickets
            </button>
            <button
              onClick={() => navigate('/events')}
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Browse More Events
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}