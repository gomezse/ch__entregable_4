import { existsSync, promises } from "fs";

const path = "../data/ProductsFile.json";

class ProductManager {

    constructor() {
        this.products = [];
    }

    /**
     * @param {*} title  @param {*} description  @param {*} price  @param {*} thumbnail  @param {*} code @param {*} stock 
     * @returns true en caso de que se hayan cargados todos los atributos, false caso contrario.
     */

    validate = (p) => p.title && p.description && p.price && p.code && p.stock;

    //Devolver true en caso de encontrar un objeto con el code, caso contrario false.
    async existCode(code) {
        const products = await this.getProducts();
        const existingProduct = products.find(product => product.code === code);

        return Boolean(existingProduct);
    }

    //Obtener un objeto del archivo mediante su id.
    async getProductById(searchId) {
        try {
            const products = await this.getProducts();
            const product = products.find(product => product.id === searchId);
            return product;
        } catch (error) {
            return error;
        }

    }

    //Obtener el listado de productos del archivo.
    async getProducts(queryObj = {}) {
        const { limit } = queryObj;

        try {
            if (existsSync(path)) {
                const productsFile = await promises.readFile(path, 'utf-8');
                const productsData = JSON.parse(productsFile);
                return limit ? productsData.slice(0, +limit) : productsData;
            } else {
                return [];
            }
        } catch (error) {
            return error;
        }
    }

    //Agregar un nuevo producto.
    async createProduct(product) {
        try {
            if (!this.validate(product)) {
                return console.error('Debe llenar todos los campos, son obligatorios.');
            }

            //El control de code repetido, solo se hace en caso de que el archivo exista.
            if (existsSync(path)) {
                const existCode = await this.existCode(product.code);
                if (existCode) { return console.error('El codigo ingresado ya existe.') }
            }

            const products = await this.getProducts();
            const newProduct = {
                id: !products.length ? 1 : products[products.length - 1].id + 1,
                ...product,
                status: true
            };
            products.push(newProduct);

            await promises.writeFile(path, JSON.stringify(products));

            return newProduct;
        } catch (error) {
            return error;
        }
    }


    //Eliminar un objeto del archivo
    async deleteProduct(id) {
        try {            
            const products = await this.getProducts();            
            const product = products.find((u) => u.id === id);
            
            if (product) {
                const newArrayProducts = products.filter((product) => product.id !== id);
                await promises.writeFile(path, JSON.stringify(newArrayProducts));
            }            
            return product;

        } catch (error) {
            return error;
        }
    }

    //Modificar parcial o total los atributos de un objeto del archivo.(sin modificar su id)
    async updateProduct(id, updatedFields) {
        try {
           
            const products = await this.getProducts();
            const productIndex = products.findIndex(product => product.id === +id);

            if (productIndex === -1) {
                return null;
            }
      
            const updatedProduct = { ...products[productIndex], ...updatedFields };

            //forzar que por mas que venga el id como parametro a modificar, no se cambie.
            updatedProduct.id = products[productIndex].id;

            products[productIndex] = updatedProduct;
  
            await promises.writeFile(path, JSON.stringify(products));

            return updatedProduct;

        } catch (error) {
            return error;
        }
    }
    
}

export const manager = new ProductManager();



async function test() {
    const manager = new ProductManager();
    //creacion de los 10 productos para el testing 
    // await manager.addProduct("palo de escoba","madera",350,2,"as123",2);
    // await manager.addProduct("palo","plastico",350,2,"asv123",24);
    // await manager.addProduct("escoba","para barrer",450,2,"asr123",1);
    // await manager.addProduct("termo","acero inoxidable",650,3,"a1s123",2);
    // await manager.addProduct("pc","hp",950,2,"ass123",2);
    // await manager.addProduct("cebolla","criolla",1350,1,"as13",2);    
    // await manager.addProduct("remera","manga corta",250,2,"as33123",1);
    // await manager.addProduct("bermuda","jean",650,3,"aacc",2);
    // await manager.addProduct("sombrero","pana",950,2,"ttppss1",2);
    // await manager.addProduct("reloj","smart watch",1350,1,"as12df",2);

}

test();