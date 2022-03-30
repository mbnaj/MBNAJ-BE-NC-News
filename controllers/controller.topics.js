const { selectTopics,insertTopic } = require('../models/model.topics.js')

exports.getTopics = (req, res, next) => {
  return selectTopics()
    .then((data) => {
      res.status(200).send({ topics: data })
    })
    .catch((err) => {
      next(err)
    })
}

////////////////////////////////////////////////////////////////////////////////////
exports.postTopic = (req, res, next) => {
  const { slug,description} = req.body;

  return insertTopic(slug,description)
    .then((topic) => {
      res.status(201).send({ topic });
    })
    .catch((err) => {
      next(err);
    });
};
////////////////////////////////////////////////////////////////////////////////////
