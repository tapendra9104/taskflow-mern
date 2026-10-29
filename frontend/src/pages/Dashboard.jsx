import { useState, useEffect, useCallback } from 'react';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import Pagination from '../components/Pagination';
import Spinner from '../components/Spinner';
import useTasks from '../hooks/useTasks';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';
import '../styles/components.css';

const Dashboard = () => {
  const { tasks, pagination, loading, fetchTasks, createTask, updateTask, deleteTask } =
    useTasks();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Fetch all tasks (no filters for this clean view)
  useEffect(() => {
    fetchTasks({ page: 1, limit: 50 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = useCallback(
    async (data) => {
      await createTask(data);
      fetchTasks({ page: 1, limit: 50 });
    },
    [createTask, fetchTasks]
  );

  const handleUpdate = useCallback(
    async (data) => {
      if (!editingTask) return;
      await updateTask(editingTask._id, data);
      setEditingTask(null);
      fetchTasks({ page: 1, limit: 50 });
    },
    [editingTask, updateTask, fetchTasks]
  );

  const handleDelete = useCallback(
    async (id) => {
      if (!window.confirm('Delete this task?')) return;
      await deleteTask(id);
      fetchTasks({ page: 1, limit: 50 });
    },
    [deleteTask, fetchTasks]
  );

  const handleToggleComplete = useCallback(
    async (id, currentStatus) => {
      const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
      await updateTask(id, { status: newStatus });
      fetchTasks({ page: 1, limit: 50 });
    },
    [updateTask, fetchTasks]
  );

  const handleEdit = useCallback((task) => {
    setEditingTask(task);
    setShowForm(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setShowForm(false);
    setEditingTask(null);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Split tasks into pending and completed
  const pendingTasks = tasks.filter((t) => t.status !== 'completed');
  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const totalTasks = tasks.length;

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <main className="dashboard" id="dashboard">
      {/* Welcome Header */}
      <div className="dashboard-welcome">
        <div className="dashboard-welcome-left">
          <span className="dashboard-welcome-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </span>
          <h1 className="dashboard-welcome-text">
            Welcome, {user?.name || 'User'}!
          </h1>
        </div>
        <button
          className="logout-btn"
          onClick={handleLogout}
          id="logout-btn"
        >
          <svg className="logout-btn-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Logout
        </button>
      </div>

      {/* Add New Task Button */}
      <button
        className="add-task-btn"
        onClick={() => {
          setEditingTask(null);
          setShowForm(true);
        }}
        id="add-task-btn"
      >
        <span className="add-task-btn-icon">+</span>
        Add New Task
      </button>

      {/* Stats Cards */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-value">{totalTasks}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
        <div className="stat-card">
          <div className="stat-value pending">{pendingTasks.length}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card">
          <div className="stat-value completed">{completedTasks.length}</div>
          <div className="stat-label">Completed</div>
        </div>
      </div>

      {/* Task Lists */}
      {loading ? (
        <Spinner />
      ) : tasks.length === 0 ? (
        <div className="task-list-empty">
          <div className="task-list-empty-icon">📋</div>
          <h3>No tasks found</h3>
          <p>Create your first task to get started!</p>
        </div>
      ) : (
        <>
          {/* Pending Tasks */}
          {pendingTasks.length > 0 && (
            <div className="task-section">
              <h2 className="section-title">Pending Tasks</h2>
              <div className="task-list">
                {pendingTasks.map((task, index) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleComplete={handleToggleComplete}
                    formatDate={formatDate}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <div className="task-section">
              <h2 className="section-title">Completed Tasks</h2>
              <div className="task-list">
                {completedTasks.map((task, index) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleComplete={handleToggleComplete}
                    formatDate={formatDate}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <Pagination pagination={pagination} onPageChange={(page) => fetchTasks({ page, limit: 50 })} />

      {showForm && (
        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? handleUpdate : handleCreate}
          onClose={handleCloseForm}
        />
      )}
    </main>
  );
};

export default Dashboard;
