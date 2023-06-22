//jshint esversion:6
require('dotenv').config(); 
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/authDB");

const userschema = new mongoose.Schema({
  email:String,
  password:String
});




const user = new mongoose.model("user", userschema);

app.get("/", function(req, res)
{
    res.render("home");
});
app.get("/login", function(req, res)
{
    res.render("login");
});
app.get("/register", function(req, res)
{
    res.render("register");
});
  
app.post("/register", function(req, res)
{
   const newuser = new user({
    email: req.body.username,
    password:md5(req.body.password)
   });
   newuser.save()
   .then(() =>{
     res.render("secrets");
   })
   .catch(err=>{
     res.send(err);
   }); 
});

app.post("/login", function(req, res)
{
  const username = req.body.username;
  const password = md5(req.body.password);
  
  user.findOne({email:username})
  .then(founduser =>{
     if(founduser.password == password)
      res.render("secrets");
  })
  .catch((err) =>{
    res.send(err);  
  })
})


app.listen(3000, function() {
    console.log("Server started on port 3000");
  });
  