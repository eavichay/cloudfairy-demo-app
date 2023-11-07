const { default: mongoose } = require("mongoose");
const { Task } = require("./Task");

const taskListSchema = new mongoose.Schema({
  title: {
    type: String,
    index: true,
    required: true,
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
});

taskListSchema.methods.toResponseObject = async function () {
  const allTaks = await Task.find({ taskListId: this._id }).exec();
  return {
    id: this._id,
    title: this.title,
    tasks: allTaks,
  };
};

module.exports.TaskList = mongoose.model("TaskList", taskListSchema);
