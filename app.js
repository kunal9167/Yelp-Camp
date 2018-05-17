var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");

// seedDB();

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

//Schema setup



// Campground.create({
//         name: "Manali",
//         image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQO3ZjRQZaLS1QkYKgfF2ZLfN6A_JrrUHBdvQq748V-RjtfjAcm",
//         description: "An amazing place to be. No bathrooms, no waterfall. Beautiful Manali"
//     },
//     function(err, campground){
//     if(err)
//     console.log(err);
//     else
//     {
//         console.log("Newly created campground");
//         console.log(campground);
//     }
// });


app.get("/", function(req, res) {
  res.render("landing");
});

app.get("/campgrounds", function(req, res) {
  Campground.find({}, function(err, allcampgrounds) {
    if (err) console.log(err);
    else {
      res.render("Index", { campgrounds: allcampgrounds });
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
  res.render("new.ejs");
});

app.get("/campgrounds/:id", function(req,res){
  Campground.findById(req.params.id,function(err,foundCampground){
    if(err)
      console.log(err)
    else
    res.render("show",{campground:foundCampground});      
  });
});

app.listen(3000, function() {
  console.log("Yelp camp has started");
});
