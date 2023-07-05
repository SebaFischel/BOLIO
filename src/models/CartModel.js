import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2'

const cartCollection = 'carts';

const cartSchema = new mongoose.Schema({
    products: {
        type: [
            {
                product: {
                    type: String,
                    required: true
                },
                quantity: {
                    type: Number,
                    default: 1
                }
            }
        ],
        default: []
    }
});

cartSchema.plugin(mongoosePaginate);

const cartModel = mongoose.model(cartCollection, cartSchema)
export default cartModel;