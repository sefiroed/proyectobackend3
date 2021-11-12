import moment from 'moment';

let timeStamp = moment().format();

interface addProduct {
    timestamp: typeof timeStamp
    name: string
    description: string
    codeproduct:number
    url: string
    price: number
    stock: number
}

interface NewProduct {
    id: string
    timestamp: typeof timeStamp
    name: string
    description: string
    codeproduct:number
    url: string
    price: number
    stock: number
}

//Interface usada para carritos
interface CartProduct {
    id: string
    timestamp: string
    name: string
    description: string
    codeproduct:number
    url: string
    price: number
    stock: number
}

//Interface usada para carritos
interface NewCart {
    cartid: string
    timestamp: string
    client: number
    product: [CartProduct]
}






export { addProduct, NewProduct, CartProduct, timeStamp };

