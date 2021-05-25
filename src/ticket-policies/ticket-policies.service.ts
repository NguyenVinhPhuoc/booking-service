import { Injectable, Logger } from '@nestjs/common';
import { DatabaseError, QueryTypes, Sequelize } from 'sequelize';
import { CancellationTickets } from 'src/models/cancellationTickets.model';
import { CancellationTicketDto } from '../dtos/create-cancel-ticket.dtos';

@Injectable()
export class TicketPoliciesService {
  private readonly logger = new Logger('TicketPolicesService');
  constructor(private sequelize: Sequelize) {}
  async createCancellationTicket(cancellationTicketDto: CancellationTicketDto) {
    try {
      const cancellationTicket = await this.sequelize.query(
        'SP_CreateCancellationTicket @oldTicketId=:oldTicketId,' +
          ' @lostPercentage=:lostPercentage',
        {
          replacements: { cancellationTicketDto },
          type: QueryTypes.SELECT,
          mapToModel: true,
          model: CancellationTickets,
          raw: true,
        },
      );
      return cancellationTicket[0];
    } catch (error) {
      this.logger.error(error.message);
      throw new DatabaseError(error);
    }
  }
}
