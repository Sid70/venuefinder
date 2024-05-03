import { Document, Schema, model, models } from "mongoose";

export interface IEvent extends Document {
  event: IEvent;
  _id: string;
  title: string;
  description?: string;
  createdAt: Date;
  imageUrl: string;
  startDateTime: Date;
  endDateTime: Date;
  price: string;
  phNumber: string;
  isFree: boolean;
  url?: string;
  capacity: string
  location: { _id: string , name: string }
  category: { _id: string, name: string }
  venueType: { _id: string, name: string }
  organizer: { _id: string, firstName: string, lastName: string }
}

const EventSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  location: { type: Schema.Types.ObjectId, ref: 'Location' },
  createdAt: { type: Date, default: Date.now },
  imageUrl: { type: String, required: true },
  startDateTime: { type: Date, default: Date.now },
  endDateTime: { type: Date, default: Date.now },
  price: { type: String },
  phNumber: { type: String },
  isFree: { type: Boolean, default: false },
  url: { type: String },
  capacity: { type: String , required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  venueType: { type: Schema.Types.ObjectId, ref: 'VenueType'},
  organizer: { type: Schema.Types.ObjectId, ref: 'User' },
})

const Event = models.Event || model('Event', EventSchema);

export default Event;