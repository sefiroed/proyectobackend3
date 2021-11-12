import mongoose from 'mongoose';
import {
  newProductI,
  ProductI,
  ProductBaseClass,
  ProductQuery,
} from '../products.interface';
import Config from '../../../config';

const productsSchema = new mongoose.Schema<ProductI>({
  name: String,
  price: Number,
});

export class ProductsAtlasDAO implements ProductBaseClass {
  private srv: string;
  private products;

  constructor(local: boolean = false) {
    if (local)
      this.srv = `mongodb://localhost:27017/${Config.MONGO_LOCAL_DBNAME}`;
    else
      this.srv = `mongodb+srv://${Config.MONGO_ATLAS_USER}:${Config.MONGO_ATLAS_PASSWORD}@${Config.MONGO_ATLAS_CLUSTER}/${Config.MONGO_ATLAS_DBNAME}?retryWrites=true&w=majority`;
    mongoose.connect(this.srv);
    this.products = mongoose.model<ProductI>('product', productsSchema);
  }

  async get(id?: string): Promise<ProductI[]> {
    let output: ProductI[] = [];
    try {
      if (id) {
        const document = await this.products.findById(id);
        if (document) output.push(document);
      } else {
        output = await this.products.find();
      }

      return output;
    } catch (err) {
      return output;
    }
  }

  async add(data: newProductI): Promise<ProductI> {
    if (!data.name || !data.description || 
      !data.codeproduct || !data.url || 
      !data.price || !data.stock ) throw new Error('invalid data');

    const newProduct = new this.products(data);
    await newProduct.save();

    return newProduct;
  }

  async update(id: string, newProductData: newProductI): Promise<ProductI> {
    return this.products.findByIdAndUpdate(id, newProductData);
  }

  async delete(id: string) {
    await this.products.findByIdAndDelete(id);
  }

  async query(options: ProductQuery): Promise<ProductI[]> {
    let query: ProductQuery = {};

    if (options.name) query.name = options.name;

    if (options.description) query.description = options.description;

    if (options.codeproduct) query.codeproduct = options.codeproduct;

    if (options.url) query.url = options.url;

    if (options.price) query.price = options.price;

    if (options.stock) query.stock = options.stock;

    return this.products.find(query);
  }
}
