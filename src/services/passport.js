const passport = require("koa-passport");
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../schemas/usersScheme");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await User.findOne({ githubId: profile.id });
        if (!user) {
          user = await new User({
            githubId: profile.id,
            username: profile.username,
            displayName: profile.displayName,
            profileUrl: profile.profileUrl,
            profilePic: profile.photos[0].value,
          }).save();
        } else {
          // Update profile picture if it changes
          user.profilePic = profile.photos[0].value;
          await user.save();
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);
