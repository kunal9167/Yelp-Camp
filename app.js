var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

//Schema setup

var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

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

// var campgrounds =[
//     {name: "Thane Creek", image: "https://www.pc.gc.ca/en/pn-np/ab/banff/activ/camping/~/media/802FD4AF791F4C6886E18CBF4A2B81B2.ashx?w=595&h=396&as=1"},
//     {name: "Manali", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQO3ZjRQZaLS1QkYKgfF2ZLfN6A_JrrUHBdvQq748V-RjtfjAcm"},
//     {name: "Shimla", image: "https://threerivers-drupal.s3.us-east-2.amazonaws.com/public/2017-03/BP_Camping_Billboard_01.jpg"},
//     {name: "Kings Park", image: "https://www.pc.gc.ca/en/pn-np/ab/banff/activ/camping/~/media/802FD4AF791F4C6886E18CBF4A2B81B2.ashx?w=595&h=396&as=1"},
//     {name: "Salmon creek", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQO3ZjRQZaLS1QkYKgfF2ZLfN6A_JrrUHBdvQq748V-RjtfjAcm"},
//     {name: "Greece", image: "https://threerivers-drupal.s3.us-east-2.amazonaws.com/public/2017-03/BP_Camping_Billboard_01.jpg"}
// ];

app.get("/", function(req, res) {
  res.render("landing");
});

app.get("/campgrounds", function(req, res) {
  Campground.find({}, function(err, allcampgrounds) {
    if (err) console.log(err);
    else {
      res.render("campgrounds", { campgrounds: allcampgrounds });
    }
  });
});

app.post("/campgrounds", function(req, res) {
  var name = req.body.name;
  var image = req.body.image;
  var newCampground = {
    name,
    image
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
    //To show more info about an element
    // res.send("This will be the showpage One day");
    res.render("show");
});

app.listen(3000, function() {
  console.log("Yelp camp has started");
});
