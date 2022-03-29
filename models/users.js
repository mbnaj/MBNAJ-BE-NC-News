const db = require('../db/connection');

exports.selectUsers = () => {

    let sql = `SELECT * FROM users ; `;
    
    return db.query(sql)
    .then((data)=>{
        return data.rows;
    });

};