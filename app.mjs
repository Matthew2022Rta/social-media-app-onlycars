import express from 'express';
// import session from 'express-session';
import mongoose from 'mongoose';
import session from 'express-session';
import User from './models/User.mjs'
import Post from './models/Post.mjs';
import hbs from 'hbs'
import multer from 'multer';
import path from 'path';
import fs from 'fs';


import dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT || 3000;
await mongoose.connect(process.env.MONGO_URL);



if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
  }
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
  });
  const upload = multer({ storage });

//await mongoose.connect('mongodb://localhost/scratch;')
const app=express() ;
app.set('view engine','hbs')
app.use(express.urlencoded({extended:true}))

app.use(express.static('public'));

  
const sessionoptions={
         secret:"secret to saving session ID",
         saveUninitialized :false,
         resave:false
}
app.use(session(sessionoptions))
    // }
 app.use('/uploads', express.static('uploads'));
app.use(express.json())

app.get("/", async (req, res) => {
    const allPosts = await Post.find({});
    res.render("homepage", { posts: allPosts });
  });
app.get("/signup",function(req,res){
    res.render('signup');
})

app.post('/signup',async(req,res)=>{
    const { username, password } = req.body
    const existing = await User.findOne({ username })
    if (existing) {
      return res.status(400).send({ error: 'Username already taken' })
    }
    const user = await User.insertOne(req.body)
console.log(user)
    // redirect or confirm
    res.redirect('/login')
  })

app.get('/login',function(req,res){
    res.render('signin')

})

app.post('/api/login', async (req, res) => {
    const { username } = req.body;
    const user = await User.findOne({ username });
  
    if (user) {
      req.session.username = user.username;
      req.session.password = user.password;
  
      const allPosts = await Post.find({}); // fetch all users' posts
  
      res.render('welcome', {
        name: user.username,
        password: user.password,
        posts: allPosts
      });
    } else {
      res.send({ error: 'no user / password combination found' });
    }
  });
app.get('/list', async function(req, res) {
    try {
      // Query to get only 'username' and 'password'
      const users = await User.find({}, 'username password');  // Projection to include only 'username' and 'password'
      
      // Send the formatted result as a pretty-printed JSON string
      res.send(users);  // This will return an array of objects with only username and password
    } catch (err) {
      // Handle any errors during the query
      res.status(500).send('Error retrieving users: ' + err);
    }
  });

app.get("/home", function(req, res){
res.send(req.session.username)
} )

app.post("/postconent", upload.single("carpicture"), async function (req, res) {
    const { carbrand, carmodel, caryear, desfription } = req.body;
    const { username } = req.session;
    const carpicture = req.file.filename;

    if (!carbrand || !carmodel || !caryear || !carpicture || !username) {
      return res.status(400).send("Missing required fields or user session.");
    }
  
    await Post.create({
      username,
      carbrand,
      carmodel,
      caryear,
      carpicture,
      desfription
    });
  
    res.redirect("/profile");
  });

  app.get("/profile", async function(req, res){
    const username = req.session.username;
    const posts = await Post.find({ username });
    res.render("profile", { username, posts });
  });
app.post('/action',async function(req, res){
     if (req.body.option==="edit"){
        res.render('fixprofile')
     }
     else if(req.body.option==="delete"){
        await User.deleteOne({ username: req.session.username })
        res.redirect("/login")
    } 
    else{
        res.redirect('/action')
    }})
app.post('/fixprofile',async function(req,res){
    const update = {};

    if (req.body.username) {
        update.username = req.body.username;  // Only update username if provided
    }

    if (req.body.password) {
        update.password = req.body.password;  // Update password if provided
    }

    try {
        const updatedUser = await User.findOneAndUpdate(
            { username: req.session.username },  // Find user based on session username
            update,                              // Update with the specified fields
            { new: true }                        // Return the updated document
        );

        if (updatedUser) {
            res.send('Profile updated successfully');
        } else {
            res.status(404).send('User not found');
        }
    } catch (err) {
        console.log('Error updating profile:', err);
        res.status(500).send('Update failed');
    }
})

app.post('/deletepost', async (req, res) => {
  const { postId } = req.body;
  const username = req.session.username;

  const post = await Post.findOne({ _id: postId });

  // Only allow user to delete their own post
  if (post?.username === username) {
    await Post.deleteOne({ _id: postId });
    return res.redirect('/profile');
  }

  res.status(403).send('Unauthorized to delete this post');
});

app.listen(process.env.PORT || 3000);
