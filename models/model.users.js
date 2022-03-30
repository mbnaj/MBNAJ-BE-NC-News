const db = require('../db/connection');

exports.selectUsers = () => {

    let sql = `SELECT * FROM users ; `;
    
    return db.query(sql)
    .then((data)=>{
        return data.rows;
    });

};


exports.selectUser = (username) => {

    let sql = `SELECT * FROM users WHERE username=$1 ; `;
    
    return db.query(sql,[username])
    .then((data)=>{
        if (data.rowCount === 0) {
            return Promise.reject({ status: 404, message: "Not Found" });
        }
        return data.rows[0];
    });

};

