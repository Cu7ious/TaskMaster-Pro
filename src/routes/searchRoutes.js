// src/routes/searchRoutes.js

const Router = require("koa-router");
const searchController = require("../controllers/searchController");

const router = new Router({ prefix: "/api/v1" });

router.get("/search", searchController.search);

module.exports = router;
