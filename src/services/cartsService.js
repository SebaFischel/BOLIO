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

deleteProductCart = async (id) => {
    const result = CartsRepository.deleteProductCart(id);
    return result;
}

