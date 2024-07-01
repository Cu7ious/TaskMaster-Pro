const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  githubId: String,
  username: String,
  displayName: String,
  profileUrl: String,
  profilePic: String,
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
});

module.exports = mongoose.model("User", userSchema);
