const Task = require('../models/Task');
const ApiError = require('../utils/ApiError');

// @desc    Create a new task
// @route   POST /api/tasks
exports.createTask = async (req, res, next) => {
  try {
    const task = await Task.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tasks for the authenticated user
// @route   GET /api/tasks
// @query   status, priority, sortBy, order, page, limit, search
exports.getAllTasks = async (req, res, next) => {
  try {
    const {
      status,
      priority,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 10,
      search,
    } = req.query;

    // Build filter
    const filter = { user: req.user._id };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    // Allowed sort fields
    const allowedSortFields = ['createdAt', 'dueDate', 'priority', 'title', 'status'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortOrder = order === 'asc' ? 1 : -1;

    // Priority sort mapping (for meaningful sort order)
    let sort;
    if (sortField === 'priority') {
      // Custom sort: high=3, medium=2, low=1
      sort = undefined; // handled after query via aggregation alternative
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    // Get total count for pagination
    const total = await Task.countDocuments(filter);

    // Fetch tasks
    let tasks;
    if (sortField === 'priority') {
      // Aggregate for custom priority sort
      tasks = await Task.aggregate([
        { $match: filter },
        {
          $addFields: {
            priorityOrder: {
              $switch: {
                branches: [
                  { case: { $eq: ['$priority', 'high'] }, then: 3 },
                  { case: { $eq: ['$priority', 'medium'] }, then: 2 },
                  { case: { $eq: ['$priority', 'low'] }, then: 1 },
                ],
                default: 0,
              },
            },
          },
        },
        { $sort: { priorityOrder: sortOrder } },
        { $skip: skip },
        { $limit: limitNum },
        { $project: { priorityOrder: 0 } },
      ]);
    } else {
      tasks = await Task.find(filter)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limitNum)
        .lean();
    }

    res.json({
      success: true,
      tasks,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single task
// @route   GET /api/tasks/:id
exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      throw ApiError.notFound('Task not found');
    }

    res.json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!task) {
      throw ApiError.notFound('Task not found');
    }

    res.json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      throw ApiError.notFound('Task not found');
    }

    res.json({ success: true, message: 'Task deleted' });
  } catch (error) {
    next(error);
  }
};
