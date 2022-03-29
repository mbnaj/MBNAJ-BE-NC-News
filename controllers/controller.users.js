const { selectUsers } = require('../models/model.users.js')

exports.getUsers = (req, res, next) => {
  return selectUsers()
    .then((data) => {
      res.status(200).send({ users: data })
    })
    .catch((err) => {
      next(err)
    })
}