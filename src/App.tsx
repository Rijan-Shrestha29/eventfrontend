import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/sonner';
import { useAuthStore } from './lib/store';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { EventsPage } from './pages/EventsPage';
import { EventDetailsPage } from './pages/EventDetailsPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { BookingConfirmationPage } from './pages/BookingConfirmationPage';
import { MyTicketsPage } from './pages/MyTicketsPage';
import { CreateEventPage } from './pages/CreateEventPage';
import { ProfilePage } from './pages/ProfilePage';
import { VenuesPage } from './pages/VenuesPage';
import { AboutPage } from './pages/AboutPage';

// Dashboards
import { AdminDashboard } from './pages/dashboards/AdminDashboard';
import { OrganizerDashboard } from './pages/dashboards/OrganizerDashboard';
import { AttendeeDashboard } from './pages/dashboards/AttendeeDashboard';
import { ArtistDashboard } from './pages/dashboards/ArtistDashboard';
import { VenueOwnerDashboard } from './pages/dashboards/VenueOwnerDashboard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Protected Route Component
function ProtectedRoute({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode; 
  allowedRoles?: string[] 
}) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

// Public Route (redirect to dashboard if already logged in)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user) {
    // Redirect to role-specific dashboard
    const dashboardPath = user.role === 'venue_owner' ? '/venue-owner' : `/${user.role}`;
    return <Navigate to={dashboardPath} replace />;
  }

  return <>{children}</>;
}

// Layout wrapper for pages with Navbar and Footer
function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <PageLayout>
                <LandingPage />
              </PageLayout>
            }
          />
          <Route
            path="/events"
            element={
              <PageLayout>
                <EventsPage />
              </PageLayout>
            }
          />
          <Route
            path="/events/:id"
            element={
              <PageLayout>
                <EventDetailsPage />
              </PageLayout>
            }
          />

          {/* Auth Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <PageLayout>
                  <CheckoutPage />
                </PageLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking-confirmation"
            element={
              <ProtectedRoute>
                <BookingConfirmationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-tickets"
            element={
              <ProtectedRoute>
                <PageLayout>
                  <MyTicketsPage />
                </PageLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-event"
            element={
              <ProtectedRoute>
                <PageLayout>
                  <CreateEventPage />
                </PageLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <PageLayout>
                  <ProfilePage />
                </PageLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/venues"
            element={
              <PageLayout>
                <VenuesPage />
              </PageLayout>
            }
          />
          <Route
            path="/about"
            element={
              <PageLayout>
                <AboutPage />
              </PageLayout>
            }
          />

          {/* Dashboard Routes - Using wildcard to match all subroutes */}
          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Organizer Routes */}
          <Route
            path="/organizer/*"
            element={
              <ProtectedRoute allowedRoles={['organizer']}>
                <OrganizerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Artist Routes */}
          <Route
            path="/artist/*"
            element={
              <ProtectedRoute allowedRoles={['artist']}>
                <ArtistDashboard />
              </ProtectedRoute>
            }
          />

          {/* Venue Owner Routes */}
          <Route
            path="/venue-owner/*"
            element={
              <ProtectedRoute allowedRoles={['venue_owner']}>
                <VenueOwnerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Attendee Routes */}
          <Route
            path="/attendee/*"
            element={
              <ProtectedRoute allowedRoles={['attendee']}>
                <AttendeeDashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route
            path="*"
            element={
              <PageLayout>
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
                    <p className="text-xl text-gray-600 mb-6">Page not found</p>
                    <a
                      href="/"
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
                    >
                      Go Home
                    </a>
                  </div>
                </div>
              </PageLayout>
            }
          />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}