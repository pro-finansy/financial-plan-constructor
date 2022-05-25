import { Commit } from 'vuex';
import { dynamicsObject } from '@/interfaces';
import common from '../../../api/modules/common';

interface State {
  currencies: dynamicsObject,
  currencyList: Array<dynamicsObject>
}

export default {
  state: {
    currencies: {},
    currencyList: []
  },
  getters: {
    currencies: (state: State) => state.currencies,
    currencyList: (state: State) => state.currencyList,
  },
  mutations: {
    set(state: State, convert: dynamicsObject) {
      state.currencies = convert;
    },
    setCurrency(state: State, currencyList: Array<dynamicsObject>) {
      currencyList = currencyList.map(c => ({ _id: c.code, name: c.name, sign: c.sign }));
      state.currencyList = currencyList;
    }
  },
  actions: {
    async getConvert({ commit }: { commit: Commit }) {
      const result = await common.getConvert();
      commit('set', result.data.list);
    },
    async getCurrencies({ commit }: { commit: Commit }) {
      const result = await common.getCurrencies();
      commit('setCurrency', result.data);
    }
  }
};
