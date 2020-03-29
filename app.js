const express = require('express');
const morgan = require('morgan');
const app = express();
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const expressValidator = require('express-validator');
const mongoose = require('mongoose');
dotenv.config();


//for local database
//MONGO_URI = mongodb://localhost/nodeapi

//Mongo DB connection 
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true }).then(() => console.log(`DB connected`));

mongoose.connection.on('error', err => {
    console.log(`DB connection error: ${err.message}`);
})
//Bringing route middleware
const postRoutes = require('./routes/post');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

//Middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use('/', postRoutes);
app.use('/', authRoutes);
app.use('/', userRoutes);
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ error: "Unauthorized!" });
    }
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Listening server to the port: ${PORT}`);
});