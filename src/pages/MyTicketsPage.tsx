import { useState } from 'react';
import { Link } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Calendar, MapPin, Clock, Download, QrCode, Share2, Ticket } from 'lucide-react';
import { useAuthStore } from '../lib/store';
import { mockBookings, mockEvents } from '../lib/mockData';
import QRCode from 'qrcode';
import { useEffect } from 'react';

export function MyTicketsPage() {
  const { user } = useAuthStore();
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  const myBookings = mockBookings.filter(b => b.userId === user?.id);
  
  const upcomingBookings = myBookings.filter(b => {
    const event = mockEvents.find(e => e.id === b.eventId);
    return event && new Date(event.startDate) > new Date();
  });

  const pastBookings = myBookings.filter(b => {
    const event = mockEvents.find(e => e.id === b.eventId);
    return event && new Date(event.startDate) <= new Date();
  });

  useEffect(() => {
    if (selectedBooking) {
      QRCode.toDataURL(selectedBooking.qrCode)
        .then(setQrCodeUrl)
        .catch(console.error);
    }
  }, [selectedBooking]);

  const BookingCard = ({ booking }: { booking: any }) => {
    const event = mockEvents.find(e => e.id === booking.eventId);
    if (!event) return null;

    const isPast = new Date(event.startDate) <= new Date();

    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="flex flex-col md:flex-row">
          <img 
            src={event.banner} 
            alt={event.title}
            className="w-full md:w-48 h-48 object-cover"
          />
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                <Badge variant={isPast ? 'secondary' : 'default'}>
                  {booking.status}
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedBooking(booking)}
              >
                <QrCode className="w-4 h-4 mr-2" />
                View QR
              </Button>
            </div>

            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(event.startDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {new Date(event.startDate).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
              {event.type === 'offline' && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Venue Location
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <p className="text-sm text-gray-500">Tickets</p>
                <p className="font-semibold">{booking.quantity} × Standard</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Paid</p>
                <p className="text-xl font-bold text-blue-600">${booking.totalPrice}</p>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Link to={`/events/${event.id}`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  View Event
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Tickets</h1>
          <p className="text-gray-600">Manage and view all your event tickets</p>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingBookings.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past ({pastBookings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingBookings.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Ticket className="w-16 h-16 text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No upcoming tickets</h3>
                  <p className="text-gray-500 mb-4">You don't have any upcoming events</p>
                  <Link to="/events">
                    <Button>Browse Events</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              upcomingBookings.map(booking => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {pastBookings.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Ticket className="w-16 h-16 text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No past tickets</h3>
                  <p className="text-gray-500">Your attended events will appear here</p>
                </CardContent>
              </Card>
            ) : (
              pastBookings.map(booking => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            )}
          </TabsContent>
        </Tabs>

        {/* QR Code Dialog */}
        <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Event Ticket QR Code</DialogTitle>
            </DialogHeader>
            {selectedBooking && (
              <div className="space-y-4">
                <div className="flex justify-center p-6 bg-white rounded-lg">
                  {qrCodeUrl && (
                    <img src={qrCodeUrl} alt="QR Code" className="w-64 h-64" />
                  )}
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Booking ID</p>
                  <p className="font-mono font-semibold">{selectedBooking.id}</p>
                </div>
                <p className="text-sm text-gray-500 text-center">
                  Show this QR code at the event entrance
                </p>
                <Button className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download QR Code
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}