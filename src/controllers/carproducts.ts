import {Request, Response, NextFunction} from 'express';
import { productsCarAPI } from '../apis/productscar';
import { ProductCarQuery } from '../models/car/productscar.interface';

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
  
  async getProductsCar (req : Request, res : Response) {

    const { id } = req.params;
    const { name, description, codeproduct, url, price, stock } = req.query;
    // const product = productsPersistence.get(id);
    if (id) {
      const result = await productsCarAPI.getProducts(id);
      if (!result.length)
        return res.status(404).json({
          data: 'OBJECT NOT FOUND',
        });

      return res.json({
        data: result,
      });
    }

    const query: ProductCarQuery = {};

    if (name) query.name = name.toString();

    if (description) query.description = description.toString();

    if (codeproduct) query.codeproduct = Number(codeproduct);

    if (url) query.url = url.toString();

    if (price) query.price = Number(price);

    if (stock) query.stock = Number(stock);

    if (Object.keys(query).length) {
      return res.json({
        data: await productsCarAPI.query(query),
      });
    }

    res.json({
      data: await productsCarAPI.getProducts(),
    });
    // const id = Number(req.params.id);
    // const product = carProductsPersistence.get(id);
    // if(id){
    //   console.log(product);
    //   if(!product){
    //     return res.status(404).json({
    //       msg: "Product not found"
    //     })
    //   }else{   
    //     res.json({product})
    //   }     
    //   return res.status(404).json({
    //     msg: "ID invalidate"
    //   })
    // }
    // if (product.length < 1) {
    //   return res.status(400).json({
    //     error: 'No products loaded',
    //   });
    // }
    // res.json({
    //   data: carProductsPersistence.get()
    // })
    
  }
  

  async addProductsCar (req : Request, res : Response) {  

    const body = req.body;
    const product = await productsCarAPI.addProduct(body);

    res.json({
      msg: 'product added successfully',
      data: product,
    });
      
  }

  async deleteProductsCar (req : Request, res : Response) {
    const id = req.params.id;

    await productsCarAPI.deleteProduct(id);
    res.json({
      msg: "Product deleted",
    })
  }
}


export const carProductsController = new CarProduct();