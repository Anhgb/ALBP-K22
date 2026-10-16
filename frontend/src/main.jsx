import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import App from './App.jsx';
import './index.css';

// ── Cấu hình TanStack Query ───────────────────────────────────────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Không refetch khi focus lại tab (mặc định true, hơi aggressive)
      refetchOnWindowFocus: false,
      // Cache 5 phút trước khi garbage collect
      gcTime: 5 * 60 * 1000,
      // Retry 1 lần khi lỗi
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      {/* DevTools chỉ hiển thị trong development */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>,
);
