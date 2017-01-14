**Welcome to SHUBHAM RESUME FILTER project.**

****Project URL: http://resumeselector.herokuapp.com/****

1. create a folder for your app.
2. open node cmd and go to that folder.
3. run command 'npm init'
4. add discription
5. edit entry point as app.js
6. author name
7. open package.json file and add dependencies as
"dependencies":{
  "express":"*",
  "body-parser":"*"
  },
8. create app.js file
9. write console.log("Hello world");
10. run app as node app.js and test it for further implementation

**11. Further define framework and other vital variables.**
>>
```nodejs
var express = require('express');
var SparkPost = require('sparkpost');
var sp = new SparkPost('#####################################');
var port = process.env.PORT || 3000
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs')
var mongodb = require('mongodb')
```

**12 Database connection and client session variables**
>>
```nodejs
var collections = ["users", "blog", "comments", "property", "images", "notification", "bookmark", "messages","timetable", "timetablecategory", "timetablequestion", "resume", "skills"]
var db = mongojs('mongodb://***********.***********:***********.***********@***********.mlab.com:***********/***********', collections)
var app = express();
var ObjectId = mongojs.ObjectId;
var passport = require("passport")
var blog=db.collection('blog');
var session = require('client-sessions');
```

**13 Set view engine and define folders where images, css and javascript files are stored.**
>> Increase the form post method capacity as per your requirement. I increased to 50MB
```nodejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname)));
// body parser middleware
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb',extended: false}));
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname)));
```

**14. Define FTP CONNECTION**
>>
```nodejs
var JSFtp = require("jsftp");
var fs = require('fs');
var config = {
  host: 'ftp.***********.com',
  port: 21,
  user: '***********',
  password: '***********'
}
```

**15. Utilize Multiparty for accessing images from the frontendc**
>>
```nodejs
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
```

**16. Write upload method to store resume on server using ftp**
>>
```nodejs
app.post('/upload', function(req, res){       
  var file = req.files.file;
  var filepath = file.path;
  var fullname = req.body.fullname;
  var email = req.body.email;
  var timestamp = new Date().valueOf();
  var Client = require('ftp');
  var date = new Date();
  var datetime = (date.getMonth()+1)+" / "+date.getDate()+" / "+date.getFullYear()+" at "+date.getHours()+":"+date.getMinutes();
  let PDFParser = require("pdf2json");
  let pdfParser = new PDFParser(this,1);
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
```

