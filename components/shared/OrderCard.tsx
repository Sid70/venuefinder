import { IEvent } from '@/lib/database/models/event.model'
import { formatDateTime } from '@/lib/utils'
import { auth } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Rating from '../ui/Rating'
import { getUserById } from '@/lib/actions/user.actions';
import { getUserRating } from '@/lib/actions/rating.action'


type OrderCardProps = {
    orderItem: IEvent;
    event: IEvent;
    hasOrderLink?: boolean;
    hidePrice?: boolean;
};


const OrderCard = async ({ orderItem, event, hasOrderLink, hidePrice }: OrderCardProps) => {
    const { sessionClaims } = auth();
    const userId = sessionClaims?.userId as string;
    const user = await getUserById(userId);

    // const isEventCreator = userId === event?.organizer?._id?.toString();
    // const currentDateTime = new Date();

    const venueRating = await getUserRating(userId, event?._id);

    const endDateTime = new Date(orderItem.endDateTime);
    const currentDateTime = new Date();



    return (
        <div className="group relative flex min-h-[380px] w-full max-w-[400px] flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg md:min-h-[438px]">
            <Link
                href={`/events/${event?._id}`}
                style={{ backgroundImage: `url(${event?.imageUrl})`, height: "250px" }}
                className="flex-center flex-grow bg-gray-50 bg-cover bg-center text-grey-500"
            />
            <div
                className="flex min-h-[230px] flex-col gap-3 p-5 md:gap-4"
            >
                <Link href={`/events/${event?._id}`}>
                    <p className="p-medium-16 md:p-medium-20 line-clamp-2 flex-1 text-black" style={{ fontSize: "1.5rem" }}>{event?.title}</p>
                </Link>

                {
                    hidePrice && (
                        <div className="flex flex-col gap-2">
                            {!(endDateTime < currentDateTime) ? (
                                <p className="flex items-center justify-center rounded-full bg-green-200 text-green-800 font-semibold py-1 px-4 w-max">
                                    Booking Confirmed
                                </p>
                            ) : (
                                <>
                                    <p className="flex items-center justify-center rounded-full bg-red-400 text-white font-semibold py-1 px-4 w-max">
                                        Booking Expired
                                    </p>
                                </>
                            )}

                            <div className="flex flex-col space-y-1 mt-2">
                                <p className="text-gray-700 font-semibold">Booking From</p>
                                <p className="text-gray-600">{formatDateTime(orderItem.startDateTime).dateTime}</p>
                            </div>
                            <div className="flex flex-col space-y-1">
                                <p className="text-gray-700 font-semibold">to</p>
                                <p className="text-gray-600">{formatDateTime(orderItem.endDateTime).dateTime}</p>
                            </div>
                        </div>
                    )
                }

                {/* Rating */}
                <div>
                    <Rating userId={userId} initialValue={(venueRating.rating === null) ? 0 : venueRating.rating} eventId={event?._id} />
                </div>

                <div className="flex items-center justify-between w-full">
                    <div className='flex items-center justify-between w-full' style={{ marginTop: "10px" }}>
                        {!hasOrderLink && (
                            <Link href={`/orders?eventId=${event?._id}`} className="flex gap-2">
                                <p className="text-primary-500">Order Details</p>
                                <Image src="/assets/icons/arrow.svg" alt="search" width={10} height={10} />
                            </Link>
                        )}

                        <div className='flex items-center'>
                            <div className='ml-10'>
                                <a href={`tel:${event?.phNumber}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-green-700">
                                        <path fillRule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z" clipRule="evenodd" />
                                    </svg>
                                </a>

                            </div>
                            <div className='ml-10'>
                                <a href={`mailto:${user.email}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" style={{ color: "crimson" }}>
                                        <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                                        <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default OrderCard;