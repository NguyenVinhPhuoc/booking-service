import { CreateContactDto } from './create-contact.dto';
import { CreateGuestDto } from './create-guest.dto';
export class CreateTicketDto {
  scheduleDetailId: string;
  totalPrice: number;
  contact: CreateContactDto;
  guests: CreateGuestDto[];
}
