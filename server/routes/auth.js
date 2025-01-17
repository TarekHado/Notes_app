const express = require('express');
const router = express.Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    async function(accessToken, refreshToken, profile, done) {
        const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            profileImage: profile.photos[0].value
        }

        try {
            let user = await User.findOne({ googleId: profile.id });
            if (user) {
                done(null, user)
            } else {
                user = await User.create(newUser);
                done(null, user)
            }
        } catch (error) {
            console.log(error.message);
        }
    }
));

// GoogleLogin Route
router.get('/auth/google',
    passport.authenticate('google', { scope: ['email', 'profile'] }));

// Retrieve User Data 
router.get('/google/callback', 
    passport.authenticate('google', {
        failureRedirect: '/login-failure',
        successRedirect: '/dashboard'
    })
);

// Route if login failed
router.get('/login-failure', (req, res) => {
    res.send('Something went wrong...')
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
            res.send('Error logginig out');
        } else {
            res.redirect('/');
        }
    })
})

// Presist user data after successfull authentication
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

// Retrieve user data from session
passport.deserializeUser( function (id, done) {

    try {
        const user = User.findById(id);
        done(null, user);
    } catch (error) {
        console.log(error.message);
    }
});

module.exports = router;