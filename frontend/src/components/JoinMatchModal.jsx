// src/components/JoinMatchModal.jsx
import { useState } from 'react';
import { useJoinMatch } from '../hooks/useMatches';

export default function JoinMatchModal({ match, isOpen, onClose }) {
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const joinMutation = useJoinMatch();

  if (!isOpen || !match) return null;

  const handleJoin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await joinMutation.mutateAsync({
        postId: match.id,
        message: message.trim(),
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi xin tham gia kèo.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 shadow-2xl text-slate-900 dark:text-white animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🤝</span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Xin Tham Gia Kèo Đấu</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Match info preview */}
        <div className="mt-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/60 p-4 space-y-2 text-sm shadow-sm">
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Chủ kèo:</span>
            <span className="font-bold text-slate-900 dark:text-white">{match.creator?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Trình độ yêu cầu:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">{match.level_required}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Chi phí dự kiến:</span>
            <span className="font-extrabold text-teal-600 dark:text-teal-300">
              {Number(match.estimated_cost_per_person).toLocaleString('vi-VN')} đ / người
            </span>
          </div>
          <div className="border-t border-slate-200 dark:border-white/5 pt-2 text-xs text-slate-600 dark:text-slate-300 italic">
            "{match.note}"
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-300 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 rounded-xl border border-emerald-300 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 p-3 text-sm text-emerald-800 dark:text-emerald-300 font-semibold">
            🎉 Đã gửi yêu cầu tham gia thành công! Vui lòng đợi chủ kèo phê duyệt.
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleJoin} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Lời nhắn gửi chủ kèo (Tùy chọn)
            </label>
            <textarea
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="VD: Mình đánh được 2 năm, trình độ ổn, xin giao lưu nhé!"
              className="w-full rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all shadow-sm"
            />
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 dark:border-white/10 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={joinMutation.isPending || success}
              className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2 text-sm font-bold text-slate-950 hover:bg-emerald-400 disabled:opacity-50 transition-all shadow-md shadow-emerald-500/20"
            >
              {joinMutation.isPending ? 'Đang gửi...' : 'Gửi yêu cầu 🏸'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
