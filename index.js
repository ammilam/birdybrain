// index.js

/*  EXPRESS */

const express = require('express');
const app = express();
const session = require('express-session');

app.set('view engine', 'ejs');

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET' 
}));

app.get('/', function(req, res) {
  res.render('pages/auth');
});



const port = process.env.PORT || 8080;
app.listen(port , () => console.log('App listening on port ' + port));

/*  PASSPORT SETUP  */

const passport = require('passport');
var birbs;

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

app.get('/birbs', (req, res) => res.send(birbs));
app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

/*  Google AUTH  */
 
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = '792680317269-4v325ru18egt9h8c6vh83al7mvrti0ao.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = 'Pa-Ozx7SMrlKNdECJtClfKmO';
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "https://auth-m5frx3rr6q-uc.a.run.app/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      birbs=profile;
      return done(null, birbs);
  }
));
 
app.get('/auth/google', 
  passport.authenticate('google', { scope : ['profile', 'email'] }));
 
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    // Successful authentication, redirect success.
    res.render('pages/birbs');
  });