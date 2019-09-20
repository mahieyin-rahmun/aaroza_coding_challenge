const path = require('path');
const bcrypt = require('bcrypt');

require('dotenv').config({
    path: path.resolve(__dirname, '../.env')
});

const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const Actor = require(path.resolve(__dirname, '../models/Actor'));
const User = require(path.resolve(__dirname, '../models/User'));
const Movie = require(path.resolve(__dirname, '../models/Movie'));


// #######################################################################################################

/*  
    For each UserSeeder, ActorSeeder, MovieSeeder
        Try to insert documents
        If error, check error code.
            11000 => documents already exist
            other => Internal error

*/


const seedActors = () => {
    let actorsObj = [
        new Actor({
            name: "Robert Downey, Jr.",
            birthday: new Date("April 4, 1965"),
            country: "United States"
        }),
        new Actor({
            name: "Will Smith",
            birthday: new Date("September 25, 1968"),
            country: "United States"
        }),
        new Actor({
            name: "Johnny Depp",
            birthday: new Date("June 9, 1963"),
            country: "United States"
        }),
        new Actor({
            name: "Jon Favreau",
            birthday: new Date("October 19, 1966"),
            country: "United States"
        }),
        new Actor({
            name: "Gwyneth Paltrow",
            birthday: new Date("September 27, 1972"),
            country: "United States"
        }),
        new Actor({
            name: "Scarlett Johansson",
            birthday: new Date("November 22, 1984"),
            country: "United States"
        }),
        new Actor({
            name: "Guy Pearce",
            birthday: new Date("October 5, 1967"),
            country: "United Kingdom"
        })
    ];

    return new Promise((resolve, reject) => {
        Actor.collection.insertMany(actorsObj)
        .then(docs => {
            resolve("Actor documents inserted.");            
        })
        .catch(err => {
            if (err.code === 11000) {
                reject('Seeding not required. Actor documents already exist.');    
            }
            reject("Error code:", err.code);           
        })
    });
};


const seedMovies = () => {
    let moviesObj = [
        new Movie({
            title: "Iron Man",
            year: "2008",
            rating: "7.9/10",
            actors: [
                {
                    name: "Robert Downey, Jr.",
                    birthday: new Date("April 4, 1965"),
                    country: "United States"
                },
                {
                    name: "Jon Favreau",
                    birthday: new Date("October 19, 1966"),
                    country: "United States"
                },
                {
                    name: "Gwyneth Paltrow",
                    birthday: new Date("September 27, 1972"),
                    country: "United States"
                } 
            ]
        }),
        new Movie({
            title: "Iron Man 2",
            year: "2010",
            rating: "7/10",
            actors: [
                {
                    name: "Robert Downey, Jr.",
                    birthday: new Date("April 4, 1965"),
                    country: "United States"
                },
                {
                    name: "Jon Favreau",
                    birthday: new Date("October 19, 1966"),
                    country: "United States"
                },
                {
                    name: "Scarlett Johansson",
                    birthday: new Date("November 22, 1984"),
                    country: "United States"
                } 
            ]
        }),
        new Movie({
            title: "Iron Man 3",
            year: "2013",
            rating: "7.2/10",
            actors: [
                {
                    name: "Robert Downey, Jr.",
                    birthday: new Date("April 4, 1965"),
                    country: "United States"
                },
                {
                    name: "Jon Favreau",
                    birthday: new Date("October 19, 1966"),
                    country: "United States"
                },
                {
                    name: "Gwyneth Paltrow",
                    birthday: new Date("September 27, 1972"),
                    country: "United States"
                },
                {
                    name: "Guy Pearce",
                    birthday: new Date("October 5, 1967"),
                    country: "United Kingdom"
                } 
            ]
        })
    ];

    return new Promise((resolve, reject) => {
        Movie.insertMany(moviesObj)
            .then(docs => resolve("Movie documents inserted."))
            .catch(err => {
                if (err.code === 11000) {
                    reject('Seeding not required. Movie documents already exist.');    
                }
                reject("Error code:", err.code);
            });
    });
};


const seedUsers = async () => {
    try {
        var passwordUser1 = await hashPassword("password1");
        var passwordUser2 = await hashPassword("password2");   
    } catch (err) {
        // if bcrypt fails, then nothing to do other than storing the passwords plain-text. thankfully, it's only the seeder
        passwordUser1 = "password1";
        passwordUser2 = "password2";
    }

    let userObj = [
        new User({
            username: "mahieyin",
            password: passwordUser1
        }),
        new User({
            username: "maria",
            password: passwordUser2
        })
    ];

    return new Promise((resolve, reject) => {
        User.collection.insertMany(userObj)
            .then(docs => resolve("User documents inserted."))
            .catch(err => {
                if (err.code === 11000) {
                    reject('Seeding not required. User documents already exist.');    
                }
                reject("Error code:", err.code);
            });
    });
};


// helper function for the user seeder to generate hashed passwords
const hashPassword = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, 10)
            .then(hashPassword => resolve(hashPassword))
            .catch(err => reject(err));
    });
};


// execute each seeder in sequence
const seed = async () => {
    mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true});

    let functionsToExecute = [seedUsers, seedActors, seedMovies];

    for (let i = 0; i < functionsToExecute.length; i++) {
        const func = functionsToExecute[i];
        
        try {
            let result = await func();
            console.log(result);
            
        } catch (err) {
            console.log(err);
        }        
    }

    // close the connection
    return new Promise((resolve, reject) => {
        mongoose.connection.close();
        resolve();
    });    
};

// #######################################################################################################

module.exports = {
    seed
};