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

// Requiring Routes
var commentRoutes     = require("./routes/comments");
var campgroundRoutes  = require("./routes/campgrounds");
var indexRoutes        = require("./routes/index");


mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
// seedDB();

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

app.use("/campgrounds/:id/comments",commentRoutes);
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);


app.listen(3000, function() {
  console.log("Yelp camp has started");
});
