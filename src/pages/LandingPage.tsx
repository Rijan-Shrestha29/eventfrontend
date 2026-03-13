import { useNavigate } from 'react-router';
import { Calendar, Users, Music, TrendingUp, Star, ArrowRight } from 'lucide-react';
import { EventCard } from '../components/EventCard';
import { mockEvents } from '../lib/mockData';
import { useAuthStore } from '../lib/store';

export function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const categories = [
    { name: 'Concert', icon: Music, color: '#FF6B6B', image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400' },
    { name: 'Conference', icon: Users, color: '#4ECDC4', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400' },
    { name: 'Wedding', icon: Star, color: '#FFD3E1', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400' },
    { name: 'Workshop', icon: Calendar, color: '#95E1D3', image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400' },
  ];

  const stats = [
    { label: 'Events Hosted', value: '2,340+', icon: Calendar },
    { label: 'Happy Users', value: '15,420+', icon: Users },
    { label: 'Artists Registered', value: '1,250+', icon: Music },
    { label: 'Success Rate', value: '98%', icon: TrendingUp },
  ];

  const featuredEvents = mockEvents.slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600"
            alt="Events"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-purple-900/90" />
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Create Amazing Events
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            The ultimate platform for event planning, booking, and management
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/events')}
              className="px-8 py-4 bg-white text-blue-900 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              Browse Events
            </button>
            {!isAuthenticated && (
              <button
                onClick={() => navigate('/register')}
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold text-lg hover:bg-white/10 transition-colors"
              >
                Get Started
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Event Categories */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Explore Event Categories</h2>
            <p className="text-xl text-gray-600">
              Find the perfect event for every occasion
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div
                key={category.name}
                onClick={() => navigate(`/events?category=${category.name.toLowerCase()}`)}
                className="relative h-48 rounded-xl overflow-hidden cursor-pointer group"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${category.color}cc, ${category.color}99)`,
                  }}
                >
                  <div className="text-center text-white">
                    <category.icon className="w-12 h-12 mx-auto mb-2" />
                    <h3 className="text-2xl font-bold">{category.name}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-2">Featured Events</h2>
              <p className="text-xl text-gray-600">
                Discover the hottest events happening now
              </p>
            </div>
            <button
              onClick={() => navigate('/events')}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              View All <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center text-white">
                <stat.icon className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-4xl font-bold mb-2">{stat.value}</h3>
                <p className="text-xl text-blue-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Create Your Event?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of event organizers who trust Eventory
          </p>
          <button
            onClick={() => navigate(isAuthenticated ? '/organizer/create-event' : '/register')}
            className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
          >
            {isAuthenticated ? 'Create Event' : 'Sign Up Now'}
          </button>
        </div>
      </section>
    </div>
  );
}