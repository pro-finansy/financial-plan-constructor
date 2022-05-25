import axios from 'axios';
import { dynamicsObject, valueof } from '@/interfaces';
import { COURSES_ENUM } from '@/utils/enums';
import { Questionnaire } from '@/interfaces/dto/questionnaire';
import { Instrument } from '@/interfaces/dto/instrument';
import store from '@/store';

function getCorrectCurrency(currency: string) {
  return store.getters.currencyList.find((c: dynamicsObject) => currency.includes(c._id)) || { name: '', _id: '' };
}

export async function getCurrentExchange(el: dynamicsObject, module: Questionnaire.QSectionModules, course: valueof<typeof COURSES_ENUM>, loading: boolean) {
  await axios.get('/api/exchange/' + (el.symbol || module.data.name))
    .then(res => {
      const response = res.data;
      if (response) {
        if (response.price.symbol) 
          module.data.name = response.price.symbol;
        if (response.price.regularMarketPrice)
          module.data.price = response.price.regularMarketPrice;
        if (response.price.currency) {
          const correctCurrency = getCorrectCurrency(response.price.currency)
          module.data[`currency_${course}`] = correctCurrency.name;
          module.data[`currency_${course}_id`] = correctCurrency._id;
        }
        if (response.price.matdate) {
          module.data.matdate = response.price.matdate;
        }
        const lot = course === COURSES_ENUM.TWO && response.price.lot ? response.price.lot : 1;
        module.data.lot = lot;
        module.data.comment = response.price.comment;
        if (response.instrument) {
          const vars = [`country_${course}`, `country_${course}_id`, `base_currency_${course}`, `base_currency_${course}_id`, `class_${course}`, `class_${course}_id`, `section_${course}`, `instrument_type_${course}`, 'title'];
          for (const v of vars) {
            module.data[v] = response.instrument[v];
          }
          if (module.data.type === 'mixed') {
            module.data[`instrument_type_${course}`] = 'Фонды смешанных активов';
          }
          module.data[`instrument_type_${course}_id`] = '1';
          module.data[`section_${course}_id`] = '1';
          if (course === COURSES_ENUM.TWO && (module.data[`instrument_type_${course}`] === 'Акции' || module.data[`instrument_type_${course}`] === 'Отраслевые ETF и БПИФ' || module.data[`instrument_type_${course}`] === 'ETF и БПИФ на акции широкого рынка (не отраслевые)' || module.data[`instrument_type_${course}`] === 'Альтернативные инвестиции')) {
            const section = module.inputs.find(i => i.id === `section_${course}`);
            if (section) {
              section.show = true;
              section.required = true;
            }
          } else if (course === COURSES_ENUM.TWO) {
            const section = module.inputs.find(i => i.id === `section_${course}`);
            if (section) {
              section.show = true;
              section.required = true;
            }
          }
          if (course === COURSES_ENUM.TWO && (module.data[`instrument_type_${course}`] === 'Облигации' || module.data[`instrument_type_${course}`] === 'ВДО' || module.data[`instrument_type_${course}`] === 'Надёжные облигации')) {
            const matdate = module.inputs.find(i => i.id === `matdate`);
            const section = module.inputs.find(i => i.id === `section_${course}`);
            if (matdate) matdate.show = true;
            if (section) {
              section.show = false;
              section.required = false;
            }
          }
        }
      }
    })
    .catch(() => {
      loading = false;
    })
}

export function getCorrectInstruments(input: Instrument.Input, data: string, instruments: Array<Instrument.Dto>, mixed: boolean) {
  const drop_data = instruments.length > 0 ? 
  instruments.filter(i => i.name.toLowerCase().trim().includes(data.toLowerCase().trim()) && i.name) : [];
  input.drop_data = drop_data;
  if (!data || mixed) return;
  axios.get(`/api/exchanges/${data}`)
    .then(res => {
      if (!res.data) return;
      input.drop_data = [...drop_data, ...res.data].filter(i => (i.symbol || i.name || i.isin) && (i.symbol?.toLowerCase()?.trim()?.includes(data.toLowerCase().trim()) || i.name?.toLowerCase()?.trim()?.includes(data.toLowerCase().trim()) || i.isin?.toLowerCase()?.trim()?.includes(data.toLowerCase().trim()) || i.title?.toLowerCase()?.trim()?.includes(data.toLowerCase().trim())));
      input.drop_data = input.drop_data.sort((a, b) => (a.symbol || a.name || a.isin).length - (b.symbol || b.name || b.isin).length);
    })
}