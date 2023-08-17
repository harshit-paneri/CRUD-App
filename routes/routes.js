const express = require("express");
const router = express.Router();
const User = require("../models/users");
const multer = require("multer");
const fs = require("fs");

// img upload
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.filename + "_" + Date.now() + "_" + file.originalname);
  },
});

// like middleware

var upload = multer({
  storage: storage,
}).single("image");

// Insert an user into database route
router.post("/add", upload, async (req, res) => {
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      image: req.file.filename,
    });

    await user.save(); // Use await to handle the asynchronous operation

    req.session.message = {
      type: "success",
      message: "User added successfully!",
    };
    res.redirect("/");
  } catch (err) {
    res.json({ message: err.message, type: "danger" });
  }
});

//home all users route
router.get("/", async (req, res) => {
  try {
    const users = await User.find().exec(); // Use await to handle the query

    res.render("index", {
      title: "Home Page",
      users: users,
    });
  } catch (error) {
    res.json({ message: error.message });
  }
}); 

//add user route
router.get("/add", (req, res) => {
  // res.send("All Buddy you are at home");
  res.render("add_user", { title: "Add User" });
});

// user edit
router.get("/edit/:id", async (req, res) => {
    const id = req.params.id; // Extract the id parameter from the request
    try {
        const user = await User.findById(id).exec();

        if (user == null) {
            res.redirect('/');
        } else {
            res.render("edit_user", {
                title: "Edit User",
                user: user,
            });
        }
    } catch (err) {
        res.redirect('/');
    }
});

// update user
router.post('/update/:id', upload, async (req, res) => {
    const id = req.params.id;
    let new_image = "";
    let old_image = req.body.old_image; 
    if (req.file) {
        new_image = req.file.filename;
        try {
            fs.unlinkSync("./uploads/" + old_image);
        } catch (err) {
            console.log(err);
        }
    } else {
        new_image = old_image;
    }

    try {
        await User.findByIdAndUpdate(id, {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: new_image,
        });

        req.session.message = {
            type: 'success',
            message: 'User update successfuly!',
        };
        res.redirect('/');
    } catch (err) {
        res.json({ message: err.message, type: 'danger' });
    }
});

// Delete user route
router.get('/delete/:id', async (req, res) => {
    const id = req.params.id;
    
    try {
        const result = await User.findByIdAndRemove(id).exec();
        
        if (result.image !== '') {
            const imagePath = './uploads/' + user.image;
            try {
                fs.unlinkSync(imagePath );
            } catch (err) {
                console.log(err);
            }
        }
        
        req.session.message = {
            type: 'success',
            message: 'User deleted successfully!'
        };
    } catch (error) {
        res.json({ message: error.message });
    }
    
    res.redirect("/");
});
module.exports = router;
