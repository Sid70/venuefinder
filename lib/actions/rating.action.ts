'use server'

import { connectToDatabase } from '@/lib/database'
import { handleError } from '@/lib/utils'

import { CreateEventRatingParams } from '@/types'
import Rating from '../database/models/rating.model'

export async function createVenueRating(rating: CreateEventRatingParams) {
    try {
        // Connect to the database
        await connectToDatabase();

        // Destructure the rating parameters
        const { userId, eventId, rating: userRating } = rating;

        // Create a new rating document
        const newRating = await Rating.create({
            userId,
            eventId,
            rating: userRating,
        });

        // Return the newly created rating document as a JSON object
        return JSON.parse(JSON.stringify(newRating));
    } catch (error) {
        // Handle errors using a custom error handling function
        handleError(error);
    }
}

interface CheckForExistingRatingResponse {
    exists: boolean;
}

export async function checkForExistingRating(userId: string, eventId: string): Promise<CheckForExistingRatingResponse> {
    try {
        await connectToDatabase();

        // Query the database for an existing rating record
        const existingRating = await Rating.findOne({ userId, eventId });

        // Return an object indicating whether an existing rating was found
        return {
            exists: !!existingRating, // True if existingRating is not null
        };
    } catch (error) {
        // Log the error and return a default response
        console.error('Error checking for existing rating:', error);
        return { exists: false };
    }
}

interface GetUserRatingResponse {
    rating: number | null;
}

// Function to get the rating value by userId and eventId
export async function getUserRating(userId: string, eventId: string): Promise<GetUserRatingResponse> {
    try {
        // Connect to the database
        await connectToDatabase();

        // Query the database for a rating document matching the userId and eventId
        const ratingDocument = await Rating.findOne({
            userId: userId,
            eventId: eventId,
        });

        // If the document exists, return the rating value
        if (ratingDocument) {
            return {
                rating: ratingDocument.rating,
            };
        } else {
            // If no document is found, return null for the rating
            return {
                rating: null,
            };
        }
    } catch (error) {
        // Handle errors (e.g., log the error, rethrow it, or return a default value)
        console.error('Error fetching user rating:', error);
        return {
            rating: null,
        };
    }
}

export async function getAverageRating(eventId: string): Promise<{ totalAverage: number; count: number }> {
    try {
        // Connect to the database
        await connectToDatabase();
        
        // Retrieve all ratings for the given eventId
        const ratings = await Rating.find({ eventId });

        // Get the count of ratings
        const count = ratings.length;

        // If there are no ratings, return zeroes for both total average and count
        if (count === 0) {
            return { totalAverage: 0, count: 0 };
        }

        // Calculate the sum of ratings
        const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);

        // Calculate the average rating
        const totalAverage = totalRating / count;

        // Return the average rating and count of ratings
        return { totalAverage, count };
        
    } catch (error) {
        // Handle any errors that occur during data retrieval or calculation
        console.error('Error getting average rating:', error);
        throw new Error('Failed to calculate average rating');
    }
}