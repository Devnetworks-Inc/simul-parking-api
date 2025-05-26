const { config } = require("../../../configs/config");
const { NotFoundError } = require("../../../libs/core/error/custom-error");
const APP_MESSAGES = require("../../../shared/messages/app-messages");
const { BookingDetailsEntity } = require("../../booking/schemas/booking.entity");
const { sendEmail } = require('../../../shared/services/email')
const stripe = require('stripe')(config.STRIPE_KEY)
const endpointSecret = config.STRIPE_ENDPOINT_SECRET;

class StripeController {
  async webhook(request, response) {
    const sig = request.headers['stripe-signature'];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    }
    catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
    }

    const session = event?.data?.object;

    if (session?.metadata?.product_service !== 'SIMUL_PARKING_SPACE_BOOKING') {
      response.json({ received: true })
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        console.log('PaymentIntent was successful!');
        handlePaymentSuccess(session)
        break;
      case 'payment_intent.payment_failed':
        // Then define and call a function to handle the event payment_intent.payment_failed
        console.log('PaymentIntent failed!');
        handlePaymentFailed(session)
        break;
      case 'checkout.session.expired':
        handlePaymentFailed(session)
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    response.json({ received: true });
  }
}

async function handlePaymentSuccess(session) {
  try {
    const booking = await BookingDetailsEntity.findById(session.metadata.booking_id).exec()
    if (booking) {
      booking.status = 'paid'
      booking.checkoutSessionPaymentDate = new Date()
      await booking.save()
      await sendEmail({ to: booking.email, first_name: booking.firstName, last_name: booking.lastName, booking_id: session.metadata.booking_id });
    }
  } catch (error) {
    console.error(error)
  }
}

async function handlePaymentFailed(session) {
  try {
    const booking = await BookingDetailsEntity.findById(session.metadata.booking_id).exec()
    if (booking) {
      booking.status = 'failed'
      booking.checkoutSessionFailedDate = new Date()
      await booking.save()
    }
  } catch (error) {
    console.error(error)
  }
}

module.exports = { StripeController };
