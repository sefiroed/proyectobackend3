import {Request, Response, NextFunction} from 'express';
import { productsAPI } from '../apis/products';
import { ProductQuery } from '../models/products/products.interface';


class Product {
  async checkProductExists(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;
    const product = await productsAPI.getProducts(id);

    if (!product) {
      return res.status(404).json({
        msg: 'producto not found',
      });
    }
    next();
  }

  async getProducts (req : Request, res : Response) {
    const { id } = req.params;
    const { name, description, codeproduct, url, price, stock } = req.query;
    // const product = productsPersistence.get(id);
    if (id) {
      const result = await productsAPI.getProducts(id);
      if (!result.length)
        return res.status(404).json({
          data: 'OBJECT NOT FOUND',
        });

      return res.json({
        data: result,
      });
    }

    const query: ProductQuery = {};

    if (name) query.name = name.toString();

    if (description) query.description = description.toString();

    if (codeproduct) query.codeproduct = Number(codeproduct);

    if (url) query.url = url.toString();

    if (price) query.price = Number(price);

    if (stock) query.stock = Number(stock);

    if (Object.keys(query).length) {
      return res.json({
        data: await productsAPI.query(query),
      });
    }

    res.json({
      data: await productsAPI.getProducts(),
    });
    
  }

  checkAddProducts(req: Request, res: Response, next: NextFunction) {

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

  async addProducts (req : Request, res : Response) {
    
    const body = req.body;
    const product = await productsAPI.addProduct(body);

    res.json({
      msg: 'product added successfully',
      data: product,
    });

  }

  async updateProducts (req : Request, res : Response) {
    const body = req.body;
    const id = req.params.id;
    const newItem = productsAPI.updateProduct(id,body);

    res.json({
      msg: "Update products",
      data: newItem
    })
  }

  async deleteProducts (req : Request, res : Response) {
    const id = req.params.id;

    await productsAPI.deleteProduct(id);
    res.json({
      msg: "Product deleted",
    })
  }
}


export const productsController = new Product();