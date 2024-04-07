const { 
    GetPerformance,
    GetPropertiesReq,
    GetPropertyReq,
    GetThumbnailReq,
    GetFilesReq,
    GetWalletReq 
} = require("../../controllers/seller/get");
const { 
    express 
} = require("../../modules");
const sellerGetRouter = express.Router();

sellerGetRouter.get('/', GetPerformance)
sellerGetRouter.get('/seller.properties', GetPropertiesReq)
sellerGetRouter.get('/seller.property', GetPropertyReq)
sellerGetRouter.get('/seller.thumbnail', GetThumbnailReq)
sellerGetRouter.get('/seller.files', GetFilesReq)
// sellerGetRouter.get('/seller.profile', )
sellerGetRouter.get('/seller.wallet', GetWalletReq)
sellerGetRouter.get('/seller.transactions', GetThumbnailReq)

module.exports = sellerGetRouter;