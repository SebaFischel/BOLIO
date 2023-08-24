import ProductsRepository from "../repositories/products.repositories";


    getAll = async () => {
        const result = await ProductsRepository.getAll();
        return result;
    }

    save = async (product) => {
        const result = await ProductsRepository.save(product);
        return result;
    }

    getProductById = async (id) => {
        const result = await ProductsRepository.getProductById(id);
        return result;
    }

    deleteProductById = async (id) => {
        const result = await ProductsRepository.deleteProductById(id);
        return result;
    }

    updateProductById = async (product) => {
        const result = await ProductsRepository.updateProductById(product);
        return result;
    }

    removeProductFromCart = async (cartId, productId) => {
        const result = await ProductsRepository.removeProductFromCart(cartId, productId);
        return result;
    }

