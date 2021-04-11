const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');





mongoose.connect(config.database);
let db = mongoose.connection;

//Check connection
db.once('open',function(){
  console.log('Connected to MongoDB');
});

//Check for DB Errors:
db.on('error',function(err){
  console.log(err);
});

//Init App
const app = express();



//Load View Engine
app.set('views',path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Body parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));


// Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next){
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Home Route
//Pass values to the templates or views
app.get('/',function(req, res){
  Article.find({},function(err, articles){
    if(err){
      console.log(err);
    } else {
      res.render('index5',{
        title:'Articles',
        articles: articles
    });
  }
  });
});


// Passport Config
require('./config/passport')(passport);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());


app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

// Route Files
let articles = require('./routes/articles');
let users = require('./routes/users');
app.use('/articles', articles);
app.use('/users', users);


//Start Server
app.listen(3000, function(){
  console.log('Server Started on port 3000...')
});
