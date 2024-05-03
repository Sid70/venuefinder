"use client";

import { createVenueRating, checkForExistingRating } from '@/lib/actions/rating.action';
import { useState, useEffect } from 'react';

interface RatingProps {
    initialValue: number;
    userId: string;
    eventId: string;
    onChange?: (rating: number) => void;
    onSubmit?: (rating: number, userId: string, eventId: string) => Promise<void>;
}

const Rating: React.FC<RatingProps> = ({ initialValue, userId, eventId, onChange, onSubmit }) => {
    const [rating, setRating] = useState<number>(initialValue);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [hasRated, setHasRated] = useState<boolean>(false);

    // Check for existing ratings when the component mounts
    useEffect(() => {
        async function fetchExistingRating() {
            try {
                const { exists } = await checkForExistingRating(userId, eventId);
                setHasRated(exists);
                if (exists) {
                    setSubmitted(true);
                }
            } catch (error) {
                console.error('Error checking for existing rating:', error);
            }
        }

        fetchExistingRating();
    }, [userId, eventId]);

    const handleRatingClick = (value: number) => {
        if (hasRated) {
            console.log('User has already rated this event');
            return;
        }

        setRating(value);
        // Call the onChange callback if provided
        if (onChange) {
            onChange(value);
        }
        // Reset submission state when a star is clicked
        setSubmitted(false);
    };

    const handleSubmit = async () => {
        // Prevent submission if the user has already rated
        if (hasRated) {
            console.log('User has already rated this event');
            return;
        }

        if (onSubmit) {
            // Submit the rating using the provided onSubmit function
            await onSubmit(rating, userId, eventId);
        }

        // Submit the rating using `createVenueRating` function
        try {
            await createVenueRating({ userId, eventId, rating });
            setSubmitted(true); // Mark as submitted only if successful
            setHasRated(true); // Mark that the user has rated the event
        } catch (error) {
            // Handle error (e.g., log it, show error message)
            console.error('Error submitting rating:', error);
        }
    };

    return (
        <>
            <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((value) => {
                    // Calculate the fill percentage for each star
                    const fillPercentage =
                        rating >= value
                            ? 100
                            : rating >= value - 0.5
                                ? (rating - (value - 1)) * 100
                                : 0;

                    return (
                        <button
                            key={value}
                            onClick={() => handleRatingClick(value)}
                            className="relative text-2xl focus:outline-none"
                            aria-label={`Rate ${value} stars`}
                            disabled={hasRated || submitted}
                        >
                            {/* Render star background */}
                            <span className="text-gray-300">★</span>
                            {/* Render the filled portion of the star */}
                            <span
                                className="absolute top-0 left-0 h-full overflow-hidden"
                                style={{ width: `${fillPercentage}%`, color: 'gold' }}
                            >
                                ★
                            </span>
                        </button>
                    );
                })}
            </div>

            <button
                onClick={handleSubmit}
                disabled={hasRated || submitted}
                style={{ fontSize: '0.8rem', color: submitted ? 'gray' : 'black' }}
            >
                {submitted ? 'Submitted' : rating === 0 ? 'Rate the venue now' : 'Submit'}
            </button>
        </>
    );
};

export default Rating;
