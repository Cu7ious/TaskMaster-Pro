const mongoose = require("mongoose");
const { Schema } = mongoose;

const tasksSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    resolved: { type: Boolean, default: false },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", tasksSchema);

module.exports = Task;
