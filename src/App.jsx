import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

const todoItemVariants = {
  hidden: { opacity: 0, x: -40, scale: 0.95 },
  visible: {
    opacity: 1, x: 0, scale: 1,
    transition: { duration: 0.35, ease: 'easeOut' }
  },
  exit: {
    opacity: 0, x: 40, scale: 0.9,
    transition: { duration: 0.25, ease: 'easeIn' }
  }
};

const staggerContainer = {
  visible: { transition: { staggerChildren: 0.07 } }
};

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');
  const [shake, setShake] = useState(false);

  useEffect(() => {
    try {
      const savedTodos = localStorage.getItem('todos');
      if (savedTodos) setTodos(JSON.parse(savedTodos));
    } catch (error) {
      console.error('Error loading todos from localStorage:', error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('todos', JSON.stringify(todos));
    } catch (error) {
      console.error('Error saving todos to localStorage:', error);
    }
  }, [todos]);

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) {
      setInputError('Công việc không thể trống!');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    setInputError('');
    const newTodo = {
      id: Date.now(),
      text: inputValue.trim(),
      done: false
    };
    setTodos([...todos, newTodo]);
    setInputValue('');
  };

  const handleToggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, done: !todo.done } : todo
    ));
  };

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleDeleteAll = () => {
    if (window.confirm('Bạn chắc chắn muốn xóa tất cả công việc?')) {
      setTodos([]);
    }
  };

  const filteredByStatus = todos.filter(todo => {
    if (filter === 'active') return !todo.done;
    if (filter === 'completed') return todo.done;
    return true;
  });

  const filteredTodos = filteredByStatus.filter(todo =>
    todo.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.done).length,
    active: todos.filter(t => !t.done).length
  };

  const completionPct = stats.total > 0
    ? Math.round((stats.completed / stats.total) * 100)
    : 0;

  return (
    <div className="app">
      {/* Animated background orbs */}
      <div className="bg-orb bg-orb--1" aria-hidden="true" />
      <div className="bg-orb bg-orb--2" aria-hidden="true" />
      <div className="bg-orb bg-orb--3" aria-hidden="true" />

      <motion.div
        className="container"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {/* Header */}
        <motion.header className="header" variants={fadeInUp}>
          <div className="header__icon">✅</div>
          <h1 className="header__title">Todo<span>App</span></h1>
          <p className="header__subtitle">Quản lý công việc thông minh</p>
        </motion.header>

        {/* Progress Bar */}
        {stats.total > 0 && (
          <motion.div className="progress-card" variants={fadeInUp}>
            <div className="progress-card__header">
              <span>Tiến độ hoàn thành</span>
              <span className="progress-card__pct">{completionPct}%</span>
            </div>
            <div className="progress-bar">
              <motion.div
                className="progress-bar__fill"
                initial={{ width: 0 }}
                animate={{ width: `${completionPct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        )}

        {/* Stats */}
        <motion.div variants={fadeInUp}>
          <Stats stats={stats} />
        </motion.div>

        {/* Add Todo Form */}
        <motion.form
          className={`form-card ${shake ? 'form-card--shake' : ''}`}
          onSubmit={handleAddTodo}
          noValidate
          variants={fadeInUp}
        >
          <div className="form-card__input-row">
            <div className="form-group">
              <label htmlFor="todo-input">➕ Thêm Công Việc Mới</label>
              <input
                id="todo-input"
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  if (inputError) setInputError('');
                }}
                placeholder="Nhập nội dung công việc..."
                aria-invalid={!!inputError}
                aria-describedby={inputError ? 'input-error' : undefined}
                autoComplete="off"
              />
              <AnimatePresence>
                {inputError && (
                  <motion.span
                    id="input-error"
                    className="error"
                    role="alert"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                  >
                    ⚠️ {inputError}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <motion.button
              type="submit"
              className="btn btn--add"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Thêm
            </motion.button>
          </div>
        </motion.form>

        {/* Search */}
        <motion.div className="search-card" variants={fadeInUp}>
          <span className="search-card__icon">🔍</span>
          <input
            id="search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm công việc..."
            aria-label="Tìm kiếm công việc"
          />
          {searchTerm && (
            <motion.button
              className="search-card__clear"
              onClick={() => setSearchTerm('')}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Xóa tìm kiếm"
            >
              ✕
            </motion.button>
          )}
        </motion.div>

        {/* Filter Bar */}
        <motion.div variants={fadeInUp}>
          <FilterBar currentFilter={filter} onFilterChange={setFilter} />
        </motion.div>

        {/* Todo List */}
        <motion.div className="list-wrapper" variants={fadeInUp}>
          <AnimatePresence mode="popLayout">
            {filteredTodos.length > 0 ? (
              <motion.ul
                className="todo-list"
                aria-label="Danh sách công việc"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                <AnimatePresence>
                  {filteredTodos.map(todo => (
                    <TodoItem
                      key={todo.id}
                      todo={todo}
                      onToggle={handleToggleTodo}
                      onDelete={handleDeleteTodo}
                    />
                  ))}
                </AnimatePresence>
              </motion.ul>
            ) : (
              <motion.div
                className="empty-state"
                key="empty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <div className="empty-state__icon">
                  {todos.length === 0 ? '📋' : '🔎'}
                </div>
                <p>
                  {todos.length === 0
                    ? 'Chưa có công việc nào. Hãy thêm ngay!'
                    : 'Không tìm thấy công việc phù hợp.'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Delete All */}
        <AnimatePresence>
          {todos.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <motion.button
                onClick={handleDeleteAll}
                className="btn btn--danger-full"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                🗑️ Xóa Tất Cả ({stats.total})
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// ============================================================================
// TODO ITEM COMPONENT
// ============================================================================

function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <motion.li
      className={`todo-item ${todo.done ? 'todo-item--completed' : ''}`}
      variants={todoItemVariants}
      layout
      exit="exit"
      whileHover={{ x: 4 }}
    >
      <motion.label className="todo-item__checkbox-wrap" whileTap={{ scale: 0.85 }}>
        <input
          type="checkbox"
          checked={todo.done}
          onChange={() => onToggle(todo.id)}
          className="todo-item__checkbox-input"
          aria-label={`Đánh dấu hoàn thành: ${todo.text}`}
        />
        <span className={`todo-item__checkbox ${todo.done ? 'todo-item__checkbox--checked' : ''}`}>
          {todo.done && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              ✓
            </motion.span>
          )}
        </span>
      </motion.label>

      <span className="todo-item__text">{todo.text}</span>

      <motion.button
        onClick={() => onDelete(todo.id)}
        className="btn btn--delete"
        aria-label={`Xóa công việc: ${todo.text}`}
        whileHover={{ scale: 1.15, rotate: 10 }}
        whileTap={{ scale: 0.85 }}
      >
        🗑️
      </motion.button>
    </motion.li>
  );
}

TodoItem.propTypes = {
  todo: PropTypes.shape({
    id: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    done: PropTypes.bool.isRequired
  }).isRequired,
  onToggle: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

// ============================================================================
// FILTER BAR COMPONENT
// ============================================================================

function FilterBar({ currentFilter, onFilterChange }) {
  const filters = [
    { value: 'all', label: '📋 Tất Cả' },
    { value: 'active', label: '⏳ Chưa Xong' },
    { value: 'completed', label: '✅ Đã Xong' }
  ];

  return (
    <div className="filter-bar" role="group" aria-label="Lọc công việc">
      {filters.map(f => (
        <motion.button
          key={f.value}
          onClick={() => onFilterChange(f.value)}
          className={`btn btn--filter ${currentFilter === f.value ? 'btn--filter--active' : ''}`}
          aria-pressed={currentFilter === f.value}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {f.label}
          {currentFilter === f.value && (
            <motion.span
              className="filter-active-dot"
              layoutId="activeFilter"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
        </motion.button>
      ))}
    </div>
  );
}

FilterBar.propTypes = {
  currentFilter: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired
};

// ============================================================================
// STATS COMPONENT
// ============================================================================

function Stats({ stats }) {
  const items = [
    { label: 'Tổng Cộng', value: stats.total, icon: '📊', color: 'stat--total' },
    { label: 'Chưa Hoàn', value: stats.active, icon: '⏳', color: 'stat--active' },
    { label: 'Đã Hoàn', value: stats.completed, icon: '✅', color: 'stat--done' }
  ];

  return (
    <div className="stats">
      {items.map((item) => (
        <motion.div
          key={item.label}
          className={`stat ${item.color}`}
          whileHover={{ scale: 1.05, y: -4 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <span className="stat__icon">{item.icon}</span>
          <motion.span
            className="stat__number"
            key={item.value}
            initial={{ scale: 0.7, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
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
    active: PropTypes.number.isRequired
  }).isRequired
};

export default App;
