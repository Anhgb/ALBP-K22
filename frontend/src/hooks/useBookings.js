// src/hooks/useBookings.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/axios';

/**
 * Hook lấy danh sách đặt sân của người dùng hiện tại
 */
export const useMyBookings = () => {
  return useQuery({
    queryKey: ['my-bookings'],
    queryFn: async () => {
      const response = await apiClient.get('/bookings');
      return response.data?.data ?? [];
    },
  });
};

/**
 * Hook thanh toán giả lập qua Webhook (Mock Payment Webhook)
 */
export const useMockPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookingId, checkinCode, paymentStatus = 'paid' }) => {
      const response = await apiClient.post('/webhooks/payment', {
        booking_id: bookingId,
        checkin_code: checkinCode,
        payment_status: paymentStatus,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['court-slots'] });
      queryClient.invalidateQueries({ queryKey: ['courts'] });
    },
  });
};
