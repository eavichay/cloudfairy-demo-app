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

router.get("/tasklists", verifyJWT, getTaskLists);
router.post("/tasklists", verifyJWT, createTaskList);
router.delete("/tasklists/:id", verifyJWT, deleteTaskList);
router.post("/tasklists/:taskListId", verifyJWT, createTask);

router.post("/task/completion/:taskId", verifyJWT, updateCompletion);
router.post("/task/:taskId", verifyJWT, updateTask);
router.delete("/task/:taskId", verifyJWT, deleteTask);

module.exports.TasksRouter = router;
