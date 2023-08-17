const express = require("express");
const router = express.Router();

//user route
router.get("/users",(req,res)=>{
    res.send("All Users");
});
//home route
router.get("/",(req,res)=>{
    // res.send("All Buddy you are at home");
    res.render("index",{title : "Home Page"})
});

//add user route
router.get("/add",(req,res)=>{
    // res.send("All Buddy you are at home");
    res.render("add_user",{title : "Add User"})
});

module.exports= router;