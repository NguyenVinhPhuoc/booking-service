import { Injectable, Logger, Query } from '@nestjs/common';
import { DatabaseError, QueryTypes } from 'sequelize';
import { Sequelize } from 'sequelize';
import { Ticket } from './ticket.model';
import { TicketDetail } from './ticketDetail.model';

@Injectable()
export class TicketsService {
  private readonly logger = new Logger('TicketService');
  constructor(private sequelize: Sequelize) {}

  async postTicket(scheduleDetailId: string, totalPrice: number) {
    try {
      const ticket = await this.sequelize.query(
        `SP_CreateTicket @scheduleDetailId=:scheduleDetailId` +
          `, @totalPrice=:totalPrice`,
        {
          replacements: {
            scheduleDetailId: scheduleDetailId,
            totalPrice: totalPrice,
          },
          type: QueryTypes.SELECT,
          mapToModel: true,
          model: Ticket,
          raw: true,
        },
      );
      return ticket[0];
    } catch (error) {
      this.logger.error(error.message);
      throw new DatabaseError(error);
    }
  }

  async getTicketsByScheduleDetail(scheduleDetailId: string) {
    try {
      const tickets = await this.sequelize.query(
        `SP_GetTicketsByScheduleDetail @scheduleDetailId=:scheduleDetailId`,
        {
          replacements: { scheduleDetailId },
          type: QueryTypes.SELECT,
          raw: true,
          mapToModel: true,
          model: Ticket,
        },
      );
      return tickets;
    } catch (error) {
      this.logger.error(error.message);
      throw new DatabaseError(error);
    }
  }

  async getTicketsByContact(contactId: string) {
    try {
      const tickets = await this.sequelize.query(
        `SP_GetTicketsByContact @contactId=:contactId`,
        {
          replacements: { contactId },
          type: QueryTypes.SELECT,
          raw: true,
          mapToModel: true,
          model: Ticket,
        },
      );
      return tickets;
    } catch (error) {
      this.logger.error(error.message);
      throw new DatabaseError(error);
    }
  }

  async postTicketsDetail(
    ticketId: string,
    contactId: string,
    guestId: string,
  ) {
    try {
      await this.sequelize.query(
        `SP_CreateTicketDetail @ticketId=:ticketId, @contactId=:contactId, @guestId=:guestId`,
        {
          replacements: {
            ticketId: ticketId,
            contactId: contactId,
            guestId: guestId,
          },
          type: QueryTypes.SELECT,
          raw: true,
          mapToModel: true,
          model: TicketDetail,
        },
      );
    } catch (error) {}
  }
}
