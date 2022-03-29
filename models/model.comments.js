const db = require("../db/connection");

exports.selectComments = () => {
  let sql = `SELECT * FROM comments ; `;

  return db.query(sql).then((data) => {
    return data.rows;
  });
};

exports.selectCommentsByArticleId = (article_id) => {
  article_id = parseInt(article_id);

  if (typeof article_id !== "number" && article_id < 0) {
    return Promise.reject({ status: 400, message: "Bad Request" });
  }

  return db
    .query(`SELECT * FROM articles WHERE article_id = $1; `, [article_id])
    .then((data) => {
      if (data.rows.length > 0) {
        let sql = `SELECT comments.*,users.name AS author FROM comments LEFT JOIN users ON users.username=comments.author WHERE article_id = $1; `;

        return db.query(sql, [article_id]).then((commentsData) => {
          return commentsData.rows;
        });
      } else {
        return [];
      }
    });
};

exports.insertCommentsByArticleId = (article_id, author, body) => {
  let promises = [];
  article_id = parseInt(article_id);

  if (typeof article_id !== "number" && article_id < 0) {
    return Promise.reject({ status: 400, message: "Bad Request" });
  }

  promises[0] = db
    .query(`SELECT * FROM articles WHERE article_id = $1; `, [article_id])
    .then((data) => {
      if (data.rowCount === 0) {
        return Promise.reject({ status: 404, message: "Not Found" });
      }
      return data.rows[0];
    });
  promises[1] = db
    .query(`SELECT * FROM users WHERE username = $1; `, [author])
    .then((data) => {
      if (data.rowCount === 0) {
        return Promise.reject({ status: 404, message: "Not Found" });
      }
      return data.rows[0];
    });

  return Promise.all(promises).then((result) => {
    let sql = `INSERT INTO comments (article_id,author,body) VALUES ($1,$2,$3) RETURNING comments.* ;`;

    return db.query(sql, [article_id, author, body]).then((data) => {
      return data.rows[0];
    });
  });
};
