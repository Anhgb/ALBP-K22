import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import confetti from 'canvas-confetti';
import ThreeBackground from './ThreeBackground';
import './App.css';

// ============================================================================
// CONSTANTS
// ============================================================================

const PRIORITIES = {
  high:   { label: '🔴 Cao',   color: '#f43f5e', bg: 'rgba(244,63,94,0.12)'  },
  medium: { label: '🟡 Trung', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  low:    { label: '🟢 Thấp',  color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
};

const FILTER_OPTIONS = [
  { value: 'all',       label: '📋 Tất Cả'     },
  { value: 'active',    label: '⏳ Chưa Xong'  },
  { value: 'completed', label: '✅ Đã Xong'    },
];

const SORT_OPTIONS = [
  { value: 'default',  label: 'Mặc định'   },
  { value: 'priority', label: 'Độ ưu tiên' },
  { value: 'date',     label: 'Ngày tạo'   },
  { value: 'alpha',    label: 'A → Z'       },
];

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden:  { opacity: 0, x: -30, scale: 0.96 },
  visible: { opacity: 1, x: 0,  scale: 1,
    transition: { duration: 0.32, ease: 'easeOut' } },
  exit:    { opacity: 0, x: 60, scale: 0.9, height: 0, marginBottom: 0,
    transition: { duration: 0.28, ease: 'easeIn' } },
};

// ============================================================================
// UTILITIES
// ============================================================================

function formatTime(ts) {
  return new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit', minute: '2-digit',
    day: '2-digit',  month: '2-digit',
  }).format(new Date(ts));
}

function fireConfetti() {
  const opts = { particleCount: 80, spread: 90, origin: { y: 0.55 } };
  confetti({ ...opts, colors: ['#7c3aed','#06b6d4','#10b981','#f59e0b'] });
  setTimeout(() => confetti({ ...opts, angle: 60,  origin: { x: 0, y: 0.6 } }), 250);
  setTimeout(() => confetti({ ...opts, angle: 120, origin: { x: 1, y: 0.6 } }), 400);
}

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

function App() {
  const [todos,      setTodos]      = useState([]);
  const [filter,     setFilter]     = useState('all');
  const [sortBy,     setSortBy]     = useState('default');
  const [searchTerm, setSearchTerm] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [priority,   setPriority]   = useState('medium');
  const [inputError, setInputError] = useState('');
  const [shake,      setShake]      = useState(false);
  const [undoStack,  setUndoStack]  = useState([]); // { todo, timer }
  const [celebrated, setCelebrated] = useState(false);
  const inputRef = useRef(null);

  /* ── localStorage ── */
  useEffect(() => {
    try {
      const saved = localStorage.getItem('todos-v2');
      if (saved) setTodos(JSON.parse(saved));
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => {
    try { localStorage.setItem('todos-v2', JSON.stringify(todos)); }
    catch (e) { console.error(e); }
  }, [todos]);

  /* ── Confetti when 100% complete ── */
  useEffect(() => {
    const done = todos.length > 0 && todos.every(t => t.done);
    if (done && !celebrated) { fireConfetti(); setCelebrated(true); }
    if (!done) setCelebrated(false);
  }, [todos, celebrated]);

  /* ── Add todo ── */
  const handleAdd = useCallback((e) => {
    e.preventDefault();
    if (!inputValue.trim()) {
      setInputError('Công việc không thể trống!');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    setInputError('');
    setTodos(prev => [...prev, {
      id:        Date.now(),
      text:      inputValue.trim(),
      done:      false,
      priority,
      createdAt: Date.now(),
    }]);
    setInputValue('');
    inputRef.current?.focus();
  }, [inputValue, priority]);

  /* ── Toggle ── */
  const handleToggle = useCallback((id) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }, []);

  /* ── Delete with Undo ── */
  const handleDelete = useCallback((id) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    setTodos(prev => prev.filter(t => t.id !== id));

    const timer = setTimeout(() => {
      setUndoStack(prev => prev.filter(u => u.todo.id !== id));
    }, 5000);

    setUndoStack(prev => [...prev, { todo, timer }]);
  }, [todos]);

  const handleUndo = useCallback((id) => {
    const entry = undoStack.find(u => u.todo.id === id);
    if (!entry) return;
    clearTimeout(entry.timer);
    setTodos(prev => {
      const restored = [...prev, entry.todo];
      return restored.sort((a, b) => a.createdAt - b.createdAt);
    });
    setUndoStack(prev => prev.filter(u => u.todo.id !== id));
  }, [undoStack]);

  /* ── Edit ── */
  const handleEdit = useCallback((id, newText) => {
    if (!newText.trim()) return;
    setTodos(prev => prev.map(t => t.id === id ? { ...t, text: newText.trim() } : t));
  }, []);

  /* ── Change priority ── */
  const handlePriorityChange = useCallback((id, newPriority) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, priority: newPriority } : t));
  }, []);

  /* ── Delete all ── */
  const handleDeleteAll = () => {
    if (window.confirm('Bạn chắc chắn muốn xóa tất cả công việc?')) setTodos([]);
  };

  /* ── Mark all done ── */
  const handleMarkAllDone = () => {
    setTodos(prev => prev.map(t => ({ ...t, done: true })));
  };

  /* ── Filtering & Sorting ── */
  const filtered = todos
    .filter(t => {
      if (filter === 'active')    return !t.done;
      if (filter === 'completed') return  t.done;
      return true;
    })
    .filter(t => t.text.toLowerCase().includes(searchTerm.toLowerCase()));

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'priority') {
      const order = { high: 0, medium: 1, low: 2 };
      return order[a.priority] - order[b.priority];
    }
    if (sortBy === 'alpha')    return a.text.localeCompare(b.text, 'vi');
    if (sortBy === 'date')     return b.createdAt - a.createdAt;
    return 0;
  });

  const stats = {
    total:     todos.length,
    completed: todos.filter(t =>  t.done).length,
    active:    todos.filter(t => !t.done).length,
  };
  const pct = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  /* ── Reorder (only works when sort = default & filter = all) ── */
  const canReorder = sortBy === 'default' && filter === 'all' && !searchTerm;

  const handleReorder = (newOrder) => {
    setTodos(prev => {
      const map = Object.fromEntries(prev.map(t => [t.id, t]));
      return newOrder.map(id => map[id]);
    });
  };

  return (
    <div className="app">
      <ThreeBackground />

      <motion.div className="container" initial="hidden" animate="visible" variants={stagger}>

        {/* ── Header ── */}
        <motion.header className="header" variants={fadeUp}>
          <div className="header__icon">✅</div>
          <h1 className="header__title">Todo<span>App</span></h1>
          <p className="header__subtitle">Quản lý công việc thông minh</p>
        </motion.header>

        {/* ── Progress ── */}
        {stats.total > 0 && (
          <motion.div className="progress-card" variants={fadeUp}>
            <div className="progress-card__header">
              <span>
                {pct === 100
                  ? '🎉 Tuyệt vời! Hoàn thành tất cả!'
                  : `Còn ${stats.active} việc cần làm`}
              </span>
              <span className="progress-card__pct">{pct}%</span>
            </div>
            <div className="progress-bar">
              <motion.div
                className="progress-bar__fill"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        )}

        {/* ── Stats ── */}
        <motion.div variants={fadeUp}>
          <Stats stats={stats} />
        </motion.div>

        {/* ── Add Form ── */}
        <motion.form
          className={`form-card${shake ? ' form-card--shake' : ''}`}
          onSubmit={handleAdd}
          noValidate
          variants={fadeUp}
        >
          <div className="form-card__top">
            <div className="form-group">
              <label htmlFor="todo-input">➕ Thêm Công Việc Mới</label>
              <input
                ref={inputRef}
                id="todo-input"
                type="text"
                value={inputValue}
                onChange={e => { setInputValue(e.target.value); if (inputError) setInputError(''); }}
                placeholder="Nhập nội dung công việc..."
                aria-invalid={!!inputError}
                aria-describedby={inputError ? 'input-error' : undefined}
                autoComplete="off"
              />
              <AnimatePresence>
                {inputError && (
                  <motion.span id="input-error" className="error" role="alert"
                    initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    ⚠️ {inputError}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <motion.button type="submit" className="btn btn--add"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Thêm
            </motion.button>
          </div>

          {/* Priority Selector */}
          <div className="priority-row">
            <span className="priority-row__label">Ưu tiên:</span>
            {Object.entries(PRIORITIES).map(([key, val]) => (
              <motion.button
                key={key} type="button"
                className={`btn btn--priority ${priority === key ? 'btn--priority--active' : ''}`}
                style={priority === key
                  ? { background: val.bg, borderColor: val.color, color: val.color }
                  : {}}
                onClick={() => setPriority(key)}
                whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.93 }}
                aria-pressed={priority === key}
              >
                {val.label}
              </motion.button>
            ))}
          </div>
        </motion.form>

        {/* ── Toolbar: Search + Sort ── */}
        <motion.div className="toolbar" variants={fadeUp}>
          <div className="search-card">
            <span className="search-card__icon">🔍</span>
            <input
              id="search-input"
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm..."
              aria-label="Tìm kiếm công việc"
            />
            <AnimatePresence>
              {searchTerm && (
                <motion.button className="search-card__clear"
                  onClick={() => setSearchTerm('')}
                  initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  aria-label="Xóa tìm kiếm"
                >✕</motion.button>
              )}
            </AnimatePresence>
          </div>

          <div className="sort-select-wrap">
            <label htmlFor="sort-select" className="sr-only">Sắp xếp</label>
            <select
              id="sort-select"
              className="sort-select"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              {SORT_OPTIONS.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* ── Filter Bar ── */}
        <motion.div variants={fadeUp}>
          <FilterBar currentFilter={filter} onFilterChange={setFilter} />
        </motion.div>

        {/* ── Quick Actions ── */}
        {stats.active > 0 && (
          <motion.div className="quick-actions" variants={fadeUp}>
            <motion.button className="btn btn--ghost" onClick={handleMarkAllDone}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              ✅ Đánh dấu tất cả hoàn thành
            </motion.button>
          </motion.div>
        )}

        {/* ── Todo List (with Drag & Drop) ── */}
        <motion.div className="list-wrapper" variants={fadeUp}>
          <AnimatePresence mode="wait">
            {sorted.length > 0 ? (
              canReorder ? (
                <Reorder.Group
                  axis="y"
                  values={sorted.map(t => t.id)}
                  onReorder={handleReorder}
                  className="todo-list"
                  aria-label="Danh sách công việc (kéo để sắp xếp)"
                  as="ul"
                >
                  <AnimatePresence>
                    {sorted.map(todo => (
                      <TodoItem
                        key={todo.id}
                        todo={todo}
                        onToggle={handleToggle}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                        onPriorityChange={handlePriorityChange}
                        draggable
                      />
                    ))}
                  </AnimatePresence>
                </Reorder.Group>
              ) : (
                <motion.ul
                  className="todo-list"
                  aria-label="Danh sách công việc"
                  variants={stagger} initial="hidden" animate="visible"
                >
                  <AnimatePresence>
                    {sorted.map(todo => (
                      <TodoItem
                        key={todo.id}
                        todo={todo}
                        onToggle={handleToggle}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                        onPriorityChange={handlePriorityChange}
                        draggable={false}
                      />
                    ))}
                  </AnimatePresence>
                </motion.ul>
              )
            ) : (
              <motion.div className="empty-state" key="empty"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                <div className="empty-state__icon">
                  {todos.length === 0 ? '📋' : '🔎'}
                </div>
                <p>{todos.length === 0
                  ? 'Chưa có công việc nào. Hãy thêm ngay!'
                  : 'Không tìm thấy công việc phù hợp.'}
                </p>
                {canReorder && (
                  <p className="empty-state__hint">💡 Kéo thả để sắp xếp lại thứ tự</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Delete All ── */}
        <AnimatePresence>
          {todos.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <motion.button onClick={handleDeleteAll} className="btn btn--danger-full"
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                🗑️ Xóa Tất Cả ({stats.total})
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>

      {/* ── Undo Toast Stack ── */}
      <div className="undo-stack" aria-live="polite">
        <AnimatePresence>
          {undoStack.map(({ todo }) => (
            <motion.div key={todo.id} className="undo-toast"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0,  scale: 1   }}
              exit={{    opacity: 0, y: 20, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 320, damping: 24 }}>
              <span>🗑️ Đã xóa "<b>{todo.text.length > 24 ? todo.text.slice(0,24) + '…' : todo.text}</b>"</span>
              <motion.button className="undo-toast__btn" onClick={() => handleUndo(todo.id)}
                whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}>
                ↩️ Hoàn tác
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ============================================================================
// TODO ITEM COMPONENT
// ============================================================================

function TodoItem({ todo, onToggle, onDelete, onEdit, onPriorityChange, draggable }) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [showPrio, setShowPrio] = useState(false);
  const editRef = useRef(null);
  const p = PRIORITIES[todo.priority] || PRIORITIES.medium;

  const commitEdit = () => {
    onEdit(todo.id, editText);
    setEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter')  { commitEdit(); }
    if (e.key === 'Escape') { setEditText(todo.text); setEditing(false); }
  };

  useEffect(() => {
    if (editing) editRef.current?.focus();
  }, [editing]);

  const ItemWrapper = draggable ? Reorder.Item : motion.li;
  const wrapperProps = draggable
    ? { value: todo.id, as: 'li' }
    : { variants: itemVariants, exit: 'exit', layout: true };

  return (
    <ItemWrapper
      {...wrapperProps}
      className={`todo-item ${todo.done ? 'todo-item--completed' : ''}`}
      style={{ '--p-color': p.color, '--p-bg': p.bg }}
      whileHover={{ x: draggable ? 0 : 4 }}
    >
      {/* Priority stripe */}
      <span className="todo-item__stripe" aria-hidden="true" />

      {/* Checkbox */}
      <motion.label className="todo-item__checkbox-wrap" whileTap={{ scale: 0.8 }}>
        <input
          type="checkbox" checked={todo.done}
          onChange={() => onToggle(todo.id)}
          className="todo-item__checkbox-input"
          aria-label={`Đánh dấu hoàn thành: ${todo.text}`}
        />
        <span className={`todo-item__checkbox ${todo.done ? 'todo-item__checkbox--checked' : ''}`}>
          {todo.done && (
            <motion.span
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 500 }}>✓</motion.span>
          )}
        </span>
      </motion.label>

      {/* Text / Edit Input */}
      <div className="todo-item__body">
        {editing ? (
          <input
            ref={editRef}
            className="todo-item__edit-input"
            value={editText}
            onChange={e => setEditText(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={handleKeyDown}
            aria-label="Sửa nội dung công việc"
          />
        ) : (
          <span
            className="todo-item__text"
            onDoubleClick={() => { if (!todo.done) setEditing(true); }}
            title={todo.done ? '' : 'Double-click để sửa'}
          >
            {todo.text}
          </span>
        )}
        <span className="todo-item__meta">
          <span className="todo-item__time">{formatTime(todo.createdAt)}</span>
          {!todo.done && (
            <motion.button
              className="todo-item__edit-btn"
              onClick={() => setEditing(e => !e)}
              whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
              aria-label="Sửa công việc"
            >✏️</motion.button>
          )}
        </span>
      </div>

      {/* Priority badge + picker */}
      <div className="todo-item__prio-wrap">
        <motion.button
          className="badge"
          style={{ background: p.bg, color: p.color, borderColor: p.color }}
          onClick={() => setShowPrio(v => !v)}
          whileHover={{ scale: 1.08 }}
          aria-label="Đổi mức ưu tiên"
          aria-expanded={showPrio}
        >
          {p.label}
        </motion.button>
        <AnimatePresence>
          {showPrio && (
            <motion.div
              className="prio-picker"
              initial={{ opacity: 0, scale: 0.85, y: -8 }}
              animate={{ opacity: 1, scale: 1,    y: 0   }}
              exit={{    opacity: 0, scale: 0.85, y: -8  }}
              transition={{ duration: 0.18 }}
            >
              {Object.entries(PRIORITIES).map(([key, val]) => (
                <button key={key}
                  className="prio-picker__item"
                  style={{ color: val.color }}
                  onClick={() => { onPriorityChange(todo.id, key); setShowPrio(false); }}
                >
                  {val.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Delete */}
      {draggable && (
        <span className="todo-item__drag-hint" aria-hidden="true" title="Kéo để sắp xếp">⠿</span>
      )}
      <motion.button
        onClick={() => onDelete(todo.id)}
        className="btn btn--delete"
        aria-label={`Xóa công việc: ${todo.text}`}
        whileHover={{ scale: 1.2, rotate: 10 }}
        whileTap={{ scale: 0.85 }}
      >🗑️</motion.button>
    </ItemWrapper>
  );
}

TodoItem.propTypes = {
  todo:             PropTypes.object.isRequired,
  onToggle:         PropTypes.func.isRequired,
  onDelete:         PropTypes.func.isRequired,
  onEdit:           PropTypes.func.isRequired,
  onPriorityChange: PropTypes.func.isRequired,
  draggable:        PropTypes.bool.isRequired,
};

// ============================================================================
// FILTER BAR
// ============================================================================

function FilterBar({ currentFilter, onFilterChange }) {
  return (
    <div className="filter-bar" role="group" aria-label="Lọc công việc">
      {FILTER_OPTIONS.map(f => (
        <motion.button
          key={f.value}
          onClick={() => onFilterChange(f.value)}
          className={`btn btn--filter ${currentFilter === f.value ? 'btn--filter--active' : ''}`}
          aria-pressed={currentFilter === f.value}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          {f.label}
        </motion.button>
      ))}
    </div>
  );
}

FilterBar.propTypes = {
  currentFilter:  PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

// ============================================================================
// STATS
// ============================================================================

function Stats({ stats }) {
  const items = [
    { label: 'Tổng Cộng', value: stats.total,     icon: '📊', cls: 'stat--total'  },
    { label: 'Chưa Hoàn', value: stats.active,    icon: '⏳', cls: 'stat--active' },
    { label: 'Đã Hoàn',   value: stats.completed, icon: '✅', cls: 'stat--done'   },
  ];

  return (
    <div className="stats">
      {items.map(item => (
        <motion.div key={item.label} className={`stat ${item.cls}`}
          whileHover={{ scale: 1.05, y: -4 }}
          transition={{ type: 'spring', stiffness: 300 }}>
          <span className="stat__icon">{item.icon}</span>
          <motion.span className="stat__number"
            key={item.value}
            initial={{ scale: 0.6, opacity: 0.4 }}
            animate={{ scale: 1,   opacity: 1   }}
            transition={{ type: 'spring', stiffness: 400 }}>
            {item.value}
          </motion.span>
          <span className="stat__label">{item.label}</span>
        </motion.div>
      ))}
    </div>
  );
}

Stats.propTypes = {
  stats: PropTypes.shape({
    total: PropTypes.number.isRequired,
    completed: PropTypes.number.isRequired,
    active: PropTypes.number.isRequired,
  }).isRequired,
};

export default App;
