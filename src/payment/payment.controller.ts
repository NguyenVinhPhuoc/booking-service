import {
  Controller,
  Get,
  HttpStatus,
  Logger,
  Post,
  Query,
} from '@nestjs/common';
import { debug } from 'node:console';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  private readonly logger = new Logger('PaymentController');
  constructor(private readonly paymentService: PaymentService) {}
  async createOrder(captureId: string, refundAmount: number) {
    try {
      const res = await this.paymentService.refundOrder(
        captureId,
        false,
        refundAmount,
      );
      return res.status;
    } catch (error) {
      this.logger.error(error.message);
      throw HttpStatus.SERVICE_UNAVAILABLE;
    }
  }
}
