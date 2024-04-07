
const { resolve } = require('path');
const {Client,Pool} = require('pg');


let PgAdmin = new Promise((resolve, reject) => {
    try {
        let pool = new Pool({
            user: 'Fabian',
            port: '5432',
            database: 'homepoint',
            password: 'asdfghjkl', 
            host: 'localhost' 
        })
 
        let conn = pool.connect();

        if (conn) {
            resolve(pool)
        }else{
            reject(conn)
        }
    } catch (error) {
        console.log(error)
    }
})

module.exports = {
    PgAdmin
}
