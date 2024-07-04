const Task = require("../schemas/tasksScheme");
const Project = require("../schemas/projectsScheme");

const createTask = async ctx => {
  if (ctx.isAuthenticated()) {
    const { projectId, content } = ctx.request.body;
    const { _id: userId } = ctx.state.user;

    const task = new Task({
      userId,
      projectId,
      content,
    });
    await task.save();

    await Project.findByIdAndUpdate(projectId, { $push: { tasks: task._id } });

    ctx.status = 201;
    ctx.body = task;
  } else {
    ctx.status = 401;
    ctx.body = { message: "Unauthorized" };
  }
};

const getAllTasksByProject = async ctx => {
  if (ctx.isAuthenticated()) {
    const { id } = ctx.params;
    const tasks = await Task.find({ projectId: id });
    ctx.body = tasks;
  } else {
    ctx.status = 401;
    ctx.body = { message: "Unauthorized" };
  }
};

// Bulk update (Mark all as done)
const markAllTasksAsDone = async ctx => {
  if (ctx.isAuthenticated()) {
    const { ids, update } = ctx.request.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      ctx.status = 400;
      ctx.body = { error: "Invalid IDs array" };
      return;
    }

    try {
      const result = await Task.updateMany({ _id: { $in: ids } }, { $set: update });

      if (result.nModified === 0) {
        ctx.status = 404;
        ctx.body = { error: "No tasks found to update" };
      } else {
        ctx.status = 200;
        ctx.body = { message: "Tasks updated successfully", result };
      }
    } catch (err) {
      ctx.status = 500;
      ctx.body = { error: "Internal Server Error" };
    }
  } else {
    ctx.status = 401;
    ctx.body = { message: "Unauthorized" };
  }
};

const deleteAllResolvedTasks = async ctx => {
  if (ctx.isAuthenticated()) {
    const { projectId, ids } = ctx.request.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      ctx.status = 400;
      ctx.body = { error: "Invalid IDs array" };
      return;
    }

    try {
      const result = await Task.deleteMany({ _id: { $in: ids } });

      const project = await Project.findByIdAndUpdate(
        projectId,
        { $pull: { tasks: ids } },
        { new: true }
      );

      if (result.deletedCount === 0) {
        ctx.status = 404;
        ctx.body = { error: "No tasks found to delete" };
      } else if (!project) {
        ctx.status = 500;
        ctx.body = { error: "Project associated with tasks not found" };
        return;
      } else {
        ctx.status = 200;
        ctx.body = { message: "Tasks deleted successfully", result };
      }
    } catch (err) {
      ctx.status = 500;
      ctx.body = { error: "Internal Server Error" };
    }
  } else {
    ctx.status = 401;
    ctx.body = { message: "Unauthorized" };
  }
};

const updateTask = async ctx => {
  if (ctx.isAuthenticated()) {
    const { id } = ctx.params;
    const updatedTask = await Task.findByIdAndUpdate(id, ctx.request.body, { new: true });
    if (updatedTask) {
      ctx.body = updatedTask;
    } else {
      ctx.status = 404;
      ctx.body = { message: "tasks not found" };
    }
  } else {
    ctx.status = 401;
    ctx.body = { message: "Unauthorized" };
  }
};

const deleteTask = async ctx => {
  if (ctx.isAuthenticated()) {
    const { projectId, taskId } = ctx.params;

    try {
      const result = await Task.findByIdAndDelete(taskId);
      const project = await Project.findByIdAndUpdate(
        projectId,
        { $pull: { tasks: taskId } },
        { new: true }
      );

      if (!result) {
        ctx.status = 404;
        ctx.body = { message: "Task not found" };
      } else if (!project) {
        ctx.status = 500;
        ctx.body = { error: "Project not found" };
        return;
      }
      ctx.status = 200;
      ctx.body = { message: "Tasks deleted successfully", result };
    } catch (err) {
      ctx.status = 500;
      ctx.body = { error: "Internal Server Error" };
    }
  } else {
    ctx.status = 401;
    ctx.body = { message: "Unauthorized" };
  }
};

module.exports = {
  createTask,
  getAllTasksByProject,
  markAllTasksAsDone,
  deleteAllResolvedTasks,
  updateTask,
  deleteTask,
};
