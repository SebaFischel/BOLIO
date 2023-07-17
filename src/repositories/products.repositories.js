import ProductManager from ('../dao/dbManagers/ProductManager.js');

export default class ProductsRepository {
    constructor () {
        this.dao = new ProductManager();
    }

    getAll = async () => {
        const result = await this.dao.getAll();
        return result;
    }

    save = async (product) => {
        const result = await this.dao.save(product);
        return result;
    }

    getProductById = async (id) => {
        const result = await this.dao.getProductById(id);
        return result;
    }

    deleteProductById = async (id) => {
        const result = await this.dao.deleteProductById(id);
        return result;
    }

    updateProductById = async (product) => {
        const result = await this.dao.updateProductById(product);
        return result;
    }

    removeProductFromCart = async (cartId, productId) => {
        const result = await this.dao.removeProductFromCart(cartId, productId);
        return result;
    }

}