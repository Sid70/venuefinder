import { Document, Schema, model, models } from "mongoose";

export interface ILocation extends Document {
  _id: string;
  name: string;
}

const LocationSchema = new Schema({
  name: { type: String, required: true, unique: true },
})

const Location = models.Location || model('Location', LocationSchema);

export default Location;