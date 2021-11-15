import { newProductCarI, ProductCarI } from '../models/car/productscar.interface';
import { NewFactoryCarDAO } from '../models/car/productscar.factory';
import { TypePersistence } from '../models/car/productscar.factory';
import { UserAPI } from './users';
import { productsAPI } from './products';




/**
 * with this variable we select the persistence type
 **/ 

const type = TypePersistence.MongoAtlas;

class prodAPI {
  private car;

  constructor() {
    this.car = NewFactoryCarDAO.get(type);
  }

  async getProducts(userId: string): Promise<ProductCarI> {
    return this.car.get(userId);
    
  }

  async createCar(userId: string): Promise<ProductCarI> {
    const user = await UserAPI.getUsers(userId);

    if (!user.length)
      throw new Error('User does not exist. Error creating cart');

    const newCart = await this.car.createCar(userId);
    return newCart;
  }

  async addProduct(
    carId: string,
    productId: string,
    amount: number
  ): Promise<ProductCarI> {
    const product = (await productsAPI.getProducts(productId))[0];

    const addProduct = {
      _id: productId,
      name: product.name,
      price: product.price,
      amount,
    };

    const updatedCart = await this.car.add(carId, addProduct);
    return updatedCart;
  }


  async deleteProudct(carId: string, productId: string, amount: number) {
    const product = (await productsAPI.getProducts(productId))[0];

    const deleteProduct = {
      _id: productId,
      name: product.name,
      price: product.price,
      amount,
    };

    const updatedCart = await this.car.delete(carId, deleteProduct);
    return updatedCart;
  }

}
  
export const productsCarAPI = new prodAPI();