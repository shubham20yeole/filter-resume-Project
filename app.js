var express = require('express');
var SparkPost = require('sparkpost');
var sp = new SparkPost('9bf6b6d7079252cab943971ff90c08cc3a9cee0d');
var port = process.env.PORT || 3000
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs')
var mongodb = require('mongodb')
// var db = mongojs('mongodb://ds143717.mlab.com:43717/shubham', ['users']);
var collections = ["users", "blog", "comments", "property", "images", "notification", "bookmark", "messages","timetable", "timetablecategory", "timetablequestion", "resume", "skills"]

var db = mongojs('mongodb://shubham20.yeole:shubham20.yeole@ds163387.mlab.com:63387/paceteam3', collections)

var app = express();
var ObjectId = mongojs.ObjectId;
var passport = require("passport")
var blog=db.collection('blog');
var session = require('client-sessions');

/*var logger = function(req, res, next){
	console.log("Logging...");
	next();
} 
mongodb://ds143717.mlab.com:43717/shubham
var db = mongojs('//mongodb://shubham20.yeole:shubham20.yeole@ds143717.mlab.com:43717/shubham', ['users'])
app.use(logger);*/

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// set static path

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname)));
app.use(session({
  cookieName: 'session',
  secret: 'random_string_goes_here',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));
//Global vars
app.use(function(req, res, next){
	res.locals.errors = null;
	next();
})

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));
 var errmsg = "Computer Science Project";
app.get('/', function(req, res){       
  db.resume.find(function (err, resume) {
    res.render("index.ejs", {message:"", resumecount: resume.length});
  });
});

app.post('/getmatch', function(req, res){   
  var skills = req.body.skills;
  db.resume.find(function (err, resumeContent) {
    res.send(resumeContent);    
  });
});
app.listen(port, function() {
  console.log('Listening on port ' + port)
})