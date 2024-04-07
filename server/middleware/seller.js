const { 
    jwt 
} = require("../../modules");
const { 
    PgAdmin 
} = require("../db");

const seller_authentication = (req, res, next) => {
    //const token = req.cookies.author_JWT; 
    const token = req.body.jwt; 
    console.log("token", req.body)
    //check json web token exists & verified
    if(token) {
        jwt.verify(token, 'homepoint_JWT', (err, decodedToken) => {
            if(err){
                res.status(200).send(false)
            }else{
                res.status(200).send(true)
            }
        })
    }else{
        res.status(200).send(false)
    } 
}

const check_seller = (req, res, next) => {
    //const token = req.cookies.author_JWT; 
    const token = req.body.jwt; 
    console.log("token", req.body)
    //check json web token exists & verified
    if (token) {
        jwt.verify(token, 'homepoint_JWT', async (err, decodedToken) => {
            if (err) {
                console.log(err)
                res.status(401).send('err verifying jwt')
                next();
            } else {
                //console.log(decodedToken);
                PgAdmin
                .then((pool) => {
                    pool.query(`select * from "register" where "userid" = '${decodedToken.id}'`)
                    .then((result, err) => {
                        if(result){
                            res.status(200).send({bool: true, user: result.rows[0]});
                            next();
                        }else{
                            console.log(err)
                            res.status(401).send('no record on db');
                        }
                    })
                })
                .catch((err) => {
                    console.log(err)
                    res.status(401).send(false);
                })
                
            }
        })
    } else {
        res.status(401).send('token is missing')
        next();
    }
}

module.exports = {check_seller}
