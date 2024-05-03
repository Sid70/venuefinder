import stripe from 'stripe'
import { NextResponse } from 'next/server'
import { createOrder } from '@/lib/actions/order.actions'

export async function POST(request: Request) {
  const body = await request.text()

  console.log(1)

  const sig = request.headers.get('stripe-signature') as string
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

  let event

  try {
    console.log(1)
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err) {
    return NextResponse.json({ message: 'Webhook error', error: err })
  }

  // Get the ID and type
  const eventType = event.type

  // CREATE
  if (eventType === 'checkout.session.completed') {
    const { id, amount_total, metadata } = event.data.object

    const order = {
      stripeId: id,
      eventId: metadata?.eventId || '',
      buyerId: metadata?.buyerId || '',
      totalAmount: amount_total ? (amount_total / 100).toString() : '0',
      createdAt: new Date(),
      startDateTime: metadata?.startDateTime ? new Date(metadata.startDateTime) : new Date(), // Use current date as default if startDateTime is not provided
      endDateTime: metadata?.endDateTime ? new Date(metadata.endDateTime) : new Date(),       // Use current date as default if endDateTime is not provided
    };


    const newOrder = await createOrder(order)
    return NextResponse.json({ message: 'OK', order: newOrder })
  }
  console.log(1)
  return new Response('', { status: 200 })
}
