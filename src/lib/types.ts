import { z } from 'zod';

// User roles
export type UserRole = 'admin' | 'organizer' | 'artist' | 'venue_owner' | 'attendee';

export type EventStatus = 'draft' | 'published' | 'live' | 'completed' | 'cancelled';

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

// Zod Schemas
export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  role: z.enum(['admin', 'organizer', 'artist', 'venue_owner', 'attendee']),
  avatar: z.string().optional(),
  bio: z.string().optional(),
  phone: z.string().optional(),
  rating: z.number().optional(),
  verified: z.boolean().default(false),
  createdAt: z.string(),
});

export const venueSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  capacity: z.number(),
  location: z.string(),
  city: z.string(),
  price: z.number(),
  images: z.array(z.string()),
  amenities: z.array(z.string()),
  ownerId: z.string(),
  rating: z.number(),
  available: z.boolean(),
});

export const artistSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  genre: z.string(),
  bio: z.string(),
  portfolio: z.array(z.string()),
  rating: z.number(),
  price: z.number(),
  available: z.boolean(),
  avatar: z.string(),
});

export const ticketTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  quantity: z.number(),
  sold: z.number(),
  perks: z.array(z.string()),
});

export const eventSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  type: z.enum(['online', 'offline']),
  startDate: z.string(),
  endDate: z.string(),
  status: z.enum(['draft', 'published', 'live', 'completed', 'cancelled']),
  organizerId: z.string(),
  venueId: z.string().optional(),
  meetingLink: z.string().optional(),
  banner: z.string(),
  artistIds: z.array(z.string()),
  ticketTypes: z.array(ticketTypeSchema),
  sponsors: z.array(z.string()).optional(),
  totalBookings: z.number(),
  revenue: z.number(),
  rating: z.number().optional(),
  createdAt: z.string(),
});

export const bookingSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  userId: z.string(),
  ticketTypeId: z.string(),
  quantity: z.number(),
  totalPrice: z.number(),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']),
  qrCode: z.string(),
  bookedAt: z.string(),
  attendeeInfo: z.object({
    name: z.string(),
    email: z.string(),
    phone: z.string(),
  }),
});

export const notificationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  message: z.string(),
  type: z.string(),
  read: z.boolean(),
  createdAt: z.string(),
});

export const approvalRequestSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.enum(['organizer', 'artist', 'venue']),
  status: z.enum(['pending', 'approved', 'rejected']),
  details: z.any(),
  createdAt: z.string(),
});

// TypeScript types derived from schemas
export type User = z.infer<typeof userSchema>;
export type Venue = z.infer<typeof venueSchema>;
export type Artist = z.infer<typeof artistSchema>;
export type TicketType = z.infer<typeof ticketTypeSchema>;
export type Event = z.infer<typeof eventSchema>;
export type Booking = z.infer<typeof bookingSchema>;
export type Notification = z.infer<typeof notificationSchema>;
export type ApprovalRequest = z.infer<typeof approvalRequestSchema>;

// Form schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['organizer', 'artist', 'venue_owner', 'attendee']),
});

export const createEventSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  category: z.string(),
  type: z.enum(['online', 'offline']),
  startDate: z.string(),
  endDate: z.string(),
  venueId: z.string().optional(),
  meetingLink: z.string().url().optional(),
  banner: z.string(),
});

export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;
export type CreateEventForm = z.infer<typeof createEventSchema>;
