const Router = require("koa-router");
const projectsController = require("../controllers/projectsController");

const router = new Router();

router.post("/projects", projectsController.createProject);
router.get("/projects", projectsController.getAllProjects);
router.get("/projects/page/:page", projectsController.getAllProjectsPaginated);
// router.put("/projects/update-all", projectsController.markAllTasksAsDone);
// // DELETE multiple projects by ids
// // Due to delete's limitations of the frontend lib
// // PUT is used for bulk deletion
// router.put("/projects/delete-all", projectsController.deleteAllResolvedTasks);
// router.put("/projects/:id", projectsController.updateTask);
router.delete("/projects/:id", projectsController.deleteProjectById);

module.exports = router;
