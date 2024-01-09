const express = require("express");
const { verifyJWT } = require("../middlewares/auth");
const {
  getTaskLists,
  createTaskList,
  deleteTaskList,
  deleteTask,
  createTask,
  updateTask,
  updateCompletion,
} = require("../controllers/tasks.controller");
const router = express.Router();

router.get("/api/tasklists", verifyJWT, getTaskLists);
router.post("/api/tasklists", verifyJWT, createTaskList);
router.delete("/api/tasklists/:id", verifyJWT, deleteTaskList);
router.post("/api/tasklists/:taskListId", verifyJWT, createTask);

router.post("/api/task/completion/:taskId", verifyJWT, updateCompletion);
router.post("/api/task/:taskId", verifyJWT, updateTask);
router.delete("/api/task/:taskId", verifyJWT, deleteTask);

module.exports.TasksRouter = router;
