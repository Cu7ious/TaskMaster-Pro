const Router = require("koa-router");
const tasksController = require("../controllers/tasksController");

const router = new Router({ prefix: "/api/v1" });

router.post("/tasks", tasksController.createTask);
router.put("/tasks/update-all", tasksController.markAllTasksAsDone);
router.delete("/tasks/delete-all", tasksController.deleteAllResolvedTasks);
router.get("/tasks/:id", tasksController.getAllTasksByProject);
router.put("/tasks/:id", tasksController.updateTask);
router.delete("/tasks/:projectId/:taskId", tasksController.deleteTask);

module.exports = router;
