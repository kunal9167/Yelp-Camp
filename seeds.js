var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var data= [
    {
        name: "Clouds Rest",
        image: "https://images.unsplash.com/photo-1445308394109-4ec2920981b1?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=1c80f31bb4040015d51db663252fbd30&auto=format&fit=crop&w=500&q=60",
        description: "blah blah blah"    
    },
    {
        name: "Manali",
        image: "https://images.unsplash.com/photo-1455496231601-e6195da1f841?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=4d1156d3e4dfafbc71a9f293939f3243&auto=format&fit=crop&w=500&q=60",
        description: "blah blah blah"    
    },
    {
        name: "Shimla",
        image: "https://images.unsplash.com/photo-1496080174650-637e3f22fa03?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=b7ca353cfcc4299e6c3d431ff862e1cf&auto=format&fit=crop&w=500&q=60",
        description: "blah blah blah"    
    }
];

function seedDB(){
    // remove all campgrounds
    Campground.remove({},function(err){
    if(err){
        console.log(err);
    }
    console.log("Removed campgrounds");
        
    //add a few campgrounds
    data.forEach(function(seed){

        Campground.create(seed,function(err,campground){
            if(err)
                console.log(err);
            else{
                console.log("added a campground");
                
                Comment.create({
                    text:"This place is great, but I wish internet was present",
                    author: "Homer"
                }, function(err,comment){
                    
                    if(err)
                        console.log(err);
                    else{
                        campground.comments.push(comment);
                        campground.save();
                        console.log("Created new comment");
                    }   
                });
            }
        })
    });
    });

    
}

module.exports = seedDB;