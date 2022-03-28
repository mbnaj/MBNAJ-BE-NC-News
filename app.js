const express = require("express");
const { getTopics } = require("./controllers/topics");
const { getArticleById } = require("./controllers/articles");

const app = express();
app.use(express.json());

//////////////////////////////////////////////////////////////
// getTopics
//////////////////////////////////////////////////////////////
app.get("/api/topics", getTopics);

//////////////////////////////////////////////////////////////
// getTopics
//////////////////////////////////////////////////////////////
app.get("/api/articles/:article_id", getArticleById);

// NO ROUTE ERROR
app.all("/*", (req, res) => {
  res.status(404).send({ message: "Route not found" });
});

// VALIDATION ERROR
app.use((err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status).send({ message: err.message });
  } else {
    next(err);
  }
});

// DATABASE ERROR
app.use((err, req, res, next) => {
  if (err.code == "22P02") {
    res.status(400).send({ message: "Bad Request!!" });
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
