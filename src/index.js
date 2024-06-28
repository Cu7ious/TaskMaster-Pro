const Koa = require("koa");
const { koaBody } = require("koa-body");
const cors = require("@koa/cors");
const mongoose = require("mongoose");

const tasksRoutes = require("./routes/tasksRoutes");
const projectsRoutes = require("./routes/projectsRoutes");

const app = new Koa();
const PORT = process.env.PORT;
const DB_URI = process.env.MONGO_URL;

mongoose
  .connect(DB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(err => {
    console.error("Error connecting to MongoDB:", err);
  });

app.use(cors());
app.use(koaBody());

app.use(tasksRoutes.routes()); // Use todo routes
app.use(tasksRoutes.allowedMethods()); // Handle HTTP method OPTIONS for todo routes

app.use(projectsRoutes.routes()); // Use todo routes
app.use(projectsRoutes.allowedMethods()); // Handle HTTP method OPTIONS for todo routes

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
