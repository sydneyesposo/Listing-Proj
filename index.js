const express = require('express');
const app = express();
const path = require('path');
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');
const Listing = require('./models/listing');
const User = require("./models/users");
const Review = require("./models/reviews");
const methodOverride = require('method-override');
const cookieSession = require("cookie-session");
const authenticateUser = require("./middlewares/authenticateUser");


mongoose.connect('mongodb://localhost:27017/dblisting')
    .then(() => {
        console.log("Connection Open");
    })
    .catch(err => {
        console.log("Error\n",err);
        })


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static("public"));//
app.use(express.urlencoded({extended: true})); 
app.use(methodOverride('_method'));

// cookie session
app.use(
    cookieSession({
      keys: ["random"],
    })
  );

const categories = ['Residential', 'Agricultural', 'Commercial'];



// View all listing
app.get('/listings', async (req, res) => {
    const listings = await Listing.find({});
    res.render('listings/index', {listings});
})


// route for serving frontend files
app
  .get("/listings", (req, res) => {
    res.render("/listings/index");
  })
  .get("/listings/login", (req, res) => {
    res.render("listings/login");
  })
  .get("/listings/register", (req, res) => {
    res.render("listings/register");
  })
 

  //insert
  .get("/listings", authenticateUser, (req, res) => {
    const newListing = new Listing(req.body);
    res.render("/listings/${newListing._id}", { user: req.session.user });
  });

//   .get("/listings/index", authenticateUser, (req, res) => {
//     res.render("listings/index", { user: req.session.user });
//   })
  


// Form to add new listing
app.get('/listings/new', (req, res) => {
    res.render('listings/new', {categories});
})



// add new listing
app.post('/listings', async (req, res) => {
    const newListing = new Listing(req.body);
    await newListing.save();
    console.log(newListing);
    res.redirect(`/listings/${newListing._id}`);
})
// // Form to add review
app.get('/listings/show', async (req, res) => {
    const newReview = new Listing(req.body);
    await newReview.save();
    console.log(newReview);
    res.redirect(`/listings/${newReview._id}`);
})

//add new route 
app.get("/listings/new", authenticateUser, (req, res) => {
  res.render("listings/new", { user: req.session.user });
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


// View specific listing
app.get('/listings/:id', async (req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render('listings/show', {listing});
})

// Delete a listing
app.delete('/listings/:id', async (req, res) => {
    const {id} = req.params;
    const deleteListing = await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
})



//--------------------------------------------------------//
//LOGIN AND REGISTER
  
  // route for handling post requests
app.post("/listings/login", async (req, res) => {
  const {email, password} = req.body;
  console.log(req.body);

  // check for missing fields
  if (!email || !password) return res.send("Please enter all the fields");

  const doesUserExits = await User.findOne({email});

  if (!doesUserExits) return res.send("invalid username or password");

  const doesPasswordMatch = await bcrypt.compare(password,doesUserExits.password);

  if (!doesPasswordMatch) return res.send("invalid useranme or password");

  // else he\s logged in
  req.session.user = {
    email,
  };
  res.redirect("/listings");
});

app.post("/listings/register", async (req, res) => {
  const { email, password } = req.body;
// check for missing fields
if (!email || !password) return res.send("Please enter all the fields");

const doesUserExitsAlreay = await User.findOne({email});

if (doesUserExitsAlreay) return res.send("A user with that email already exists please try another one!");

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
    res.redirect("listings/login");
  });


app.listen(2000, () => {
    console.log("Listening on port 2000.");
})