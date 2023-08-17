const express = require("express");
const router = express.Router();
const User = require("../models/users");
const multer = require("multer");

// img upload
var storage= multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,"./uploads");
    },
    filename: function(req, file, cb){
        cb(null, file.filename+"_"+ Date.now()+"_"+file.originalname);
    },
});

// like middleware

var upload=multer({
    storage: storage,
}).single('image');

// Insert an user into database route
router.post('/add', upload, async (req, res) => {
    try {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: req.file.filename,
        });

        await user.save(); // Use await to handle the asynchronous operation

        req.session.message = {
            type: 'success',
            message: 'User added successfully!'
        };
        res.redirect('/');
    } catch (err) {
        res.json({ message: err.message, type: 'danger' });
    }
});



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