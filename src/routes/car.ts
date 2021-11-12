import {Router} from 'express';
import { carProductsController } from '../controllers/carproducts';
import asyncHandler from 'express-async-handler';

const router = Router();

router.get(
    '/:id?',carProductsController.checkProductCarExists, 
    asyncHandler(carProductsController.getProductsCar)
);
router.post(
    '/', carProductsController.checkAddProductCar,
    asyncHandler(carProductsController.addProductsCar)
);
router.delete(
    '/:id', carProductsController.checkProductCarExists,
    asyncHandler(carProductsController.deleteProductsCar)
);

export default router;