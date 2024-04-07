const { 
    DeleteProduct 
} = require("../../controllers/seller/delete");
const { 
    express 
} = require("../../modules");

const sellerDeleteRouter = express.Router();

sellerDeleteRouter.delete('/seller.delete.property', DeleteProduct)

module.exports =sellerDeleteRouter;