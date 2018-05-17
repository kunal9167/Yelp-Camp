var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var data= [
    {
        name: "Clouds Rest",
        image: "https://images.unsplash.com/photo-1445308394109-4ec2920981b1?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=1c80f31bb4040015d51db663252fbd30&auto=format&fit=crop&w=500&q=60",
        description: "Quam eu quam magna, lorem duis tristique ac vestibulum ut lobortis, eros nunc convallis eget vulputate dui. Risus a netus, ultrices enim fermentum cum aenean ultrices, nullam vitae nonummy at ut sit. Ut in lorem adipiscing varius suspendisse libero, sed quis, facilisi pede lectus, et a in est sollicitudin sed, est placerat fringilla sollicitudin consequat. Porta aenean et consequat et erat, aut bibendum wisi, elit voluptas sed feugiat vel quis, bibendum ut urna molestie, proin sed sit dui. Vitae mauris molestie, pede varius fermentum, sit elit erat nec vel elementum dui, eget nibh arcu, faucibus pede lacus neque pretium porta. Dolor nisl bibendum id erat, nisl sed vestibulum dis purus, odio suscipit at turpis, mus sed in tellus cursus, porttitor conubia odio libero. Amet dolor odio venenatis mauris, luctus nibh at, mauris quisque porttitor mauris. Rhoncus elit, suspendisse quam vel neque lectus id id, est ligula, ac sed tellus eu neque et dis, sit at possimus netus aliquet vestibulum molestie. Pellentesque viverra orci, facilisis nec montes nullam praesent enim, consectetuer porta id. Ut volutpat integer praesent, pharetra vehicula platea natoque ac ante in, ante pellentesque nec condimentum iaculis nonummy natoque, deserunt quis suspendisse eleifend cras massa. Purus at donec aliquam necessitatibus in. Tempus dictum, purus nunc, dolor nostra ullamcorper sed."    
    },
    {
        name: "Manali",
        image: "https://images.unsplash.com/photo-1455496231601-e6195da1f841?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=4d1156d3e4dfafbc71a9f293939f3243&auto=format&fit=crop&w=500&q=60",
        description: "Quam eu quam magna, lorem duis tristique ac vestibulum ut lobortis, eros nunc convallis eget vulputate dui. Risus a netus, ultrices enim fermentum cum aenean ultrices, nullam vitae nonummy at ut sit. Ut in lorem adipiscing varius suspendisse libero, sed quis, facilisi pede lectus, et a in est sollicitudin sed, est placerat fringilla sollicitudin consequat. Porta aenean et consequat et erat, aut bibendum wisi, elit voluptas sed feugiat vel quis, bibendum ut urna molestie, proin sed sit dui. Vitae mauris molestie, pede varius fermentum, sit elit erat nec vel elementum dui, eget nibh arcu, faucibus pede lacus neque pretium porta. Dolor nisl bibendum id erat, nisl sed vestibulum dis purus, odio suscipit at turpis, mus sed in tellus cursus, porttitor conubia odio libero. Amet dolor odio venenatis mauris, luctus nibh at, mauris quisque porttitor mauris. Rhoncus elit, suspendisse quam vel neque lectus id id, est ligula, ac sed tellus eu neque et dis, sit at possimus netus aliquet vestibulum molestie. Pellentesque viverra orci, facilisis nec montes nullam praesent enim, consectetuer porta id. Ut volutpat integer praesent, pharetra vehicula platea natoque ac ante in, ante pellentesque nec condimentum iaculis nonummy natoque, deserunt quis suspendisse eleifend cras massa. Purus at donec aliquam necessitatibus in. Tempus dictum, purus nunc, dolor nostra ullamcorper sed."    
    },
    {
        name: "Shimla",
        image: "https://images.unsplash.com/photo-1496080174650-637e3f22fa03?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=b7ca353cfcc4299e6c3d431ff862e1cf&auto=format&fit=crop&w=500&q=60",
        description: "Quam eu quam magna, lorem duis tristique ac vestibulum ut lobortis, eros nunc convallis eget vulputate dui. Risus a netus, ultrices enim fermentum cum aenean ultrices, nullam vitae nonummy at ut sit. Ut in lorem adipiscing varius suspendisse libero, sed quis, facilisi pede lectus, et a in est sollicitudin sed, est placerat fringilla sollicitudin consequat. Porta aenean et consequat et erat, aut bibendum wisi, elit voluptas sed feugiat vel quis, bibendum ut urna molestie, proin sed sit dui. Vitae mauris molestie, pede varius fermentum, sit elit erat nec vel elementum dui, eget nibh arcu, faucibus pede lacus neque pretium porta. Dolor nisl bibendum id erat, nisl sed vestibulum dis purus, odio suscipit at turpis, mus sed in tellus cursus, porttitor conubia odio libero. Amet dolor odio venenatis mauris, luctus nibh at, mauris quisque porttitor mauris. Rhoncus elit, suspendisse quam vel neque lectus id id, est ligula, ac sed tellus eu neque et dis, sit at possimus netus aliquet vestibulum molestie. Pellentesque viverra orci, facilisis nec montes nullam praesent enim, consectetuer porta id. Ut volutpat integer praesent, pharetra vehicula platea natoque ac ante in, ante pellentesque nec condimentum iaculis nonummy natoque, deserunt quis suspendisse eleifend cras massa. Purus at donec aliquam necessitatibus in. Tempus dictum, purus nunc, dolor nostra ullamcorper sed."    
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