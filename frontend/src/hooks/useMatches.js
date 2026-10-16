// src/hooks/useMatches.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/axios';

/**
 * Hook lấy danh sách các bài đăng ghép kèo (Matchmaking Board)
 * @param {object} params { level, search, status }
 */
export const useMatches = (params = {}) => {
  return useQuery({
    queryKey: ['matches', params],
    queryFn: async () => {
      const response = await apiClient.get('/matches', { params });
      return response.data?.data ?? [];
    },
    staleTime: 30 * 1000, // 30 giây để cập nhật nhanh số slot
  });
};

/**
 * Hook lấy chi tiết 1 bài đăng ghép kèo
 */
export const useMatch = (matchId) => {
  return useQuery({
    queryKey: ['match', matchId],
    queryFn: async () => {
      const response = await apiClient.get(`/matches/${matchId}`);
      return response.data?.data ?? null;
    },
    enabled: !!matchId,
  });
};

/**
 * Hook tạo một bài đăng ghép kèo mới
 */
export const useCreateMatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const response = await apiClient.post('/matches', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      queryClient.invalidateQueries({ queryKey: ['my-matches'] });
    },
  });
};

/**
 * Hook gửi yêu cầu tham gia kèo (Join request)
 */
export const useJoinMatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, message }) => {
      const response = await apiClient.post(`/matches/${postId}/requests`, { message });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['match', variables.postId] });
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      queryClient.invalidateQueries({ queryKey: ['my-match-requests'] });
    },
  });
};

/**
 * Hook chủ bài duyệt (accept) hoặc từ chối (reject) yêu cầu tham gia
 */
export const useUpdateMatchRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, requestId, status }) => {
      const response = await apiClient.put(`/matches/${postId}/requests/${requestId}`, { status });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['match', variables.postId] });
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      queryClient.invalidateQueries({ queryKey: ['my-matches'] });
    },
  });
};

/**
 * Hook lấy các bài đăng của chính user đang đăng nhập
 */
export const useMyMatches = () => {
  return useQuery({
    queryKey: ['my-matches'],
    queryFn: async () => {
      const response = await apiClient.get('/my-matches');
      return response.data?.data ?? [];
    },
  });
};

/**
 * Hook lấy các yêu cầu xin tham gia do user gửi đi
 */
export const useMyMatchRequests = () => {
  return useQuery({
    queryKey: ['my-match-requests'],
    queryFn: async () => {
      const response = await apiClient.get('/my-match-requests');
      return response.data?.data ?? [];
    },
  });
};
