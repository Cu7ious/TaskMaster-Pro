require("dotenv").config();
const Koa = require("koa");
const { koaBody } = require("koa-body");
const cors = require("@koa/cors");
const mongoose = require("mongoose");
const session = require("koa-session");

const passport = require("koa-passport");
require("./services/passport");

const usersRoutes = require("./routes/usersRoutes");
const tasksRoutes = require("./routes/tasksRoutes");
const projectsRoutes = require("./routes/projectsRoutes");
const searchRoutes = require("./routes/searchRoutes");

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

app.use(async (ctx, next) => {
  const { method, path } = ctx.request;
  console.log(`New request to: ${method} ${path} at ${new Date().toISOString()}`);
  await next();
});

app.keys = [process.env.SESSION_SECRET];
app.use(session({}, app));

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(koaBody());

app.use(passport.initialize());
app.use(passport.session());

app.use(usersRoutes.routes()).use(usersRoutes.allowedMethods());

app.use(tasksRoutes.routes()); // Use todo routes
app.use(tasksRoutes.allowedMethods()); // Handle HTTP method OPTIONS for todo routes

app.use(projectsRoutes.routes()); // Use todo routes
app.use(projectsRoutes.allowedMethods()); // Handle HTTP method OPTIONS for todo routes

app.use(searchRoutes.routes()); // Use todo routes
app.use(searchRoutes.allowedMethods()); // Handle HTTP method OPTIONS for todo routes

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
