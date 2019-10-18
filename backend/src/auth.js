// npm imports
const passport = require('passport');
const GoogleTokenStrategy = require('passport-google-token').Strategy;

// Local imports
const UserCreds = require('./models/userCreds');
const UserData = require('./models/userData');

/**
 * Initializes passport and authentication-related endpoints for the entire express application.
 */
function initAuth(app) {
  // Middleware to use passport
  app.use(passport.initialize());
  app.use(passport.session());

  // For saving user creds in cookie
  passport.serializeUser(({ id }, done) => done(null, id));

  // For retrieving user creds object from cookie
  passport.deserializeUser((id, done) => UserData.findById(id, done));

  // Google Auth config via passport
  passport.use(
    new GoogleTokenStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
      },
      (accessToken, refreshToken, profile, done) => {
        UserCreds.findOrCreate(
          accessToken,
          refreshToken,
          profile,
          (err, userCred) => {
            if (err) return done(err, null);
            UserData.findById(userCred.userDataId, (err2, user) => {
              return done(err2, user);
            });
          }
        );
      }
    )
  );

  app.post(
    '/auth/google',
    passport.authenticate('google-token', { session: true }),
    (req, res) => {
      if (!req.user) {
        return res.status(401).json({
          error: 'User Not Authenticated'
        });
      }
      return res.status(200).send(JSON.stringify(req.user));
    }
  );

  // Logout Route
  app.get('/auth/logout', (req, res, next) => {
    req.logout();
    req.session.destroy(err => {
      if (err) {
        return next(err);
      }
      // Clears session
      res.clearCookie('connect.sid', { path: '/' });
      return res.sendStatus(200);
    });
  });
}

module.exports = {
  initAuth,
  /**
   * Express middleware to check if current user is authenticated.
   */
  isAuthenticated: (req, res, next) => {
    if (process.env.NODE_ENV === 'development') {
      return next();
    }
    // return next();
    return req.user
      ? next()
      : res.status(401).json({
          error: 'User not authenticated (must sign in)'
        });
  }
};
