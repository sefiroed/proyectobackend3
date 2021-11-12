import Product from './interfacecar'

const random = (min: number, max: number) => {
    return Math.random() * (max - min + 1) + min;
}
const test = () => {
    let obj:Product = new Product(
      0,
      new Date(),
      `Producto ${Math.floor(random(1, 10))}`,
      `Descripcion ${Math.floor(random(1, 10))}`,
      parseFloat(random(0.0, 9999.99).toFixed(2)),
      parseInt(random(0, 40000).toFixed(0)),
      `https://picsum.photos/id/${Math.floor(random(1, 200))}/200/200`,
      parseInt(random(0, 100).toFixed(0))
    );
    return obj;
};

const objToJSON = (content: any) => {
    return JSON.stringify(content, undefined, 2);
};

export { random, test, objToJSON };