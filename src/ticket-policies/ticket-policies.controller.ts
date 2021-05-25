import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { mapFinderOptions } from 'sequelize/types/lib/utils';
import { CancellationTicketDto } from 'src/dtos/create-cancel-ticket.dtos';
import { PaymentService } from 'src/payment/payment.service';
import { TicketPoliciesService } from './ticket-policies.service';

@Controller('ticket-policies')
export class TicketPoliciesController {
  constructor(
    private readonly ticketPoliciesService: TicketPoliciesService,
    private readonly paymentService: PaymentService,
  ) {}

  @MessagePattern('refund_ticket')
  @Patch()
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
      await this.paymentService.refundOrder(
        cancellationTicket.captureId,
        false,
        cancellationTicket.refundAmount,
      );
      return {
        cancellationTicket,
      };
    } catch (error) {
      console.log(error.message);
    } finally {
      channel.ack(originalMessage);
    }
  }
}
