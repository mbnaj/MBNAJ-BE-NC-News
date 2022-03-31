const express = require('express');
const { getAPI } = require('../db/helpers/utils');
const acrticlesRouter = require('./router.articles');
const topicsRouter = require('./router.topics');
const usersRouter = require('./router.users');
const commentsRouter = require('./router.comments');

const apiRouter = express.Router();

apiRouter.use('/articles',acrticlesRouter);
apiRouter.use('/topics',topicsRouter);
apiRouter.use('/users',usersRouter);
apiRouter.use('/comments',commentsRouter);

//////////////////////////////////////////////////////////////
// GET /api
//////////////////////////////////////////////////////////////
apiRouter.get('/', getAPI);




module.exports = apiRouter;