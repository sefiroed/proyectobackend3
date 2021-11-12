import knex, { Knex } from 'knex';
import {
    newProductI,
    ProductI,
    ProductBaseClass,
    ProductQuery,
    IKnex,
} from '../products.interface';
import Config from '../../../config';
import dbConfig from '../../../../knexfile';


export class ProductsMysqlDAO implements ProductBaseClass {
    private connection: Knex;
    constructor(dbType: 'mysql' | 'sqlite') {
      const environment =
        dbType === 'mysql'
          ? process.env.NODE_ENV || 'development'
          : 'development2';
      const configDb: IKnex = dbConfig;
      const options = configDb[environment];
      const mockData = [
        { id: '1', name: 'Terreno', price: 200000, description: "lugar", codeproduct:5545,
        url: "http://mercadolibre.com", stock: 7 },
        { id: '2', name: 'Finca', price: 250000, description: "Edificación", codeproduct:5546,
        url: "http://mercadolibre.com", stock: 5 },
        { id: '3', name: 'Urbanización', price: 300000, description: "Barrio", codeproduct:5547,
        url: "http://mercadolibre.com", stock: 3  },
      ];
      this.connection = knex(options);
      console.log(`BD MySQL ${environment} configured`);
      this.connection.schema.hasTable('products').then(exists => {
        if (!exists) {
          this.connection.schema
            .createTable('products', productsTable => {
              productsTable.increments();
              productsTable.string('name').notNullable();
              productsTable.integer('price').notNullable();
              productsTable.string('description').notNullable();
              productsTable.integer('codeproduct').notNullable();
              productsTable.string('url').notNullable();
              productsTable.integer('stock').notNullable();
            })
            .then(() => {
              console.log('Product table created');
              this.connection('products')
                .insert(mockData)
                .then(() => console.log('Products added'))
                .catch(e => console.log(e));
            })
            .catch(e => console.log(e));
        }
      });
    }
  
    async get(id?: string): Promise<ProductI[]> {
      try {
        if (id) {
          const producto = await this.connection('products').where(
            'id',
            String(id),
          );
          return producto[0];
        }
        return this.connection('products');
      } catch (e) {
        throw { error: e, message: 'There was a problem loading the products' };
      }
    }
  
    // async add(newProductData: newProductI): Promise<ProductI> {
    //   try {
    //     const newProductId = await this.connection('products').insert(newProductData);
    //     const newProduct = this.get(newProductId[0] as unknown as string);
    //     return newProduct as unknown as ProductI;
    //   } catch (e) {
    //     throw { error: e, message: 'Product could not be saved' };
    //   }
    // }

    async add(data: newProductI): Promise<ProductI> {
        if (!data.name || !data.description || 
            !data.codeproduct || !data.url || 
            !data.price || !data.stock ) throw new Error('invalid data');

        const newItem: ProductI = {
            name: data.name,
            price: data.price,
            description: data.description,
            codeproduct: data.codeproduct,
            url: data.url,
            stock: data.stock
        };

        const newProduct = await this.connection('products').insert(newItem);
        // const newProduct = this.get(newProductId[0] as unknown as string);
      
        return newProduct as ProductI;
    }

    async update(id: string, newProductData: newProductI): Promise<ProductI> {
      try {
        await this.connection('products')
          .where('id', Number(id))
          .update(newProductData);
        const productUpdated = await this.get(id);
  
        if (productUpdated) {
          return productUpdated as ProductI;
        } 
        else {
          throw ('The product you want to update does not exist');
        }
      } catch (e) {
        if (e ) {
          throw e;
        } else {
          throw { error: e, message: 'Product could not be updated' };
        }
      }
    }
  
    async delete(id: string): Promise<void> {
      try {
        const productDeleted = await this.connection('products')
          .where('id', Number(id))
          .del();
        if (!productDeleted) {
          throw ('The product you want to delete does not exist');
        }
      } catch (e) {
        if (e ) {
          throw e;
        } else {
          throw { error: e, message: 'Product could not be updated' };
        }
      }
    }
  
    async query(options: ProductQuery): Promise<ProductI[]> {
      try {
        const products = await this.connection('products')
          .modify(queryProducts => {
            if (options.name) {
              queryProducts.where('nombre', options.name);
            }
          })
          .modify(queryProducts => {
            if (options.codeproduct) {
              queryProducts.where('codigo', options.codeproduct);
            }
          })
          .modify(queryProducts => {
            if (options.minPrice) {
              queryProducts.where('precio', '>=', options.minPrice);
            }
          })
          .modify(queryProducts => {
            if (options.maxPrice) {
              queryProducts.where('precio', '<=', options.maxPrice);
            }
          })
          .modify(queryProducts => {
            if (options.minStock) {
              queryProducts.where('stock', '>=', options.minStock);
            }
          })
          .modify(queryProducts => {
            if (options.maxStock) {
              queryProducts.where('stock', '<=', options.maxStock);
            }
          });
  
        return products;
      } catch (e) {
        throw { error: e, message: 'Product not found' };
      }
    }
  }
  
  