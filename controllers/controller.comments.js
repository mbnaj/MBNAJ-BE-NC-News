const {
  selectComments,
  selectCommentsByArticleId,
  insertCommentsByArticleId,
  removeCommentById,
  updateCommentById,
} = require("../models/model.comments.js");

exports.getComments = async (req, res, next) => {
  try {
    const data = await selectComments();
    res.status(200).send({ comments: data });
  } catch (err) {
    next(err);
  }
};

exports.getCommentsByArticleId = async (req, res, next) => {
  const { article_id } = req.params;
  const { limit,p} = req.query;
  try {
    const data = await selectCommentsByArticleId(article_id,limit,p);
    res.status(200).send({ comments: data });
  } catch (err) {
    next(err);
  }
};

exports.postCommentsByArticleId = async (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  try {
    const data = await insertCommentsByArticleId(article_id, username, body);
    res.status(201).send({ comment: data });
  } catch (err) {
    next(err);
  }
};



exports.deleteCommentById = async (req, res, next) => {
  const { comment_id } = req.params;

  try {
    await removeCommentById(comment_id);
    res.status(204).send('ok');
  } catch (err) {
    next(err);
  }
};

exports.patchCommentsById = async (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;

  try {
    const data = await updateCommentById(article_id, inc_votes);
    res.status(201).send({ comment: data });
  } catch (err) {
    next(err);
  }
};
