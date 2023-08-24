import cartManager from ('../dao/dbManagers/CartManager.js');

export default class CartsRepository {
    constructor () {
        this.dao = new cartManager();
    }

    getAll = async () => {
        const result = await this.dao.getAll();
        return result;
    }

    save = async (cart) => {
        const result = await this.dao.save(cart);
        return result;
    }

    getById = async (id) => {
        const result = await this.dao.getProductById(id);
        return result;
    }

    addProductToCart = async (cartId, productId) => {
        const result = await this.dao.deleteProductById(cartId, productId);
        return result;
    }

    deleteProductFromCart = async (cartId, productId) => {
        const result = await this.dao.deleteProductFromCart(cartId, productId);
        return result;
    }

}