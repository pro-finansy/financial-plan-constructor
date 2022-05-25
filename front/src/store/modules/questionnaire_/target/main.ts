import { dynamicsObject, valueof } from '@/interfaces';
import store from '@/store';
import { COURSES_ENUM } from '@/utils/enums';
import { targetTypes, currenciesTwo } from '../common/index';

const data = (course: valueof<COURSES_ENUM>) => ({
  name: '',
  type: 'Пассивный доход',
  type_id: '2',
  inflation: course === COURSES_ENUM.TWO ? '8' : '',
  currency: '',
  currency_id: '',
})

const inputs = (course: valueof<COURSES_ENUM>): dynamicsObject => ([
  { show: true, id: 'name', name: 'Цель по SMART', placeholder: 'Введите цель по SMART', type: 'textarea', drop: false, error: false, required: true },
  { show: true, id: 'type', name: 'Тип цели', placeholder: 'Выберите тип цели', type: 'drop', drop: true, showDrop: false, drop_data: targetTypes, error: false, required: true },
  { show: true, id: 'inflation', name: 'Процент инфляции (%)', placeholder: 'Введите процент инфляции для подсчета FV цели', type: 'number', maxlength: 3, drop: false, showDrop: false, drop_data: [], error: false, required: true },
  { show: true, id: 'profitability', name: 'Процент доходности (%)', placeholder: 'Введите процент доходности для подсчета FV профиля', type: 'number', maxlength: 3, drop: false, showDrop: false, drop_data: [], error: false, required: true },
  { show: true, id: 'currency', name: 'Валюта цели', placeholder: 'Выберите валюту цели', type: 'drop', drop: true, showDrop: false, drop_data: course === COURSES_ENUM.ONE ? store?.getters?.currencyList : currenciesTwo, error: false, required: true },
]);

export default (course: valueof<COURSES_ENUM>) => {
  return { data: data(course), inputs: inputs(course) }
}