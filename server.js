require('dotenv').config();

// necessary imports
const morgan = require('morgan');
const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');

// route files
const userRoutes = require(path.resolve(__dirname, './routes/UserRoutes'));
const movieRoutes = require(path.resolve(__dirname, './routes/MovieRoutes'));
const actorRoutes = require(path.resolve(__dirname, './routes/ActorRoutes'));

// set up express
const app = express();

app.use(cors());

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

