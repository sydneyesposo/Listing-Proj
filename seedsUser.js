const mongoose = require('mongoose');
const User = require('./models/users');

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

const seedUser= [{
    email: 'sample@email.com',
    password: '$2b$12$8Q/zRbmC/hfPEezxzXfSe.N3l.rLYl41K0v2/HJGmY0hcS9pDI4k2'},
    {email: 'syd@gmail.com',
    password: '$2b$12$8Q/zRbmC/hfPEezxzXfSe.N3l.rLYl41K0v2/HJGmY0hcS9pDI4k2'
}]

User.insertMany(seedUser)
    .then(res => {
        console.log(res);
    })
    .catch(e => {
        console.log(e);
    })