// src/hooks/useCourts.js
import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/axios';

/**
 * Hook lấy danh sách tất cả các sân cầu lông đang hoạt động
 */
export const useCourts = () => {
  return useQuery({
    queryKey: ['courts'],
    queryFn: async () => {
      const response = await apiClient.get('/courts');
      return response.data?.data ?? [];
    },
    staleTime: 5 * 60 * 1000, // 5 phút
  });
};

/**
 * Hook lấy chi tiết một sân theo ID
 */
export const useCourt = (courtId) => {
  return useQuery({
    queryKey: ['court', courtId],
    queryFn: async () => {
      const response = await apiClient.get(`/courts/${courtId}`);
      return response.data?.data ?? null;
    },
    enabled: !!courtId,
    staleTime: 5 * 60 * 1000,
  });
};
