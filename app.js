require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const auth = require('./server/routes/auth');
const index = require('./server/routes/index');
const dashboard = require('./server/routes/dashboard');
const db = require('./server/config/db');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
    // cookie: { maxAge: new Date(Date.now() + 3600000)}
}));
app.use(methodOverride('_method'));
app.use(passport.initialize());
app.use(passport.session());

// Static Files
app.use(express.static('public'));

// Templating Engines
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.use('/', auth);
app.use('/', index);
app.use('/', dashboard);

app.get('*', (req, res) => {
    res.status(404).render('404');
})

db();
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`App listening on port ${port}`));