import { z } from 'zod';

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role: z.enum(['attendee', 'organizer', 'artist', 'venue_owner']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

// Event Schemas
export const eventBasicInfoSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  category: z.enum(['concert', 'conference', 'wedding', 'workshop', 'sports', 'exhibition', 'seminar', 'party']),
  type: z.enum(['online', 'offline']),
  date: z.string().min(1, 'Date is required'),
  endDate: z.string().optional(),
  time: z.string().min(1, 'Time is required'),
});

export const eventVenueSchema = z.object({
  venueId: z.string().optional(),
  onlineLink: z.string().url('Invalid URL').optional(),
});

export const ticketSchema = z.object({
  type: z.enum(['free', 'vip', 'early_bird', 'regular']),
  name: z.string().min(1, 'Ticket name is required'),
  price: z.number().min(0, 'Price must be 0 or greater'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  perks: z.array(z.string()),
  salesStart: z.string(),
  salesEnd: z.string(),
});

export const eventTicketsSchema = z.object({
  tickets: z.array(ticketSchema).min(1, 'At least one ticket type is required'),
});

export const eventCustomizationSchema = z.object({
  banner: z.string().url('Invalid banner URL'),
  colorTheme: z.string(),
  sponsors: z.array(z.string()),
});

// Booking Schemas
export const bookingSchema = z.object({
  eventId: z.string(),
  ticketType: z.string(),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  attendeeInfo: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  }),
  couponCode: z.string().optional(),
});

// Venue Schemas
export const venueSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  location: z.string().min(3, 'Location is required'),
  address: z.string().min(10, 'Address must be at least 10 characters'),
  capacity: z.number().min(1, 'Capacity must be at least 1'),
  pricePerDay: z.number().min(0, 'Price must be 0 or greater'),
  amenities: z.array(z.string()),
  images: z.array(z.string().url('Invalid image URL')),
});

// Profile Schemas
export const profileUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  bio: z.string().optional(),
  avatar: z.string().url('Invalid avatar URL').optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Search & Filter Schemas
export const eventFilterSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  type: z.enum(['online', 'offline']).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  location: z.string().optional(),
});

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type EventBasicInfoFormData = z.infer<typeof eventBasicInfoSchema>;
export type EventVenueFormData = z.infer<typeof eventVenueSchema>;
export type EventTicketsFormData = z.infer<typeof eventTicketsSchema>;
export type EventCustomizationFormData = z.infer<typeof eventCustomizationSchema>;
export type BookingFormData = z.infer<typeof bookingSchema>;
export type VenueFormData = z.infer<typeof venueSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type EventFilterFormData = z.infer<typeof eventFilterSchema>;
