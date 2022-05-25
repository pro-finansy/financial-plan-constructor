import { portfolioDistribution, expertPortfolioInstrument } from './common';
import { defaultExpertComment } from '../common/defaults';
import copyObject from '@/utils/copyObject';
import { COURSES_ENUM, ROLES_ENUM } from '@/utils/enums';
import { dynamicsObject, valueof } from '@/interfaces';

const portfolioSections = (course: valueof<COURSES_ENUM>, role: keyof typeof ROLES_ENUM, comments: dynamicsObject) => {
  const comment = comments?.expert ? comments?.expert : '';
  return [
    { show: true, name: 'Распределение на ядро и тактику', modules: [ copyObject(portfolioDistribution) ], adding: false, default: 'percents' },
    { show: true, name: 
      (course === COURSES_ENUM.ONE ? 'Состав ядра портфеля эксперта' : 'Состав ядра портфеля эксперта'),
      modules: [ copyObject(expertPortfolioInstrument(course, 'core', role)) ], adding: true, default: 'portfolio-instrument-expert'},
    { show: !!(role === ROLES_ENUM.EXPERT), name: 'Комментарий эксперта', modules: [ copyObject(defaultExpertComment(!!(role === ROLES_ENUM.EXPERT), comment)) ], adding: false, default: 'conclusion-comment' },
  ];
};

export default (course: valueof<COURSES_ENUM>, role: keyof typeof ROLES_ENUM, comments: dynamicsObject) => ({
  id: 'expertPortfolio',
  name: (course === COURSES_ENUM.ONE ? 'Портфель, предлагаемый экспертом для рассмотрения' : 'Портфель эксперта'),
  sections: portfolioSections(course, role, comments)
});