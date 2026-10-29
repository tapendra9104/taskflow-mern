const express = require('express');
const router = express.Router();
const {
  createTask,
  getAllTasks,
  getTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const protect = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  createTaskSchema,
  updateTaskSchema,
} = require('../validators/taskValidator');

// All task routes require authentication
router.use(protect);

router.route('/').get(getAllTasks).post(validate(createTaskSchema), createTask);

router
  .route('/:id')
  .get(getTask)
  .put(validate(updateTaskSchema), updateTask)
  .delete(deleteTask);

module.exports = router;
