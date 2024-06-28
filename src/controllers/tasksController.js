const Task = require("../models/tasksScheme");

// Create a new to-do
const createTask = async ctx => {
  const { projectId, content } = ctx.request.body;
  const task = new Task({
    projectId,
    content,
  });
  await task.save();
  ctx.status = 201;
  ctx.body = task;
};

// Get all to-dos
const getAllTasks = async ctx => {
  const tasks = await Task.find();
  // ctx.body = [tasks[0]];
  ctx.body = tasks;
};

const getAllTasksByProject = async ctx => {
  const { id } = ctx.params;
  const tasks = await Task.find({ projectId: id });
  // ctx.body = [tasks[0]];
  ctx.body = tasks;
};

// Bulk update (Mark all as done)
const markAllTasksAsDone = async ctx => {
  const { ids, update } = ctx.request.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    ctx.status = 400;
    ctx.body = { error: "Invalid IDs array" };
    return;
  }

  try {
    const result = await Task.updateMany(
      { _id: { $in: ids } }, // Filter to match documents with the given IDs
      { $set: update } // Update operation
    );

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
};

const deleteAllResolvedTasks = async ctx => {
  const { ids } = ctx.request.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    ctx.status = 400;
    ctx.body = { error: "Invalid IDs array" };
    return;
  }

  try {
    const result = await Task.deleteMany(
      { _id: { $in: ids } } // Filter to match documents with the given IDs
    );

    if (result.deletedCount === 0) {
      ctx.status = 404;
      ctx.body = { error: "No tasks found to delete" };
    } else {
      ctx.status = 200;
      ctx.body = { message: "Tasks deleted successfully", result };
    }
  } catch (err) {
    ctx.status = 500;
    ctx.body = { error: "Internal Server Error" };
  }
};

// const deleteManyTasksByProject = async ctx => {
//   const { ids } = ctx.request.params;
//   console.log("ids:", ids);

//   if (!Array.isArray(ids) || ids.length === 0) {
//     ctx.status = 400;
//     ctx.body = { error: "Invalid IDs array" };
//     return;
//   }

//   try {
//     const result = await Task.deleteMany(
//       { _id: { $in: ids } } // Filter to match documents with the given IDs
//     );

//     if (result.deletedCount === 0) {
//       ctx.status = 404;
//       ctx.body = { error: "No tasks found to delete" };
//     } else {
//       ctx.status = 200;
//       ctx.body = { message: "Tasks deleted successfully", result };
//     }
//   } catch (err) {
//     ctx.status = 500;
//     ctx.body = { error: "Internal Server Error" };
//   }
// };

const updateTask = async ctx => {
  const { id } = ctx.params;
  const updatedTask = await Task.findByIdAndUpdate(id, ctx.request.body, { new: true });
  if (updatedTask) {
    ctx.body = updatedTask;
  } else {
    ctx.status = 404;
    ctx.body = { message: "To-do not found" };
  }
};

const deleteTask = async ctx => {
  const { id } = ctx.params;
  const result = await Task.findByIdAndDelete(id);
  if (result) {
    ctx.status = 204;
  } else {
    ctx.status = 404;
    ctx.body = { message: "Task not found" };
  }
};

module.exports = {
  createTask,
  getAllTasksByProject,
  getAllTasks,
  markAllTasksAsDone,
  deleteAllResolvedTasks,
  // deleteManyTasksByProject,
  updateTask,
  deleteTask,
};
