import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Link } from 'react-router';
import { 
  Calendar, 
  Users, 
  Shield, 
  Zap, 
  Heart, 
  Award,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

export function AboutPage() {
  const features = [
    {
      icon: Calendar,
      title: 'Event Management',
      description: 'Create, manage, and promote events with powerful tools designed for organizers.',
    },
    {
      icon: Users,
      title: 'Multiple User Roles',
      description: 'Support for organizers, artists, venue owners, and attendees with role-specific features.',
    },
    {
      icon: Shield,
      title: 'Secure Bookings',
      description: 'Safe and secure payment processing with QR code ticket verification.',
    },
    {
      icon: Zap,
      title: 'Real-time Updates',
      description: 'Get instant notifications about bookings, approvals, and event updates.',
    },
    {
      icon: Heart,
      title: 'Wishlist & Favorites',
      description: 'Save your favorite events and get notified when tickets become available.',
    },
    {
      icon: Award,
      title: 'Verified Profiles',
      description: 'Connect with verified artists and trusted venues for quality assurance.',
    },
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    },
    {
      name: 'Emily Davis',
      role: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">About Eventory</h1>
            <p className="text-xl max-w-3xl mx-auto opacity-90">
              We're on a mission to revolutionize event planning and booking, making it easier 
              for organizers, artists, and attendees to connect and create unforgettable experiences.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Our Story */}
        <section className="mb-20">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Founded in 2024, Eventory was born from a simple idea: event planning 
                  shouldn't be complicated. We saw the challenges faced by event organizers, 
                  artists, and venue owners, and decided to create a platform that brings 
                  everyone together.
                </p>
                <p>
                  Today, Eventory powers thousands of events worldwide, from intimate 
                  gatherings to large-scale festivals. Our platform connects talented 
                  artists with passionate organizers, matches events with perfect venues, 
                  and makes ticket booking seamless for attendees.
                </p>
                <p>
                  We believe that great events bring people together and create lasting 
                  memories. That's why we're committed to providing the best tools and 
                  support to make every event a success.
                </p>
              </div>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800" 
                alt="Team collaboration"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Eventory?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We offer everything you need to plan, manage, and attend events successfully
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:border-blue-500 transition-colors">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A passionate group of professionals dedicated to transforming the events industry
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {team.map((member, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-gray-600">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="mb-20">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-12">
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
                  <p className="mb-8 opacity-90">
                    Have questions? We'd love to hear from you. Send us a message and 
                    we'll respond as soon as possible.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5" />
                      <span>support@eventory.com</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5" />
                      <span>+1 (555) 123-4567</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5" />
                      <span>123 Event Street, San Francisco, CA 94102</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <Link to="/register">
                    <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                      Join Eventory Today
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Stats */}
        <section>
          <Card>
            <CardContent className="p-12">
              <div className="grid gap-8 md:grid-cols-4 text-center">
                <div>
                  <div className="text-4xl font-bold text-blue-600 mb-2">10K+</div>
                  <div className="text-gray-600">Events Hosted</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-blue-600 mb-2">50K+</div>
                  <div className="text-gray-600">Active Users</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
                  <div className="text-gray-600">Verified Venues</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-blue-600 mb-2">4.9★</div>
                  <div className="text-gray-600">Average Rating</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}