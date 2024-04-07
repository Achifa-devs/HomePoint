const { 
    GetProperties,
    GetClicks,
    GetImpressions,
    GetLikes,
    GetProperty,
    GetPropertyFile,
    GetPropertyFiles,
    GetUserWallet,
    GetUserTransactions 
} = require("../../reuseables/get")

async function GetPerformance(req,res) {

    let clicks = await GetClicks()
    let impressions = await GetImpressions()
    let likes = await GetLikes()

    let properties = await GetProperties()
    let availble=[]
    let unavailble=[]

    properties.map((item) => {
        if(item.status === 'availble'){
            availble.push(true)
        }else{
            unavailble.push(true)
        }
    })

    res.status(200).send({engagements: {clicks,impressions,likes}, status: {availble,unavailble}})
}

async function GetPropertiesReq(req,res) {
    let data = await GetProperties()
    res.status(200).send(data)

}

async function GetPropertyReq(req,res) {
    let {
        property_ref
    }=req.query
    let data = await GetProperty(property_ref)
    res.status(200).send(data)
}

async function GetThumbnailReq(req,res) {
    let {
        property_ref
    }=req.query
    let data = await GetPropertyFile(property_ref)
    res.status(200).send(data)
}

async function GetFilesReq(req,res) {
    let {
        property_ref
    }=req.query
    let data = await GetPropertyFiles(property_ref)
    res.status(200).send(data)
}

async function GetWalletReq(req,res) {
    let {
        userid
    }=req.query
    let data = await GetUserWallet(userid)
    res.status(200).send(data)
}

async function GetTransactionReq(req,res) {
    let {
        userid
    }=req.query
    let data = await GetUserTransactions(userid)
    res.status(200).send(data)
}


module.exports = {
    GetPerformance,
    GetPropertiesReq,
    GetPropertyReq,
    GetThumbnailReq,
    GetFilesReq,
    GetWalletReq,
    GetUserWallet,
    GetTransactionReq,
    GetUserTransactions
    
};