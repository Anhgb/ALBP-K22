// src/store/authStore.js
//
// Zustand store quản lý trạng thái xác thực toàn ứng dụng.
// Token được persist vào localStorage để giữ session sau khi refresh trang.
//
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      // ── State ────────────────────────────────────────────────────────────
      token: null,
      user: null,

      // ── Actions ──────────────────────────────────────────────────────────

      /**
       * Lưu thông tin đăng nhập sau khi nhận response từ API login/register.
       * @param {{ token: string, user: object }} payload
       */
      setAuth: ({ token, user }) => set({ token, user }),

      /**
       * Cập nhật thông tin user (dùng sau khi user chỉnh sửa profile).
       * @param {object} userData
       */
      setUser: (userData) => set({ user: userData }),

      /**
       * Xoá toàn bộ thông tin đăng nhập.
       * Được gọi từ logout action hoặc interceptor 401.
       */
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: 'smashmatch-auth', // Key trong localStorage
      storage: createJSONStorage(() => localStorage),
      // Chỉ persist token và user, không persist các action
      partialize: (state) => ({ token: state.token, user: state.user }),
    },
  ),
);
