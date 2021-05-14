import { Model } from 'sequelize';

export class Ticket extends Model {
  id: string;
  scheduleDetailId: string;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}
