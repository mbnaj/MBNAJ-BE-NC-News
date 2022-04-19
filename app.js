const express = require("express");
const apiRouter = require("./routers/router.api");
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api',apiRouter);


// NO ROUTE ERROR
app.all("/*", (req, res) => {
  var Url = req.protocol + '://' + req.get('host') + req.originalUrl;
  console.log(Url,' <== This Url is invalid..')
  res.status(404).send({ message: "Route not found" });
});


// DATABASE ERROR
app.use((err, req, res, next) => {
  //console.log('DB ERROR:==========>',err)
  let dbErrors = ['22P02','23503'];
  if ( dbErrors.includes( err.code) ) {
    res.status(400).send({ message: "Bad Request" });
  } else {
    next(err);
  }
});

// VALIDATION ERROR
app.use((err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status).send({ message: err.message });
  } else {
    next(err);
  }
});



// SERVER ERROR
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ message: "Internal Server Error!" });
});

module.exports = app;
