import express from 'express';
// import session from 'express-session';
import mongoose from 'mongoose';
import session from 'express-session';
import User from './models/User.mjs'
import hbs from 'hbs'
await mongoose.connect('mongodb://localhost/scratch;')
const app=express() ;
app.set('view engine','hbs')
app.use(express.urlencoded({extended:true}))


const sessionoptions={
         secret:"secret to saving session ID",
         saveUninitialized :false,
  resave:false
}
app.use(session(sessionoptions))
    // }

app.use(express.json())

app.get("/",function(req,res){
    res.render('signup')

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

app.post('/api/login',async(req,res)=>{
    const { username } = req.body
    console.log(req.body)

    //the following call to findone expects a string for a password and username
    //however if we pass in an object, we can manipulate the query to use a mongodb operator that is not just equality(as is the case with a simple name and value pair)
    //example:password:{$ne:1} will be interpreted as any password thats not equal to 1
    const user=await User.findOne({username})
    const lit = await User.find({}, 'username password');
    if(user){
        req.session.username =user.username
        req.session.password=user.password
        res.render('welcome',{'name':user.username,'password':user.password,'list':lit})

    }
    else{
        res.send({error: 'no user / password combination found'})
    }

})
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
app.get("/profile", function(req, res){
    res.render ('profile',{'username':req.session.username})
    } )
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
app.listen(3000)
