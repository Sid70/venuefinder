import React from 'react';

interface RatingProps {
    averageRating: number; // The average rating of the event
}

const Rating: React.FC<RatingProps> = ({ averageRating }) => {
    // Calculate the percentage fill for each star based on the average rating
    const calculateFillPercentage = (star: number) => {
        if (averageRating >= star) {
            return 100; // Fully filled star
        } else if (averageRating >= star - 0.5) {
            return (averageRating - (star - 1)) * 100;
        } else {
            return 0; // Empty star
        }
    };

    return (
        <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <div key={star} className="relative text-2xl">
                    {/* Render the empty star background */}
                    <span className="text-gray-300">★</span>
                    {/* Render the filled portion of the star */}
                    <span
                        className="absolute top-0 left-0 h-full overflow-hidden"
                        style={{ width: `${calculateFillPercentage(star)}%`, color: 'gold' }}
                    >
                        ★
                    </span>
                </div>
            ))}
        </div>
    );
};

export default Rating;
