import { useEffect, useState } from 'react';
import { Calendar, Star, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router';
import { DataTable } from '../../../components/DataTable';
import { bookingsApi } from '../../../lib/mockApi';
import { useAuthStore } from '../../../lib/store';
import { Booking } from '../../../types';
import { Modal } from '../../../components/Modal';

export function AttendeeHistory() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    if (!user) return;
    const data = await bookingsApi.getByUser(user.id);
    setBookings(data);
  };

  const pastBookings = bookings.filter(b => {
    if (!b.event) return false;
    return new Date(b.event.date) < new Date();
  });

  const handleReview = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowReviewModal(true);
  };

  const submitReview = () => {
    alert(`Review submitted for ${selectedBooking?.event?.title}: ${rating} stars - ${review}`);
    setShowReviewModal(false);
    setRating(0);
    setReview('');
    setSelectedBooking(null);
  };

  const columns = [
    { 
      header: 'Event', 
      accessor: (row: Booking) => (
        <div className="flex items-center gap-3">
          <img src={row.event?.banner} alt="" className="w-16 h-16 object-cover rounded" />
          <div>
            <p className="font-semibold">{row.event?.title}</p>
            <p className="text-sm text-gray-500">{row.event?.category}</p>
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
      header: 'Ticket Type', 
      accessor: (row: Booking) => row.ticketType 
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
      header: 'Actions',
      accessor: (row: Booking) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleReview(row)}
            className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-100 transition-colors"
          >
            <Star className="w-4 h-4" />
            Review
          </button>
          <button
            onClick={() => navigate(`/events/${row.eventId}`)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-semibold hover:border-blue-600 hover:text-blue-600 transition-colors"
          >
            Details
          </button>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Booking History</h1>
        <p className="text-gray-600">View your past event attendance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Events</p>
              <p className="text-2xl font-bold">{pastBookings.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold">
                ${pastBookings.reduce((sum, b) => sum + b.totalAmount, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Reviews Given</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </div>
      </div>

      {/* History Table */}
      {pastBookings.length > 0 ? (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <DataTable
            data={pastBookings}
            columns={columns}
            itemsPerPage={10}
          />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No past events</h3>
          <p className="text-gray-600 mb-6">Your event history will appear here</p>
          <button
            onClick={() => navigate('/events')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Browse Events
          </button>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedBooking && (
        <Modal onClose={() => setShowReviewModal(false)} title="Write a Review">
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">{selectedBooking.event?.title}</h3>
              <p className="text-gray-600">
                {selectedBooking.event?.date && new Date(selectedBooking.event.date).toLocaleDateString()}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="transition-colors"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review
              </label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Share your experience..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={submitReview}
                disabled={rating === 0 || !review.trim()}
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Review
              </button>
              <button
                onClick={() => setShowReviewModal(false)}
                className="flex-1 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}