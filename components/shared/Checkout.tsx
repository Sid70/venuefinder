import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Image from 'next/image';
import { IEvent } from '@/lib/database/models/event.model';
import { Button } from '../ui/button';
import { checkoutOrder } from '@/lib/actions/order.actions';
import Modal from '../ui/booking-date-modal'; // Make sure to import the Modal component

loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const Checkout = ({ event, userId }: { event: IEvent, userId: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDateTime, setStartDateTime] = useState<Date | null>(null);
  const [endDateTime, setEndDateTime] = useState<Date | null>(null);

  useEffect(() => {
    // const chck = await IsOrderBookedByUser({userId,startDateTime,endDateTime,event._id});
    // console.log(event)
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      console.log('Order placed! You will receive an email confirmation.');
    }

    if (query.get('canceled')) {
      console.log('Order canceled -- continue to shop around and checkout when you’re ready.');
    }
  }, []);

  const onCheckout = async () => {
    if (startDateTime && endDateTime) {
      const order = {
        eventTitle: event.title,
        eventId: event._id,
        price: event.price,
        isFree: event.isFree,
        buyerId: userId,
        startDateTime: startDateTime,
        endDateTime: endDateTime,
      };

      // You can adjust this function as needed
      await checkoutOrder(order);
    } else {
      // Handle the case when startDateTime or endDateTime is null
      alert("Please select both start and end dates.");
    }
  };


  const handleButtonClick = () => {
    // Open the modal
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    // Close the modal
    setIsModalOpen(false);
  };

  return (
    <>
      <form action={onCheckout} method="post">
        <div className="flex items-center justify-between">
          <Button type="button" onClick={handleButtonClick} size="lg" className="button sm:w-fit">
            {event.isFree ? 'Book Now' : 'Book Now'}
          </Button>
        </div>
      </form>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <h1 style={{ fontSize: "20px" }}>Select Date and Time Which You Want to Book: </h1>

        <div className="flex flex-col gap-5 md:flex-row py-4">
          <div className="w-full">
            <div className="flex items-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
              <Image
                src="/assets/icons/calendar.svg"
                alt="calendar"
                width={24}
                height={24}
                className="filter-grey"
              />
              <p className="ml-3 whitespace-nowrap text-grey-600">Start Date:</p>
              <DatePicker
                selected={startDateTime}
                onChange={(date: Date) => setStartDateTime(date)}
                showTimeSelect
                timeInputLabel="Time:"
                dateFormat="MM/dd/yyyy h:mm aa"
                wrapperClassName="datePicker"
                required
              />
            </div>
          </div>

          <div className="w-full">
            <div className="flex items-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
              <Image
                src="/assets/icons/calendar.svg"
                alt="calendar"
                width={24}
                height={24}
                className="filter-grey"
              />
              <p className="ml-3 whitespace-nowrap text-grey-600">End Date:</p>
              <DatePicker
                selected={endDateTime}
                onChange={(date: Date) => setEndDateTime(date)}
                showTimeSelect
                timeInputLabel="Time:"
                dateFormat="MM/dd/yyyy h:mm aa"
                wrapperClassName="datePicker"
                required
              />
            </div>
          </div>
        </div>

        <Button onClick={onCheckout} className="mt-4" >
          Yes, Proceed
        </Button>
      </Modal>
    </>
  );
};

export default Checkout;
