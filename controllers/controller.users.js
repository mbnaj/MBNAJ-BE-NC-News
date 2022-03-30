const { selectUsers,selectUser } = require('../models/model.users.js')

exports.getUsers = (req, res, next) => {
  return selectUsers()
    .then((data) => {
      res.status(200).send({ users: data })
    })
    .catch((err) => {
      next(err)
    })
}

exports.getUser = (req, res, next) => {
  const { username } = req.params;
  return selectUser(username)
    .then((data) => {
      res.status(200).send({ user: data })
    })
    .catch((err) => {
      next(err)
    })
}
