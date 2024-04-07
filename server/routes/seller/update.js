const { 
    UpdateProduct, 
    UpdatePwd, 
    UpdateProfile, 
    UpdateOrders
} = require("../../controllers/seller/update");
const { 
    express, 
    parser 
} = require("../../modules");
const sellerUpdateRouter = express.Router();

sellerUpdateRouter.post('/seller.update_product', parser, UpdateProduct)
sellerUpdateRouter.post('/seller.update_pwd', parser, UpdatePwd)
// sellerUpdateRouter.post('/seller.update_payment_method', parser, UpdatePaymentMethod)
sellerUpdateRouter.post('/seller.update_profile', parser, UpdateProfile)
sellerUpdateRouter.post('/seller.update_orders', parser, UpdateOrders)

module.exports = sellerUpdateRouter;