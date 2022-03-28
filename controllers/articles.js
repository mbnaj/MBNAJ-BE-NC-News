const { selectArticles} = require('../models/article.js');
  
  
  exports.getArticles = (req, res,next) => {

    return selectArticles().then((data) => {
      res.status(200).send({article:data});
    })
    .catch((err)=>{
      next(err);
    });
  };
  