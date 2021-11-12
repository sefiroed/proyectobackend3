import fs from 'fs';
import {
  newProductI,
  ProductI,
  ProductBaseClass,
  ProductQuery,
} from '../products.interface';


export class ProductsFSDAO implements ProductBaseClass {
  private products: ProductI[] = [];
  private nameFile: string;

  constructor(fileName: string) {
    const mockData = [
      { _id: '1', name: 'Terreno', description: "lugar", codeproduct:5545,
      url: "http://mercadolibre.com", price: 200000, stock: 7 },
      { _id: '2', name: 'Finca', description: "Edificación", codeproduct:5546,
      url: "http://mercadolibre.com", price: 250000, stock: 5 },
      { _id: '3', name: 'Urbanización', description: "Barrio", codeproduct:5547,
      url: "http://mercadolibre.com", price: 300000, stock: 3  },
    ];
    this.nameFile = fileName;
    this.products = mockData;
    this.guardar();
  }

  async leer(file: string): Promise<void> {
    this.products = JSON.parse(await fs.promises.readFile(file, 'utf-8'));
  }

  async guardar(): Promise<void> {
    await fs.promises.writeFile(
      this.nameFile,
      JSON.stringify(this.products, null, '\t')
    );
  }



  async findIndex(id: string): Promise<number> {
    await this.leer(this.nameFile);
    return this.products.findIndex((aProduct: ProductI) => aProduct._id == id);
  }

  async find(id: string): Promise<ProductI | undefined> {
    await this.leer(this.nameFile);

    return this.products.find((aProduct) => aProduct._id === id);
  }

  async get(id?: string): Promise<ProductI[]> {
    await this.leer(this.nameFile);

    if (id) {
      return this.products.filter((aProduct) => aProduct._id === id);
    }
    return this.products;
  }

  async add(data: newProductI): Promise<ProductI> {
    if (!data.name || !data.description || !data.codeproduct || !data.url || 
      !data.price || !data.stock) throw new Error('invalid data');

    await this.leer(this.nameFile);

    const newItem: ProductI = {
      _id: (this.products.length + 1).toString(),
      name: data.name,
      description: data.description,
      codeproduct: data.codeproduct,
      url: data.url,
      price: data.price,
      stock: data.stock
    };

    this.products.push(newItem);

    await this.guardar();

    return newItem;
  }

  async update(id: string, newProductData: newProductI): Promise<ProductI> {
    await this.leer(this.nameFile);

    const index = await this.findIndex(id);
    const oldProduct = this.products[index];

    const updatedProduct: ProductI = { ...oldProduct, ...newProductData };
    this.products.splice(index, 1, updatedProduct);

    await this.guardar();

    return updatedProduct;
  }

  async delete(id: string): Promise<void> {
    await this.leer(this.nameFile);

    const index = await this.findIndex(id);
    this.products.splice(index, 1);
    await this.guardar();
  }

  async query(options: ProductQuery): Promise<ProductI[]> {
    await this.leer(this.nameFile);
    type Conditions = (aProduct: ProductI) => boolean;
    const query: Conditions[] = [];

    if (options.name)
      query.push((aProduct: ProductI) => aProduct.name == options.name);

    if (options.description)
      query.push((aProduct: ProductI) => aProduct.description == options.description);  
    
    if (options.codeproduct)
      query.push((aProduct: ProductI) => aProduct.codeproduct == options.codeproduct);

    if (options.url)
      query.push((aProduct: ProductI) => aProduct.url == options.url);

    if (options.price)
      query.push((aProduct: ProductI) => aProduct.price == options.price);
    
    if (options.stock)
      query.push((aProduct: ProductI) => aProduct.stock == options.stock);

    return this.products.filter((aProduct) => query.every((x) => x(aProduct)));
  }
}
