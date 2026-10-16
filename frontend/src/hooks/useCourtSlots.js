// src/hooks/useCourtSlots.js
//
// Custom hook fetch danh sách court slots theo sân và ngày.
// Sử dụng TanStack Query (React Query v5) để:
//   - Cache kết quả tránh gọi API lặp lại
//   - Auto-refetch mỗi 30s để hiển thị trạng thái slot real-time
//   - Stale-while-revalidate: hiển thị data cũ trong khi fetch mới
//
import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/axios';

/**
 * Fetch danh sách slots từ API.
 * Tách ra ngoài hook để có thể test độc lập.
 *
 * @param {number|string} courtId
 * @param {string}        date     Định dạng 'YYYY-MM-DD'
 * @returns {Promise<object>}      data từ API
 */
const fetchCourtSlots = async ({ courtId, date }) => {
  const { data } = await apiClient.get(`/courts/${courtId}/slots`, {
    params: { date },
  });
  return data; // { success, data: { court_id, court_name, date, slots: [...] } }
};

/**
 * Query key factory - giúp invalidate cache chính xác.
 * Dùng pattern: ['entity', 'action', params]
 */
export const courtSlotKeys = {
  all:     ()             => ['courtSlots'],
  byCourt: (courtId)      => ['courtSlots', String(courtId)],
  byDate:  (courtId, date) => ['courtSlots', String(courtId), date],
};

/**
 * Hook fetch và cache danh sách court slots.
 *
 * @param {object} params
 * @param {number|string} params.courtId   - ID sân cần xem lịch
 * @param {string}        params.date      - Ngày cần xem (YYYY-MM-DD)
 * @param {object}        [params.options] - Tuỳ chọn cho useQuery
 *
 * @returns {{
 *   slots:      Array,
 *   courtName:  string,
 *   isLoading:  boolean,
 *   isFetching: boolean,
 *   isError:    boolean,
 *   error:      Error|null,
 *   refetch:    Function
 * }}
 *
 * @example
 * const { slots, isLoading } = useCourtSlots({ courtId: 1, date: '2026-10-09' });
 */
const useCourtSlots = ({ courtId, date, options = {} }) => {
  const query = useQuery({
    queryKey: courtSlotKeys.byDate(courtId, date),

    queryFn: () => fetchCourtSlots({ courtId, date }),

    // Chỉ fetch khi có đủ courtId và date
    enabled: Boolean(courtId && date),

    // Cache 30s - đủ fresh cho real-time slot availability
    staleTime: 30_000,

    // Auto-refetch mỗi 30s khi tab đang focus (hiện trạng thái mới nhất)
    refetchInterval: 30_000,
    refetchIntervalInBackground: false, // Dừng khi user chuyển tab

    // Giữ data cũ trong khi đang fetch data mới (tránh loading flash)
    placeholderData: (previousData) => previousData,

    // Retry 1 lần nếu lỗi mạng
    retry: 1,

    // Spread options tuỳ chỉnh từ component (override nếu cần)
    ...options,
  });

  return {
    // Lấy mảng slots từ nested response, fallback về mảng rỗng
    slots:      query.data?.data?.slots ?? [],
    courtName:  query.data?.data?.court_name ?? '',

    isLoading:  query.isLoading,   // Lần fetch đầu tiên, chưa có data
    isFetching: query.isFetching,  // Đang re-fetch (kể cả khi đã có data cũ)
    isError:    query.isError,
    error:      query.error,
    refetch:    query.refetch,
  };
};

export default useCourtSlots;
