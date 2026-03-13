import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form@7.55.0';
import { zodResolver } from '@hookform/resolvers/zod';
import { bookingSchema, type BookingFormData } from '../lib/schemas';
import { useAuthStore, useCartStore } from '../lib/store';
import { bookingsApi } from '../lib/mockApi';
import { CreditCard, Lock, Trash2, Tag, CheckCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { items, getTotalAmount, clearCart, removeItem } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      attendeeInfo: {
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
      },
    },
  });

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-xl text-gray-500 mb-4">Your cart is empty</p>
          <button
            onClick={() => navigate('/events')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            Browse Events
          </button>
        </div>
      </div>
    );
  }

  const subtotal = getTotalAmount();
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'SAVE10') {
      setDiscount(10);
      toast.success('10% discount applied!');
    } else if (couponCode.toUpperCase() === 'SAVE20') {
      setDiscount(20);
      toast.success('20% discount applied!');
    } else {
      toast.error('Invalid coupon code');
    }
  };

  const validatePayment = () => {
    if (!cardNumber || cardNumber.length < 16) {
      toast.error('Please enter a valid card number');
      return false;
    }
    if (!expiry || !/^\d{2}\/\d{2}$/.test(expiry)) {
      toast.error('Please enter expiry in MM/YY format');
      return false;
    }
    if (!cvv || cvv.length < 3) {
      toast.error('Please enter a valid CVV');
      return false;
    }
    return true;
  };

  const onSubmit = async (data: BookingFormData) => {
    // Validate payment details
    if (!validatePayment()) {
      return;
    }

    setIsProcessing(true);
    toast.loading('Processing your payment...');

    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create booking for each cart item
      const bookingIds = [];
      for (const item of items) {
        const booking = await bookingsApi.create({
          eventId: item.eventId,
          userId: user!.id,
          ticketType: item.ticketType.name,
          quantity: item.quantity,
          totalAmount: item.ticketType.price * item.quantity,
          couponCode: couponCode || undefined,
          discount: discount > 0 ? discountAmount : undefined,
          attendeeInfo: data.attendeeInfo,
        });
        bookingIds.push(booking.id);
      }

      clearCart();
      toast.dismiss();
      toast.success('Payment successful! Your tickets are ready.');
      
      // Navigate to booking confirmation with booking IDs
      navigate('/booking-confirmation', { 
        state: { 
          success: true,
          bookingIds,
          totalAmount: total 
        } 
      });
    } catch (error) {
      toast.dismiss();
      console.error('Booking failed:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cart Items */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={`${item.eventId}-${item.ticketType.id}`}
                    className="flex gap-4 p-4 border border-gray-200 rounded-lg"
                  >
                    <img
                      src={item.event.banner}
                      alt={item.event.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">
                        {item.event.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {item.ticketType.name} × {item.quantity}
                      </p>
                      <p className="font-bold text-lg">
                        ${item.ticketType.price * item.quantity}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.eventId)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors h-fit"
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Attendee Information */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">Attendee Information</h2>
              <form onSubmit={handleSubmit(onSubmit)} id="checkout-form">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      {...register('attendeeInfo.name')}
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.attendeeInfo?.name && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.attendeeInfo.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      {...register('attendeeInfo.email')}
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.attendeeInfo?.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.attendeeInfo.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      {...register('attendeeInfo.phone')}
                      type="tel"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.attendeeInfo?.phone && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.attendeeInfo.phone.message}
                      </p>
                    )}
                  </div>
                </div>
              </form>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
              <div className="space-y-4">
                <div className="p-4 border-2 border-blue-600 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="font-semibold">Credit / Debit Card</p>
                      <p className="text-sm text-gray-600">
                        Visa, Mastercard, Amex accepted
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <input
                    type="text"
                    placeholder="Card Number (16 digits)"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                    maxLength={16}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length >= 2) {
                          value = value.slice(0, 2) + '/' + value.slice(2, 4);
                        }
                        setExpiry(value);
                      }}
                      maxLength={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      maxLength={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 pt-2">
                  <Lock className="w-4 h-4" />
                  <span>Secure payment powered by Stripe</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Price Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
              <h3 className="text-xl font-bold mb-6">Price Details</h3>

              {/* Coupon Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coupon Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={applyCoupon}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {discount > 0 && (
                  <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    {discount}% discount applied!
                  </p>
                )}
                <p className="mt-2 text-xs text-gray-500">
                  Try: SAVE10 or SAVE20
                </p>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({discount}%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold pt-3 border-t">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Complete Payment Button */}
              <button
                type="submit"
                form="checkout-form"
                disabled={isProcessing}
                className="w-full py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Pay Now ${total.toFixed(2)}
                  </>
                )}
              </button>

              <div className="mt-4 text-xs text-center text-gray-500">
                By completing your purchase you agree to our Terms & Conditions
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}