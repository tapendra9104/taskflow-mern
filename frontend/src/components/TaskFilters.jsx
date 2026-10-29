import { useState, useEffect, useCallback } from 'react';

const TaskFilters = ({ onFilterChange, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    priority: 'all',
    sortBy: 'createdAt',
    order: 'desc',
    ...initialFilters,
  });

  // Debounce search
  const [searchInput, setSearchInput] = useState(filters.search);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput }));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const notifyChange = useCallback(
    (updated) => {
      onFilterChange(updated);
    },
    [onFilterChange]
  );

  useEffect(() => {
    notifyChange(filters);
  }, [filters, notifyChange]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="task-filters" id="task-filters">
      <input
        className="form-input search-input"
        type="text"
        name="search"
        placeholder="🔍 Search tasks..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        id="search-input"
      />

      <select
        className="form-select"
        name="status"
        value={filters.status}
        onChange={handleChange}
        id="filter-status"
      >
        <option value="all">All Status</option>
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      <select
        className="form-select"
        name="priority"
        value={filters.priority}
        onChange={handleChange}
        id="filter-priority"
      >
        <option value="all">All Priority</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <select
        className="form-select"
        name="sortBy"
        value={filters.sortBy}
        onChange={handleChange}
        id="filter-sort"
      >
        <option value="createdAt">Date Created</option>
        <option value="dueDate">Due Date</option>
        <option value="priority">Priority</option>
        <option value="title">Title</option>
      </select>

      <select
        className="form-select"
        name="order"
        value={filters.order}
        onChange={handleChange}
        id="filter-order"
      >
        <option value="desc">Newest First</option>
        <option value="asc">Oldest First</option>
      </select>
    </div>
  );
};

export default TaskFilters;
