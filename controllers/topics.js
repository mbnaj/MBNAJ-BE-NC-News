const { selectTopics } = require('../models/topics.js')

exports.getTopics = (req, res, next) => {
  return selectTopics()
    .then((data) => {
      res.status(200).send({ topics: data })
    })
    .catch((err) => {
      next(err)
    })
}
