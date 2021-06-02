import { Controller, HttpStatus, Logger, Patch } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { CancellationTicketDto } from 'src/dtos/create-cancel-ticket.dtos';
import { ExchangeTicketDto } from 'src/dtos/create-exchange-ticket.dtos';
import { PaymentService } from 'src/payment/payment.service';
import { TicketPoliciesService } from './ticket-policies.service';

@Controller('ticket-policies')
export class TicketPoliciesController {
  private readonly logger = new Logger('TicketPolicyController');

  constructor(
    private readonly ticketPoliciesService: TicketPoliciesService,
    private readonly paymentService: PaymentService,
  ) {}

  @MessagePattern('refund_ticket')
  async createCancellationTicket(
    @Payload() cancellationTicketDto: CancellationTicketDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    try {
      const cancellationTicket = await this.ticketPoliciesService.createCancellationTicket(
        cancellationTicketDto,
      );
      const response = await this.paymentService.refundOrder(
        cancellationTicket.captureId,
        false,
        cancellationTicket.refundAmount,
      );

      if (response.status !== '200') {
        return { message: 'Thanh toán không thành công', response };
        //Thieu kich hoat lai ve
      }
      return {
        cancellationTicket,
      };
    } catch (error) {
      this.logger.error(error.message);
      throw HttpStatus.SERVICE_UNAVAILABLE;
    } finally {
      channel.ack(originalMessage);
    }
  }

  @MessagePattern('exchange_ticket_without_refund')
  async createExchangeTicket(
    @Payload() exchangeTicketDto: ExchangeTicketDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    try {
      const exchangeTicket = await this.ticketPoliciesService.createExchangeTicket(
        exchangeTicketDto,
      );
      return exchangeTicket;
    } catch (error) {
      this.logger.error(error.message);
      throw HttpStatus.SERVICE_UNAVAILABLE;
    } finally {
      channel.ack(originalMessage);
    }
  }
}
