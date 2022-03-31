const express = require('express');
const { getCommentsByArticleId,postCommentsByArticleId ,deleteCommentById} = require('../controllers/controller.comments');

const commentsRouter = express.Router();



//////////////////////////////////////////////////////////////
// DELETE /api/comments/:comment_id
//////////////////////////////////////////////////////////////
commentsRouter.delete('/:comment_id', deleteCommentById);


module.exports = commentsRouter;


