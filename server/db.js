const {Client,Pool} = require('pg');
require('dotenv').config(); 

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



let NeonDB = new Promise((resolve, reject) => {
    let  DATABASE_URL  = process.env.NEONDB;

    const pool = new Pool({
        connectionString: DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        },
        createTimeoutMillis: 80000,
        connectionTimeoutMillis: 300000,
        acquireTimeoutMillis: 8000, 
        idleTimeoutMillis: 8000000,
        reapIntervalMillis: 10000,
        createRetryIntervalMillis: 10000 
    });
    let conn = pool.connect();  
    if(conn){
        resolve(pool);
    }else{
        reject(conn);
    }
    
})

module.exports = {
    PgAdmin,
    NeonDB
}
