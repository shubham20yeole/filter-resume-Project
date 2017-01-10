STEPS to SETUP Node.js PROJECT for Amazon web service (AWS) s3 bucket

1. npm init
2. npm install express --save
3. npm install body-parser --save
4. npm install path --save
5. npm install ejs --save
6. npm install passport --save
7. npm install git+https://github.com/RiptideElements/s3fs
8. npm install fs --save
9. npm install s3fs --save
10. npm install connect-multiparty --save
11. Install Nodemon
```nodejs
npm install -g nodemon
  ```
  ```nodejs
npm install --save-dev nodemon
  ```


12. Create views folder to store ejs files
13. Set ejs in app.js file
	```nodejs
  app.set('view engine', 'ejs');<br>
	app.set('views', path.join(__dirname, 'views'));
  ```

14. Use Body Parser Middleware 
	```nodejs
  app.use(bodyParser.json({limit: '50mb'})); 
	app.use(bodyParser.urlencoded({limit: '50mb',extended: false}));
	app.use(express.static(path.join(__dirname, 'public')))
	app.use(express.static(path.join(__dirname)));
```

15. Initiate and define S3 Bucket
	```nodejs
  var fs = require('fs');
	var S3FS = require('s3fs');
	var awsS3Function = new S3FS('shubhamawss3bucket', {
	  accessKeyId:'***************************',
	  secretAccessKey:'***************************';
	});
```

16. Command to create bucket
	awsS3Function.create();

17. Difine and use multiparty dependency
	```nodejs
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

18. Define root method
  	```nodejs
    app.get('/', function(req, res){       
	   res.render("index.ejs");
	});
```

19. Create upload method
	```nodejs
  app.post('/upload', function(req, res){       
	    var file = req.files.file;
	    var filepath = file.path;
	    var timestamp = new Date().valueOf();
	    var stream = fs.createReadStream(filepath);
	    var url = "https://s3.amazonaws.com/shubhamawss3bucket/shubham-"+timestamp+"-"+file.originalFilename;
	    return awsS3Function.writeFile('shubham-'+timestamp+"-"+file.originalFilename, stream).then(function(){
	      console.log("FILE UPLOADED SUCCESSFULLY");
	        res.send("<h1>FILE UPLOADED SUCCESSFULLY:</h1>"+
	          "<h2>Click Following: <a href='"+url+"' target='_blank'>Click Me</a></h2>"+
	          "<h2>Copy Paste following url: "+url+"<h2><hr>"+
	          "<img src='"+url+"'>");
		  })
		});
```
