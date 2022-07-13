//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose=require('mongoose');
const { urlencoded } = require("body-parser");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb+srv://ayan-gautam:test123@cluster0.rqzhl.mongodb.net/todolistDB');

itemSchema=new mongoose.Schema({
  description:String
});
var temp=[];
const Item=mongoose.model('Item',itemSchema);
var item=new Item({
  description:"Get Up"
});
temp.push(item);
var item2=new Item({
  description:"Get to the work"
});
temp.push(item2);
var item3=new Item({
  description:"Get rest"
});
temp.push(item3);


app.get("/", function(req, res) {

const day = date.getDate();
  Item.find({},function(err,results){
    if(err){
      console.log(err);
    }else{
      console.log('Successfully retreived');
      if(results.length===0)
      {
        Item.insertMany(temp,function(err){
          if(err)
          {
            console.log(err);
          }
          else{
            console.log("Item inserted successfully");
          }
        });
      }
      res.render("list", {listTitle: day, newListItems: results});
    }
  });

});

app.post("/", function(req, res){

  const item=new Item({
    description : req.body.newItem
  });
  item.save();
  res.redirect("/");
});

app.post('/delete',function(req,res){
  //console.log(req.body.ditem);
  Item.deleteOne({_id:req.body.ditem},function(err){
    if(err)console.log(err);
    else{ //console.log("Deletion Successful");
    }
  });
  res.redirect('/');
});

app.get("/:type", function(req,res){
  console.log(req.params.type);
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
