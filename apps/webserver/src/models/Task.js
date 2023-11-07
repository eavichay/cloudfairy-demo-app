const { default: mongoose } = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  isComplete: {
    type: Boolean,
    default: false,
  },
  taskListId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TaskList",
    index: true,
    required: true,
  },
  owner: {
    required: true,
    index: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

taskSchema.methods.markAsComplete = async function () {
  this.isComplete = true;
  return this.save();
};

taskSchema.methods.changeTitle = async function (newTitle) {
  this.title = newTitle;
  return await this.save();
};

taskSchema.methods.changeDescription = async function (newDescription) {
  this.description = newDescription;
  return await this.save();
};

module.exports.Task = mongoose.model("Task", taskSchema);
