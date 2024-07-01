const Router = require("koa-router");
const projectsController = require("../controllers/projectsController");

const router = new Router({ prefix: "/api/v1" });

router.post("/projects", projectsController.createProject);
router.put("/projects/:id", projectsController.updateProjectById);
router.get("/projects/tags", projectsController.getAllUniqueTags);
router.get("/projects/tags/:tag", projectsController.findAllProjectsByTag);
router.get("/projects/page/:page", projectsController.getAllProjectsPaginated);
router.delete("/projects/:id", projectsController.deleteProjectById);

module.exports = router;
