import {
  Controller,
  Logger,
  HttpStatus,
  Body,
  Post,
  Query,
  Get,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { CreateTicketDto } from 'src/dtos/create-ticket.dto';
import { GuestsService } from 'src/guests/guests.service';
import { ContactsService } from 'src/contacts/contacts.service';
import { vehicleType } from 'src/enums/vehicleType.enum';

@Controller('tickets')
export class TicketsController {
  private readonly logger = new Logger('TicketController');
  constructor(
    private readonly ticketsService: TicketsService,
    private readonly guestsService: GuestsService,
    private readonly contactsService: ContactsService,
  ) {}

  // @MessagePattern('create_ticket')
  @Post()
  async createTicket(
    // @Payload() createTicketDto: CreateTicketDto,
    // @Ctx() context: RmqContext,
    @Body() createTicketDto: CreateTicketDto,
  ) {
    // const channel = context.getChannelRef();
    // const originalMessage = context.getMessage();
    const {
      guests,
      contact,
      scheduleDetailId,
      totalPrice,
      captureId,
      vehicleType,
      classId,
    } = createTicketDto;
    try {
      const ticket = await this.ticketsService.postTicket(
        scheduleDetailId,
        totalPrice,
        vehicleType,
        captureId,
        classId,
      );
      const contactTemp = await this.contactsService.postContact(contact);
      const guestsTemp = await Promise.all(
        guests.map(async (guest) => {
          const guestTemp = await this.guestsService.postGuest(guest);
          await this.ticketsService.postTicketsDetail(
            ticket.id,
            contactTemp.id,
            guestTemp.id,
          );
          return guestTemp;
        }),
      );
      return {
        ...ticket,
        guestsTemp,
        contactTemp,
        numberOfTicket: guests.length,
      };
    } catch (error) {
      this.logger.error(error.message);
      throw HttpStatus.SERVICE_UNAVAILABLE;
    } finally {
      // channel.ack(originalMessage);
    }
  }

  // @MessagePattern('get_tickets_by_email')
  @Get()
  async getTicketByEmail(
    //   @Payload() email: string,
    //  @Ctx() context: RmqContext
    @Query('email') email: string,
  ) {
    // const channel = context.getChannelRef();
    // const originalMessage = context.getMessage();
    try {
      const tickets = await this.ticketsService.GetTicketsByEmail(email);
      return tickets;
    } catch (error) {
      this.logger.error(error.message);
      throw HttpStatus.SERVICE_UNAVAILABLE;
    } finally {
      // channel.ack(originalMessage);
    }
  }

  @MessagePattern('get_ticket_by_scheduleDetailId')
  async getTicketsByScheduleDetailId(
    @Payload() scheduleDetailId: string,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    try {
      const tickets = await this.ticketsService.GetTicketsByScheduleDetailId(
        scheduleDetailId,
      );
      return tickets;
    } catch (error) {
      this.logger.error(error.message);
      throw HttpStatus.SERVICE_UNAVAILABLE;
    } finally {
      channel.ack(originalMessage);
    }
  }
}
