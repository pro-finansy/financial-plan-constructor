import { valueof } from "@/interfaces";
import copyObject from "@/utils/copyObject";
import { COURSES_ENUM, ROLES_ENUM } from '@/utils/enums';
import { defaultAmount, targetInflation, conclusionPeriod, defaultExpertComment, realityReplenish, defaultBroker, defaultStudentComment } from '../common/defaults';
import { existingPortfolioInstrument, portfolioDistribution, expertPortfolioInstrument, studentPortfolioInstrument } from '../portfolio/common';
import { termField, riskPortfolioField } from '../target/type';

export default (id: string, course: valueof<COURSES_ENUM>, role: keyof typeof ROLES_ENUM = ROLES_ENUM.STUDENT, owner: keyof typeof ROLES_ENUM = ROLES_ENUM.STUDENT) => {
  const defaults = [
    {id: 'income-field', default: defaultAmount(course)},
    {id: 'term-field', default: termField},
    {id: 'student-field', default: defaultAmount(course)},
    {id: 'portfolio-field', default: riskPortfolioField},
    {id: 'resources-field', default: defaultAmount(course)},
    {id: 'targetInflation-field', default: targetInflation},
    {id: 'conclusion-period', default: conclusionPeriod},
    {id: 'conclusion-replenishment', default: defaultAmount(course)},
    {id: 'conclusion-replenishment-reality', default: realityReplenish(role)},
    {id: 'conclusion-student-comment', default: defaultStudentComment},
    {id: 'conclusion-broker', default: defaultBroker(owner)},
    
    {id: 'conclusion-comment', default: defaultExpertComment(!!(role === ROLES_ENUM.EXPERT))},
    {id: 'stock-comment', default: defaultExpertComment(false)},
    {id: 'bond-comment', default: defaultExpertComment(false)},
    {id: 'alternative-comment', default: defaultExpertComment(false)},
    {id: 'tactic-comment', default: defaultExpertComment(false)},

    {id: 'percents', default: portfolioDistribution},
    {id: 'portfolio-instrument-existing', default: existingPortfolioInstrument(course, 'core', role, owner)},
    {id: 'portfolio-instrument-existing-tactic', default: existingPortfolioInstrument(course, 'tactic', role, owner)},
    {id: 'portfolio-instrument-default', default: studentPortfolioInstrument(course, 'core', role, owner)},
    {id: 'portfolio-instrument-default-tactic', default: studentPortfolioInstrument(course, 'tactic', role, owner)},
    {id: 'portfolio-instrument-expert', default: expertPortfolioInstrument(course, 'core', role, owner)},
    {id: 'portfolio-instrument-expert-tactic', default: expertPortfolioInstrument(course, 'tactic', role, owner)},
  ];
  const result = defaults.find(def => def.id === id);
  if (!result) return {};
  return copyObject(result.default);
};