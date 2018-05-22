var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");
var passport = require("passport");
var LocalStratergy = require("passport-local");



mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

app.use(require("express-session")({
	secret:"Kuch bhi rakh le re bhai",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	next();
});	

app.get("/", function(req, res) {
  res.render("landing");
});

// INDEX - show all campgrounds
app.get("/campgrounds", function(req, res) {
  Campground.find({}, function(err, allcampgrounds) {
    if (err) console.log(err);
    else {
      res.render("campgrounds/Index", { campgrounds: allcampgrounds, currentUser: req.user });
    }
  });
});

app.post("/campgrounds", function(req, res) {
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

app.get("/campgrounds/new", function(re1, res) {
  res.render("campgrounds/new.ejs");
});

app.get("/campgrounds/:id", function(req,res){
  Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
    if(err)
      console.log(err)
    else
    res.render("campgrounds/show",{campground:foundCampground});      
  });
});

// =========================================
//    COMMENTS ROUTES
// =========================================

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req,res){
  Campground.findById(req.params.id,function(err,campground){
      if(err)
        console.log(err);
      else
      {
        res.render("comments/new",{campground});       
      }
  })  
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req,res){
	//Lookup campground using ID
	Campground.findById(req.params.id, function(err,campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}
		else
		{
			Comment.create(req.body.comment, function(err,comment){
				if(err)
					res.redirect("/campgrounds");
				else{
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/"+campground._id);
				}
			});
		}
	});
	
	
	//create new comment
	//connect new comment to campground
	//redirect to SHOW page of campground
});

// ======================
// AUTH ROUTES
// ======================

// Show Register form
app.get("/register",function(req,res){
	res.render("register");
});

// handle sign up logic
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/campgrounds"); 
        });
    });
});

// Show login form
app.get("/login", function(req,res){
	res.render("login");
});

// Handling Login Logic
app.post("/login", passport.authenticate("local",
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}),function(req,res){
});

// Logout route
app.get("/logout",function(req,res){
	req.logOut();
	res.redirect("/campgrounds")
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}
app.listen(3000, function() {
  console.log("Yelp camp has started");
});
