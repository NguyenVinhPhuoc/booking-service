import { Injectable, Logger } from '@nestjs/common';
import { DatabaseError, QueryTypes } from 'sequelize';
import { Sequelize } from 'sequelize';
import { TicketContact } from 'src/models/get-ticket-contact.model';
import { Ticket } from '../models/ticket.model';
import { TicketDetail } from './ticketDetail.model';

@Injectable()
export class TicketsService {
  private readonly logger = new Logger('TicketService');
  constructor(private sequelize: Sequelize) {}

  async postTicket(
    scheduleDetailId: string,
    totalPrice: number,
    vehicleType: string,
    captureId: string,
    classId: string,
  ) {
    try {
      const ticket = await this.sequelize.query(
        `SP_CreateTicket @scheduleDetailId=:scheduleDetailId` +
          `, @totalPrice=:totalPrice, @vehicleType=:vehicleType, @captureId=:captureId, @classId=:classId`,
        {
          replacements: {
            scheduleDetailId: scheduleDetailId,
            totalPrice: totalPrice,
            vehicleType: vehicleType,
            captureId: captureId,
            classId: classId,
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
    } catch (error) {
      this.logger.error(error.message);
      throw new DatabaseError(error);
    }
  }

  async GetTicketsByEmail(email: string) {
    try {
      const tickets = await this.sequelize.query(
        'SP_GetTicketsByEmail @email=:email',
        {
          replacements: { email },
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

  async GetTicketsByScheduleDetailId(scheduleDetailId: string) {
    try {
      const ticketContacts = await this.sequelize.query(
        'SP_GetTicketsByScheduleDetailId @scheduleDetailId=:scheduleDetailId',
        {
          replacements: { scheduleDetailId },
          type: QueryTypes.SELECT,
          raw: true,
          mapToModel: true,
          model: TicketContact,
        },
      );
      return ticketContacts;
    } catch (error) {
      this.logger.error(error.message);
      throw new DatabaseError(error);
    }
  }
}
