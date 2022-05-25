import { dynamicsObject } from '@/interfaces';
import store from '@/store';

function getCorrectCurrency(currency: string) {
  return store.getters.currencyList.find((c: dynamicsObject) => currency.includes(c._id)) || { name: '', _id: '' };
}

export { getCorrectCurrency };
