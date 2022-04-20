const express = require('express');
const { getCommentsByArticleId,postCommentsByArticleId ,deleteCommentById,patchCommentsById} = require('../controllers/controller.comments');

const commentsRouter = express.Router();



//////////////////////////////////////////////////////////////
// DELETE /api/comments/:comment_id
//////////////////////////////////////////////////////////////
commentsRouter.delete('/:comment_id', deleteCommentById);

//////////////////////////////////////////////////////////////
// PATCH /api/comments/:comment_id
//////////////////////////////////////////////////////////////
commentsRouter.patch('/:comment_id', patchCommentsById);



module.exports = commentsRouter;


