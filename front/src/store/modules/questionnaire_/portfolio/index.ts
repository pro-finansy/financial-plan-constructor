import expert from './expert';
import student from './student';
import existing from './existing';
import copyObject from '@/utils/copyObject';
import { dynamicsObject, valueof } from '@/interfaces';
import { COURSES_ENUM, ROLES_ENUM } from '@/utils/enums';

function createPortfolios(course: valueof<COURSES_ENUM>, role: keyof typeof ROLES_ENUM, comments: dynamicsObject) {
  return {
    existing: copyObject(existing(course, role, comments)),
    student: copyObject(student(course, role, comments)),
    expert: copyObject(expert(course, role, comments))
  };
}

export { createPortfolios };