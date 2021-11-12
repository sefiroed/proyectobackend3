export interface newProductI {
  name?: string;
  price?: number;
  description?: string;
  codeproduct?: number;
  url?: string;
  stock: number;
}

export interface ProductI {
  _id?: string;
  name?: string;
  price?: number;
  description?: string;
  codeproduct?: number;
  url?: string;
  stock?: number;
}

export interface IObject {
  [key: string]: string | number | boolean | unknown;
}

export interface IKnex {
  [key: string]: {
    client: string;
    connection: {
      host?: string;
      user?: string;
      password?: string;
      database?: string;
      filename?: string;
    };
    migrations?: {
      directory: string;
    };
    seeds?: {
      directory: string;
    };
    pool?: {
      min?: number;
      max?: number;
    };
    useNullAsDefault?: boolean;
  };
}

export interface ProductQuery {
  name?: string;
  price?: number;
  description?: string;
  codeproduct?: number;
  url?: string;
  stock?: number;
  minStock?: number;
  maxStock?: number;
  minPrice?: number;
  maxPrice?: number;

}

export interface ProductBaseClass {
  get(id?: string | undefined): Promise<ProductI[]>;
  add(data: newProductI): Promise<ProductI>;
  update(id: string, newProductData: newProductI): Promise<ProductI>;
  delete(id: string): Promise<void>;
  query(options: ProductQuery): Promise<ProductI[]>;
}
