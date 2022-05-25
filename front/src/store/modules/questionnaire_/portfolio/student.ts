import { dynamicsObject, valueof } from '@/interfaces';
import { portfolioDistribution, studentPortfolioInstrument } from './common';
import { defaultExpertComment, defaultStudentComment } from '../common/defaults';
import { COURSES_ENUM, ROLES_ENUM } from '@/utils/enums';
import copyObject from '@/utils/copyObject';

const portfolioSections = (course: valueof<COURSES_ENUM>, role: keyof typeof ROLES_ENUM, comments: dynamicsObject) => {
  const comment = course === COURSES_ENUM.ONE ? [
    { show: !!(role === ROLES_ENUM.EXPERT), name: 'Комментарий эксперта', modules: [ copyObject(defaultExpertComment(!!(role === ROLES_ENUM.EXPERT), comments?.student)) ], adding: false, default: 'conclusion-comment' },
  ] : [
    { show: !(role === ROLES_ENUM.STUDENT), name: 'Обзор рисковой части', modules: [ copyObject(defaultExpertComment(false, comments?.stock)) ], adding: false, default: 'stock-comment' },
    { show: !(role === ROLES_ENUM.STUDENT), name: 'Обзор консервативной части', modules: [ copyObject(defaultExpertComment(false, comments?.bond)) ], adding: false, default: 'bond-comment' },
    { show: !(role === ROLES_ENUM.STUDENT), name: 'Обзор защитной части', modules: [ copyObject(defaultExpertComment(false, comments?.alternative)) ], adding: false, default: 'alternative-comment' },
    { show: !(role === ROLES_ENUM.STUDENT), name: 'Обзор тактических идей', modules: [ copyObject(defaultExpertComment(false, comments?.tactic)) ], adding: false, default: 'tactic-comment' },
  ]
  return [
    { show: true, name: 'Распределение на ядро и тактику', modules: [ copyObject(portfolioDistribution) ], adding: false, default: 'percents' },
    { show: true, name: 
      (course === COURSES_ENUM.ONE ? 'Состав ядра портфеля на сумму с учётом инфляции' : 'Состав ядра портфеля на всю сумму цели'),
      modules: [ copyObject(studentPortfolioInstrument(course, 'core', role)) ], adding: true, default: 'portfolio-instrument-default'},
    { show: true, name: 
      (course === COURSES_ENUM.ONE ? 'Состав тактических идей портфеля на сумму с учётом инфляции' : 'Состав тактических идей итогового портфеля'),
      modules: [ copyObject(studentPortfolioInstrument(course, 'tactic', role)) ], optional: true, selected: false, adding: true, file: null, default: 'portfolio-instrument-default-tactic'},
      ...comment,
      { show: false, name: 'Комментарий для эксперта, причины выбора, % допустимого убытка', modules: [ copyObject(defaultStudentComment) ], adding: false, default: 'conclusion-student-comment' },
  ];
};

export default (course: valueof<COURSES_ENUM>, role: keyof typeof ROLES_ENUM, comments: dynamicsObject) => ({
  id: 'studentPortfolio',
  name: (course === COURSES_ENUM.ONE ? 'Портфель, составленный учеником' : 'Портфель на всю сумму цели'),
  description: 'Выберите наличие в портфеле этой цели наличие выбранных студентом инструментов',
  sections: portfolioSections(course, role, comments)
});