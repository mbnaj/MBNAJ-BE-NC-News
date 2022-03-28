const db = require('../db/connection');

exports.selectTopics = () => {

    let sql = `SELECT *  FROM topics ; `;
    
    return db.query(sql)
    .then((data)=>{
        return data.rows;
    });

};