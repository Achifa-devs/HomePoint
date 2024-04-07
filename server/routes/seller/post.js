const { 
    RegisterSeller, 
    LoginSeller, 
    PostNewPropertyMetaData 
} = require("../../controllers/seller/post");
const { 
    express, 
    parser 
} = require("../../modules");

const sellerPostRouter = express.Router();

sellerPostRouter.post('/seller.login', parser, LoginSeller)
sellerPostRouter.post('/seller.signup', parser, RegisterSeller)
sellerPostRouter.post('/seller.new_property', parser, PostNewPropertyMetaData)

module.exports = sellerPostRouter;