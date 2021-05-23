export class ExchangeTicketDto {
  oldTicketId: string;
  originalPrice: number;
  lostPercentage: number;
  refundAmount: number;
  extraCharge: number;
  newTicketId: string;
}
