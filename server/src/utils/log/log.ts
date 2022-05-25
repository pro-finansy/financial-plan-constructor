import fs from 'fs';
import dateFilter from '../date.filter';

export const log = (message: string) => {
  message = dateFilter(Date.now(), 'datetime') + ': ' + message;
  fs.appendFile(__dirname + '/log.txt', message + '\n', (err: Error) => {
    if (err) throw err;
  });
};