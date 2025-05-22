const { config } = require("../../../configs/config");
const { NotFoundError } = require("../../../libs/core/error/custom-error");
const APP_MESSAGES = require("../../../shared/messages/app-messages");
const { BookingDetailsEntity } = require("../../booking/schemas/booking.entity");
const stripe = require('stripe')(config.STRIPE_KEY)
const endpointSecret = 'whsec_f9a89ac7cd96428d8fe2447b8399537a6800f67c18b01a29ef31cd855308a14a';

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

    const paymentIntent = event.data.object;
    const booking = await BookingDetailsEntity.findById(paymentIntent.metadata.booking_id).exec()
    console.log(booking)

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        console.log('PaymentIntent was successful!');
        if (booking) {
          booking.status = 'paid'
          await booking.save()
        }
        break;
      case 'payment_intent.payment_failed':
        // Then define and call a function to handle the event payment_intent.payment_failed
        console.log('PaymentIntent failed!');
        if (booking) {
          booking.status = 'failed'
          await booking.save()
        }
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    response.json({ received: true });
  }
}

module.exports = { StripeController };
