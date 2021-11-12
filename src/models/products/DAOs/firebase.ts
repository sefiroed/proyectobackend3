import admin, { firestore, ServiceAccount } from 'firebase-admin';
import serviceAccount from './../../../firebase.json';
import {
    newProductI,
    ProductI,
    ProductBaseClass,
    ProductQuery,
} from '../products.interface';
  
  
export class ProductsFirebaseDAO implements ProductBaseClass {
    private srv: any;
    private products;
    constructor(){
        this.srv =admin.initializeApp({
            credential: admin.credential.cert(serviceAccount as ServiceAccount),
        });
        const db = admin.firestore(this.srv);
        this.products = db.collection('products');
        
            
    }

    async get(id?:string): Promise<ProductI[]> {
        let output: ProductI[] = [];
        try {
            if (id) {
                const data = await this.products.doc(id).get();
                const product = data.data();
                return output;
            
            }else {
                const result = await this.products.get();
                const products = result.docs;
                output = products.map(product => {
                    const productData = product.data();
                    return {
                        _id: product.id,
                        ...productData,
                    };
                }) as ProductI[];
            }
            return output;
        } catch (e) {
            throw { error: e, message: 'There was a problem loading the products' };
        }
    }


    async add(data: newProductI): Promise<ProductI> {
        if (!data.name || !data.description || 
            !data.codeproduct || !data.url || 
            !data.price || !data.stock ) throw new Error('invalid data');

        const newItem: ProductI = {
            name: data.name,
            description: data.description,
            codeproduct: data.codeproduct,
            url: data.url,
            price: data.price,
            stock: data.stock
        };

        this.products.add(newItem);
      
        return newItem;
        
    }

    async update(id: string, newProductData: newProductI): Promise<ProductI> {
        await this.products.doc(id).update(newProductData);
        const prductUpdate = await this.get(id);
        return prductUpdate as ProductI;
    }

    
    async delete(_id: string) {
        console.log('paso');
        await this.products.doc(_id).delete();
        
    }

    async query(options: ProductQuery): Promise<ProductI[]> {
        let query: ProductI[] = [];
        let queryProducts: firestore.Query<firestore.DocumentData> = this.products;
        
        
        if (options.name){
            queryProducts = queryProducts.where('name', '==', options.name);
        }

        if (options.description){
            queryProducts = queryProducts.where('description', '==', options.description);
        }

        if (options.codeproduct){
            queryProducts = queryProducts.where('codeproduct', '==', options.codeproduct);
        }

        if (options.url){
            queryProducts = queryProducts.where('url', '==', options.url);
        }

        if (options.price){
            queryProducts = queryProducts.where('price', '==', options.price);
        }

        if (options.stock){
            queryProducts = queryProducts.where('stock', '==', options.stock);
        }

        const productsSnapshot = await queryProducts.get();
        productsSnapshot.forEach(doc => {
          const _id = doc.id;
          const data = doc.data();
          const product = {
            _id,
            ...data,
          };
          query.push(product as ProductI);
        });


        return query;
    }

    
}
  

