import { ProductsCarMemDAO } from './DAOs/memory';
import { ProductsCarFSDAO } from './DAOs/fs';
import { ProductsCarAtlasDAO } from './DAOs/mongo';

import path from 'path';
export enum TypePersistence {
  Memory = 'MEM',
  FileSystem = 'FS',
  MYSQL = 'MYSQL',
  SQLITE3 = 'SQLITE3',
  LocalMongo = 'LOCAL-MONGO',
  MongoAtlas = 'MONGO-ATLAS',
  Firebase = 'FIREBASE',
}

export class NewFactoryCarDAO {
  static get(type: TypePersistence) {
    switch (type) {
      case TypePersistence.FileSystem:
        console.log('RETURN INSTANCE CLASS FS');
        const filePath = path.resolve(__dirname, '../../../public/productscar.json');
        console.log(filePath);
        return new ProductsCarFSDAO(filePath);

      case TypePersistence.MongoAtlas:
        console.log('RETURN INSTANCE CLASS MONGO ATLAS');
        return new ProductsCarAtlasDAO();

      case TypePersistence.LocalMongo:
        console.log('RETURN INSTANCE CLASS MONGO LOCAL');
        return new ProductsCarAtlasDAO(true);

      // case TypePersistence.MYSQL:
      //   return new MYSQLProductDAO();  

      default:
        console.log('RETURN INSTANCE CLASS MEMORY');
        return new ProductsCarMemDAO();
    }
  }
}
