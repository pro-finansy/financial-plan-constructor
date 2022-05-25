import { dynamicsObject, valueof } from '@/interfaces';
import store from '@/store';
import { COURSES_ENUM, ROLES_ENUM } from '@/utils/enums';
import { currenciesTwo, periods } from './index';

const defaultAmount = (course: valueof<COURSES_ENUM>): dynamicsObject => ({
  data: {
    amount: '',
    currency: '',
    currency_id: '',
    currency_sign: '',
  },
  inputs: [
    { show: true, id: 'amount', name: 'Сумма', placeholder: 'Введите сумму', type: 'text', mask: '##########', drop: false, error: false, required: true },
    { show: !!(course === COURSES_ENUM.ONE), id: 'currency', name: 'Валюта', placeholder: 'Выберите валюту', type: 'drop', drop: true, showDrop: false, drop_data: course === COURSES_ENUM.ONE ? store?.getters?.currencyList : currenciesTwo, error: false, required: true },
  ]
});

const targetInflation = {
  data: {
    fv: ''
  },
  inputs: [
    { show: true, id: 'fv', name: 'Цель с учётом инфляции (высчитывается автоматически)', placeholder: 'Введите цель с учетом инфляции', type: 'text', drop: false, error: false, required: false },
  ]
}

const realityReplenish = (role: keyof typeof ROLES_ENUM) => ({
  data: {
    amount: ''
  },
  inputs: [
    { show: true, id: 'amount', name: 'Сумма', placeholder: role === ROLES_ENUM.STUDENT ? 'Необходимо рассчитать самостоятельно' : 'Высчитывается автоматически', type: 'number', disabled: true, drop: false, error: false, required: role === ROLES_ENUM.STUDENT }
  ]
})

const defaultExpertComment = (required = false, comment = '') => {
  return {
    data: {
      comment,
    },
    inputs: [
      { show: true, id: 'comment', name: 'Комментарий эксперта', placeholder: 'Введите комментарий эксперта', type: 'textarea', drop: false, error: false, required: required },
    ]
  }
}

const defaultStudentComment = {
  data: {
    student_comment: '',
  },
  inputs: [
    { show: true, id: 'student_comment', name: 'Комментарий для эксперта', placeholder: 'Введите комментарий для эксперта', type: 'textarea', drop: false, error: false, required: false },
  ]
}

const defaultBroker = (owner: keyof typeof ROLES_ENUM) => ({
  data: {
    broker: '',
  },
  inputs: [
    { show: true, id: 'broker', name: 'Брокер', placeholder: 'Введите Вашего брокера', type: 'text', drop: false, error: false, required: owner === ROLES_ENUM.STUDENT },
  ]
})

const conclusionPeriod = {
  data: {
    period: '',
    period_id: '',
  },
  inputs: [
    { show: true, id: 'period', name: 'Периодичность', placeholder: 'Выберите периодичность', type: 'drop', drop: true, showDrop: false, drop_data: periods, error: false, required: true },
  ]
};

export { defaultAmount, defaultStudentComment, defaultExpertComment, targetInflation, conclusionPeriod, realityReplenish, defaultBroker, currenciesTwo };