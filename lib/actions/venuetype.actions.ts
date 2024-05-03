"use server"

import { CreateVenueTypeParams } from "@/types"
import { handleError } from "../utils"
import { connectToDatabase } from "../database"
import VenueType from "../database/models/venuetype.model"

export const createVenueType = async ({ venueTypeName }: CreateVenueTypeParams) => {
  try {
    await connectToDatabase();

    const newVenueType = await VenueType.create({ name: venueTypeName });

    return JSON.parse(JSON.stringify(newVenueType));
  } catch (error) {
    handleError(error)
  }
}

export const getAllVenueType = async () => {
  try {
    await connectToDatabase();

    const venuetypes = await VenueType.find();

    return JSON.parse(JSON.stringify(venuetypes));
  } catch (error) {
    handleError(error)
  }
}