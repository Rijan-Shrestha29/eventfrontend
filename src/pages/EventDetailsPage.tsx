import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { 
  Calendar, MapPin, Users, Clock, Share2, Heart, 
  Tag, Star, ArrowLeft, Ticket 
} from 'lucide-react';
import { Event } from '../types';
import { eventsApi } from '../lib/mockApi';
import { useAuthStore, useCartStore, useWishlistStore } from '../lib/store';
import { EventCard } from '../components/EventCard';
import { mockEvents } from '../lib/mockData';
import { toast } from 'sonner';

export function EventDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { addItem } = useCartStore();
  const { isInWishlist, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlistStore();
  const [event, setEvent] = useState<Event | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const data = await eventsApi.getById(id);
      setEvent(data || null);
    } catch (error) {
      console.error('Failed to load event:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-500">Loading event...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-500 mb-4">Event not found</p>
          <button
            onClick={() => navigate('/events')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const inWishlist = isInWishlist(event.id);
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!selectedTicket) {
      alert('Please select a ticket type');
      return;
    }

    const ticket = event.tickets.find(t => t.id === selectedTicket);
    if (ticket) {
      addItem({
        eventId: event.id,
        event,
        ticketType: ticket,
        quantity,
      });
      navigate('/checkout');
    }
  };

  const handleWishlistToggle = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (inWishlist) {
      removeFromWishlist(event.id);
    } else {
      addToWishlist(event.id);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href,
      });
    }
  };

  const similarEvents = mockEvents
    .filter(e => e.category === event.category && e.id !== event.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
        </div>
      </div>

      {/* Banner */}
      <div className="relative h-96">
        <img
          src={event.banner}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm mb-4">
              {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
            </div>
            <h1 className="text-5xl font-bold mb-2">{event.title}</h1>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{event.rating}</span>
              <span className="text-white/80">({event.reviews} reviews)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Info */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">Event Details</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Calendar className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <p className="font-semibold">Date & Time</p>
                    <p className="text-gray-600">{formattedDate}</p>
                    <p className="text-gray-600">{event.time}</p>
                  </div>
                </div>

                {event.type === 'offline' && event.venue && (
                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-blue-600 mt-1" />
                    <div>
                      <p className="font-semibold">{event.venue.name}</p>
                      <p className="text-gray-600">{event.venue.address}</p>
                    </div>
                  </div>
                )}

                {event.type === 'online' && (
                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-blue-600 mt-1" />
                    <div>
                      <p className="font-semibold">Online Event</p>
                      <p className="text-gray-600">Link will be provided after booking</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <Users className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <p className="font-semibold">Attendees</p>
                    <p className="text-gray-600">{event.attendees} people registered</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">About This Event</h2>
              <p className="text-gray-700 leading-relaxed">{event.description}</p>
            </div>

            {/* Organizer */}
            {event.organizer && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">Organized By</h2>
                <div className="flex items-center gap-4">
                  <img
                    src={event.organizer.avatar}
                    alt={event.organizer.name}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{event.organizer.name}</h3>
                    {event.organizer.rating && (
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{event.organizer.rating} rating</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Booking */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
              <h3 className="text-2xl font-bold mb-6">Select Tickets</h3>

              <div className="space-y-4 mb-6">
                {event.tickets.map((ticket) => {
                  const available = ticket.quantity - ticket.sold;
                  const isAvailable = available > 0;

                  return (
                    <div
                      key={ticket.id}
                      onClick={() => isAvailable && setSelectedTicket(ticket.id)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedTicket === ticket.id
                          ? 'border-blue-600 bg-blue-50'
                          : isAvailable
                          ? 'border-gray-200 hover:border-blue-300'
                          : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{ticket.name}</h4>
                          <p className="text-2xl font-bold text-blue-600">
                            {ticket.price === 0 ? 'FREE' : `$${ticket.price}`}
                          </p>
                        </div>
                        <span className="text-sm text-gray-500">
                          {available} left
                        </span>
                      </div>
                      {ticket.perks.length > 0 && (
                        <ul className="text-sm text-gray-600 space-y-1">
                          {ticket.perks.slice(0, 2).map((perk, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <span className="w-1 h-1 bg-gray-400 rounded-full" />
                              {perk}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>

              {selectedTicket && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}

              <button
                onClick={handleAddToCart}
                disabled={!selectedTicket}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-3"
              >
                <Ticket className="w-5 h-5 inline mr-2" />
                Book Now
              </button>

              <div className="flex gap-2">
                <button
                  onClick={handleWishlistToggle}
                  className="flex-1 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      inWishlist ? 'fill-red-500 text-red-500' : ''
                    }`}
                  />
                  {inWishlist ? 'Saved' : 'Save'}
                </button>
                <button
                  onClick={handleShare}
                  className="flex-1 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Events */}
        {similarEvents.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-8">Similar Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}