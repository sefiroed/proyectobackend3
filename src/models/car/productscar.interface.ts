import { Schema } from 'mongoose';

export type productReference = Schema.Types.ObjectId | string;

export interface newProductCarI {
  name?: string;
  price?: number;
  description?: string;
  codeproduct?: number;
  url?: string;
  stock?: number;
}

export interface ProductCarI {
  _id: string;
  userId: productReference;
  productsCar: ProductCar[];
}

export interface ProductCar {
  _id: string;
  amount: number;
}


export interface ProductCarBaseClass {
  get(id: string): Promise<ProductCarI>;
  createCar(userId: string): Promise<ProductCarI>;
  add(data: string, product: ProductCar): Promise<ProductCarI>;
  delete(data: string, product: ProductCar): Promise<ProductCarI>;
}
