import { Model } from 'sequelize';

export class Guest extends Model {
  id: string;
  scheduleDetailId: string;
  createdAt: string;
  updatedAt: string;
}
