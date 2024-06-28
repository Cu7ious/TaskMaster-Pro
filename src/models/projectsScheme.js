const mongoose = require("mongoose");
const { Schema } = mongoose;

const projectsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectsSchema);

module.exports = Project;
