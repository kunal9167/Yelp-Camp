var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

// Index Route
router.get("/", function(req, res) {
    Campground.find({}, function(err, allcampgrounds) {
      if (err) console.log(err);
      else {
        res.render("campgrounds/Index", { campgrounds: allcampgrounds, currentUser: req.user });
      }
    });
  });

//Create Route
router.post("/", isLoggedIn, function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = {
      name,
      image,
      description
    };
  
    Campground.create(newCampground, function(err, newlyCreated) {
      if (err) {
          console.log(err)
      }
      else
          res.redirect("/campgrounds");
    });
  });
  
// NEW Route
router.get("/new", isLoggedIn, function(re1, res) {
	res.render("campgrounds/new.ejs");
});
  
// SHOW Route
router.get("/:id", function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
      if(err)
        console.log(err)
      else
      res.render("campgrounds/show",{campground:foundCampground});      
    });
});

// Middleware
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
      return next();
  }
  res.redirect("/login");
}

  module.exports = router;