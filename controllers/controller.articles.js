const {
  selectArticles,
  selectArticleById,
  updateArticleById,
} = require("../models/model.articles.js");

exports.getArticles = (req, res, next) => {
  const { topic, sort_by, order } = req.query;
  let keyword = {};
  if (topic != null) {
    keyword["topic"] = topic;
  }

  return selectArticles(keyword, sort_by, order)
    .then((data) => {
      res.status(200).send({ articles: data });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  return selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  return updateArticleById(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
