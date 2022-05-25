import { defaultAmount, targetInflation } from '../common/defaults';
import { portfolios, duration } from '../common/index';
import copyObject from '@/utils/copyObject';
import { COURSES_ENUM, ROLES_ENUM } from '@/utils/enums';
import { valueof } from '@/interfaces';

const termField = {
  data: {
    term: '',
    duration: '',
    duration_id: '',
  },
  inputs: [
    { show: true, id: 'term', name: 'Срок', placeholder: 'Введите срок', type: 'text', drop: false, mask: '###', error: false, required: true },
    { show: true, id: 'duration', name: 'Месяцев/лет', placeholder: 'Выберите месяцев/лет', type: 'drop', drop: true, showDrop: false, drop_data: duration, error: false, required: true },
  ]
};
const riskPortfolioField = {
  data: {
    portfolio: '',
    portfolio_id: '',
  },
  inputs: [
    { show: true, id: 'portfolio', name: 'Риск-профиль', placeholder: 'Выберите риск-профиль', type: 'drop', drop: true, showDrop: false, drop_data: portfolios, error: false, required: true },
  ]
};

const firstType = {
  id: 1,
  name: 'Накопление суммы к сроку',
  section_name: 'Сумма цели'
};

const secondType = {
  id: 2,
  name: 'Пассивный доход',
  section_name: 'Желаемый пассивный доход в месяц (по текущим ценам)'
}

const names = {
  student: {
    STUDENT: 'Цель с учетом инфляции',
    EXPERT: 'Цель с учетом инфляции, просчитанная учеником',
    OWNER: 'Цель с учетом инфляции, просчитанная учеником',
    SUPPORT: '',
  },
  resourses: {
    STUDENT: 'Стартовый капитал (сумма свободных денег для инвестирования + сумма уже купленных для этого портфеля активов)',
    EXPERT: 'Имеющиеся ресурсы',
    OWNER: 'Имеющиеся ресурсы',
    SUPPORT: '',
  }
}

const defaultType = (course: valueof<COURSES_ENUM>, role: keyof typeof ROLES_ENUM) => {
  return {
    id: 2,
    name: 'Пассивный доход',
    sections: [
      { show: true, name: 'Желаемый пассивный доход в месяц (по текущим ценам)', modules: [ copyObject(defaultAmount(course)) ], adding: false, default: 'income-field' },
      { show: true, name: 'Срок достижения цели', modules: [ copyObject(termField) ], adding: false, default: 'term-field' },
      { show: true, name: names.student[role], modules: [ copyObject(defaultAmount(course)) ], adding: false, default: 'student-field' },
      { show: !!(role === ROLES_ENUM.EXPERT), name: 'Цель с учетом инфляции по формулам FV', modules: [ copyObject(targetInflation) ], adding: false, default: 'targetInflation-field' },
      { show: true, name: names.resourses[role], modules: [ copyObject(defaultAmount(course)) ], adding: !!(course === COURSES_ENUM.ONE), default: 'resources-field' },
      { show: true, name: 'Риск-профиль цели', modules: [ copyObject(riskPortfolioField) ], adding: false, default: 'portfolio-field' },
    ],
  }
};

export { defaultType, firstType, secondType, termField, riskPortfolioField };