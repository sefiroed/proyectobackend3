import {
  newProductI,
  ProductI,
  ProductBaseClass,
  ProductQuery,
} from '../products.interface';

export class ProductsMemDAO implements ProductBaseClass {
  private products: ProductI[] = [];

  constructor() {
    const mockData = [
      { _id: '1', name: 'Terreno', price: 20000 },
      { _id: '2', name: 'Finca', price: 250000 },
      { _id: '3', name: 'Urbanización', price: 2600000 },
    ];

    mockData.forEach((aMock) => this.products.push(aMock));
  }

  findIndex(id: string) {
    return this.products.findIndex((aProduct) => aProduct._id == id);
  }

  find(id: string): ProductI | undefined {
    return this.products.find((aProduct) => aProduct._id === id);
  }

  async get(id?: string): Promise<ProductI[]> {
    if (id) {
      return this.products.filter((aProduct) => aProduct._id === id);
    }
    return this.products;
  }

  async add(data: newProductI): Promise<ProductI> {
    if (!data.name || !data.description || !data.codeproduct || !data.url || 
      !data.price || !data.stock) throw new Error('invalid data');

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

    return newItem;
  }

  async update(id: string, newProductData: newProductI): Promise<ProductI> {
    const index = this.findIndex(id);
    const oldProduct = this.products[index];

    const updatedProduct: ProductI = { ...oldProduct, ...newProductData };
    this.products.splice(index, 1, updatedProduct);
    return updatedProduct;
  }

  async delete(id: string): Promise<void> {
    const index = this.findIndex(id);
    this.products.splice(index, 1);
  }

  async query(options: ProductQuery): Promise<ProductI[]> {
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
