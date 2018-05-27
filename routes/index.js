 // ======================
 // AUTH ROUTES
 // ======================
 
var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// Root Route
router.get("/", function(req, res) {
    res.render("landing");
  });
  
// Show Register form
router.get("/register",function(req,res){
      res.render("register");
  });
  
// handle sign up logic
router.post("/register", function(req, res){
      var newUser = new User({username: req.body.username});
      User.register(newUser, req.body.password, function(err, user){
        
        if(err){
            req.flash("error", err.message);
            return res.redirect("/register");
          }
          else{
          passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp "+user.username);            
            res.redirect("/campgrounds"); 
          });
        }
      });
  });
  
// Show login form
router.get("/login", function(req,res){
      res.render("login", {});
  });
  
  // Handling Login Logic
router.post("/login", passport.authenticate("local",
      {
          successRedirect: "/campgrounds",
          failureRedirect: "/login"
      }),function(req,res){
});
  
  // Logout route
  router.get("/logout",function(req,res){
      req.logOut();
      req.flash("success", "Logged you out");
      res.redirect("/campgrounds")
  });
  

  module.exports = router;