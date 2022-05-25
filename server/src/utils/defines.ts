import { default as isEmail } from 'validator/lib/isEmail';
import { dynamicsObject } from '../interfaces';

export const defineSearchEmail = function (query: dynamicsObject, search: string) {
  const latin = search.trim().match("^[a-zA-Z0-9_.-]+$");
  const email = isEmail(search.trim());
  if (latin || email) {
    query.studentEmail = { $regex: search.trim().toLowerCase(), $options: "i" };
  }
}

export const defineSearchDates = function (reqQuery: dynamicsObject, query: dynamicsObject, dates: Array<any>) {
  for (const date of dates) {
    if (reqQuery[date] && reqQuery[date].length === 2) {
      query[date] = {
        $gte: new Date(reqQuery[date][0]),
        $lte: new Date(new Date(reqQuery[date][1]).setDate(new Date(reqQuery[date][1]).getDate() + 1))
      }
    }
  }
}

export const definePagination = function(filters: dynamicsObject, query: dynamicsObject) {
  if (query.limit) filters.limit = Number(query.limit);
  if (query.page) filters.skip = Number(query.limit) * (Number(query.page) - 1);
}