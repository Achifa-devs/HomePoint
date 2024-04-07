const { 
    aleaRNGFactory 
} = require("number-generator");
const { 
    NeonDB 
} = require("../../db");
const { 
    bcrypt, 
    shortId, 
    jwt
} = require("../../modules");
const { erroDeletion } = require("../../reuseables/get");
const maxAge = 90 * 24 * 60 * 60; 

const createToken = (id) => {
    return jwt.sign({ id }, 'homepoint_JWT', {
        expiresIn: maxAge
    });
}; 


async function RegisterSeller(req,res) {

    let  {
        fname,
        lname,
        email,
        phone,
        address,
        gender,
        age,
        coverphoto,
        password,
        role
    } = req.body;


    try {
        const { 
            uInt32
        } = aleaRNGFactory(10);


        let hashedPwd = await bcrypt.hash(password, 20);
        let date = new Date();
        let userid = shortId.generate();

        let walletid = shortId.generate();
        let accounNo = uInt32()

        let registrationResponse = async() => (
            await NeonDB.then((pool) => {
                return(
                    pool.query(
                        `INSERT INTO register(
                            id,
                            firstname,
                            lastname,
                            email,
                            number,
                            address,
                            gender,
                            age,
                            coverphoto,
                            pwd,
                            isactive,
                            isverified,
                            lastseen,
                            role,
                            bio,
                            userid,
                            date
                        )
                        VALUES(
                            DEFAULT,
                            '${fname}',
                            '${lname}',
                            '${email}', 
                            '${phone}',
                            '${JSON.stringify(address)}',
                            '${gender}',
                            '${JSON.stringify(age)}',
                            '${coverphoto}',
                            '${hashedPwd}',
                            ${false},
                            ${false},
                            '${date}',
                            '${JSON.stringify({"buyer": role === 0 ? "true" : "false", "seller": role === 1 ? "true" : "false"})}',
                            '${''}',
                            '${userid}',
                            '${date}'
                        )
                        `
                    )
                    .then((result) => {
                        if(result.rowCount > 0){
                            return({error: null, bool: true, data: result.rowCount})
                        }else{
                            return({error: 'User Not Registered', bool: false, data: result.rowCount})
                        }
                    })
                    .catch((err) => {
                        console.log('Error registering seller: ', err)
                        return({error: err.message, bool: false, data: null})
                    })
                )
            })
            .catch((err) => {
                console.log('Error from seller registration function: ', err)
                return({error: err.message, bool: false, data: null})
            })
        )

        let walletCreationResponse = async() => (
            await NeonDB.then((pool) => {
                return(
                    pool.query(
                        `INSERT INTO wallet(
                            id,
                            walletid,
                            account,
                            balance,
                            userid
                        )
                        VALUES(
                            DEFAULT,
                            '${walletid}',
                            ${accounNo},
                            ${0},
                            '${userid}'
                        )
                        `
                    )
                    .then((result) => {
                        if(result.rowCount > 0){
                            return({error: null, bool: true, data: result.rowCount})
                        }else{
                            return({error: 'User Wallet Not Created', bool: false, data: result.rowCount})
                        }
                    })
                    .catch((err) => {
                        console.log('Error Creating Seller Wallet: ', err)
                        return({error: err.message, bool: false, data: null})
                    })
                )
            })
            .catch((err) => {
                console.log('Error From Seller Wallet Creation: ', err)
                return({error: err.message, bool: false, data: null})
            })
        )

        let erroDeletion = async() => (
            await NeonDB.then((pool) => {
                return(
                    pool.query(
                        `DELETE FROM register WHERE userid = '${userid}'`
                    )
                    .then((result) => {
                        if(result.rowCount > 0){
                            res.status(401).send({error: 'Error registering seller, Unfinished Storage Deleted', bool: false, data: null})
                        }
                    })
                    .catch((err) => {
                        console.log('Error registering seller, Unfinished Storage Deleted: ', err)
                        res.status(401).send({error: 'Error registering seller', bool: false, data: null})
                    })
                )
            })
            .catch((err) => {
                console.log('Error Deleting Stored Data: ', err)
                return({error: err.message, bool: false, data: null})
            })
        )

        new Promise(async(resolve, reject) => {
            let handleRegistration = await registrationResponse()
            if(handleRegistration.bool){
                resolve(true)
            }else{
                reject(handleRegistration)
            } 
        })
        .then(async() => {
            let handleWalletCreation = await walletCreationResponse()
            if(handleWalletCreation.bool){
                res.status(200).send({error: handleWalletCreation, bool: true, data: null})
            }else{
                await erroDeletion()
            }
        })
        .catch (handleRegistration => {

            res.status(401).send({error: handleRegistration, bool: false, data: null})
        })


    } catch (error) {
        console.log('error caught in seller registration try/catch block: ', error)
    }


}

async function LoginSeller(req,res) {
    let {
        email,
        pwd
    } = req.body; 

 
    try {
        new Promise((resolve, reject) => {
            NeonDB
            .then(async(pool) => {
                    
                pool.query(`select "id" from "register" where "email" = '${email}'`, (err, result) => {
                    
                    if(!err){
                        if(result.rows.length > 0){
                            const id = result.rows[0].id;
                            resolve(id)
                        }else{
                            
                            reject({Mssg: "Email is not registered..."});
                        }
                    }else{
                        console.log("Error Getting Seller Email On Login: ",err)
                    }
                    
                })
                
            });
        })
        .then(async(id) => {
            return(
                NeonDB
                .then(async(pool) => {
                    let database_return_value = await pool.query(
                        `select * from  "register" where "id" = '${id}'`
                    )
                    .then(result => result.rows[0])
                    .catch(err => console.log(err))
    
                    return database_return_value
                })
            )
            
        }) 
        .then(async(user) => {
            if(user){
                const auth = await bcrypt.compare(pwd, user.pwd);
                if (auth) {
                    const token = createToken(user.userid);
    
                    res.cookie('homepoint_JWT', token, {
                        maxAge: maxAge * 1000,
                        httpOnly: true,
                        secure: false,
                        sameSite: 'none',
                        path: '/'
                    }); 
                    res.send({
                        bool: true,  
                        mssg: "Authentication Successful"
                    }) 
                    // res.status(200).send({bool: true, id: user});
        
                }else{
                    res.send({
                        bool: false,
                        mssg: "Invalid password"
                    })
                }
            }else{ 
                res.send({
                    bool: false,
                    mssg: "Email is not registered"
                })  
            }
        })  
        .catch(err => {
            res.send({
                bool: false,
                mssg: "Email is not registered"
            }) 
            console.log("Error Logging Seller In: ", err)
        })
    } catch (error) {
        console.log(error)
    }
}

async function PostNewPropertyMetaData(req,res) {
    
    let {
        title, 
        description,
        features,
        category,
        type,
        price,
        location,
        status,
        userid,
        negotiable,
        files
    }=req.body

    try {
        
        let date = new Date();
        let property_ref = shortId.generate();
        let fileid = shortId.generate();

        let productUploadResponse = async() => (
            await NeonDB.then((pool) => {
                return(
                    pool.query(
                        `INSERT INTO properties_meta_data(
                            id,
                            title,
                            description,
                            features,
                            category,
                            type,
                            price,
                            location,
                            negotiable,
                            status,
                            userid,
                            property_ref,
                            date
                        )
                        VALUES(
                            DEFAULT,
                            '${title}',
                            '${description}',
                            '${JSON.stringify(features)}',
                            '${category}',
                            '${type}',
                            '${price}',
                            '${JSON.stringify(location)}',
                            '${negotiable}',
                            '${status}',
                            '${userid}',
                            '${property_ref}',
                            '${date}'
                        )
                        `
                    )
                    .then((result) => {
                        if(result.rowCount > 0){
                            return({error: null, bool: true, data: result.rowCount})
                        }else{
                            return({error: 'New Product Not Uploaded', bool: false, data: result.rowCount})
                        }
                    })
                    .catch((err) => {
                        console.log('Error Uploading New Product: ', err)
                        return({error: err.message, bool: false, data: null})
                    })
                )
            })
            .catch((err) => {
                console.log('Error Uploading New Product: ', err)
                return({error: err.message, bool: false, data: null})
            })
        )

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
            let handleProductUpload = await productUploadResponse()
            if(handleProductUpload.bool){
                resolve(true)
            }else{
                reject(handleProductUpload)
            } 
        })
        .then(async() => {
            let handleFileUpload = await Promise.all(files.map(async(item) =>  await fileUploadResponse(item.file, item.type)))
            let response = handleFileUpload.filter(item => item.bool === false)
            if(!response.length > 0){
                res.status(200).send({error: handleFileUpload, bool: true, data: null})
            }else{
                await erroDeletion(property_ref)
            }
        })
        .catch (handleProductUpload => {
            res.status(401).send({error: handleProductUpload, bool: false, data: null})
        })


    } catch (error) {
        console.log('error caught in seller product upload try/catch block: ', error)
    }


}


module.exports = {
    RegisterSeller,
    LoginSeller,
    PostNewPropertyMetaData
}