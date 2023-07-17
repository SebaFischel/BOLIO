import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2'

const ticketCollection = 'tickets';

const ticketSchema = new mongoose.Schema({
    id: {
        type: String
    },
    code: {
        type: String,
        required: true
    },
    purchase_datetime: {
        type: Number,
        required: true,
    },
    amount: {
        type: String,
        required: true
    },
    purchaser: {
        type: String,
        required: true
    }
});

ticketSchema.plugin(mongoosePaginate);

const ticketModel = mongoose.model(ticketCollection, ticketSchema)
export default ticketModel;