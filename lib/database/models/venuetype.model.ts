import { Document, Schema, model, models } from "mongoose";

export interface IVenueType extends Document {
  _id: string;
  name: string;
}

const VenueTypeSchema = new Schema({
  name: { type: String, required: true, unique: true },
})

const VenueType = models.VenueType || model('VenueType', VenueTypeSchema);

export default VenueType;