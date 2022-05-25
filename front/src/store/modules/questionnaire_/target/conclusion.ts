import { defaultAmount, defaultExpertComment, realityReplenish, defaultBroker, defaultStudentComment } from '../common/defaults';
import { periods } from '../common/index';
import copyObject from '@/utils/copyObject';
import { COURSES_ENUM, ROLES_ENUM } from '@/utils/enums';
import { dynamicsObject, valueof } from '@/interfaces';

const conclusionPeriod = {
  data: {
    period: '',
    period_id: '',
  },
  inputs: [
    { show: true, id: 'period', name: 'Периодичность', placeholder: 'Выберите периодичность', type: 'drop', drop: true, showDrop: false, drop_data: periods, error: false, required: true },
  ]
};

export default (course: valueof<COURSES_ENUM>, role: keyof typeof ROLES_ENUM, owner: keyof typeof ROLES_ENUM, view: keyof typeof ROLES_ENUM, comments: dynamicsObject) => {
  const comment = comments?.target ? comments?.target : '';
  return {
    name: 'Вывод по цели',
    sections: [
      { show: true, name: 'Периодичность пополнения портфеля', modules: [ copyObject(conclusionPeriod) ], adding: false, chart: true, default: 'conclusion-period' },
      { show: true, name: role === ROLES_ENUM.STUDENT ? 'На какую сумму можете пополнять' : 'На какую сумму ученик может пополнять', modules: [ defaultAmount(course) ], adding: !!(course === COURSES_ENUM.ONE), default: 'conclusion-replenishment' },
      { show: true, name: 'Сколько реально нужно пополнять', modules: [ copyObject(realityReplenish(role)) ], adding: false, default: 'conclusion-replenishment-reality' },
      { show: !!(role === ROLES_ENUM.EXPERT), name: 'Комментарий эксперта по формированию цели', modules: [ copyObject(defaultExpertComment(!!(role === ROLES_ENUM.EXPERT), comment)) ], adding: false, default: 'conclusion-comment' },
      { show: !!(role === ROLES_ENUM.STUDENT), name: 'Брокер', modules: [ copyObject(defaultBroker(owner)) ], adding: false, default: 'conclusion-broker' },
      { show: !!(role === ROLES_ENUM.STUDENT), name: 'Дополнительный комментарий для эксперта по цели', modules: [ copyObject(defaultStudentComment) ], adding: false, default: 'conclusion-student-comment' },
    ]
  }
}