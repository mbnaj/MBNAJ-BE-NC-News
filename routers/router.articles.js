const express = require("express");
const {
  getArticleById,
  patchArticleById,
  getArticles,
  postArticle,
  deleteArticleById,
} = require("../controllers/controller.articles");
const {
  getCommentsByArticleId,
  postCommentsByArticleId,
  deleteCommentById,
} = require("../controllers/controller.comments");

const articlesRouter = express.Router();

articlesRouter.route("/").get(getArticles).post(postArticle);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .delete(deleteArticleById)
  .patch(patchArticleById);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentsByArticleId);

module.exports = articlesRouter;
