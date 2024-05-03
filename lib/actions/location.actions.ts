"use server"

import { CreateLocationParams } from "@/types"
import { handleError } from "../utils"
import { connectToDatabase } from "../database"
import Location from "../database/models/location.model"

export const createLocation = async ({ locationName }: CreateLocationParams) => {
  try {
    await connectToDatabase();

    const newLocation = await Location.create({ name: locationName });

    return JSON.parse(JSON.stringify(newLocation));
  } catch (error) {
    handleError(error)
  }
}

export const getAllLocations = async () => {
  try {
    await connectToDatabase();

    const locations = await Location.find();

    return JSON.parse(JSON.stringify(locations));
  } catch (error) {
    handleError(error)
  }
}

interface LocationDocument extends Document {
  _id: string;
}

// Define the function
export const getLocationById = async (_id: string): Promise<LocationDocument | null> => {
  try {
    // Connect to the database
    await connectToDatabase();

    // Find the location by ID
    const location = await Location.findById(_id);

    // Convert location to JSON and return
    return location ? JSON.parse(JSON.stringify(location)) : null;
  } catch (error) {
    // Handle error gracefully
    console.error('Error getting location by ID:', error);
    return null;
  }
};