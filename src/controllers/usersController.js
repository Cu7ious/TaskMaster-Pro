exports.getProfile = ctx => {
  if (ctx.isAuthenticated()) {
    ctx.status = 200;
    ctx.body = ctx.state.user;
  } else {
    ctx.status = 401;
    ctx.body = { message: "Unauthorized" };
  }
};
