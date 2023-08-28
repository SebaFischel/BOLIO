import cartModel from '../dbManagers/models/CartModel.js';
import productModel from '../dbManagers/models/ProductModel.js';
import ticketModel from './models/TicketModel.js';
import { v4 as uuidv4 } from "uuid";
import { logger } from '../../utils.js'
import { transporter } from '../../controllers/mailSms.controller.js';


export default class Carts {
  constructor() {
   logger.info("Working carts with DB");
    this.path = "src/Files/carts.json";
  }

  async getAll() {
    const carts = await cartModel.find().lean();
    return carts;
  }

  async save(cart) {
    try {
      const newCart = new cartModel(cart);
  
      await newCart.save();
      
      return newCart;
    } catch (error) {
      logger.error(error);
      throw new Error("Error al guardar el carrito en la base de datos");
    }
  }

  async getById(id) {
    const cart = await cartModel.findOne({ _id: id }).lean();
    if (!cart) {
      return "Cart not found";
    }
  
    const populatedCart = await Promise.all(cart.products.map(async (item) => {
      const product = await productModel.findById(item.product).lean();
      return { ...item, product };
    }));
  
    cart.products = populatedCart;
  
    return cart;
  }

  async addProductToCart(cartId, productId) {
    try {
      const cart = await cartModel.findById(cartId);
      if (!cart) {
        return null;
      }
      const existingProductIndex = cart.products.findIndex(
        (product) => product.product === productId
      );
      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity += 1;
      } else {
        cart.products.push({ product: productId, quantity: 1 });
      }
      const updatedCart = await cart.save();
      return updatedCart;
    } catch (error) {
      logger.error(error);
      throw new Error("Error al agregar el producto al carrito");
    }
  }
  

  async purchaseCart(cartId, purchaserFirstName, purchaserLastName, purchaserEmail) {
    try {
        let total = 0;
        logger.info("Inicio del método purchaseCart");

        const cart = await cartModel.findById(cartId);
        if (!cart) {
            throw new Error("Cart not found");
        }

        const unprocessedProducts = [];

        for (const productItem of cart.products) {
            logger.info(`Procesando producto: ${productItem.product}`);

            const product = await productModel.findById(productItem.product);
            if (!product) {
                unprocessedProducts.push(productItem.product);
                continue;
            }

            if (product.stock >= productItem.quantity) {
                product.stock -= productItem.quantity;
                await product.save();
            } else {
                unprocessedProducts.push(productItem.product);
                continue;
            }
            cart.products.forEach((e) => {
                total += e.quantity;
            });
        }

        await cartModel.findByIdAndDelete(cartId);

        if (unprocessedProducts.length === 0) {
            const fecha = new Date().toLocaleString("en-GB", {
                hour12: false,
            });
            logger.info(typeof(fecha))
            const ticketData = {
                code: uuidv4(),
                purchase_datetime: fecha,
                amount: total,
                purchaser: `${purchaserFirstName} ${purchaserLastName}`,
            };

            const ticket = new ticketModel(ticketData);
            await ticket.save();

            try {
                const mailOptions = {
                    from: 'fischel.sebastian@gmail.com', 
                    to: purchaserEmail, 
                    subject: 'Your Purchase Ticket',
                    html: `<p>Hola ${purchaserFirstName},</p>
                            <p>Tu compra se realizó con exito</p>
                            <p>El codigo de tu ticket es: ${ticket.code}</p>
                            <p>Fecha de compra: ${ticket.purchase_datetime}</p>
                            <p>Cantidad: ${ticket.amount}</p>
                            <p>Comprador: ${ticket.purchaser}</p>`
                };

                await transporter.sendMail(mailOptions);
                logger.info('Ticket sent by email to:', purchaserEmail);
            } catch (emailError) {
                logger.error('Error sending email:', emailError);
                
            }

            logger.info("Finalización exitosa de la compra");
            return "Purchase completed successfully";
        }

        logger.error("Error durante el proceso de compra");
        return {
            error: "Error during the purchase process",
            unprocessedProducts,
        };
    } catch (error) {
        logger.error(error);
        throw new Error("Error during the purchase process");
    }
}

async deleteProductFromCart(cartId, productId) {
  try {
      const cart = await cartModel.findById(cartId);
      if (!cart) {
          return "Cart not found";
      }

      const productIndex = cart.products.findIndex((productItem) => productItem.product.toString() === productId);
      if (productIndex === -1) {
          return "Product not found in cart";
      }

      cart.products.splice(productIndex, 1); 
      await cart.save();

      return cart;
  } catch (error) {
      logger.error(error);
      throw new Error("Error al eliminar el producto del carrito");
  }
}

}