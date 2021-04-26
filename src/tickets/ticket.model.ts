import { Model } from 'sequelize';

export class Ticket extends Model {
  id: string;
  scheduleDetailId: string;
  contactId: string;
  customerFullName: string;
  isSubContact: string;
  createdAt: string;
  updatedAt: string;
}
