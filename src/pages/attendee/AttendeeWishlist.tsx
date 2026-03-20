import { useEffect, useState } from 'react';
import { Heart, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { EventCard } from '../../../components/EventCard';
import { eventsApi } from '../../../lib/mockApi';
import { useWishlistStore } from '../../../lib/store';
import { Event } from '../../../types';

export function AttendeeWishlist() {
  const navigate = useNavigate();
  const { items: wishlistIds, removeItem } = useWishlistStore();
  const [wishlistEvents, setWishlistEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWishlist();
  }, [wishlistIds]);

  const loadWishlist = async () => {
    setLoading(true);
    const allEvents = await eventsApi.getAll();
    const wishlist = allEvents.filter(e => wishlistIds.includes(e.id));
    setWishlistEvents(wishlist);
    setLoading(false);
  };

  const handleRemove = (eventId: string) => {
    removeItem(eventId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
        <p className="text-gray-600">Events you've saved for later</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-md h-96 animate-pulse" />
          ))}
        </div>
      ) : wishlistEvents.length > 0 ? (
        <>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-blue-900">
              <Heart className="w-5 h-5 inline mr-2 text-red-500" />
              You have {wishlistEvents.length} event{wishlistEvents.length !== 1 ? 's' : ''} in your wishlist
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistEvents.map((event) => (
              <div key={event.id} className="relative">
                <EventCard event={event} />
                <button
                  onClick={() => handleRemove(event.id)}
                  className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors group"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-5 h-5 text-red-600 group-hover:text-red-700" />
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
          <p className="text-gray-600 mb-6">
            Start adding events to your wishlist to keep track of events you're interested in
          </p>
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