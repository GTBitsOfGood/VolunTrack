const path = require('path');
const morgan = require('morgan');
const express = require('express');
const addRequestId = require('express-request-id')();
const mongoose = require('mongoose');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo')(session);

// const auth = require('./auth');
// const api = require('./routes');
const app = express();

// Connect to MongoDB
mongoose.connect(
  process.env.MONGODB_URI,
  { useNewUrlParser: true, useCreateIndex: true },
  err => {
    if (err) throw err;
    console.log('Conected to MongoDB');
  }
);
mongoose.Promise = global.Promise;

// Setup morgan logging
morgan.token('id', req => req.id);
const logger = morgan(
  process.env.NODE_ENV === 'production'
    ? ':id - :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]'
    : 'dev'
);

app.use(addRequestId);
app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SECRET,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    resave: true,
    saveUninitialized: false
  })
);

// Initialize passport authentication on the entire app
// auth.initAuth(app);

// Route API Calls to separate router
// app.use('/api', api);

// Render React page
// app.use(express.static(path.join(__dirname, '../../frontend/build/')));
// app.get('/*', (req, res) => {
//   return res.sendFile(path.join(__dirname, '../../frontend/build/index.html'));
// });

module.exports = app;
