import CategoryFilter from '@/components/shared/CategoryFilter';
import Collection from '@/components/shared/Collection'
import LocationFilter from '@/components/shared/LocationFilter';
import CapacityFilter from '@/components/shared/CapacityFilter';
import PriceFilter from '@/components/shared/PriceFilter';
import VenueTypeFilter from '@/components/shared/VenueTypeFilter';
import Search from '@/components/shared/Search';
import { Button } from '@/components/ui/button'
import { getAllEvents } from '@/lib/actions/event.actions';
import { SearchParamProps } from '@/types';
import Image from 'next/image'
import Link from 'next/link'
import ChatBot from '@/components/shared/Chatbot';
import RatingFilter from '@/components/shared/RatingFilter';


export default async function Home({ searchParams }: SearchParamProps) {
  const page = Number(searchParams?.page) || 1;
  const searchText = (searchParams?.query as string) || '';
  const category = (searchParams?.category as string) || '';
  const location = (searchParams?.location as string) || '';
  const price = (searchParams?.price as string) || '';
  const capacity = (searchParams?.capacity as string) || '';
  const venueType = (searchParams?.venueType as string) || '';
  const rating = (searchParams?.rating as string) || '';

  const events = await getAllEvents({
    query: searchText,
    category,
    location,
    price,
    capacity,
    page,
    venueType,
    rating,
    limit: 6,
  })

  return (
    <>
      {/* Host, Connect, Celebrate: Your Events, Our Platform! */}
      <section className="bg-primary-50 bg-dotted-pattern bg-contain py-5 md:py-10">
        <div className="wrapper grid grid-cols-1 gap-5 md:grid-cols-2 2xl:gap-0">
          <div className="flex flex-col justify-center gap-8">
            <h1 className="h1-bold">Find & Book The Best Venue For Every Special Event!</h1>
            <p className="p-regular-20 md:p-regular-24">Excess a global community to find your perfect venue, with helpful tips and insights at your fingertips.</p>
            <Button size="lg" asChild className="button w-full sm:w-fit">
              <Link href="#events">
                Explore Now
              </Link>
            </Button>
          </div>

          <Image
            src="/assets/images/hero.png"
            alt="hero"
            width={1000}
            height={1000}
            className="max-h-[70vh] object-contain object-center 2xl:max-h-[50vh]"
          />
        </div>
      </section>

      {/* Trust by Thousands of Events */}

      <section id="events" className="wrapper my-8 flex flex-col gap-8 md:gap-12">
        <h2 className="h2-bold">Trust by <br /> Thousands of Venues</h2>

        <div className="flex w-full flex-col gap-5 md:flex-row">
          <Search />
        </div>
        <div className="flex w-full flex-col gap-5 md:flex-row">
          <CategoryFilter />
          <LocationFilter />
        </div>
        <div className="flex w-full flex-col gap-5 md:flex-row">
          <PriceFilter />
          <CapacityFilter />
        </div>
        <div className="flex w-full flex-col gap-5 md:flex-row">
          <VenueTypeFilter />
          <RatingFilter />
        </div>

        <Collection
          data={events?.data}
          emptyTitle="No Venues Found"
          emptyStateSubtext="Come back later"
          collectionType="All_Events"
          limit={6}
          page={page}
          totalPages={events?.totalPages}
        />
      </section>

      <ChatBot chatbotId="R8Y0Y4iiHGnEa7J9ITDcF" domain="www.chatbase.co" />
    </>
  )
}
