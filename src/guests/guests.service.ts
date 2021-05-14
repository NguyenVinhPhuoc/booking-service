import { Injectable, Logger, Query } from '@nestjs/common';
import { DatabaseError, QueryTypes } from 'sequelize';
import { Sequelize } from 'sequelize';
import { CreateGuestDto } from 'src/dtos/create-guest.dto';
import { Guest } from './guests.model';

@Injectable()
export class GuestsService {
  private readonly logger = new Logger('TicketService');
  constructor(private sequelize: Sequelize) {}
  async postGuest(createGuestDto: CreateGuestDto) {
    try {
      const guest = await this.sequelize.query(
        'SP_CreateGuest @title=:title, @fullName=:fullName',
        {
          replacements: {
            title: createGuestDto.title,
            fullName: createGuestDto.fullName,
          },
          type: QueryTypes.SELECT,
          mapToModel: true,
          model: Guest,
          raw: true,
        },
      );
      return guest[0];
    } catch (error) {
      this.logger.error(error.message);
      throw new DatabaseError(error);
    }
  }

  findAll() {
    return `This action returns all guests`;
  }

  findOne(id: number) {
    return `This action returns a #${id} guest`;
  }

  remove(id: number) {
    return `This action removes a #${id} guest`;
  }
}
