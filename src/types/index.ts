export type UserRole = 'admin' | 'organizer' | 'artist' | 'venue_owner' | 'attendee';

export type EventStatus = 'draft' | 'published' | 'live' | 'completed' | 'cancelled';

export type EventCategory = 'concert' | 'conference' | 'wedding' | 'workshop' | 'sports' | 'exhibition' | 'seminar' | 'party';

export type EventType = 'online' | 'offline';

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'refunded';

export type TicketType = 'free' | 'vip' | 'early_bird' | 'regular';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  bio?: string;
  rating?: number;
  createdAt: string;
  verified: boolean;
  suspended: boolean;
}

export interface Artist extends User {
  role: 'artist';
  genre?: string;
  portfolio: string[];
  availability: string[];
  performanceHistory: Performance[];
  hourlyRate?: number;
}

export interface VenueOwner extends User {
  role: 'venue_owner';
  venues: Venue[];
}

export interface Organizer extends User {
  role: 'organizer';
  company?: string;
  events: Event[];
}

export interface Venue {
  id: string;
  name: string;
  location: string;
  address: string;
  capacity: number;
  pricePerDay: number;
  images: string[];
  amenities: string[];
  ownerId: string;
  rating: number;
  availability: string[];
}

export interface Ticket {
  id: string;
  type: TicketType;
  name: string;
  price: number;
  quantity: number;
  sold: number;
  perks: string[];
  salesStart: string;
  salesEnd: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  type: EventType;
  date: string;
  endDate?: string;
  time: string;
  status: EventStatus;
  organizerId: string;
  organizer?: User;
  venueId?: string;
  venue?: Venue;
  onlineLink?: string;
  banner: string;
  tickets: Ticket[];
  artists: string[];
  artistDetails?: Artist[];
  attendees: number;
  rating: number;
  reviews: number;
  colorTheme: string;
  sponsors: string[];
  createdAt: string;
  views: number;
}

export interface Booking {
  id: string;
  eventId: string;
  event?: Event;
  userId: string;
  user?: User;
  ticketType: string;
  quantity: number;
  totalAmount: number;
  status: BookingStatus;
  qrCode: string;
  couponCode?: string;
  discount?: number;
  bookedAt: string;
  attendeeInfo: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface Performance {
  eventId: string;
  eventName: string;
  date: string;
  rating: number;
  earnings: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: string;
  actionUrl?: string;
}

export interface ApprovalRequest {
  id: string;
  userId: string;
  user?: User;
  type: 'organizer' | 'artist' | 'venue';
  status: ApprovalStatus;
  details: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reason?: string;
}

export interface CartItem {
  eventId: string;
  event: Event;
  ticketType: Ticket;
  quantity: number;
}

export interface DashboardStats {
  totalUsers?: number;
  totalEvents?: number;
  totalRevenue?: number;
  upcomingEvents?: number;
  totalBookings?: number;
  earnings?: number;
  completedEvents?: number;
  activeListings?: number;
}
