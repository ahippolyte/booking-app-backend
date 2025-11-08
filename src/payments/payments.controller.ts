import { Controller, Get, Post, Body, Param, Headers, RawBodyRequest, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-intent')
  // @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a Stripe Payment Intent (not yet implemented)' })
  async createPaymentIntent(
    @Body() createPaymentDto: { bookingId: string; amount: number; currency?: string },
  ) {
    return this.paymentsService.createPaymentIntent(
      createPaymentDto.bookingId,
      createPaymentDto.amount,
      createPaymentDto.currency,
    );
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Handle Stripe webhook events' })
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() request: RawBodyRequest<Request>,
  ) {
    return this.paymentsService.handleStripeWebhook(signature, request.rawBody);
  }

  @Get(':id')
  // @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment details by ID' })
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  @Get('booking/:bookingId')
  // @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment by booking ID' })
  findByBooking(@Param('bookingId') bookingId: string) {
    return this.paymentsService.findByBooking(bookingId);
  }
}
