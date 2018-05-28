var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/index");
var NodeGeocoder = require('node-geocoder');

var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'solemnghost', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

//INDEX - show all campgrounds
router.get("/", function(req, res){
	// Get all campgrounds from DB
	if(req.query.search){
		const regex = new RegExp(escapeRegex(req.query.search), 'gi');
		Campground.find({name: regex}, function(err, allCampgrounds){
			if(err){
				console.log(err);
			} else {
				
				if(allCampgrounds.length<1){
					req.flash("error", "No campgrounds match that query");
					res.redirect("/campgrounds");					
				}else{
					res.render("campgrounds/index",{campgrounds: allCampgrounds, page: 'campgrounds'});
				}
			}
		 });
	}
	else{
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index",{campgrounds: allCampgrounds, page: 'campgrounds'});
       }
	});
}
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, upload.single('image'), function(req, res){
  // get data from form and add to campgrounds array
  var name = req.body.campground.name;
  var desc = req.body.campground.description;
  var author = {
      id: req.user._id,
      username: req.user.username
  }
  geocoder.geocode(req.body.campground.location, function (err, data) {
	
	if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
	}

	cloudinary.uploader.upload(req.file.path, function(result) {
		// add cloudinary url for the image to the campground object under image property
		req.body.campground.image = result.secure_url;
		// add author to campground
		req.body.campground.author = {
		  id: req.user._id,
		  username: req.user.username
		}
		var lat = data[0].latitude;
		var lng = data[0].longitude;
		var location = data[0].formattedAddress;
		
		var newCampground = {name: name, image:req.body.campground.image , description: desc, author:author, location: location, lat: lat, lng: lng, price: req.body.campground.price};
		
		Campground.create(newCampground, function(err, campground) {
		  if (err) {
			req.flash('error', err.message);
			return res.redirect('back');
		  }
		  res.redirect('/campgrounds/' + campground.id);
		});
	  });

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
      else{
		
		if (!foundCampground) {
			req.flash("error", "Item not found.");
			return res.redirect("back");
		}  
		res.render("campgrounds/show",{campground:foundCampground});      
	  }
	});
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
	//is user logged in
	Campground.findById(req.params.id, function(err, foundCampground){
		
		if(err){
			return req.flash("error", "Campground does not exist");
		}
		
		if (!foundCampground) {
			req.flash("error", "Item not found.");
			return res.redirect("back");
		}
		res.render("campgrounds/edit", {campground: foundCampground});
	});	
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	geocoder.geocode(req.body.location, function (err, data) {
	  if (err || !data.length) {
		req.flash('error', 'Invalid address');
		return res.redirect('back');
	  }
	  req.body.campground.lat = data[0].latitude;
	  req.body.campground.lng = data[0].longitude;
	  req.body.campground.location = data[0].formattedAddress;
  
	  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
		  if(err){
			  req.flash("error", err.message);
			  res.redirect("back");
		  } else {
			  req.flash("success","Successfully Updated!");
			  res.redirect("/campgrounds/" + campground._id);
		  }
	  });
	});
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

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;