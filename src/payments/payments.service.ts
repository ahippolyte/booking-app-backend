import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
// import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  // private stripe: Stripe;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    // Initialize Stripe when implementing payment
    // const stripeKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    // if (stripeKey) {
    //   this.stripe = new Stripe(stripeKey, {
    //     apiVersion: '2024-11-20.acacia',
    //   });
    // }
  }

  /**
   * Create a Stripe Payment Intent (to be implemented)
   * This will be used to process payments securely with Stripe
   */
  async createPaymentIntent(bookingId: string, amount: number, currency: string = 'EUR') {
    // TODO: Implement Stripe Payment Intent
    // const paymentIntent = await this.stripe.paymentIntents.create({
    //   amount: Math.round(amount * 100), // Stripe uses cents
    //   currency,
    //   metadata: { bookingId },
    // });

    // Create payment record in database
    // return this.prisma.payment.create({
    //   data: {
    //     amount,
    //     currency,
    //     stripePaymentId: paymentIntent.id,
    //     bookingId,
    //     userId,
    //     status: 'PENDING',
    //   },
    // });

    throw new Error('Payment integration not yet implemented. Please configure Stripe.');
  }

  /**
   * Handle Stripe webhook events (to be implemented)
   */
  async handleStripeWebhook(signature: string, payload: Buffer) {
    // TODO: Verify webhook signature and process event
    // const event = this.stripe.webhooks.constructEvent(
    //   payload,
    //   signature,
    //   this.configService.get<string>('STRIPE_WEBHOOK_SECRET'),
    // );

    // Handle different event types
    // switch (event.type) {
    //   case 'payment_intent.succeeded':
    //     // Update payment status to COMPLETED
    //     break;
    //   case 'payment_intent.payment_failed':
    //     // Update payment status to FAILED
    //     break;
    // }

    throw new Error('Webhook handling not yet implemented.');
  }

  async findOne(id: string) {
    return this.prisma.payment.findUnique({
      where: { id },
      include: {
        booking: {
          include: {
            property: true,
          },
        },
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async findByBooking(bookingId: string) {
    return this.prisma.payment.findUnique({
      where: { bookingId },
    });
  }
}
