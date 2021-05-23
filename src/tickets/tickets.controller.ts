import { Controller, Logger, HttpStatus, Body, Post } from '@nestjs/common';
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

  @MessagePattern('create_ticket')
  async create(
    @Payload() createTicketDto: CreateTicketDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    const {
      guests,
      contact,
      scheduleDetailId,
      totalPrice,
      captureId,
      vehicleType,
    } = createTicketDto;
    try {
      const ticket = await this.ticketsService.postTicket(
        scheduleDetailId,
        totalPrice,
        vehicleType,
        captureId,
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
      return { ...ticket, guestsTemp, contactTemp };
    } catch (error) {
      this.logger.error(error.message);
      throw HttpStatus.SERVICE_UNAVAILABLE;
    } finally {
      channel.ack(originalMessage);
    }
  }
}
