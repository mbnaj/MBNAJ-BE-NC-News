const express = require("express");
const { getAPI } = require("./db/helpers/utils");
const { getTopics ,postTopic} = require("./controllers/controller.topics");
const { getArticleById,patchArticleById ,getArticles,postArticle,deleteArticleById} = require("./controllers/controller.articles");
const { getUsers,getUser } = require("./controllers/controller.users");
const { getCommentsByArticleId,postCommentsByArticleId ,deleteCommentById} = require("./controllers/controller.comments");

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
//PATCH /api/articles/:article_id
//////////////////////////////////////////////////////////////
app.patch('/api/articles/:article_id', patchArticleById);


//////////////////////////////////////////////////////////////
// GET /api/users
//////////////////////////////////////////////////////////////
app.get("/api/users", getUsers);

//////////////////////////////////////////////////////////////
// GET /api/users
//////////////////////////////////////////////////////////////
app.get("/api/articles", getArticles);


//////////////////////////////////////////////////////////////
// GET /api/articles/:article_id/comments
//////////////////////////////////////////////////////////////
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);


//////////////////////////////////////////////////////////////
// POST /api/articles/:article_id/comments
//////////////////////////////////////////////////////////////
app.post("/api/articles/:article_id/comments", postCommentsByArticleId);

//////////////////////////////////////////////////////////////
// DELETE /api/comments/:comment_id
//////////////////////////////////////////////////////////////
app.delete("/api/comments/:comment_id", deleteCommentById);



//////////////////////////////////////////////////////////////
// GET /api
//////////////////////////////////////////////////////////////
app.get("/api", getAPI);


//////////////////////////////////////////////////////////////
// GET /api/users/:username
//////////////////////////////////////////////////////////////
app.get("/api/users/:username", getUser);



//////////////////////////////////////////////////////////////
// POST /api/articles
//////////////////////////////////////////////////////////////
app.post("/api/articles", postArticle);



//////////////////////////////////////////////////////////////
// DELETE /api/articles/:article_id
//////////////////////////////////////////////////////////////
app.delete("/api/articles/:article_id", deleteArticleById);



//////////////////////////////////////////////////////////////
// POST /api/articles
//////////////////////////////////////////////////////////////
app.post("/api/topics", postTopic);



// NO ROUTE ERROR
app.all("/*", (req, res) => {
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
