const db = require("../db/connection");

exports.selectArticles = () => {
  let sql = `SELECT *  FROM articles ; `;

  return db.query(sql).then((data) => {
    return data.rows;
  });
};

exports.selectArticleById = (article_id) => {
  if (typeof article_id !== "number" && article_id < 0) {
    return Promise.reject({ status: 400, message: "Bad Request!!" });
  }

  let sql = `SELECT 
    articles.title,
    articles.article_id,
    articles.body,
    articles.topic,
    articles.created_at,
    articles.votes,users.name as author  
    FROM articles 
    INNER JOIN users ON users.username=articles.author WHERE article_id=$1
    ; `;

  return db.query(sql, [article_id]).then((data) => {
    return data.rows[0];
  });
};
