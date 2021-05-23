import { Module } from '@nestjs/common';
import { TicketPoliciesService } from './ticket-policies.service';
import { TicketPoliciesController } from './ticket-policies.controller';
import { PaymentService } from 'src/payment/payment.service';

@Module({
  controllers: [TicketPoliciesController],
  providers: [TicketPoliciesService, PaymentService],
})
export class TicketPoliciesModule {}
