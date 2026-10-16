// src/pages/MatchmakingBoard.jsx
import { useState } from 'react';
import { useMatches, useMyMatches, useUpdateMatchRequest } from '../hooks/useMatches';
import { useAuthStore } from '../store/authStore';
import CreateMatchModal from '../components/CreateMatchModal';
import JoinMatchModal from '../components/JoinMatchModal';

const LEVELS = ['Tất cả', 'Mới chơi', 'Trung bình yếu', 'Trung bình', 'Trung bình khá', 'Khá', 'Bán chuyên'];

export default function MatchmakingBoard() {
  const user = useAuthStore((s) => s.user);
  const [selectedLevel, setSelectedLevel] = useState('Tất cả');
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'my-posts'
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedMatchForJoin, setSelectedMatchForJoin] = useState(null);

  // Queries
  const { data: openMatches = [], isLoading } = useMatches({
    level: selectedLevel === 'Tất cả' ? undefined : selectedLevel,
    search: search.trim() || undefined,
  });

  const { data: myMatches = [] } = useMyMatches();
  const updateRequestMutation = useUpdateMatchRequest();

  const handleApprove = (postId, requestId, status) => {
    updateRequestMutation.mutate({ postId, requestId, status });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 text-slate-900 dark:text-white transition-colors duration-300">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 dark:bg-teal-500/20 text-2xl border border-teal-500/20">
                🤝
              </span>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                Bảng Ghép Kèo Cầu Lông
              </h1>
            </div>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
              Tìm bạn giao lưu tại TP. Huế, mượn vợt xịn Kumpoo K520 Pro, VS Titan 7
            </p>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <button
                onClick={() => setIsCreateOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-all"
              >
                <span>➕</span> Đăng kèo ghép
              </button>
            ) : (
              <div className="text-xs text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 px-3.5 py-2 rounded-xl font-medium">
                Đăng nhập để đăng kèo hoặc xin tham gia
              </div>
            )}
          </div>
        </div>

        {/* Tabs & Filters */}
        <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                activeTab === 'all'
                  ? 'bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              Kèo đang mở ({openMatches.length})
            </button>

            {user && (
              <button
                onClick={() => setActiveTab('my-posts')}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                  activeTab === 'my-posts'
                    ? 'bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                Kèo của tôi ({myMatches.length})
              </button>
            )}
          </div>

          {activeTab === 'all' && (
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Tìm từ khóa, loại vợt..."
                  className="rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-900 px-3.5 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 focus:outline-none shadow-sm"
                />
              </div>

              <div className="flex flex-wrap gap-1">
                {LEVELS.map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setSelectedLevel(lvl)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                      selectedLevel === lvl
                        ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                        : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:text-white border border-slate-200 dark:border-transparent'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tab 1: Kèo đang mở (Kanban / Card Grid) */}
        {activeTab === 'all' && (
          <div className="mt-8">
            {isLoading ? (
              <div className="py-24 text-center">
                <span className="inline-block h-9 w-9 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></span>
                <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">Đang tải danh sách kèo ghép...</p>
              </div>
            ) : openMatches.length === 0 ? (
              <div className="glass-card mt-6 p-12 text-center text-slate-500 dark:text-slate-400">
                <span className="text-5xl">🏸</span>
                <p className="mt-4 font-bold text-lg text-slate-900 dark:text-white">Chưa có bài đăng ghép kèo nào phù hợp</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Hãy là người đầu tiên tạo kèo ghép để rủ bạn bè tại Huế cùng chơi!</p>
                {user && (
                  <button
                    onClick={() => setIsCreateOpen(true)}
                    className="mt-5 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20"
                  >
                    Tạo kèo ngay 🚀
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {openMatches.map((match) => {
                  const isOwner = user?.id === match.creator?.id;

                  return (
                    <div
                      key={match.id}
                      className="glass-card flex flex-col justify-between p-6 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 group"
                    >
                      <div>
                        {/* Top info */}
                        <div className="flex items-center justify-between">
                          <span className="rounded-full bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                            Cần {match.slots_remaining ?? match.slots_needed} người
                          </span>
                          <span className="rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 px-2 py-0.5 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                            {match.level_required}
                          </span>
                        </div>

                        {/* Creator info */}
                        <div className="mt-4 flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-bold">
                            {match.creator?.name?.charAt(0) ?? 'P'}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white text-sm">{match.creator?.name}</div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                              <span className="text-amber-500 dark:text-amber-400">★ {match.creator?.rating_score ?? 5.0}</span>
                              <span>•</span>
                              <span>{match.creator?.matches_played ?? 0} trận</span>
                            </div>
                          </div>
                        </div>

                        {/* Booking slot if attached */}
                        {match.booking?.court_slot && (
                          <div className="mt-4 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-800/40 p-3 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                            <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                              <span>📍</span> {match.booking.court_slot.court?.name ?? 'Sân Cầu Lông'}
                            </div>
                            <div className="text-slate-500 dark:text-slate-400">
                              📅 {match.booking.court_slot.play_date} • ⏰ {match.booking.court_slot.start_time?.slice(0, 5)} - {match.booking.court_slot.end_time?.slice(0, 5)}
                            </div>
                          </div>
                        )}

                        {/* Note text */}
                        <p className="mt-4 text-sm text-slate-700 dark:text-slate-200 bg-slate-100/70 dark:bg-white/5 rounded-xl p-3 border border-slate-200 dark:border-white/5 leading-relaxed italic">
                          "{match.note}"
                        </p>
                      </div>

                      {/* Footer & Action */}
                      <div className="mt-6 border-t border-slate-100 dark:border-white/10 pt-4 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Chi phí ước tính</span>
                          <div className="text-sm font-black text-teal-600 dark:text-teal-300">
                            {Number(match.estimated_cost_per_person).toLocaleString('vi-VN')} đ/người
                          </div>
                        </div>

                        {isOwner ? (
                          <span className="rounded-xl bg-slate-100 dark:bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-transparent">
                            Kèo của bạn
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              if (!user) {
                                alert('Vui lòng đăng nhập để xin tham gia kèo.');
                                return;
                              }
                              setSelectedMatchForJoin(match);
                            }}
                            className="flex items-center gap-1.5 rounded-xl bg-teal-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-teal-400 shadow-md shadow-teal-500/20 transition-all"
                          >
                            <span>🏸</span> Xin tham gia
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Kèo của tôi (Quản lý và duyệt yêu cầu tham gia) */}
        {activeTab === 'my-posts' && (
          <div className="mt-8 space-y-6">
            {myMatches.length === 0 ? (
              <div className="glass-card p-12 text-center text-slate-500 dark:text-slate-400">
                Bạn chưa đăng kèo ghép nào. Hãy tạo kèo mới ngay!
              </div>
            ) : (
              myMatches.map((post) => (
                <div key={post.id} className="glass-card p-6 border-slate-200 dark:border-white/10 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-white/10 pb-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-lg font-bold text-slate-900 dark:text-white">Kèo ghép #{post.id}</span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            post.status === 'open'
                              ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-transparent'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-400'
                          }`}
                        >
                          {post.status === 'open' ? '🟢 Đang mở' : '🔴 Đã đóng'}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">• Cần {post.slots_needed} người • Trình độ: {post.level_required}</span>
                      </div>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 italic">"{post.note}"</p>
                    </div>

                    <div className="text-left sm:text-right text-xs text-slate-500 dark:text-slate-400">
                      <div>Tạo lúc: {new Date(post.created_at).toLocaleDateString('vi-VN')}</div>
                      <div className="font-black text-teal-600 dark:text-teal-400 mt-0.5 text-sm">
                        {Number(post.estimated_cost_per_person).toLocaleString('vi-VN')} đ/người
                      </div>
                    </div>
                  </div>

                  {/* Danh sách yêu cầu tham gia */}
                  <div className="mt-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                      Yêu cầu tham gia ({post.requests?.length ?? 0})
                    </h4>

                    {(!post.requests || post.requests.length === 0) ? (
                      <p className="text-xs text-slate-400 dark:text-slate-500 italic">Chưa có ai gửi yêu cầu tham gia kèo này.</p>
                    ) : (
                      <div className="space-y-2">
                        {post.requests.map((req) => (
                          <div
                            key={req.id}
                            className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3.5 border border-slate-200 dark:border-white/5 shadow-sm"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                                {req.requester?.name?.charAt(0) ?? 'P'}
                              </div>
                              <div>
                                <span className="font-bold text-slate-900 dark:text-white text-sm">{req.requester?.name}</span>
                                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                  Rating: ★{req.requester?.rating_score ?? 5.0} • {req.requester?.matches_played ?? 0} trận
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {req.status === 'pending' ? (
                                <>
                                  <button
                                    onClick={() => handleApprove(post.id, req.id, 'accepted')}
                                    disabled={updateRequestMutation.isPending}
                                    className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-all shadow-sm"
                                  >
                                    ✓ Đồng ý
                                  </button>
                                  <button
                                    onClick={() => handleApprove(post.id, req.id, 'rejected')}
                                    disabled={updateRequestMutation.isPending}
                                    className="rounded-lg bg-red-500/15 border border-red-500/30 px-3 py-1.5 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-500/25 transition-all"
                                  >
                                    ✕ Từ chối
                                  </button>
                                </>
                              ) : (
                                <span
                                  className={`rounded-md px-2.5 py-1 text-xs font-bold ${
                                    req.status === 'accepted'
                                      ? 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-transparent'
                                      : 'bg-red-50 dark:bg-red-500/15 text-red-700 dark:text-red-400 border border-red-200 dark:border-transparent'
                                  }`}
                                >
                                  {req.status === 'accepted' ? 'Đã chấp nhận' : 'Đã từ chối'}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Modals */}
        <CreateMatchModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
        />

        <JoinMatchModal
          match={selectedMatchForJoin}
          isOpen={!!selectedMatchForJoin}
          onClose={() => setSelectedMatchForJoin(null)}
        />
      </div>
    </div>
  );
}
