const Router = require("koa-router");
const passport = require("koa-passport");
const usersController = require("../controllers/usersController");

const prefix = "/api/v1";
const router = new Router({ prefix });

const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";

router.get("/user/profile", usersController.getProfile);
router.get("/user/login", passport.authenticate("github", { scope: ["user:email"] }));
router.get(
  "/user/auth/github/callback",
  passport.authenticate("github", {
    successRedirect: frontendURL,
    failureRedirect: frontendURL,
  })
);
router.get("/user/logout", ctx => {
  ctx.status = 200;
  ctx.logout();
});

module.exports = router;
