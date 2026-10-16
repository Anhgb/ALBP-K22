// src/components/CreateMatchModal.jsx
import { useState } from 'react';
import { useCreateMatch } from '../hooks/useMatches';

const LEVEL_OPTIONS = [
  'Mới chơi',
  'Trung bình yếu',
  'Trung bình',
  'Trung bình khá',
  'Khá',
  'Bán chuyên',
];

const PRESET_NOTES = [
  'Đang thiếu 2 người, có sẵn vợt Kumpoo K520 Pro và VS Titan 7 cho mượn.',
  'Cần tìm 1 bạn đánh đôi nam nữ hoặc đôi nam vui vẻ, giao lưu học hỏi.',
  'Sân đẹp thảm mới, cầu Yonex xịn, cần thêm tay vợt trung bình khá quẩy hăng say.',
  'Giao lưu cầu lông cuối tuần, có nước ngọt và trà đá miễn phí.',
];

export default function CreateMatchModal({ isOpen, onClose }) {
  const [level, setLevel] = useState('Trung bình');
  const [slotsNeeded, setSlotsNeeded] = useState(2);
  const [cost, setCost] = useState(40000);
  const [note, setNote] = useState(PRESET_NOTES[0]);
  const [error, setError] = useState(null);

  const createMatchMutation = useCreateMatch();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await createMatchMutation.mutateAsync({
        level_required: level,
        slots_needed: Number(slotsNeeded),
        estimated_cost_per_person: Number(cost),
        note: note.trim(),
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi tạo kèo ghép.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 shadow-2xl text-slate-900 dark:text-white animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏸</span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Đăng Kèo Ghép Cầu Lông</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-300 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Level required */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Trình độ yêu cầu
            </label>
            <div className="grid grid-cols-3 gap-2">
              {LEVEL_OPTIONS.map((lvl) => (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => setLevel(lvl)}
                  className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-all shadow-sm ${
                    level === lvl
                      ? 'border-emerald-500 bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold'
                      : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/20'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Slots & Cost */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Số người cần thêm
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={slotsNeeded}
                onChange={(e) => setSlotsNeeded(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all shadow-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Chi phí ước tính / người (VNĐ)
              </label>
              <input
                type="number"
                step="5000"
                min="0"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all shadow-sm"
                required
              />
            </div>
          </div>

          {/* Note & Presets */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Ghi chú / Dụng cụ có sẵn
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="VD: Đang thiếu người, có sẵn vợt Kumpoo K520 Pro và VS Titan 7 cho mượn..."
              className="w-full rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all shadow-sm"
              required
            />

            {/* Quick preset chips */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="text-[11px] text-slate-400 dark:text-slate-500 self-center font-medium">Gợi ý nhanh:</span>
              {PRESET_NOTES.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setNote(preset)}
                  className="rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/5 px-2.5 py-0.5 text-[11px] text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:border-emerald-500/30 transition-all truncate max-w-[200px]"
                  title={preset}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-white/10 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={createMatchMutation.isPending}
              className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2 text-sm font-bold text-slate-950 hover:bg-emerald-400 disabled:opacity-50 transition-all shadow-md shadow-emerald-500/20"
            >
              {createMatchMutation.isPending ? (
                <>
                  <span className="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                  Đang đăng...
                </>
              ) : (
                'Đăng kèo ngay 🚀'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
