const express = require('express')
const app = express()
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const cors = require('cors')

mongoose.connect(
    "mongodb+srv://project-ert:project-ert@cluster0.rfvlx.mongodb.net/project-ert?retryWrites=true&w=majority",
    {
        useUnifiedTopology: true,
        useNewUrlParser: true
    },
    () => console.log("Connected to db")
);

app.options("*", cors())

app.use(bodyParser.json())


app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Cache-Control, Access-Control-Expose-Headers");
    next()
});


const allRoutes = require('./routes');

app.use('/api', allRoutes);

app.listen(5000, () => console.log("Server started"))