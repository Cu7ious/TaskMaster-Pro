const Project = require("../schemas/projectsScheme");
const Task = require("../schemas/tasksScheme");
const User = require("../schemas/usersScheme");

const createProject = async ctx => {
  if (ctx.isAuthenticated()) {
    const user = ctx.state.user._id;
    const { name, tags } = ctx.request.body;

    const project = new Project({
      user,
      name,
      tags,
    });
    await project.save();
    await User.findByIdAndUpdate(user, { $push: { projects: project._id } });

    ctx.status = 201;
    ctx.body = project;
  } else {
    ctx.status = 401;
    ctx.body = { message: "Unauthorized" };
  }
};

const getAllProjectsPaginated = async ctx => {
  if (ctx.isAuthenticated()) {
    const page = parseInt(ctx.request.params.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;
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

const updateProjectById = async ctx => {
  if (ctx.isAuthenticated()) {
    const { id } = ctx.params;
    const { name, tags } = ctx.request.body;

    const updatedProject = await Project.findByIdAndUpdate(id, { name, tags }, { new: true });

    if (updatedProject) {
      ctx.body = updatedProject;
    } else {
      ctx.status = 404;
      ctx.body = { message: "Project not found" };
    }
  } else {
    ctx.status = 401;
    ctx.body = { message: "Unauthorized" };
  }
};

const deleteProjectById = async ctx => {
  if (ctx.isAuthenticated()) {
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

    const user = await User.findByIdAndUpdate(
      ctx.state.user._id,
      { $pull: { projects: id } },
      { new: true }
    );

    if (!user) {
      ctx.status = 500;
      ctx.body = { error: "User not found" };
      return;
    }

    ctx.status = 200;
    ctx.body = { message: "Project and related tasks deleted" };
  } else {
    ctx.status = 401;
    ctx.body = { message: "Unauthorized" };
  }
};

const findAllProjectsByTag = async ctx => {
  if (ctx.isAuthenticated()) {
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
  } else {
    ctx.status = 401;
    ctx.body = { message: "Unauthorized" };
  }
};

const getAllUniqueTags = async ctx => {
  if (ctx.isAuthenticated()) {
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
  } else {
    ctx.status = 401;
    ctx.body = { message: "Unauthorized" };
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
