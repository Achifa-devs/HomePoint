const { NeonDB } = require("../../db");
const { shortId } = require("../../modules");
const { erroDeletion } = require("../../reuseables/get");


async function UpdateProduct(req,res) {
    let {
        title, 
        description,
        features,
        category,
        type,
        price,
        location,
        status,
        negotiable,
        files,
        property_ref
    }=req.body

    try {
        let date = new Date();
        let fileid = shortId.generate();
    
        let fileUploadResponse = async(file,type) => (
            await NeonDB.then((pool) => {
                return(
                    pool.query(
                        `INSERT INTO property_files(
                            id,
                            property_ref,
                            file,
                            type,
                            fileid
                        )
                        VALUES(
                            DEFAULT,
                            '${property_ref}',
                            '${file}',
                            '${type}',
                            '${fileid}'
                        )
                        `
                    )
                    .then((result) => {
                        if(result.rowCount > 0){
                            return({error: null, bool: true, data: result.rowCount})
                        }else{
                            return({error: 'New Product File Not Uploaded', bool: false, data: result.rowCount})
                        }
                    })
                    .catch((err) => {
                        console.log('Error Uploading New Product File: ', err)
                        return({error: err.message, bool: false, data: null})
                    })
                )
            })
            .catch((err) => {
                console.log('Error Uploading New Product File: ', err)
                return({error: err.message, bool: false, data: null})
            })
        )
    
        
    
        new Promise(async(resolve, reject) => {
            await NeonDB
            .then(async(pool) => {
                    
                pool.query(`UPDATE "properties_meta_data" set 
                
                title='${title}',
                description='${description}',
                features='${JSON.stringify(features)}',
                category='${category}',
                type='${type}',
                price='${price}',
                location='${location}',
                negotiable='${negotiable}',
                status='${status}',
                date='${date}'
        
                where "property_ref" = '${property_ref}'`)
                .then((result) => {
                    if(result.rowCount > 0){
                        resolve(true)
                    }else{
                        console.log('Product Not Updated: ', err)
                        reject({error: 'Product Not Updated', bool: false, data: null})
                    }
                })
                .catch((err) => {
                    console.log('Product Not Updated: ', err)
                    reject({error: err, bool: false, data: null})
                })
                
            })
            .catch(err => {
                console.log('Product Not Updated: ', err)
                reject({error: err, bool: false, data: null})
            }) 
        })
        .then(async() => 
            await NeonDB
            .then(async(pool) => 
                    
                await pool.query(`DELETE from "property_files" where "property_ref" = '${property_ref}'`)
                .then((result) => {
                    if(result.rowCount > 0){
                        return(true)
                    }else{
                        console.log('Product files Not Deleted: ', err)
                        return(false)
                    }
                })
                .catch((err) => {
                    console.log('Product files Not Deleted: ', err)
                    res.status(401).send({error: 'Product files Not Deleted', bool: false, data: null})
                })
                
            )
            .catch(err => {
                console.log('Product Not Deleted: ', err)
                res.status(401).send({error: 'Product files Not Deleted Cause Of Database Connection...', bool: false, data: null})
            })
        )
        .then(async() => { 
            let handleFileUpload = await Promise.all(files.map(async(item) =>  await fileUploadResponse(item.file, item.type)))
            let response = handleFileUpload.filter(item => item.bool === false)
            if(!response.length > 0){
                res.status(200).send({error: handleFileUpload, bool: true, data: null})
            }else{
                await erroDeletion(property_ref)
            }
        })
        .catch((err) => {
            console.log('Error Uploading New Product File: ', err)
            res.status(401).send({error: err.message, bool: false, data: null})
        })
    } catch (error) {
        console.log("Error While Updating Property: ",error)
    }
}

async function UpdatePwd(req,res) {
    let {
       userid,
       pwd
    }=req.body
    
    let hashedPwd = await bcrypt.hash(pwd, 20);
    await NeonDB
    .then(async(pool) => {
            
        pool.query(`UPDATE "register" set 
        'pwd'='${hashedPwd}'
        where "userid" = '${userid}'`)
        .then((result) => {
            if(result.rowCount > 0){
                res.status(200).send({error: null, bool: true, data: result.rowCount})
            }else{
                console.log('Product Not Updated: ', err)
                res.status(401).send({error: 'Product Not Updated', bool: false, data: null})
            }
        })
        .catch((err) => {
            console.log('Product Not Updated: ', err)
            res.status(401).send({error: err, bool: false, data: null})
        })
        
    })
    .catch(err => {
        console.log('Product Not Updated: ', err)
        reject({error: err, bool: false, data: null})
    }) 
}

async function UpdateProfile(req,res) {
    
}

async function UpdateOrders(req,res) {
    
}

module.exports = {
    // UpdatePaymentMethod,
    UpdateOrders,
    UpdateProduct,
    UpdateProfile,
    UpdatePwd
};