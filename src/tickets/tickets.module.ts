import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { GuestsService } from 'src/guests/guests.service';
import { ContactsService } from 'src/contacts/contacts.service';

@Module({
  controllers: [TicketsController],
  providers: [TicketsService, GuestsService, ContactsService],
})
export class TicketsModule {}
