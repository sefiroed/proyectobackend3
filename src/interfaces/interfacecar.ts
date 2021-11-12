
export default class Product {
    id;
    timestamp;
    name;
    description;
    codeproduct;
    price;
    url;
    stock;
  
    constructor(
      id: number,
      timestamp: Date,
      name: string,
      description: string,
      codeproduct: number,
      price: number,
      url: string,
      stock: number
    ) {
      this.id = id;
      this.timestamp = timestamp;
      this.name = name;
      this.description = description;
      this.codeproduct = codeproduct;
      this.price = price;
      this.url = url;
      this.stock = stock;
    }
  
    modificar(
        id: number,
        timestamp: Date,
        name: string,
        description: string,
        codeproduct: number,
        price: number,
        url: string,
        stock: number
    ) {
        this.id = id;
        this.timestamp = timestamp;
        this.name = name;
        this.description = description;
        this.codeproduct = codeproduct;
        this.price = price;
        this.url = url;
        this.stock = stock;
    }
}





