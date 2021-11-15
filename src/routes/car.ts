import {Router} from 'express';
import { carProductsController } from '../controllers/carproducts';
import asyncHandler from 'express-async-handler';
import { EmailService } from '../services/email';

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

router.post('/send-email', async (req, res) => {
    const { body } = req;

    if (!body || !body.dest || !body.subject || !body.content)
        return res.status(400).json({
        msg: "mandame en el body los siguientes datos: 'dest', 'subject' y 'content'",
        body,
        });

    const destination = body.dest;
    const subject = body.subject;
    const content = body.content;

    try {
        const response = await EmailService.sendEmail(
        destination,
        subject,
        content
        );

        res.json(response);
    } catch (err) {
        res.status(500).json(err);
    }
});


router.post('submit');

export default router;