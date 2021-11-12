import { newProductI, ProductI } from '../models/products/products.interface';
import { NewFactoryDAO } from '../models/products/products.factory';
import { TypePersistence } from '../models/products/products.factory';
import { ProductQuery } from '../models/products/products.interface';


/**
 * with this variable we select the persistence type
 **/ 

const type = TypePersistence.MongoAtlas;

class prodAPI {
  private products;

  constructor() {
    this.products = NewFactoryDAO.get(type);
  }

  async getProducts(id: string | undefined = undefined): Promise<ProductI[]> {
    if (id) return this.products.get(id);

    return this.products.get();
  }

  async addProduct(productData: newProductI): Promise<ProductI> {
    const newProduct = await this.products.add(productData);
    return newProduct;
  }

  async updateProduct(id: string, productData: newProductI) {
    const updatedProduct = await this.products.update(id, productData);
    return updatedProduct;
  }

  async deleteProduct(id: string) {
    return await this.products.delete(id);
  }

  async query(options: ProductQuery) {
    return await this.products.query(options);
  }
}
  
export const productsAPI = new prodAPI();