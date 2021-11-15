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

      case TypePersistence.MongoAtlas:
        console.log('RETURN INSTANCE CLASS MONGO ATLAS');
        return new ProductsCarAtlasDAO();

      case TypePersistence.LocalMongo:
        console.log('RETURN INSTANCE CLASS MONGO LOCAL');
        return new ProductsCarAtlasDAO(); 

      default:
        console.log('RETURN INSTANCE CLASS MEMORY');
        return new ProductsCarAtlasDAO(true);
    }
  }
}
