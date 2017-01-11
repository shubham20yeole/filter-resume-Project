module.exports = (function() {
    'use strict';
    var router = require('express').Router();
var mongojs = require('mongojs')
var mongodb = require('mongodb')
// var db = mongojs('mongodb://ds143717.mlab.com:43717/shubham', ['users']);
var collections = ["users", "blog", "comments"]

var db = mongojs('mongodb://shubham20.yeole:shubham20.yeole@ds143717.mlab.com:43717/shubham', collections)
    router.get('/', function(req, res){
	 var blogviewmsg = "You are viewing blogs of all category";
  var loginstatus = null;
  if(req.session.users==null){
    loginstatus = "false";
      }else{
    loginstatus = "true";
  }
  db.blog.find(function (err, docs) {
    res.render("dashboard.ejs",{
    blog: docs,
    users: req.session.users,
    message: blogviewmsg,
    session: loginstatus
  });
  } )
	
});

    router.post('/users/add', function(req, res){
	req.checkBody('firstname', 'First name is required').notEmpty();
	req.checkBody('lastname', 'Lastr name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();

	var errors = req.validationErrors();
	var datetime = new Date();
    var loginstatus = null;
      if(req.session.users==null){
          loginstatus = "false";
        }else{
          loginstatus = "true";
        }
 db.users.findOne({ email: req.body.email }, function(err, users) {
    if (!users) {
          var students = "Shubham is Pace CS student";
          if(errors){
               var blogviewmsg = "You are viewing blogs of all category";
 
                db.blog.find(function (err, docs) {
                    res.render("dashboard.ejs",{
                    blog: docs,
                    users: req.session.users,
                    message: blogviewmsg,
                    session: loginstatus
                });
              })
              }else{
              var psd = req.body.password;
              if(req.body.password==null){
                psd = "w$9jKp3e$!Zy_Ned";
              }else{
                psd = req.body.password; 
              }
              console.log("success");
              var newUser = {
              firstname: req.body.firstname,
              lastname: req.body.lastname,
              email: req.body.email,
              phone: req.body.phone,
              date: datetime,
              website: req.body.website,
              password: req.body.password,
              fbid: req.body.email+"w$9jKp3e$!Zy_Ned",
              gender: req.body.gender,
              photo: req.body.photo,
              type: 'user',
            }
        db.users.insert(newUser, function(err, result){
              if(err){
                console.log(err);
              }
        req.session.users = newUser;
        res.redirect('/blog');
  });
  }
      
    } else {
        db.users.findOne({ email: req.body.email }, function(err, users) {
          if (!users) {
            errmsg = 'User with email '+req.body.email+' address is not yet registered... Please Sign Up first';
              res.redirect('/');
          } else {
            if (req.body.email+"w$9jKp3e$!Zy_Ned" === users.fbid) {
              // sets a cookie with the user's info
             req.session.users = users;
              res.redirect('/blog');
            } else {
              errmsg = 'Password does not match';
              res.redirect('/');
            }
      }
  });
            
}
});
});
    return router;
})();