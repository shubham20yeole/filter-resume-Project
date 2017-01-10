var express = require('express');
var port = process.env.PORT || 3000
var bodyParser = require('body-parser');
var path = require('path');
var ejs = require('ejs');
var mongojs = require('mongojs')
var mongodb = require('mongodb')
var collections = ["users", "blog", "comments", "property", "images", "notification", "bookmark", "messages","timetable", "timetablecategory", "timetablequestion", "resume", "skills"]

var db = mongojs('mongodb://shubham20.yeole:shubham20.yeole@ds163387.mlab.com:63387/paceteam3', collections)
var JSFtp = require("jsftp");


 var fs = require('fs');
      var config = {
        host: 'ftp.byethost8.com',
        port: 21,
        user: 'b8_19205430',
        password: 'Shubham4194'
      }
// var db = mongojs('mongodb://***********@**********.com:****/****', collections)
// var JSFtp = require("jsftp");


//  var fs = require('fs');
//       var config = {
//         host: '****',
//         port: 21,
//         user: '****',
//         password: '****'
//       }
var app = express();
var passport = require("passport")
app.listen(port, function() {
  console.log('SHUBHAM PROJECT RUNNING ON: http://localhost:' + port)
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// body parser middleware
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb',extended: false}));
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname)));

var fs = require('fs');



var multiparty = require('connect-multiparty'),
  multipartyMiddleware = multiparty();
  app.use(multipartyMiddleware);
    app.use(function(req, res, next){
      console.log( req.path + "token:" + req.query.access_token)
      fs.appendFile('logs.txt', req.path + "token:" + req.query.access_token+'', 
        function(err){
          next(); 
        });
  });

app.get('/', function(req, res){       
  db.resume.find(function (err, resume) {
    res.render("index.ejs", {message:"", resumecount: resume.length});
  })
});

app.post('/getmatch', function(req, res){   
  var skills = req.body.skills;
  db.resume.find(function (err, resumeContent) {
    res.send(resumeContent);    
  })
});

app.post('/upload', function(req, res){       
  var file = req.files.file;
  var filepath = file.path;
  var fullname = req.body.fullname;
  var email = req.body.email;
  var timestamp = new Date().valueOf();
  var Client = require('ftp');
  var date = new Date();
  var datetime = (date.getMonth()+1)+" / "+date.getDate()+" / "+date.getFullYear()+" at "+date.getHours()+":"+date.getMinutes();
  var PDFParser = require("pdf2json");
  var pdfParser = new PDFParser(this,1);
  pdfParser.loadPDF(file.path);         

  pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
  pdfParser.on("pdfParser_dataReady", pdfData => {
  var resumeContent = pdfParser.getRawTextContent();
      var c = new Client();
      c.on('ready', function() {
        c.put(file.path, 'htdocs/resume/shubham-resume-selector-project-'+timestamp+"-"+file.originalFilename, function(err) {
          if (err) throw err;
          c.end();
        });
      });
      c.connect(config);
      var resumeurl = 'http://shubhamyeole.byethost8.com/resume/shubham-resume-selector-project-'+timestamp+"-"+file.originalFilename;
      var newResume = {
        fullname: fullname,
        email: email,
        filename: file.originalFilename,
        resume: resumeurl,
        timestamp: timestamp,
        datetime: datetime,
        resumetext: resumeContent
      }
      db.resume.insert(newResume, function(err, result){
        if(err){console.log(err);}
         db.resume.find(function (err, resume) {
            res.render("index.ejs", {message:"Thank you for submitting your Resume. We will review your application and contact you shortly.", resumecount: resume.length});
          })        
        });
      });   
});

app.post('/upload2', function(req, res){       
  var file = req.files.file;
  var filepath = file.path;
  var timestamp = new Date().valueOf();
  var Client = require('ftp'); 
  var c = new Client();
    c.on('ready', function() {
      c.put(file.path, 'htdocs/public_html/career/'+file.originalFilename, function(err) {
        if (err) throw err;
         c.end();
        });
   });
   c.connect(config);
   res.redirect("/");     
});