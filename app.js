const express = require("express");
const { getTopics } = require("./controllers/topics");
const { getArticleById,patchArticleById } = require("./controllers/articles");
const { getUsers } = require("./controllers/users");

const app = express();
app.use(express.json());

//////////////////////////////////////////////////////////////
// GET /api/topics
//////////////////////////////////////////////////////////////
app.get("/api/topics", getTopics);

//////////////////////////////////////////////////////////////
// GET /api/articles/:article_id
//////////////////////////////////////////////////////////////
app.get("/api/articles/:article_id", getArticleById);



//////////////////////////////////////////////////////////////
// GET /api/articles/:article_id
//////////////////////////////////////////////////////////////
app.get("/api/users", getUsers);



//////////////////////////////////////////////////////////////
//PATCH /api/articles/:article_id
//////////////////////////////////////////////////////////////
app.patch('/api/articles/:article_id', patchArticleById);



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
  //console.log('DB ERROR:==========>',err)
  if (err.code == "22P02") {
    res.status(400).send({ message: "Bad Request!!" });
  } else {
    next(err);
  }
});

// SERVER ERROR
app.use((err, req, res, next) => {
  //console.log(err);
  res.status(500).send({ message: "Internal Server Error!" });
});

module.exports = app;
