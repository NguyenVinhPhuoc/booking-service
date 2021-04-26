import { Injectable, Logger, Query } from '@nestjs/common';
import { DatabaseError, QueryTypes } from 'sequelize';
import { Sequelize } from 'sequelize';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Ticket } from './ticket.model';

@Injectable()
export class TicketsService {
  private readonly logger = new Logger('TicketService');
  constructor(private sequelize: Sequelize) {}

  async postTicket(createTicketDto: CreateTicketDto) {
    try {
      const ticket = await this.sequelize.query(
        `SP_CreateTicket @scheduleDetailId=:scheduleDetailId, @contactId=:contactId, @customerFullName=:customerFullName, @isSubContact=:isSubContact`,
        {
          replacements: {
            scheduleDetailId: createTicketDto.scheduleDetailId,
            contactId: createTicketDto.contactId,
            customerFullName: createTicketDto.customerFullName,
            isSubContact: createTicketDto.isSubContact,
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

  update(id: number, updateTicketDto: UpdateTicketDto) {
    return `This action updates a #${id} ticket`;
  }

  remove(id: number) {
    return `This action removes a #${id} ticket`;
  }
}
