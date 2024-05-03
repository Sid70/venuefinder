import { Schema, model, models, Document } from 'mongoose'
import { IEvent } from './event.model'

export interface IOrder extends Document {
  createdAt: Date
  stripeId: string
  totalAmount: string
  event: {
    _id: string
    title: string
  }
  buyer: {
    _id: string
    firstName: string
    lastName: string
  }
  startDateTime: Date,
  endDateTime: Date,
}

export type IOrderItem = {
  _id: string
  event: IEvent
  totalAmount: string
  createdAt: Date
  eventTitle: string
  buyer: string
  startDateTime: Date,
  endDateTime: Date,
}

const OrderSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  stripeId: {
    type: String,
    required: true,
    unique: true,
  },
  totalAmount: {
    type: String,
  },
  startDateTime: { type: Date , required: true},
  endDateTime: { type: Date , required: true},
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
  },
  buyer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
})

const Order = models.Order || model('Order', OrderSchema)

export default Order
