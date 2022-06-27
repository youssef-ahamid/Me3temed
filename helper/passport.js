import passport from "passport";
import FacebookStrategy from "passport-facebook";
const GoogleStrategy = oauth20.Strategy;
import oauth20 from "passport-google-oauth20";

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { email: user.email, name: user.name });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

passport.use(
  new FacebookStrategy(
    {
      clientID: "712205233331846",
      clientSecret: "ef507a0ed7c9e9f245efa99679ab4adb",
      callbackURL: "http://localhost:8000/login/facebook-callback/",
      profileFields: ["id", "emails", "displayName", "photos"],
    },
    function (accessToken, refreshToken, profile, cb = () => {}) {
      const { email, name, id, picture } = profile._json;

      const facebookUser = {
        email,
        name,
        isEmailVerified: true,
        img: picture.data.url,
        data: { id },
        refreshToken,
      };
      return cb(null, { facebookUser, accessToken });
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "1086286750475-gqq1jk1jdepfkjbhronp81omr04g0cq0.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:8000/login/google-callback/",
    },
    function (accessToken, refreshToken, profile, cb) {
      const { name, emails, displayName, photos } = profile;
      const googleUser = {
        email: emails[0].value,
        isEmailVerified: emails[0].verified,
        name: displayName,
        img: photos[0].value,
        data: { names: name },
        refreshToken,
      };
      return cb(null, { googleUser, accessToken });
    }
  )
);


export default passport;