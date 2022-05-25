import { portfolioDistribution, existingPortfolioInstrument } from './common';
import { defaultExpertComment, defaultStudentComment } from '../common/defaults';
import copyObject from '@/utils/copyObject';
import { COURSES_ENUM, ROLES_ENUM } from '@/utils/enums';
import { dynamicsObject, valueof } from '@/interfaces';

const portfolioSections = (course: valueof<COURSES_ENUM>, role: keyof typeof ROLES_ENUM, comments: dynamicsObject) => {
  const comment = comments?.existing ? comments?.existing : '';
  return [
    { show: true, name: 'Распределение на ядро и тактику', modules: [ copyObject(portfolioDistribution) ], adding: false, default: 'percents' },
    { show: true, name: 
      (course === COURSES_ENUM.ONE ? 'Состав ядра имеющегося портфеля' : 'Состав ядра портфеля на стартовый капитал'),
      modules: [ copyObject(existingPortfolioInstrument(course, 'core', role)) ], adding: true, default: 'portfolio-instrument-existing'},
    { show: true, name: 'Состав тактической идеи имеющего портфеля', modules: [ copyObject(existingPortfolioInstrument(course, 'tactic', role)) ], optional: true, selected: false, adding: true, file: null, default: 'portfolio-instrument-existing-tactic'},
    { show: !!(role === ROLES_ENUM.EXPERT), name: 'Комментарий эксперта', modules: [ copyObject(defaultExpertComment(!!(role === ROLES_ENUM.EXPERT), comment)) ], adding: false, default: 'conclusion-comment' },
    { show: false, name: 'Комментарий для эксперта, причины выбора, % допустимого убытка', modules: [ copyObject(defaultStudentComment) ], adding: false, default: 'conclusion-student-comment' },
  ];
};

export default (course: valueof<COURSES_ENUM>, role: keyof typeof ROLES_ENUM, comments: dynamicsObject) => ({
  id: 'existingPortfolio',
  name: (course === COURSES_ENUM.ONE ? 'Существующий портфель' : 'Портфель на стартовый капитал'),
  description: 'Выберите наличие в портфеле этой цели наличие купленных инструментов',
  sections: portfolioSections(course, role, comments)
});