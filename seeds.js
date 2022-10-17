const mongoose = require('mongoose');
const Listing = require('./models/listing');

mongoose
.connect('mongodb://localhost:27017/dblisting')
// {  
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true,
//     useFindAndModify: false,})
    .then(() => {
        console.log("Connection is open!");
    })
    .catch(err => {
        console.log("Error\n", err);
    })

const seedListing = [
    {
        category: 'Agricultural',
        name: 'Casa El Salvador',
        price: 5000000.00,
        description: "Sprawling contemporary estate on over 1 acre of land, recently completed with meticulous attention to design and detail.",
        address: "Ayala, Makati",
        date: new Date()

    },
    {
        category: 'Commercial',
        name: 'Brio de Agoho',
        price: 4000000.00,
        description: "The exclusive enclave of E Bay is perhaps the most coveted collection of bayfronts.",
        address: "BGC, Taguig City",
        date: new Date()



    },
    {
        category: 'Residential',
        name: 'Euphoria Residences',
        price: 2000000.00,
        description: "The exclusive enclave of E Bay is perhaps the most coveted collection of bayfronts.",
        address: "Forbes Park, Makati",
        date: new Date()


    }
]



Listing.insertMany(seedListing)
    .then(res => {
        console.log(res);
    })
    .catch(e => {
        console.log(e);
    })