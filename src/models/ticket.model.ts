import { Model } from 'sequelize';
import { vehicleType } from 'src/enums/vehicleType.enum';

export class Ticket extends Model {
  id: string;
  scheduleDetailId: string;
  totalPrice: number;
  captureId: string;
  vehicleType: vehicleType;
  classId: string;
  title: string;
  fullName: string;
  partnerId: string;
  createdAt: string;
  updatedAt: string;
}
