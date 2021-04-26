import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

@Controller('tickets')
export class TicketsController {
  private readonly logger = new Logger('TicketController');
  constructor(private readonly ticketsService: TicketsService) {}

  @MessagePattern('create_ticket')
  async create(
    @Payload() createTicketDto: CreateTicketDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    try {
      const ticket = await this.ticketsService.postTicket(createTicketDto);
      return { ticket };
    } catch (error) {
      this.logger.error(error.message);
      throw HttpStatus.SERVICE_UNAVAILABLE;
    } finally {
      channel.ack(originalMessage);
    }
  }

  @MessagePattern('get_tickets_by_contact')
  async getTicketsByContact(
    @Payload() contactId: string,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    try {
      const tickets = await this.ticketsService.getTicketsByContact(contactId);
      return { tickets };
    } catch (error) {
      this.logger.error(error.message);
      throw HttpStatus.SERVICE_UNAVAILABLE;
    } finally {
      channel.ack(originalMessage);
    }
  }

  @MessagePattern('get_tickets_by_schedule_detail')
  async getTicketsByScheduleDetail(
    @Payload() scheduleDetailId: string,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    try {
      const tickets = await this.ticketsService.getTicketsByScheduleDetail(
        scheduleDetailId,
      );
      return { tickets };
    } catch (error) {
      this.logger.error(error.message);
      throw HttpStatus.SERVICE_UNAVAILABLE;
    } finally {
      channel.ack(originalMessage);
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketsService.update(+id, updateTicketDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketsService.remove(+id);
  }
}
