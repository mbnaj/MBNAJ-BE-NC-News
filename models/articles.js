const db = require("../db/connection");

exports.selectArticles = () => {
  let sql = `SELECT 
  articles.title,
  articles.article_id,
  articles.body,
  articles.topic,
  articles.created_at,
  articles.votes,
  users.name AS author,
  count(comments.*) AS comment_count 
  FROM articles 
  LEFT JOIN users ON users.username=articles.author
  LEFT JOIN comments ON comments.article_id=articles.article_id 
  GROUP BY articles.article_id,users.name `;

  return db.query(sql).then((data) => {
    return data.rows;
  });
};

exports.selectArticleById = (article_id) => {
  if (typeof article_id !== "number" && article_id < 0) {
    return Promise.reject({ status: 400, message: "Bad Request" });
  }

  let sql = `SELECT 
    articles.title,
    articles.article_id,
    articles.body,
    articles.topic,
    articles.created_at,
    articles.votes,
    users.name AS author,
    count(comments.*) AS comment_count 
    FROM articles 
    INNER JOIN users ON users.username=articles.author
    INNER JOIN comments ON comments.article_id=articles.article_id 
    WHERE articles.article_id=$1
    GROUP BY articles.article_id,users.name
    ; `;

  return db.query(sql, [article_id]).then((data) => {
    return data.rows[0];
  });
};

exports.updateArticleById = (article_id, inc_votes) => {
  article_id = parseInt(article_id);
  inc_votes = parseInt(inc_votes);

  if (typeof article_id !== "number" && article_id < 0) {
    //return Promise.reject({ status: 400, message: "Bad Request" });
  }

  let sql = `UPDATE articles SET votes = votes + $1 where article_id= $2 RETURNING articles.*; `;

  return db.query(sql, [inc_votes, article_id]).then((data) => {
    return data.rows[0];
  });
};
