import * as z from "zod"

export const eventFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(3, 'Description must be at least 3 characters').max(400, 'Description must be less than 400 characters'),
  imageUrl: z.string(),
  startDateTime: z.date(),
  endDateTime: z.date(),
  categoryId: z.string(),
  locationId: z.string(),
  venueTypeId: z.string(),
  phNumber: z.string(),
  price: z.string(),
  capacity: z.string(),
  isFree: z.boolean(),
  url: z.string().url()
})