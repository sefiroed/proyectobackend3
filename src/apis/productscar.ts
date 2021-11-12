import { newProductCarI, ProductCarI } from '../models/car/productscar.interface';
import { NewFactoryCarDAO } from '../models/car/productscar.factory';
import { TypePersistence } from '../models/car/productscar.factory';
import { ProductCarQuery } from '../models/car/productscar.interface';
import { UserAPI } from './users';
import { productsAPI } from './products';




/**
 * with this variable we select the persistence type
 **/ 

const type = TypePersistence.MongoAtlas;

class prodAPI {
    private products;
  
    constructor() {
      this.products = NewFactoryCarDAO.get(type);
    }
  
    async getProducts(userId: string): Promise<ProductCarI> {
      return this.products.get(userId);
  
      
    }

    async createCar(userId: string): Promise<ProductCarI> {
      const user = await UserAPI.getUsers(userId);
  
      if (!user.length)
        throw new Error('User does not exist. Error creating cart');
  
      const newCart = await this.products.createCar(userId);
      return newCart;
    }
  
    async addProduct(productData: newProductCarI): Promise<ProductCarI> {
      const newProduct = await this.products.add(productData);
      return newProduct;
    }
  
  
    async deleteProudct(carId: string, productId: string, amount: number) {
      const product = (await productsAPI.getProducts(productId))[0];
  
      const deleteProduct = {
        _id: productId,
        name: product.name,
        price: product.price,
        amount,
      };
  
      const updatedCart = await this.products.deleteProduct(carId, deleteProduct);
      return updatedCart;
    }
  
    async query(options: ProductCarQuery) {
      return await this.products.query(options);
    }
}
  
export const productsCarAPI = new prodAPI();