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
} from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Controller('contacts')
export class ContactsController {
  private readonly logger = new Logger('ContactController');
  constructor(private readonly contactsService: ContactsService) {}

  @MessagePattern('create_contact')
  async postContact(
    @Payload() createContactDto: CreateContactDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    try {
      const contact = await this.contactsService.postContact(createContactDto);
      return { contact };
    } catch (error) {
      this.logger.error(error.message);
      throw HttpStatus.SERVICE_UNAVAILABLE;
    } finally {
      channel.ack(originalMessage);
    }
  }

  @MessagePattern('get_contacts')
  async getContacts(@Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    try {
      const contact = await this.contactsService.getContacts();
      return { contact };
    } catch (error) {
      this.logger.error(error.message);
      throw HttpStatus.SERVICE_UNAVAILABLE;
    } finally {
      channel.ack(originalMessage);
    }
  }

  @MessagePattern('get_contact_by_id')
  async getContact(@Payload() contactId: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    try {
      const contact = await this.contactsService.getContact(contactId);
      return { contact };
    } catch (error) {
      this.logger.error(error.message);
      throw HttpStatus.SERVICE_UNAVAILABLE;
    } finally {
      channel.ack(originalMessage);
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto) {
    return this.contactsService.update(+id, updateContactDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactsService.remove(+id);
  }
}
