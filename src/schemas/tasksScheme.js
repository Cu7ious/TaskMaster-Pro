const mongoose = require("mongoose");
const { Schema } = mongoose;

const tasksSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    resolved: { type: Boolean, default: false },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", tasksSchema);

module.exports = Task;
