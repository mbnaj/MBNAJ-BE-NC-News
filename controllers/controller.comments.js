const {
  selectComments,
  selectCommentsByArticleId,
  insertCommentsByArticleId,
} = require("../models/model.comments.js");

exports.getComments = (req, res, next) => {
  return selectComments()
    .then((data) => {
      res.status(200).send({ comments: data });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  return selectCommentsByArticleId(article_id)
    .then((data) => {
      res.status(200).send({ comments: data });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  return insertCommentsByArticleId(article_id, username, body)
    .then((data) => {
      res.status(201).send({ comment: data });
    })
    .catch((err) => {
      next(err);
    });
};
