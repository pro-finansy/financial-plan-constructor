import fs from 'fs';

export default function (path: string, callback: (a: null, html: string) => void) {
  fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
    if (err) {
      throw err;
    } else {
      callback(null, html);
    }
  });
};