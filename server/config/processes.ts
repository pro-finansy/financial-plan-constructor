import schedule from 'node-schedule';
import { getCurrencies } from '../src/modules/convert/convert.controller';
import { getTickets } from "../src/modules/exchange/exchange.controller";

export = () => {
  const times = '30 * * * *'; // 30 минут
  schedule.scheduleJob(times, function() {
    getCurrencies();
  });
  getTickets();
};