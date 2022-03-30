const {
  selectArticles,
  selectArticleById,
  updateArticleById,
  insertArticle,
  removeArticleById,
} = require("../models/model.articles.js");

exports.getArticles = (req, res, next) => {
  const { topic, sort_by, order,limit,p } = req.query;
  let keyword = {};
  if (topic != null) {
    keyword["topic"] = topic;
  }

  return selectArticles(keyword, sort_by, order,limit,p)
    .then((data) => {
      res.status(200).send({ articles: data });
    })
    .catch((err) => {
      next(err);
    });
};
////////////////////////////////////////////////////////////////////////////////////
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
////////////////////////////////////////////////////////////////////////////////////
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
////////////////////////////////////////////////////////////////////////////////////
exports.postArticle = (req, res, next) => {
  const { author,title,body,topic } = req.body;

  return insertArticle(author,title,body,topic)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
////////////////////////////////////////////////////////////////////////////////////
exports.deleteArticleById = async (req, res, next) => {
  const { article_id } = req.params;

  try {
    await removeArticleById(article_id);
    res.status(204).send('ok');
  } catch (err) {
    next(err);
  }
};
////////////////////////////////////////////////////////////////////////////////////
