const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Listing = require('./models/listing');
const methodOverride = require('method-override');

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
  .get("/", (req, res) => {
    res.render("index");
  })
  .get("/login", (req, res) => {
    res.render("login");
  })
  .get("/register", (req, res) => {
    res.render("register");
  })

  .get("/listings", authenticateUser, (req, res) => {
    res.render("listings/index", { user: req.session.user });
  });
  
//Login
app.get('/listings/login',(req, res) => {
    res.render('listings/login');
    console.log("Hi");
    })

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