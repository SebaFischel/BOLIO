import CartsRepository from "../repositories/carts.repositories";

getAll = async () => {
    const result = CartsRepository.getAll();
    return result;
}

save = async (cart) => {
    const result = await CartsRepository.save(cart);
    return result;
}

getById = async (id) => {
    const result = await CartsRepository.getProductById(id);
    return result;
}

addProductToCart = async (cartId, productId) => {
    const result = await CartsRepository.deleteProductById(cartId, productId);
    return result;
}

purchaseCart = async (cartId, purchaserFirstName, purchaserLastName) => {
    const result = await CartsRepository.purchaseCart(cartId, purchaserFirstName, purchaserLastName);
    return result;
}

deleteProductFromCart = async (cartId, productId) => {
    const result = CartsRepository.deleteProductFromCart(cartId, productId);
    return result;
}

export {
    getAll,
    save,
    getById,
    addProductToCart,
    purchaseCart,
    deleteProductFromCart,
}

