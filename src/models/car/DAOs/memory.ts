import {
  newProductCarI,
  ProductCarI,
  ProductCarBaseClass,
  ProductCarQuery,
} from '../productscar.interface';

export class ProductsCarMemDAO implements ProductCarBaseClass {
  private products: ProductCarI[] = [];

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

  find(id: string): ProductCarI | undefined {
    return this.products.find((aProduct) => aProduct._id === id);
  }

  async get(id?: string): Promise<ProductCarI[]> {
    if (id) {
      return this.products.filter((aProduct) => aProduct._id === id);
    }
    return this.products;
  }

  async add(data: newProductCarI): Promise<ProductCarI> {
    if (!data.name || !data.description || !data.codeproduct || !data.url || 
      !data.price || !data.stock) throw new Error('invalid data');

    const newItem: ProductCarI = {
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

  async update(id: string, newProductData: newProductCarI): Promise<ProductCarI> {
    const index = this.findIndex(id);
    const oldProduct = this.products[index];

    const updatedProduct: ProductCarI = { ...oldProduct, ...newProductData };
    this.products.splice(index, 1, updatedProduct);
    return updatedProduct;
  }

  async delete(id: string): Promise<void> {
    const index = this.findIndex(id);
    this.products.splice(index, 1);
  }

  async query(options: ProductCarQuery): Promise<ProductCarI[]> {
    type Conditions = (aProduct: ProductCarI) => boolean;
    const query: Conditions[] = [];

    if (options.name)
      query.push((aProduct: ProductCarI) => aProduct.name == options.name);

    if (options.description)
      query.push((aProduct: ProductCarI) => aProduct.description == options.description);  
    
    if (options.codeproduct)
      query.push((aProduct: ProductCarI) => aProduct.codeproduct == options.codeproduct);

    if (options.url)
      query.push((aProduct: ProductCarI) => aProduct.url == options.url);

    if (options.price)
      query.push((aProduct: ProductCarI) => aProduct.price == options.price);
    
    if (options.stock)
      query.push((aProduct: ProductCarI) => aProduct.stock == options.stock);

    return this.products.filter((aProduct) => query.every((x) => x(aProduct)));
  }
}
