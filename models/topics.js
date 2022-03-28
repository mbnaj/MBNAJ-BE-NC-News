const db = require('../db/connection');

exports.selectTopics = () => {

    let sql = `select *  from topics ; `;
    
    return db.query(sql)
    .then((data)=>{
        return data.rows;
    });

};