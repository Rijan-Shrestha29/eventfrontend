import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Calendar, MapPin, DollarSign, Users, Plus, X, Upload, Save } from 'lucide-react';
import { mockVenues, mockArtists } from '../lib/mockData';
import { toast } from 'sonner@2.0.3';

export function CreateEventPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [eventType, setEventType] = useState<'online' | 'offline'>('offline');
  const [ticketTypes, setTicketTypes] = useState([
    { id: '1', name: 'General Admission', price: 50, quantity: 100, perks: ['Entry Access'] }
  ]);
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);

  const addTicketType = () => {
    const newId = (ticketTypes.length + 1).toString();
    setTicketTypes([...ticketTypes, {
      id: newId,
      name: `Ticket Type ${newId}`,
      price: 0,
      quantity: 0,
      perks: []
    }]);
  };

  const removeTicketType = (id: string) => {
    setTicketTypes(ticketTypes.filter(t => t.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Event created successfully!');
    navigate('/organizer');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Create New Event</h1>
          <p className="text-gray-600">Fill in the details to create your event</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {s}
                </div>
                {s < 4 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    step > s ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Basic Info</span>
            <span>Event Details</span>
            <span>Tickets</span>
            <span>Review</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Event Title *</Label>
                  <Input id="title" placeholder="Enter event title" required />
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="music">Music</SelectItem>
                      <SelectItem value="conference">Conference</SelectItem>
                      <SelectItem value="workshop">Workshop</SelectItem>
                      <SelectItem value="sports">Sports</SelectItem>
                      <SelectItem value="arts">Arts & Culture</SelectItem>
                      <SelectItem value="food">Food & Drink</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Describe your event"
                    rows={5}
                    required
                  />
                </div>

                <div>
                  <Label>Event Type *</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <button
                      type="button"
                      onClick={() => setEventType('offline')}
                      className={`p-4 border-2 rounded-lg text-center transition-all ${
                        eventType === 'offline' 
                          ? 'border-blue-600 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <MapPin className="w-6 h-6 mx-auto mb-2" />
                      <p className="font-semibold">In-Person</p>
                      <p className="text-sm text-gray-500">Physical venue</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEventType('online')}
                      className={`p-4 border-2 rounded-lg text-center transition-all ${
                        eventType === 'online' 
                          ? 'border-blue-600 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Users className="w-6 h-6 mx-auto mb-2" />
                      <p className="font-semibold">Virtual</p>
                      <p className="text-sm text-gray-500">Online event</p>
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="banner">Event Banner URL</Label>
                  <div className="flex gap-2">
                    <Input id="banner" placeholder="https://example.com/image.jpg" />
                    <Button type="button" variant="outline">
                      <Upload className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Event Details */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date & Time *</Label>
                    <Input 
                      id="startDate" 
                      type="datetime-local" 
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date & Time *</Label>
                    <Input 
                      id="endDate" 
                      type="datetime-local" 
                      required 
                    />
                  </div>
                </div>

                {eventType === 'offline' ? (
                  <div>
                    <Label>Select Venue *</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a venue" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockVenues.slice(0, 5).map((venue) => (
                          <SelectItem key={venue.id} value={venue.id}>
                            {venue.name} - {venue.location} (Capacity: {venue.capacity})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div>
                    <Label htmlFor="meetingLink">Meeting Link *</Label>
                    <Input 
                      id="meetingLink" 
                      placeholder="https://meet.google.com/..." 
                      type="url"
                      required 
                    />
                  </div>
                )}

                <div>
                  <Label>Select Artists/Performers</Label>
                  <div className="border rounded-lg p-4 max-h-64 overflow-y-auto">
                    {mockArtists.slice(0, 8).map((artist) => (
                      <label key={artist.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedArtists.includes(artist.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedArtists([...selectedArtists, artist.id]);
                            } else {
                              setSelectedArtists(selectedArtists.filter(id => id !== artist.id));
                            }
                          }}
                          className="w-4 h-4"
                        />
                        <img src={artist.avatar} alt={artist.name} className="w-10 h-10 rounded-full" />
                        <div className="flex-1">
                          <p className="font-semibold">{artist.name}</p>
                          <p className="text-sm text-gray-500">{artist.genre}</p>
                        </div>
                        <Badge>${artist.price}</Badge>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="sponsors">Sponsors (comma-separated)</Label>
                  <Input 
                    id="sponsors" 
                    placeholder="Company A, Company B, Company C" 
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Ticket Configuration */}
          {step === 3 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Ticket Types</CardTitle>
                <Button type="button" onClick={addTicketType} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Ticket Type
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {ticketTypes.map((ticket, index) => (
                  <div key={ticket.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Ticket Type {index + 1}</h4>
                      {ticketTypes.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTicketType(ticket.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Ticket Name *</Label>
                        <Input 
                          defaultValue={ticket.name}
                          placeholder="e.g., VIP, Early Bird"
                          required
                        />
                      </div>
                      <div>
                        <Label>Price ($) *</Label>
                        <Input 
                          type="number"
                          defaultValue={ticket.price}
                          placeholder="0"
                          required
                        />
                      </div>
                      <div>
                        <Label>Quantity *</Label>
                        <Input 
                          type="number"
                          defaultValue={ticket.quantity}
                          placeholder="0"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Perks (one per line)</Label>
                      <Textarea 
                        placeholder="Enter perks, one per line"
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Step 4: Review & Submit */}
          {step === 4 && (
            <Card>
              <CardHeader>
                <CardTitle>Review Your Event</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Event Summary</h3>
                  <p className="text-sm text-blue-700">
                    Please review all the details before submitting. Once submitted, your event will be reviewed by our team.
                  </p>
                </div>

                <div className="grid gap-4">
                  <div>
                    <Label className="text-gray-500">Event Title</Label>
                    <p className="font-semibold">Your Event Title Will Appear Here</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Event Type</Label>
                    <Badge>{eventType === 'online' ? 'Virtual' : 'In-Person'}</Badge>
                  </div>
                  <div>
                    <Label className="text-gray-500">Ticket Types</Label>
                    <p className="font-semibold">{ticketTypes.length} ticket type(s) configured</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Artists</Label>
                    <p className="font-semibold">{selectedArtists.length} artist(s) selected</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
            >
              Previous
            </Button>
            
            {step < 4 ? (
              <Button
                type="button"
                onClick={() => setStep(Math.min(4, step + 1))}
              >
                Next
              </Button>
            ) : (
              <Button type="submit">
                <Save className="w-4 h-4 mr-2" />
                Submit Event
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}