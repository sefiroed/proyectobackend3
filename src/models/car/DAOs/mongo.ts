import mongoose, { Schema } from 'mongoose';
import {
  ProductCarI,
  ProductCar,
  ProductCarBaseClass,
  ProductCarQuery,
} from '../productscar.interface';
import Config from '../../../config';

const productsSchema = new mongoose.Schema<ProductCarI>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
  products: [
    {
      _id: Schema.Types.ObjectId,
      amount: Number,
    },
  ],
});

export class ProductsCarAtlasDAO implements ProductCarBaseClass {
  private srv: string;
  private car;

  constructor(local: boolean = false) {
    if (local)
      this.srv = `mongodb://localhost:27017/${Config.MONGO_LOCAL_DBNAME}`;
    else
      this.srv = `mongodb+srv://${Config.MONGO_ATLAS_USER}:${Config.MONGO_ATLAS_PASSWORD}@${Config.MONGO_ATLAS_CLUSTER}/${Config.MONGO_ATLAS_DBNAME}?retryWrites=true&w=majority`;
    mongoose.connect(this.srv);
    this.car = mongoose.model<ProductCarI>('productcar', productsSchema);
  }
  async createCar(userId: string): Promise<ProductCarI> {
    const newCar = new this.car({
      userId,
      products: [],
    });
    await newCar.save();

    return newCar;
  }

  productExist(car: ProductCarI, productId: string): boolean {
    const index = car.products.findIndex(
      (data) => data._id == productId
    );

    if (index < 0) return false;

    return true;
  }

  async get(userId: string): Promise<ProductCarI> {
    const result = await this.car.findOne({ userId });

    if (!result) throw new Error('id not found');

    return result;
  }

  async add(carId: string, product: ProductCar): Promise<ProductCarI> {
    const cart = await this.car.findById(carId);
    if (!cart) throw new Error('Cart not found');

    const index = cart.products.findIndex(
      (aProduct) => aProduct._id == product._id
    );

    if (index < 0) cart.products.push(product);
    else cart.products[index].amount += product.amount;

    await cart.save();

    return cart;
  }

  async delete(carId: string, product: ProductCar): Promise<ProductCarI> {
    const cart = await this.car.findById(carId);
    if (!cart) throw new Error('Cart not found');

    const index = cart.products.findIndex(
      (aProduct) => aProduct._id == product._id
    );

    if (index < 0) throw new Error('Product not found');

    if (cart.products[index].amount <= product.amount)
      cart.products.splice(index, 1);
    else cart.products[index].amount -= product.amount;

    await cart.save();
    return cart;
  }

  async query(options: ProductCarQuery): Promise<ProductCarI[]> {
    let query: ProductCarQuery = {};

    if (options.name) query.name = options.name;

    if (options.description) query.description = options.description;

    if (options.codeproduct) query.codeproduct = options.codeproduct;

    if (options.url) query.url = options.url;

    if (options.price) query.price = options.price;

    if (options.stock) query.stock = options.stock;

    return this.car.find(query);
  }
}
