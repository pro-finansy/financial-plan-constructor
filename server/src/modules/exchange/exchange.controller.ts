import axios from "axios";
import { ObjectId } from "mongoose";
import { Request, Response } from "express";
import { Investment } from "../investment/dto/investment.dto";

import investmentModel from '../investment/investment.model';
import errorHandler from "../../utils/handler";
import { response } from "../../utils/response";
import { STATUSES } from "../../utils/enums";
import { dynamicsObject } from "@/interfaces";

const MoexAPI = require('moex-api');
const yahooFinance = require("yahoo-finance");
const moexApi = new MoexAPI();

let tik_list: any[] = [];

moexApi.securitiesDataRaw("stock", "shares").then((res: any) => {
  const result = res.securities.data.map((a: any[]) => ({
    symbol: a[0],
    name: a[0],
    title: a[2],
    price: a[3],
    isin: a[19],
    currency: a[24],
    exchange_acronym: "MOEX",
  }));
  tik_list.push(...result);
});

moexApi.securitiesDataRaw("stock", "bonds").then(async (res: any) => {
  const result = res.securities.data.map((a: any[]) => ({
    symbol: a[0],
    name: a[0],
    isin: a[29],
    title: a[2],
    sectype: a[35],
    currency: a[32],
    exchange_acronym: "MOEX",
    lot: a[9],
    matdate: a[13],
    lastprice: a[3],
    facevalue: a[10],
    price: a[10] > 0 ? Number(((a[10] / 100) * a[3]).toFixed(2)) : a[3]
  }));
  tik_list.push(...result);
  const instruments = await investmentModel.find().select('name title').lean();
  for (const instrument of instruments) {
    const c = tik_list.find((r: any) => r.name.trim().toLowerCase() === instrument.name.trim().toLowerCase());
    if (c && instrument.title) c.title = instrument.title;
    if (!c) tik_list.push({ symbol: instrument.name, name: instrument.name, isin: instrument.name, title: instrument.title, lot: instrument.lot, currency: instrument.currency_two_id, lastprice: instrument.price, price: instrument.price });
  }
  console.log('done MOEX');
});

function getTicketsList(exchange: string, complete: (a: any) => void) {
  const url_one = `http://api.marketstack.com/v1/tickers?access_key=${process.env.EXCHANGE_TOKEN}&limit=10000&exchange=${exchange}`;

  axios({
    method: "GET",
    url: url_one,
  })
    .then((new_resp) => {
      complete(
        new_resp.data.data.map((item: any) => {
          return {
            symbol: item.symbol,
            name: item.name === null ? "_" : item.name,
            exchange_mic: item.stock_exchange.mic,
            exchange_acronym: item.stock_exchange.acronym,
            country: item.stock_exchange.country,
          };
        })
      );
    })
    .catch((error) => {
      console.log(`error in get ticket list: ${error}`);
    });
}

async function getInfoBySymbol(symbol: string, userId: ObjectId, complete: (a: dynamicsObject) => void, error: () => void) {
  const current_symbol = tik_list.find(i => (i.name && i.name.trim().toLowerCase() === symbol.trim().toLowerCase()) || (i.symbol && i.symbol.trim().toLowerCase() === symbol.trim().toLowerCase()) || (i.isin && i.isin.trim().toLowerCase() === symbol.trim().toLowerCase()));
  if (current_symbol && current_symbol.symbol) {
    symbol = current_symbol.symbol;
  }
  
  const instrument = await investmentModel.findOne({ $or: [{ title: symbol }, { name: symbol }] }).lean();
  let comment = { comment: '' };
  if (instrument) comment = instrument.comments.find((c: any) => String(c._id) === String(userId));
  if (symbol.includes("MISX")) {
    moexApi.securityMarketData(symbol.split(".")[0]).then((security: any) => {
      const price =
        (Number(security.securityInfo.SECTYPE) === 1 ||
          Number(security.securityInfo.SECTYPE) === 2)
          ? security.node.last
          : ((security.securityInfo.FACEVALUE / 100) * security.node.last).toFixed(2);

      const result = {
        price: {
          symbol: symbol.split(".")[0],
          regularMarketPrice: price,
          currency:
            security.securityInfo.CURRENCYID === "SUR"
              ? "RUB"
              : security.securityInfo.CURRENCYID,
          lot: security.securityInfo.LOTSIZE,
          comment: comment ? comment.comment : ''
        },
        instrument,
      };
      complete(result);
    });
  } else {
    const security = await moexApi.securityMarketData(symbol).catch(() => {});
    if (security) {
      const price =
        (Number(security.securityInfo.SECTYPE) === 1 ||
        Number(security.securityInfo.SECTYPE) === 2)
          ? security.node.last
          : security.securityInfo.FACEVALUE > 0 ? (((security.securityInfo.FACEVALUE / 100) * security.node.last).toFixed(2)) : security.node.last;
      const res = {
        price: {
          symbol: symbol,
          regularMarketPrice: price,
          currency:
            security.securityInfo.CURRENCYID === "SUR"
              ? "RUB"
              : security.securityInfo.CURRENCYID,
          lot: security.securityInfo.LOTSIZE,
          matdate: security.securityInfo.MATDATE,
          comment: comment ? comment.comment : ''
        },
        instrument,
      };
      return complete(res);
    } else if (current_symbol) {
      const bond = current_symbol;
      const res = {
        price: {
          symbol: symbol,
          regularMarketPrice: bond.price,
          currency:
          bond.currency === "SUR"
              ? "RUB"
              : bond.currency,
          lot: bond.lot,
          matdate: bond.matdate,
          comment: comment ? comment.comment : ''
        },
        instrument,
      };
      return complete(res);
    } else if (instrument) {
      const res = {
        price: {
          comment: comment ? comment.comment : ''
        },
        instrument
      }
      return complete(res);
    } else {
      yahooFinance
      .quote(
        {
          symbol,
          modules: ["price", "summaryDetail"],
        },
        (err: any, quotes: any) => {
          if (err) return;
          complete(quotes);
        }
      )
      .catch(() => {
        return error();
      });
    }
    
  }
}

const getTickets = function() {
  ['XNAS', 'IEXG', 'XNYS', 'XASE'].forEach((item) => {
    getTicketsList(item, (data) => {
      tik_list.push(...data);
      console.log(tik_list.length);
    });
  });
}

export const fixTitleInstrument = function(instrument: Investment.Dto) {
  const c = tik_list.find((r: any) => r.name.trim().toLowerCase() === instrument.name.trim().toLowerCase());
  if (c && instrument.title) c.title = instrument.title;
}

export const getInstrumentPrice = function(name: string) {
  const instrument = tik_list.find(i => name.trim().toLowerCase() === i.name.trim().toLowerCase() || (i.isin && name.trim().toLowerCase() === i.isin.trim().toLowerCase()));
  if (instrument) return instrument;
  return false;
}

export const fillMatDate = function (questionnaire: any) {
  questionnaire.content_EXPERT.targets.data.forEach((t: any) => {
    for (const portfolioID in t.portfolios) {
      const portfolio = t.portfolios[portfolioID];
      portfolio.sections[1].modules.forEach((m: any) => {
        const instrument = tik_list.find(i => i.matdate && (m.data.name.trim().toLowerCase() === i.name.trim().toLowerCase() || (i.isin && m.data.name.trim().toLowerCase() === i.isin.trim().toLowerCase())));
        if (instrument && !m.data.matdate) {
          m.data.matdate = instrument.matdate;
        }
      });
    }
  });
};

function onUnique(result: any[]) {
  let array: any[] = [];
  for (const element of result) {
    if (!array.find(e => (element.name && (e.name || '').trim().toLowerCase() === (element.name || '').trim().toLowerCase()) || (element.title && (e.title || '').trim().toLowerCase() === (element.title || '').trim().toLowerCase()) || (element.isin && (e.isin || '').trim().toLowerCase() === (element.isin || '').trim().toLowerCase()))) {
      array = [...array, element];
    }
  }
  return array;
}

export const findByPathName = (input: string | undefined) => {
  let _in_symbolist = (a: string | undefined, b: string | undefined) => {
    if (!b || !a) return false;
    return b.toLowerCase().trim().includes(a.toLowerCase().trim());
  };
  const result = tik_list.filter((item) => {
    return _in_symbolist(input, item.name) || _in_symbolist(input, item.title) || _in_symbolist(input, item.symbol) || _in_symbolist(input, item.isin);
  });
  const unique = onUnique(result);
  return unique;
};

export const gets = async function (req: Request, res: Response) {
  try {
    const result = findByPathName(req.params.search);
    const data = result.filter((r: any, index: number) => index < 10);
    response(res, STATUSES.OK, true, null, data);
  } catch (err) {
    errorHandler(res, err);
  }
};

export const get = async function (req: Request, res: Response) {
  try {
    getInfoBySymbol(req.params.search, res.locals.user._id, (data: any) => {
      response(res, STATUSES.OK, true, null, data);
    }, () => {
      response(res, STATUSES.NOT_FOUND, false, 'Инструмент не найден!');
    });
  } catch (err) {
    console.log(err);
    errorHandler(res, err);
  }
};

export default { get, gets, getInstrumentPrice, fillMatDate, getTickets };
export { getTickets };