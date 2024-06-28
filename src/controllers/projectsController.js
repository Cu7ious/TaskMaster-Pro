const Project = require("../models/projectsScheme");
const Task = require("../models/tasksScheme");

// Create a new to-do
const createProject = async ctx => {
  const { name, tags } = ctx.request.body;
  const project = new Project({
    name,
    tags,
  });
  await project.save();
  ctx.status = 201;
  ctx.body = project;
};

// Get all to-dos
const getAllProjects = async ctx => {
  // const projects = await Project.find();
  const projects = await Project.find().populate("tasks");
  // ctx.body = [projects[0]];
  ctx.body = projects;
};

const getAllProjectsPaginated = async ctx => {
  const page = parseInt(ctx.request.params.page) || 1; // Current page number, default to 1
  const limit = 5;
  const skip = (page - 1) * limit;
  // console.log(page);
  try {
    const projects = await Project.find().skip(skip).limit(limit);
    const totalProjects = await Project.countDocuments();

    ctx.status = 200;
    ctx.body = {
      projects,
      currentPage: page,
      totalPages: Math.ceil(totalProjects / limit),
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: error.message };
  }
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
    const result = await Project.updateMany(
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
    const result = await Project.deleteMany(
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

const updateTask = async ctx => {
  const { id } = ctx.params;
  const updatedTask = await Project.findByIdAndUpdate(id, ctx.request.body, { new: true });
  if (updatedTask) {
    ctx.body = updatedTask;
  } else {
    ctx.status = 404;
    ctx.body = { message: "Project not found" };
  }
};

const deleteProjectById = async ctx => {
  const { id } = ctx.params;

  if (!(await Project.findByIdAndDelete(id))) {
    ctx.status = 404;
    ctx.body = { error: "Project not found" };
    return;
  }

  if (!(await Task.deleteMany({ projectId: id }))) {
    ctx.status = 500;
    ctx.body = { error: "Server may have failed to delete some tasks related to this project" };
    return;
  }

  ctx.status = 200;
  ctx.body = { message: "Project and related tasks deleted" };
};

module.exports = {
  createProject,
  getAllProjects,
  getAllProjectsPaginated,
  // markAllTasksAsDone,
  // deleteAllResolvedTasks,
  // updateTask,
  deleteProjectById,
};
