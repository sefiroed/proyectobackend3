import {Request, Response, NextFunction} from 'express';
import { productsCarAPI } from '../apis/productscar';
import { productsAPI } from '../apis/products';


class CarProduct {

  async checkProductCarExists(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;
    const product = await productsCarAPI.getProducts(id);

    if (!product) {
      return res.status(404).json({
        msg: 'producto not found',
      });
    }
    next();
  }

  async checkAddProductCar(req: Request, res: Response, next: NextFunction) {

    const { name, description, codeproduct, url, price, stock } = req.body;

    if (!name || !description || !codeproduct || !url || !price || !stock || 
      typeof name !== 'string' || 
      typeof description !== 'string' || 
      isNaN(codeproduct) || 
      typeof url !== 'string' ||
      isNaN(price) || 
      isNaN(stock)) { 
      return res.status(400).json({
        msg: 'Invalid body fields',
      });
    }

    next();
  }

  async getCarByUser(req: Request, res: Response) {
    const user: any = req.user;
    const cart = await productsCarAPI.getProducts(user._id);
    res.json(cart);
  }

  async addProductsCar(req: Request, res: Response) {
    const user: any = req.user;
    const cart = await productsCarAPI.getProducts(user._id);

    const { productId, productAmount } = req.body;

    if (!productId || !productAmount)
      return res.status(400).json({ msg: 'Invalid body parameters' });

    const product = await productsAPI.getProducts(productId);

    if (!product.length)
      return res.status(400).json({ msg: 'product not found' });

    if (parseInt(productAmount) < 0)
      return res.status(400).json({ msg: 'Invalid amount' });

    const updatedCart = await productsCarAPI.addProduct(
      cart._id,
      productId,
      parseInt(productAmount)
    );
    res.json({ msg: 'Product added', cart: updatedCart });
  }

  async deleteProduct(req: Request, res: Response) {
    const user: any = req.user;
    const car = await productsCarAPI.getProducts(user._id);

    const { productId, productAmount } = req.body;

    if (!productId || !productAmount)
      return res.status(400).json({ msg: 'Invalid body parameters' });

    const product = await productsAPI.getProducts(productId);

    if (!product.length)
      return res.status(400).json({ msg: 'product not found' });

    if (parseInt(productAmount) < 0)
      return res.status(400).json({ msg: 'Invalid amount' });

    const updatedCar = await productsCarAPI.deleteProudct(
      car._id,
      productId,
      parseInt(productAmount)
    );
    res.json({ msg: 'Product deleted', cart: updatedCar });
  }
}


export const carProductsController = new CarProduct();