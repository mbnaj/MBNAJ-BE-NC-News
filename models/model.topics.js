const db = require("../db/connection");

exports.selectTopics = () => {
  let sql = `SELECT *  FROM topics ; `;

  return db.query(sql).then((data) => {
    return data.rows;
  });
};
////////////////////////////////////////////////////////////////////////////////////
exports.insertTopic = (slug, description) => {
  let sql = `INSERT INTO topics (slug,description) VALUES ($1,$2) RETURNING * ;`;

  return db.query(sql, [slug, description]).then((data) => {
    return data.rows[0];
  });
};
////////////////////////////////////////////////////////////////////////////////////
