"use client";

import { IEvent } from '@/lib/database/models/event.model';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import React from 'react';
import { Button } from '../ui/button';
import Checkout from './Checkout';

const CheckoutButton = ({ event }: { event: IEvent }) => {
    // Access user data using the useUser hook
    const { user, isLoaded, isSignedIn } = useUser();

    // Handle the case when data is still loading
    if (!isLoaded) {
        // Show a loading spinner or text while waiting for data to load
        return <div>Loading...</div>;
    }

    // Get the user ID and check if the user is signed in
    const userId = isSignedIn && user ? user.publicMetadata.userId as string : undefined;

    // Check if the user is the owner of the event
    const isOwner = userId && event.organizer._id && userId === event.organizer._id;

    return (
        <div className="flex items-center gap-3">
            {/* Conditional rendering based on user's signed-in state and ownership */}
            {isSignedIn ? (
                // If the user is signed in and not the owner of the event
                !isOwner && userId ? (
                    <Checkout event={event} userId={userId} />
                ) : (
                    // User is the owner of the event or userId is undefined
                    <div>You are the owner of this Venue</div>
                )
            ) : (
                // User is signed out
                <Button asChild className="button rounded-full" size="lg">
                    <Link href="/sign-in">
                        Book Now
                    </Link>
                </Button>
            )}
        </div>
    );
};

export default CheckoutButton;
