const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Listing = require('./models/listing');
const User = require("./models/listing");
const methodOverride = require('method-override');
const cookieSession = require("cookie-session");
const bcrypt = require("bcrypt");
const authenticateUser = require("./middlewares/authenticateUser");



mongoose.connect('mongodb://localhost:27017/dblisting')
    .then(() => {
        console.log("Connection Open");
    })
    .catch(err => {
        console.log("Error");
        console.log(err);
    })

app.set('views', path.join(__dirname, 'public'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

// cookie session
app.use(
    cookieSession({
      keys: ["random"],
    })
  );

const categories = ['Residential', 'Agricultural', 'Commercial'];

// route for serving frontend files
app
  .get("/listings", (req, res) => {
    res.render("listings/index");
  })
  .get("/listings/login", (req, res) => {
    res.render("listings/login");
  })
  .get("/listings/register", (req, res) => {
    res.render("listings/register");
  })

  .get("/listings", authenticateUser, (req, res) => {
    res.render("listings/index", { user: req.session.user });
  });
  
  // route for handling post requirests
app
.post("/listings/login", async (req, res) => {
  const { email, password } = req.body;

  // check for missing filds
  if (!email || !password) return res.send("Please enter all the fields");

  const doesUserExits = await User.findOne({ email });

  if (!doesUserExits) return res.send("invalid username or password");

  const doesPasswordMatch = await bcrypt.compare(
    password,
    doesUserExits.password
  );

  if (!doesPasswordMatch) return res.send("invalid useranme or password");

  // else he\s logged in
  req.session.user = {
    email,
  };

  res.redirect("listings/index");
})
.post("/listings/register", async (req, res) => {
  const { email, password } = req.body;
// check for missing filds
if (!email || !password) return res.send("Please enter all the fields");

const doesUserExitsAlreay = await User.findOne({ email });

if (doesUserExitsAlreay) return res.send("A user with that email already exits please try another one!");

// lets hash the password
const hashedPassword = await bcrypt.hash(password, 12);
const latestUser = new User({ email, password: hashedPassword });

latestUser
  .save()
  .then(() => {
    res.send("registered account!");
    res.redirect("listings/login");
  })
  .catch((err) => console.log(err));
});


//logout
app.get("/logout", authenticateUser, (req, res) => {
    req.session.user = null;
    res.redirect("/login");
  });
  

// //Login
// app.get('/listings/login',(req, res) => {
//     res.render('listings/login');
//     console.log("Hi");
//     })

// Form to add new listing
app.get('/listings/new', (req, res) => {
    res.render('listings/new', {categories});
})


// Insert new listing
app.post('/listings', async (req, res) => {
    const newListing = new Listing(req.body);
    await newListing.save();
    console.log(newListing);
    res.redirect(`/listings/${newListing._id}`);
})

// Form to update a listing
app.get('/listings/:id/updateListing', async (req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render('listings/edit', {listing, categories});
})

// Update a listing
app.put('/listings/:id', async (req, res) => {
    const {id} = req.params;
    const listing = await Listing.findByIdAndUpdate(id, req.body, {runValidators: true, new: true});
    res.redirect(`/listings/${listing._id}`);
})


// View all listing
app.get('/listings', async (req, res) => {
    const listings = await Listing.find({});
    res.render('listings/index', {listings});
})

// View specific listing
app.get('/listings/:id', async (req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render('listings/show', {listing});
})


app.listen(2000, () => {
    console.log("Listening on port 2000.");
})