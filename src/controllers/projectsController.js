const Project = require("../schemas/projectsScheme");
const Task = require("../schemas/tasksScheme");
const User = require("../schemas/usersScheme");

const createProject = async ctx => {
  const { user, name, tags } = ctx.request.body;

  const project = new Project({
    user,
    name,
    tags,
  });
  await project.save();

  await User.findByIdAndUpdate(user, { $push: { projects: project._id } });

  ctx.status = 201;
  ctx.body = project;
};

const getAllProjectsPaginated = async ctx => {
  if (ctx.isAuthenticated()) {
    const page = parseInt(ctx.request.params.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;
    // console.log(ctx.state.user);
    try {
      const projects = await Project.find({ user: ctx.state.user._id })
        .populate("tasks")
        .skip(skip)
        .limit(limit);
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
  } else {
    ctx.status = 401;
    ctx.body = { message: "Unauthorized" };
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

const updateProjectById = async ctx => {
  const { id } = ctx.params;
  const { name, tags } = ctx.request.body;
  const updatedProject = await Project.findByIdAndUpdate(id, { name, tags }, { new: true });
  if (updatedProject) {
    ctx.body = updatedProject;
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

const findAllProjectsByTag = async ctx => {
  const { tag } = ctx.params;
  try {
    const founds = await Project.find({ tags: tag });

    if (!founds.length) {
      ctx.status = 404;
      ctx.body = { error: "No matching projects were found" };
      return;
    }

    ctx.status = 200;
    ctx.body = founds;
  } catch (err) {
    ctx.status = 500;
    ctx.body = { error: "Internal Server Error" };
  }
};

const getAllUniqueTags = async ctx => {
  try {
    const allTags = await Project.aggregate([
      { $unwind: "$tags" },
      { $group: { _id: null, uniqueTags: { $addToSet: "$tags" } } },
      { $project: { _id: 0, uniqueTags: 1 } },
    ]);

    if (!allTags.length) {
      ctx.status = 404;
      ctx.body = { error: "No tags found" };
      return;
    }

    ctx.status = 200;
    ctx.body = allTags[0].uniqueTags;
  } catch (err) {
    ctx.status = 500;
    ctx.body = { error: "Internal Server Error" };
  }
};

module.exports = {
  createProject,
  getAllProjectsPaginated,
  updateProjectById,
  deleteProjectById,
  findAllProjectsByTag,
  getAllUniqueTags,
};
