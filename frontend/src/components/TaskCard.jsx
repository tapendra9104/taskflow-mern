const TaskCard = ({ task, onEdit, onDelete, onToggleComplete, formatDate }) => {
  const isCompleted = task.status === 'completed';

  const dateLabel = isCompleted
    ? `Completed: ${formatDate(task.updatedAt)}`
    : `Created: ${formatDate(task.createdAt)}`;

  return (
    <div
      className="task-card"
      id={`task-card-${task._id}`}
    >
      {/* Checkbox */}
      <label className={`task-checkbox ${isCompleted ? 'checked' : ''}`}>
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={() => onToggleComplete(task._id, task.status)}
          aria-label={`Mark "${task.title}" as ${isCompleted ? 'pending' : 'completed'}`}
        />
        <span className="task-checkbox-visual">
          <span className="check-icon">✓</span>
        </span>
      </label>

      {/* Task Content */}
      <div className="task-content">
        <h3 className={`task-card-title ${isCompleted ? 'completed' : ''}`}>
          {task.title}
        </h3>
        <div className="task-card-date">{dateLabel}</div>
      </div>

      {/* Actions */}
      <div className="task-card-actions">
        {!isCompleted && (
          <button
            className="task-action-btn"
            onClick={() => onEdit(task)}
            title="Edit task"
            aria-label="Edit task"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        )}
        <button
          className="task-action-btn delete"
          onClick={() => onDelete(task._id)}
          title="Delete task"
          aria-label="Delete task"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
