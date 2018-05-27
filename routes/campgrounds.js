var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/index");

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
router.post("/", middleware.isLoggedIn, function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
    var newCampground = {
      name,
      image,
	  description,
	  author
    };
  
    Campground.create(newCampground, function(err, newlyCreated) {
      if (err) {
          console.log(err)
      }
	  else{
	  		// console.log(newlyCreated);
				res.redirect("/campgrounds");
		}
    });
  });
  
// NEW Route
router.get("/new", middleware.isLoggedIn, function(re1, res) {
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

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
	//is user logged in
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			req.flash("error", "Campground does not exist");
		}
		res.render("campgrounds/edit", {campground: foundCampground});
	});	
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req,res){

	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err)
			res.redirect("/campgrounds");
		else{
			req.flash("success", "Campground Updated");			
			res.redirect("/campgrounds/"+req.params.id)
		}
	})
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(err){
		if(err)
			res.redirect("/campgrounds");
		else{
			req.flash("success", "Campground Deleted");						
			res.redirect("/campgrounds");
		}
	})
}); 

module.exports = router;