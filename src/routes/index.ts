import {Router} from 'express';
import productsRouter from './products';
import carRouter from './car';
import HandleError from '../controllers/handleerror'
import AuthRouter from './auth';
import userRouter from './user';
import { isLoggedIn } from '../middleware/admin';

const router = Router();

router.use('/auth', AuthRouter);
router.use('/products', productsRouter);
router.use('/car', isLoggedIn, carRouter);
router.use('/user', userRouter);
router.use('*', HandleError.genericError)

export default router;