import { valueof } from '@/interfaces';
import store from '@/store';
import { COURSES_ENUM, ROLES_ENUM } from '@/utils/enums';
import { countries, studentTypes, currenciesTwo } from '../common/index';

const inputsTwo = (course: valueof<COURSES_ENUM>, role: keyof typeof ROLES_ENUM, owner: keyof typeof ROLES_ENUM, view: keyof typeof ROLES_ENUM) => ([
  { show: true, id: 'name', name: 'ФИО', placeholder: 'Введите ФИО', type: 'text', drop: false, error: false, required: true },
  { show: role !== ROLES_ENUM.STUDENT, id: 'email', name: 'Почта', placeholder: 'Введите почту', type: 'email', drop: false, error: false, required: role !== ROLES_ENUM.STUDENT },
  { show: true, id: 'phone', name: 'Телефон', placeholder: 'Введите номер телефона', mask: '+###############', type: 'phone', drop: false, error: false, required: true },
  { show: true, id: 'role', name: 'Госслужащий или нет', placeholder: 'Госслужащий или нет', type: 'drop', drop: true, showDrop: false, drop_data: studentTypes, error: false, required: true },
  { show: true, id: 'country', name: 'Страна', placeholder: 'Выберите страну', type: 'drop', drop: true, showDrop: false, drop_data: countries, error: false, required: true },
  { show: true, id: 'currency', name: 'Валюта дохода', placeholder: 'Выберите валюту', type: 'drop', drop: true, showDrop: false, drop_data: course === COURSES_ENUM.ONE ? store?.getters?.currencyList : currenciesTwo, error: false, required: true },
  { show: owner === ROLES_ENUM.STUDENT, id: 'comment', name: 'Общий комментарий для эксперта', placeholder: 'Здесь вы можете, если это необходимо, указать дополнительную информацию. Например: расписать страничный финансовый план', type: 'textarea', drop: false, error: false, required: (view === ROLES_ENUM.STUDENT) },
]);

const inputsOne = (course: valueof<COURSES_ENUM>, role: keyof typeof ROLES_ENUM, owner: keyof typeof ROLES_ENUM, view: keyof typeof ROLES_ENUM) => ([
  ...inputsTwo(course, role, owner, view),
]);

const dataTwo = {
  name: '',
  email: '',
  phone: '',
  role: '',
  country: '',
  country_id: '',
  currency: 'Рубль',
  currency_id: 'RUB',
  comment: ''
}

const dataOne = {
  ...dataTwo,
  currency: '',
  currency_id: '',
}

const studentCourseOne = (course: valueof<COURSES_ENUM>, role: keyof typeof ROLES_ENUM, owner: keyof typeof ROLES_ENUM, view: keyof typeof ROLES_ENUM) => ({
  id: 'student',
  name: role === ROLES_ENUM.STUDENT ? 'Мои данные' : 'Данные ученика',
  module: {
    data: dataOne,
    inputs: inputsOne(course, role, owner, view)
  }
})

const studentCourseTwo = (course: valueof<COURSES_ENUM>, role: keyof typeof ROLES_ENUM, owner: keyof typeof ROLES_ENUM, view: keyof typeof ROLES_ENUM) => ({
  id: 'student',
  name: role === ROLES_ENUM.STUDENT ? 'Мои данные' : 'Данные ученика',
  module: {
    data: dataTwo,
    inputs: inputsTwo(course, role, owner, view)
  }
})

export default (course: valueof<COURSES_ENUM>, role: keyof typeof ROLES_ENUM, owner: keyof typeof ROLES_ENUM, view: keyof typeof ROLES_ENUM) => {
  if (course === COURSES_ENUM.ONE) return studentCourseOne(course, role, owner, view);
  if (course === COURSES_ENUM.TWO) return studentCourseTwo(course, role, owner, view);
};