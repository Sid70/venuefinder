'use server'

import { revalidatePath } from 'next/cache'

import { connectToDatabase } from '@/lib/database'
import Event from '@/lib/database/models/event.model'
import User from '@/lib/database/models/user.model'
import Category from '@/lib/database/models/category.model'
import Location from '../database/models/location.model'
import VenueType from '../database/models/venuetype.model'
import { handleError } from '@/lib/utils'
import {
  CreateEventParams,
  UpdateEventParams,
  DeleteEventParams,
  GetAllEventsParams,
  GetEventsByUserParams,
  GetRelatedEventsByCategoryParams,
} from '@/types'
import Order from '../database/models/order.model'
import Rating from '../database/models/rating.model'

const getCategoryByName = async (name: string) => {
  return Category.findOne({ name: { $regex: name, $options: 'i' } })
}

const getLocationByName = async (name: string) => {
  return Location.findOne({ name: { $regex: name, $options: 'i' } })
}

const getVenueTypeByType = async (name: string) => {
  return VenueType.findOne({ name: { $regex: name, $options: 'i' } })
}

interface Ratings {
  eventId: string;
  userId: string;
  rating: number;
}

const getRatingByRange = async (ratingRange: string) => {
  const [minStr, maxStr] = ratingRange.split('-');

  // Parse the min and max prices to integers
  const minInt = parseInt(minStr);
  const maxInt = parseInt(maxStr);

  // Check if the parsed min and max values are valid numbers
  if (isNaN(minInt) || isNaN(maxInt)) {
    throw new Error("Invalid price range");
  }

  // Fetch all rating objects from the database
  const ratings: Ratings[] = await Rating.find();

  // Filter events based on the specified price range and map to IDs
  const filteredRatingByRange = ratings
    .filter(rate => {
      const rating = rate.rating;
      // Check if the rating is within the specified range
      return rating >= minInt && rating <= maxInt;
    });

  // Return the array of filtered ratings
  return filteredRatingByRange;
}
// Define the structure of an event object
interface Event {
  _id: string; // Assuming the ID is a string; adjust as needed
  price: number; // Price property should be a number
}

// Function to get events by a specified price range
const getEventsByPriceRange = async (priceRange: string): Promise<{ _id: string }[]> => {
  // Split the priceRange string by '-' to get min and max price
  const [minStr, maxStr] = priceRange.split('-');

  // Parse the min and max prices to integers
  const minInt = parseInt(minStr);
  const maxInt = parseInt(maxStr);

  // Check if the parsed min and max values are valid numbers
  if (isNaN(minInt) || isNaN(maxInt)) {
    throw new Error("Invalid price range");
  }

  // Fetch all event objects from the database
  const events: Event[] = await Event.find();

  // Filter events based on the specified price range and map to IDs
  const filteredEventIds = events
    .filter(event => {
      const price = event.price;
      // Check if the price is within the specified range
      return price >= minInt && price <= maxInt;
    })
    .map(event => ({ _id: event._id }));

  // Return the array of filtered event IDs
  return filteredEventIds;
};


interface CapacityEvent {
  _id: string;
  capacity: number;
}


const getCapacityByRange = async (capacityRange: string): Promise<{ _id: string }[]> => {
  // Split the priceRange string by '-' to get min and max price
  const [minStr, maxStr] = capacityRange.split('-');

  // Parse the min and max prices to integers
  const minInt = parseInt(minStr);
  const maxInt = parseInt(maxStr);

  // Check if the parsed min and max values are valid numbers
  if (isNaN(minInt) || isNaN(maxInt)) {
    throw new Error("Invalid capacity range");
  }

  // Fetch all event objects from the database
  const events: CapacityEvent[] = await Event.find();

  // Filter events based on the specified capacity range and map to IDs
  const filteredEventIds = events
    .filter(event => {
      const capacity = event.capacity;
      // Check if the capacity is within the specified range
      return capacity >= minInt && capacity <= maxInt;
    })
    .map(event => ({ _id: event._id }));

  // Return the array of filtered event IDs
  return filteredEventIds;
}

const populateEvent = (query: any) => {
  return query
    .populate({ path: 'organizer', model: User, select: '_id firstName lastName' })
    .populate({ path: 'category', model: Category, select: '_id name' })
    .populate({ path: 'location', model: Location, select: '_id name' })
    .populate({ path: 'venueType', model: VenueType, select: '_id name' })
}

// CREATE
export async function createEvent({ userId, event, path }: CreateEventParams) {
  try {
    await connectToDatabase()

    const organizer = await User.findById(userId)
    if (!organizer) throw new Error('Organizer not found')

    const newEvent = await Event.create({ ...event, category: event.categoryId, organizer: userId, location: event.locationId, venueType: event.venueTypeId })

    revalidatePath(path)

    return JSON.parse(JSON.stringify(newEvent))
  } catch (error) {
    handleError(error)
  }
}

// GET ONE EVENT BY ID
export async function getEventById(eventId: string) {
  try {
    await connectToDatabase()

    const event = await populateEvent(Event.findById(eventId))

    if (!event) throw new Error('Event not found')

    return JSON.parse(JSON.stringify(event))
  } catch (error) {
    handleError(error)
  }
}

// UPDATE
export async function updateEvent({ userId, event, path }: UpdateEventParams) {
  try {
    await connectToDatabase()

    const eventToUpdate = await Event.findById(event._id)
    if (!eventToUpdate || eventToUpdate.organizer.toHexString() !== userId) {
      throw new Error('Unauthorized or event not found')
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      event._id,
      { ...event, category: event.categoryId, location: event.locationId, venueType: event.venueTypeId },
      { new: true }
    )

    revalidatePath(path)

    return JSON.parse(JSON.stringify(updatedEvent))
  } catch (error) {
    handleError(error)
  }
}

// DELETE
export async function deleteEvent({ eventId, path }: DeleteEventParams) {
  try {
    // Connect to database
    await connectToDatabase();

    // Check if there are any orders associated with the event
    const orders = await Order.find({ event: eventId });

    // If there are no associated orders, delete the event
    if (orders.length === 0) {
      const deletedEvent = await Event.findByIdAndDelete(eventId);

      if (deletedEvent) {
        // Revalidate the specified path
        revalidatePath(path);
        return { success: true, message: 'Event deleted successfully' };
      } else {
        return { success: false, message: 'Failed to delete venue' };
      }
    } else {
      // Inform the user that the event cannot be deleted
      return { success: false, message: 'Cannot delete venue because someone has booked this venue.' };
    }
  } catch (error) {
    // Handle any errors
    handleError(error);
    return { success: false, message: 'An error occurred during event deletion' };
  }
}


// GET ALL EVENTS
export async function getAllEvents({ query, limit = 6, page, category, location, price, capacity, venueType, rating }: GetAllEventsParams) {
  try {
    await connectToDatabase()

    const titleCondition = query ? { title: { $regex: query, $options: 'i' } } : {}
    const categoryCondition = category ? await getCategoryByName(category) : null
    const locationCondition = location ? await getLocationByName(location) : null
    const priceCondition = price ? await getEventsByPriceRange(price) : null
    const capacityCondition = capacity ? await getCapacityByRange(capacity) : null;
    const venueTypeCondition = venueType ? await getVenueTypeByType(venueType) : null;
    const ratingCondition = rating ? await getRatingByRange(rating) : null;

    const conditions = {
      $and: [
        titleCondition,
        categoryCondition ? { category: categoryCondition._id } : {},
        locationCondition ? { location: locationCondition._id } : {},
        priceCondition ? { _id: { $in: priceCondition.map(event => event._id) } } : {},
        capacityCondition ? { _id: { $in: capacityCondition.map(event => event._id) } } : {},
        venueTypeCondition ? { venueType: venueTypeCondition._id } : {},
        ratingCondition ? { _id: { $in: ratingCondition.map(event => event.eventId) } } : {},
      ],
    }

    const skipAmount = (Number(page) - 1) * limit
    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit)

    const events = await populateEvent(eventsQuery)
    const eventsCount = await Event.countDocuments(conditions)

    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(eventsCount / limit),
    }
  } catch (error) {
    handleError(error)
  }
}

// GET EVENTS BY ORGANIZER
export async function getEventsByUser({ userId, limit = 6, page }: GetEventsByUserParams) {
  try {
    await connectToDatabase()

    const conditions = { organizer: userId }
    const skipAmount = (page - 1) * limit

    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit)

    const events = await populateEvent(eventsQuery)
    const eventsCount = await Event.countDocuments(conditions)

    return { data: JSON.parse(JSON.stringify(events)), totalPages: Math.ceil(eventsCount / limit) }
  } catch (error) {
    handleError(error)
  }
}

// GET RELATED EVENTS: EVENTS WITH SAME CATEGORY
export async function getRelatedEventsByCategory({
  categoryId,
  eventId,
  locationId,
  limit = 3,
  page = 1,
}: GetRelatedEventsByCategoryParams) {
  try {
    await connectToDatabase()

    const skipAmount = (Number(page) - 1) * limit
    const conditions = { $and: [{ category: categoryId }, { location: locationId }, { _id: { $ne: eventId } }] }

    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit)

    const events = await populateEvent(eventsQuery)
    const eventsCount = await Event.countDocuments(conditions)

    return { data: JSON.parse(JSON.stringify(events)), totalPages: Math.ceil(eventsCount / limit) }
  } catch (error) {
    handleError(error)
  }
}
