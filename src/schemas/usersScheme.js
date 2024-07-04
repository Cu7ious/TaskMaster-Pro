const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  githubId: String,
  username: String,
  displayName: String,
  profileUrl: String,
  profilePic: String,
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
});

module.exports = mongoose.model("User", userSchema);
