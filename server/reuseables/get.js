const { PgAdmin } = require("../db");

async function GetProperty(property_ref) {
    return(
        await PgAdmin
        .then(async(pool) => {        
            await pool.query(`SELECT * from "properties_meta_data" where "property_ref" = '${property_ref}'`)
            .then((result) => result.rows)
            .catch((err) => console.log('Product Not Deleted: ', err))
        })
        .catch(err => console.log('Product Not Deleted: ', err)) 
    )
}

async function GetProperties() {
    return(
        await PgAdmin
        .then(async(pool) => {        
            await pool.query(`SELECT * from "properties_meta_data"`)
            .then((result) => result.rows)
            .catch((err) => console.log('Product Not Deleted: ', err))
        })
        .catch(err => console.log('Product Not Deleted: ', err)) 
    )
}

async function GetPropertyFiles(property_ref) {
    return(
        await PgAdmin
        .then(async(pool) => {        
            await pool.query(`SELECT * from "property_files" where "property_ref" = '${property_ref}'`)
            .then((result) => result.rows)
            .catch((err) => console.log('Product Not Deleted: ', err))
        })
        .catch(err => console.log('Product Not Deleted: ', err)) 
    )
}

async function GetPropertyFile(property_ref) {
    return(
        await PgAdmin
        .then(async(pool) => {        
            await pool.query(`SELECT * from "property_files" where "property_ref" = '${property_ref}'`)
            .then((result) => result.rows[0])
            .catch((err) => console.log('Product Not Deleted: ', err))
        })
        .catch(err => console.log('Product Not Deleted: ', err)) 
    )
}

async function GetUserWallet(userid) {
    return(
        await PgAdmin
        .then(async(pool) => {        
            await pool.query(`SELECT * from "wallet" where "userid" = '${userid}'`)
            .then((result) => result.rows)
            .catch((err) => console.log('Product Not Deleted: ', err))
        })
        .catch(err => console.log('Product Not Deleted: ', err)) 
    )
}

async function GetUserTransactions(userid) {
    return(
        await PgAdmin
        .then(async(pool) => {        
            await pool.query(`SELECT * from "transactions" where "userid" = '${userid}'`)
            .then((result) => result.rows)
            .catch((err) => console.log('Product Not Deleted: ', err))
        })
        .catch(err => console.log('Product Not Deleted: ', err)) 
    )
}

async function GetUser(userid) {
    return(
        await PgAdmin
        .then(async(pool) => {        
            await pool.query(`SELECT * from "register" where "userid" = '${userid}'`)
            .then((result) => result.rows)
            .catch((err) => console.log('Product Not Deleted: ', err))
        })
        .catch(err => console.log('Product Not Deleted: ', err)) 
    )
}

async function GetClicks() {
    return(
        await PgAdmin
        .then(async(pool) => {        
            await pool.query(`SELECT * from "clicks"`)
            .then((result) => result.rows.length)
            .catch((err) => console.log('Product Not Deleted: ', err))
        })
        .catch(err => console.log('Product Not Deleted: ', err)) 
    )
}

async function GetImpressions() {
    return(
        await PgAdmin
        .then(async(pool) => {        
            await pool.query(`SELECT * from "impressions"`)
            .then((result) => result.rows.length)
            .catch((err) => console.log('Product Not Deleted: ', err))
        })
        .catch(err => console.log('Product Not Deleted: ', err)) 
    )
}

async function GetLikes() {
    return(
        await PgAdmin
        .then(async(pool) => {        
            await pool.query(`SELECT * from "likes"`)
            .then((result) => result.rows.length)
            .catch((err) => console.log('Product Not Deleted: ', err))
        })
        .catch(err => console.log('Product Not Deleted: ', err)) 
    )
}


let erroDeletion = async(property_ref) => (
    await PgAdmin.then((pool) => {
        return(
            pool.query(
                `DELETE FROM properties_meta_data WHERE property_ref = '${property_ref}'`
            )
            .then((result) => {
                if(result.rowCount > 0){
                    res.status(401).send({error: 'Error Uploading New Product, Unfinished Storage Deleted', bool: false, data: null})
                }
            })
            .catch((err) => {
                console.log('ErrorUploading New Product, Unfinished Storage Deleted: ', err)
                res.status(401).send({error: 'ErrorUploading New Product', bool: false, data: null})
            })
        )
    })
    .catch((err) => {
        console.log('Error Deleting Stored Data: ', err)
        return({error: err.message, bool: false, data: null})
    })
)


module.exports = {
    GetProperty,
    GetProperties,
    GetPropertyFiles,
    GetPropertyFile,
    GetUserTransactions,
    GetUserWallet,
    GetUser,
    GetClicks,
    GetImpressions,
    GetLikes,

    erroDeletion
}