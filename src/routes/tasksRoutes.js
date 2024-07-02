const Router = require("koa-router");
const tasksController = require("../controllers/tasksController");

const router = new Router({ prefix: "/api/v1" });

router.post("/tasks", tasksController.createTask);
router.get("/tasks", tasksController.getAllTasks);
router.get("/tasks/:id", tasksController.getAllTasksByProject);
router.put("/tasks/update-all", tasksController.markAllTasksAsDone);

// DELETE multiple todos by ids
// Due to delete's limitations of the frontend lib
// PUT is used for bulk deletion
router.put("/tasks/delete-all", tasksController.deleteAllResolvedTasks);
router.put("/tasks/:id", tasksController.updateTask);
router.delete("/tasks/:id", tasksController.deleteTask);

module.exports = router;
