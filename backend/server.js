require('dotenv').config();

// necessary imports
const morgan = require('morgan');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');

// route files
const userRoutes = require(path.resolve(__dirname, './routes/UserRoutes'));
const movieRoutes = require(path.resolve(__dirname, './routes/MovieRoutes'));
const actorRoutes = require(path.resolve(__dirname, './routes/ActorRoutes'));

// database seeder on first run, database URI in .env file
const { seed } = require(path.resolve(__dirname, './utils/seed'));
seed().then(() => {
    // mongodb connection
    mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
        if (err) {
            console.log("DB Error: ", err);
        }

        console.log("Connected to ", process.env.DB_URI);
    });
    mongoose.set('useCreateIndex', true);
})
.catch(err => console.log("Seed Error: ", err));

// set up express
const app = express();

// setup cors
app.use(cors());

// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// logger
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'history.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));

// routes
app.use('/api/user', userRoutes);
app.use('/api/actors', actorRoutes);
app.use('/api/movies', movieRoutes);

// start listening
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});

