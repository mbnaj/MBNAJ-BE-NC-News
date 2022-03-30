const db = require("../db/connection");

exports.selectArticles = (keyword,sort_by = "created_at",order = "desc",limit = 10,offset = 0) => {
  let filter = [];
  limit = parseInt(limit);
  offset = parseInt(offset);

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

  if (keyword.hasOwnProperty("topic")) {
    sql += ` WHERE LOWER(topic) LIKE $1 `;
    filter.push("%" + keyword["topic"].toString().toLowerCase() + "%");
  }

  sql += ` GROUP BY articles.article_id,users.name `;

  if (
    [
      "title",
      "article_id",
      "created_at",
      "votes",
      "comment_count",
      "author",
    ].includes(sort_by)
  ) {
    if (["ASC", "DESC", "asc", "desc"].includes(order)) {
      sql += ` ORDER BY ${sort_by} ${order}`;
    }
  }

  if (Number.isInteger(limit) && limit > 0) {
    sql += ` LIMIT  ${limit} `;
  }

  if (Number.isInteger(offset) && offset > 0) {
    sql += ` OFFSET  ${offset} `;
  }

  return db.query(sql, filter).then((data) => {
    return data.rows;
  });
};

////////////////////////////////////////////////////////////////////////////////////
exports.selectArticleById = (article_id) => {
  article_id = parseInt(article_id);

  if (Number.isInteger(article_id) === false || article_id < 0) {
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
  console.log(article_id, "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");
  return db.query(sql, [article_id]).then((data) => {
    console.log(data.rows, "CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC");
    return data.rows[0];
  });
};
////////////////////////////////////////////////////////////////////////////////////
exports.updateArticleById = (article_id, inc_votes) => {
  article_id = parseInt(article_id);
  inc_votes = parseInt(inc_votes);

  if (typeof article_id !== "number" && article_id < 0) {
    return Promise.reject({ status: 400, message: "Bad Request" });
  }

  let sql = `UPDATE articles SET votes = votes + $1 where article_id= $2 RETURNING articles.*; `;

  return db.query(sql, [inc_votes, article_id]).then((data) => {
    return data.rows[0];
  });
};
////////////////////////////////////////////////////////////////////////////////////
exports.insertArticle = (author, title, body, topic) => {
  if (author == "" || title == "" || body == "" || topic == "") {
    return Promise.reject({ status: 400, message: "Bad Request" });
  }

  let promises = [
    db.query(`SELECT * from users WHERE username =$1;`, [author]),
    db.query(`SELECT * from topics WHERE slug =$1;`, [topic]),
  ];

  return Promise.all(promises).then(([userData, topicData]) => {
    if (userData.rowCount > 0 && topicData.rowCount > 0) {
      let sql = `INSERT INTO articles (author,title,body,topic) VALUES( $1,$2,$3,$4) RETURNING *; `;

      return db.query(sql, [author, title, body, topic]).then((returnData) => {
        let article_id = returnData.rows[0].article_id;
        console.log(article_id, "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
        return this.selectArticleById(article_id).then((data) => {
          console.log(data, "DDDDDDDDDDDDDDDDDDDDDDDDD");
          return data;
        });
      });
    } else {
      return Promise.reject({ status: 400, message: "Bad Request" });
    }
  });
};
////////////////////////////////////////////////////////////////////////////////////
exports.removeArticleById = (article_id) => {
  article_id = parseInt(article_id);

  if (Number.isInteger(article_id) === false || article_id < 0) {
    return Promise.reject({ status: 400, message: "Bad Request" });
  }

  return db
    .query(`SELECT * FROM articles WHERE article_id = $1; `, [article_id])
    .then((data) => {
      if (data.rowCount === 0) {
        return Promise.reject({ status: 404, message: "Not Found" });
      }
      return db
        .query(`DELETE FROM comments WHERE article_id =$1`, [article_id])
        .then(() => {
          return db
            .query(`DELETE FROM articles WHERE article_id =$1`, [article_id])
            .then(() => {
              return true;
            });
        });
    });
};
////////////////////////////////////////////////////////////////////////////////////
