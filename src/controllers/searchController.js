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
      const matchingProjects = await Project.find({
        user: userId,
        name: new RegExp(query, "i"),
      })
        .populate("tasks")
        .exec();

      const matchingProjectsWithFilteredTasks = matchingProjects.map(project => {
        const filteredTasks = project.tasks.filter(task => {
          return task.content.toLowerCase().includes(query.toLowerCase());
        });
        project.tasks = filteredTasks;
        return project;
      });

      const matchingTasks = await Task.find({
        userId,
        content: { $regex: new RegExp(query, "i") },
      });

      const projectIds = [...new Set(matchingTasks.map(task => task.projectId))];
      const projectsForMatchingTasks = await Project.find({
        user: userId,
        _id: { $in: projectIds },
      }).populate("tasks");

      const projectsForMatchingTasksWithFilteredTasks = projectsForMatchingTasks.map(project => {
        const filteredTasks = project.tasks.filter(task => {
          return task.content.toLowerCase().includes(query.toLowerCase());
        });
        project.tasks = filteredTasks;
        return project;
      });

      ctx.status = 200;
      ctx.body = {
        byProjectName: matchingProjectsWithFilteredTasks,
        byTaskContent: projectsForMatchingTasksWithFilteredTasks,
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
