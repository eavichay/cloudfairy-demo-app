const expressAsyncHandler = require("express-async-handler");
const { User } = require("../models/User");

const { Task } = require("../models/Task");
const { TaskList } = require("../models/TaskList");

module.exports.getTaskLists = expressAsyncHandler(async (req, res) => {
  const userId = req.userId;
  const user = await User.findOne({ _id: userId }).exec();
  if (!user) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const taskLists = await TaskList.find({ owner: userId }).exec();
  const responseData = await Promise.all(
    taskLists.map((taskList) => taskList.toResponseObject())
  );

  res.status(200);
  res.json({ taskLists: responseData });
});

module.exports.deleteTaskList = expressAsyncHandler(async (req, res) => {
  const userId = req.userId;
  const { id } = req.params;
  const existing = await TaskList.findById(id).exec();
  if (existing?.owner._id.toString() !== userId.toString()) {
    res.status(403);
    return res.json({ error: "Forbidden" });
  }
  await TaskList.findByIdAndDelete(id.toString()).exec();
  res.status(200);
  res.json({ message: "Deleted" });
});

module.exports.createTaskList = expressAsyncHandler(async (req, res) => {
  const userId = req.userId;
  const { title } = req.body;
  if (!title) {
    res.status(400);
    return res.json({ error: "No title" });
  }

  const taskList = await TaskList.create({
    title,
    owner: userId,
  });

  res.status(200);
  res.json({ taskList: await taskList.toResponseObject() });
});

module.exports.updateCompletion = expressAsyncHandler(async (req, res) => {
  const userId = req.userId;
  const { taskId } = req.params;
  const { isComplete } = req.body;

  const existingTask = await Task.findOne({
    _id: taskId.toString(),
    owner: userId,
  });

  if (!existingTask) {
    res.status(404);
    res.json({ message: `No task with id ${taskId}` });
  }
  existingTask.isComplete = !!isComplete;
  await existingTask.save();
  res.status(200);
  res.json({ task: existingTask });
});

module.exports.updateTask = expressAsyncHandler(async (req, res) => {
  const userId = req.userId;
  const { taskId } = req.params;
  const { title, description } = req.body;

  const existingTask = await Task.findOne({
    _id: taskId.toString(),
    owner: userId,
  });

  if (!existingTask) {
    res.status(404);
    res.json({ message: `No task with id ${taskId}` });
  }

  if (title) {
    await existingTask.changeTitle(title);
  }

  if (description) {
    await existingTask.changeDescription(description);
  }

  res.status(200);
  res.json({ task: existingTask });
});

module.exports.createTask = expressAsyncHandler(async (req, res) => {
  const userId = req.userId;
  const { taskListId } = req.params;
  const { title, description } = req.body;

  if (!title) {
    res.status(400);
    res.json({ error: `Missing Title` });
  }

  const existingTaskList = await TaskList.findOne({
    _id: taskListId.toString(),
    owner: userId,
  });
  if (!existingTaskList) {
    res.status(400);
    return res.json({
      error: `Tasklist with id ${taskListId} does not exists`,
    });
  }

  const newTask = await Task.create({
    title,
    description: description || "",
    owner: userId,
    taskListId: taskListId.toString(),
  });

  res.status(200);
  res.json({
    task: newTask,
  });
});

module.exports.deleteTask = expressAsyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const userId = req.userId;
  const existing = await Task.findOne({ _id: taskId, owner: userId }).exec();
  if (!existing) {
    res.status(404);
    res.json({ error: "Could not find task with id " + taskId });
    return;
  }
  await Task.deleteOne({ _id: taskId }).exec();
  res.status(200);
  res.json({ message: "Done" });
});
