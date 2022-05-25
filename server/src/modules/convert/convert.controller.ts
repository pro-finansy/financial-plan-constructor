import axios, { Method } from 'axios';
import { Request, Response } from 'express';

import convertModel from "./convert.model";

import errorHandler from "../../utils/handler";
import { response } from "../../utils/response";
import { STATUSES } from "../../utils/enums";

export const getCurrencies = () => {
  const options = {
    method: 'GET' as Method,
    url: 'https://data.fixer.io/api/latest?base=USD&access_key=' + process.env.CURRENCY_KEY,
    params: {format: 'json'},
  };

  axios
    .request(options)
    .then(async (res) => {
      let convert = await convertModel.findOne();
      if (!convert) convert = new convertModel();
      convert.list = res.data.rates;
      await convert.save();
    }).catch(err => {
      console.error(err);
    });
};

export const get = async (_req: Request, res: Response) => {
  try {
    const convert = await convertModel.findOne({}).lean();
    response(res, STATUSES.OK, true, null, convert);
  } catch (err) {
    errorHandler(res, err);
  }
}

export default { get, getCurrencies };