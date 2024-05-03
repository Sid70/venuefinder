// ====== USER PARAMS
export type CreateUserParams = {
  clerkId: string
  firstName: string
  lastName: string
  username: string
  email: string
  photo: string
}

export type UpdateUserParams = {
  firstName: string
  lastName: string
  username: string
  photo: string
}
// ====== RATING

export type CreateEventRatingParams = {
  userId: string
  eventId: string
  rating: number
}

// ====== EVENT PARAMS
export type CreateEventParams = {
  userId: string
  event: {
    title: string
    description: string
    locationId: string
    imageUrl: string
    startDateTime: Date
    endDateTime: Date
    categoryId: string
    price: string
    capacity: string
    phNumber: string
    venueTypeId: string
    isFree: boolean
    url: string
  }
  path: string
}

export type UpdateEventParams = {
  userId: string
  event: {
    _id: string
    title: string
    imageUrl: string
    description: string
    locationId: string
    startDateTime: Date
    endDateTime: Date
    categoryId: string
    phNumber: string
    venueTypeId: string
    price: string
    capacity: string
    isFree: boolean
    url: string
  }
  path: string
}

export type DeleteEventParams = {
  eventId: string
  path: string
}

export type GetAllEventsParams = {
  query: string
  category: string
  location: string
  venueType: string
  price: string
  capacity: string
  limit: number
  page: number
  rating: string
}

export type GetEventsByUserParams = {
  userId: string
  limit?: number
  page: number
}

export type GetRelatedEventsByCategoryParams = {
  categoryId: string
  eventId: string
  locationId: string
  venueTypeId: string
  limit?: number
  page: number | string
}

export type Event = {
  _id: string
  title: string
  description: string
  price: string
  capacity: string
  isFree: boolean
  imageUrl: string
  startDateTime: Date
  endDateTime: Date
  phNumber: string
  url: string
  organizer: {
    _id: string
    firstName: string
    lastName: string
  }
  venueType: {
    _id: string
    name: string
  },
  category: {
    _id: string
    name: string
  }
  location: {
    _id: string
    name: string
  }
}

// ====== CATEGORY PARAMS
export type CreateCategoryParams = {
  categoryName: string
}

// ====== LOCATION PARAMS
export type CreateLocationParams = {
  locationName: string
}

// ====== VENUE TYPE PARAMS
export type CreateVenueTypeParams = {
  venueTypeName: string
}


// ====== ORDER PARAMS
export type CheckoutOrderParams = {
  eventTitle: string
  eventId: string
  price: string
  isFree: boolean
  buyerId: string
  startDateTime: Date
  endDateTime: Date
}

export type CreateOrderParams = {
  stripeId: string
  eventId: string
  buyerId: string
  totalAmount: string
  startDateTime: Date
  endDateTime: Date
  createdAt: Date
}

export type GetOrdersByEventParams = {
  eventId: string
  searchString: string
}

export type GetOrdersByUserParams = {
  userId: string | null
  limit?: number
  page: string | number | null
}

// ====== URL QUERY PARAMS
export type UrlQueryParams = {
  params: string
  key: string
  value: string | null
}

export type RemoveUrlQueryParams = {
  params: string
  keysToRemove: string[]
}

export type SearchParamProps = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}
