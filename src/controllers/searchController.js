const Project = require("../schemas/projectsScheme");
const Task = require("../schemas/tasksScheme");

exports.search = async ctx => {
  if (ctx.isAuthenticated()) {
    const { query } = ctx.request.query;
    const userId = ctx.state.user._id;

    if (!query) {
      ctx.status = 400;
      ctx.body = { error: "Query parameter is required" };
      return;
    }

    try {
      const projectResults = await Project.find({
        user: userId,
        $or: [{ name: new RegExp(query, "i") }, { tags: new RegExp(query, "i") }],
      }).exec();

      const taskResults = await Task.find({
        userId: userId,
        content: new RegExp(query, "i"),
      }).exec();

      ctx.body = {
        projects: projectResults,
        tasks: taskResults,
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: "An error occurred during the search" };
    }
  } else {
    ctx.status = 401;
    ctx.body = { message: "Unauthorized" };
  }
};
