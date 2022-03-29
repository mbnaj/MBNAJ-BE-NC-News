const db = require("../db/connection");

exports.selectArticles = (keyword,sort_by='created_at',order='asc') => {
  let filter = [];
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
  LEFT JOIN comments ON comments.article_id=articles.article_id `;

  if(keyword.hasOwnProperty('topic')){
    sql+= ` WHERE LOWER(topic) LIKE $1 `;
    filter.push('%' + keyword['topic'].toString().toLowerCase() + '%'); 
  }

  sql+= ` GROUP BY articles.article_id,users.name `;

  if(['title','article_id','created_at','votes','comment_count','author'].includes(sort_by)){
    if(['ASC','DESC','asc','desc'].includes(order)){
      sql+= ` ORDER BY ${sort_by} ${order}`;
    }
  }

  return db.query(sql,filter).then((data) => {
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
