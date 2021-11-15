import mongoose, { Schema } from 'mongoose';
import {
  ProductCarI,
  ProductCar,
  ProductCarBaseClass,
} from '../productscar.interface';
import Config from '../../../config';

const productsCarSchema = new mongoose.Schema<ProductCarI>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
  productsCar: [
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
    this.srv = `mongodb://localhost:27017/${Config.MONGO_LOCAL_DBNAME}`;
    mongoose.connection.useDb(this.srv ? this.srv : Config.MONGO_ATLAS_SRV);
    mongoose.connection.useDb(this.srv);
    this.car = mongoose.model<ProductCarI>('productcar', productsCarSchema);
  }

  async get(userId: string): Promise<ProductCarI> {
    const result = await this.car.findOne({ userId });

    if (!result) throw new Error('id not found');

    return result;
  }
  
  async createCar(userId: string): Promise<ProductCarI> {
    const newCar = new this.car({
      userId,
      productsCar: [],
    });
    await newCar.save();

    return newCar;
  }

  productExist(car: ProductCarI, productId: string): boolean {
    const index = car.productsCar.findIndex(
      (data) => data._id == productId
    );

    if (index < 0) return false;

    return true;
  }

  async add(carId: string, product: ProductCar): Promise<ProductCarI> {
    const car = await this.car.findById(carId);
    if (!car) throw new Error('Cart not found');

    const index = car.productsCar.findIndex(
      (aProduct) => aProduct._id == product._id
    );

    if (index < 0) car.productsCar.push(product);
    else car.productsCar[index].amount += product.amount;

    await car.save();

    return car;
  }

  async delete(carId: string, product: ProductCar): Promise<ProductCarI> {
    const car = await this.car.findById(carId);
    if (!car) throw new Error('Cart not found');

    const index = car.productsCar.findIndex(
      (data) => data._id == product._id
    );

    if (index < 0) throw new Error('Product not found');

    if (car.productsCar[index].amount <= product.amount)
      car.productsCar.splice(index, 1);
    else car.productsCar[index].amount -= product.amount;

    await car.save();
    return car;
  }

}
