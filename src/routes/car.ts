import {Router} from 'express';
import { carProductsController } from '../controllers/carproducts';
import asyncHandler from 'express-async-handler';

const router = Router();

router.get(
    '/',carProductsController.checkProductCarExists, 
    asyncHandler(carProductsController.getCarByUser)
);
router.post(
    '/add', carProductsController.checkAddProductCar,
    asyncHandler(carProductsController.addProductsCar)
);
router.post(
    '/delete', carProductsController.checkProductCarExists,
    asyncHandler(carProductsController.deleteProduct)
);

router.post('submit');

export default router;