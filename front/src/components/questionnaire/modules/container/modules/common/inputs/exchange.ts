import axios from 'axios';
import { dynamicsObject, valueof } from '@/interfaces';
import { COURSES_ENUM } from '@/utils/enums';
import { getCorrectCurrency } from '../../security/index';
import { Instrument } from '@/interfaces/dto/instrument';

export function getCurrentExchange(self: any, el: dynamicsObject, course: valueof<COURSES_ENUM>) {
  axios.get('/api/exchange/' + (el.symbol || self.module.data.name))
    .then(({ data }) => {
      if (data) {
        if (data.price.symbol)
          self.module.data.name = data.price.symbol;
        if (data.price.regularMarketPrice)
          self.module.data.price = data.price.regularMarketPrice;
        if (data.price.currency) {
          const correctCurrency = getCorrectCurrency(data.price.currency)
          self.module.data[`currency_${course}`] = correctCurrency.name;
          self.module.data[`currency_${course}_id`] = correctCurrency._id;
        }
        const lot = (self.course === COURSES_ENUM.TWO && self.module.data.lot) ? self.module.data.lot : 1;
        if (self.module.data.number_papers && self.module.data.price)
          self.module.data.formula = Math.floor(self.module.data.number_papers * self.module.data.price * lot);
        self.module.data.lot = data.price.lot || 1;
      }
    });
}

export function getCorrectInstruments(self: any, input: Instrument.Input) {
  const instruments = self.instruments.length > 0 ?
    self.instruments.filter((i: dynamicsObject) => i.name.toLowerCase().trim().includes(self.module.data[input.id].toLowerCase().trim())) :
    [];
  input.drop_data = instruments;
  if (!self.module.data[input.id]) return;
  axios.get(`/api/exchanges/${self.module.data[input.id]}`)
    .then(res => {
      if (!res.data) return;
      input.drop_data = [...input.drop_data, ...res.data].filter(i => i.name && i.name.toLowerCase().trim().includes(self.module.data[input.id].toLowerCase().trim()));
      input.drop_data = input.drop_data.sort((a, b) => (a.symbol || a.name).length - (b.symbol || b.name).length);
    });
}