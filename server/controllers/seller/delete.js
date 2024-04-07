

async function DeleteProduct(req,res) {
    let {
        property_ref
    } = req.body; 

 
    try {
        new Promise((resolve, reject) => {
            NeonDB
            .then(async(pool) => {
                    
                pool.query(`DELETE from "properties_meta_data" where "property_ref" = '${property_ref}'`)
                .then((result) => {
                    if(result.rowCount > 0){
                        resolve(true)
                    }else{
                        console.log('Product Not Deleted: ', err)
                        reject({error: 'Product Not Deleted', bool: false, data: null})
                    }
                })
                .catch((err) => {
                    console.log('Product Not Deleted: ', err)
                    reject({error: err, bool: false, data: null})
                })
                
            })
            .catch(err => {
                console.log('Product Not Deleted: ', err)
                reject({error: err, bool: false, data: null})
            }) 
        }) 
        .then(() => {
            NeonDB
            .then(async(pool) => {
                    
                pool.query(`DELETE from "properties_files" where "property_ref" = '${property_ref}'`)
                .then((result) => {
                    if(result.rowCount > 0){
                        res.status(200).send({error: 'Product files Deleted', bool: true, data: null})
                    }else{
                        console.log('Product files Not Deleted: ', err)
                        res.status(401).send({error: 'Product files Not Deleted', bool: false, data: null})
                    }
                })
                .catch((err) => {
                    console.log('Product files Not Deleted: ', err)
                    res.status(401).send({error: 'Product files Not Deleted', bool: false, data: null})
                })
                
            })
            .catch(err => {
                console.log('Product Not Deleted: ', err)
                res.status(401).send({error: 'Product files Not Deleted Cause Of Database Connection...', bool: false, data: null})
            })
        })
        .catch(err => {
            console.log('Product Not Deleted: ', err)
            res.status(401).send({error: 'Product Files Not Deleted Cause Error Occured Meta Data Deletion Process...', bool: false, data: null})
        }) 
    } catch (error) {
        console.log(error)
    }
}


module.exports ={
    DeleteProduct
}