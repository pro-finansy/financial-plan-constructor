import store from '@/store';
import { ACCESSES } from '@/store/commonDatas';
import { countries, typesInsurance, instrumentCountries, instrumentTypes, classes, sectionStock, sectionBond, sectionAlternative, sectionTwo, sectionTwoAlternative } from '@/store/modules/questionnaire_/common/index';
import { COURSES_ENUM, ROLES_ENUM } from '@/utils/enums';
import { dynamicsObject, valueof } from '@/interfaces';

export default ({ id, data }: any) => {
  const isMultyCurrency = store.getters.course === COURSES_ENUM.TWO ? [...store.getters.currencyList, { _id: 'MUL', name: 'Мульти', sign: 'M' }] : store.getters.currencyList;
  const instruments = (data.type === 'mixed') ? store.getters.mixedAssets : ((data && data.role === ROLES_ENUM.STUDENT) ? [] : store.getters.instruments);
  let sectionList: Array<dynamicsObject> = [];
  
  if (id === 'questionnaire_instrument-edit') {
    const course: valueof<typeof COURSES_ENUM> = store.getters.course;
    const sections = [
      { id: 'stock', one: sectionStock, two: sectionTwo },
      { id: 'bond', one: sectionBond, two: sectionTwo },
      { id: 'alternative', one: sectionAlternative, two: sectionTwoAlternative },
    ];
    const correct = sections.find(s => s.id === data[`class_${store.getters.course}_id`]);
    sectionList = correct ? correct[course] : [];
  }
  const inputs = [
    {
      id: 'questionnaire-create-info',
      data: {},
      inputs: [],
    },
    {
      id: 'questionaire-select-course',
      data: {
        course: '',
        course_id: '',
      },
      inputs: [
        { required: true, name: 'Курс *', placeholder: 'Выберите курс', id: 'course', grid: '1 / 10', type: 'text', drop: true, showDrop: false, drop_data: [], max: 60, show: true, unsearch: true },
      ]
    },
    // FAQ
    {
      id: 'faq-add',
      data: {
        question: '',
        answer: '',
      },
      inputs: [
        { required: true, name: 'Вопрос *', placeholder: 'Введите вопрос', id: 'question', grid: '1 / 10', type: 'text', drop: false, max: 60, show: true },
        { required: true, name: 'Ответ *', placeholder: 'Введите ответ на вопрос', id: 'answer', grid: '1 / 10', type: 'textarea', drop: false, show: true },
      ]
    },
    {
      id: 'faq-edit',
      data: {
        _id: data && data._id,
        question: data && data.question,
        answer: data && data.answer,
      },
      inputs: [
        { required: true, name: 'Вопрос *', placeholder: 'Введите вопрос', id: 'question', grid: '1 / 10', type: 'text', drop: false, max: 60, show: true },
        { required: true, name: 'Ответ *', placeholder: 'Введите ответ на вопрос', id: 'answer', grid: '1 / 10', type: 'textarea', drop: false, show: true },
      ]
    },
    {
      id: 'faq-remove',
      data: {
        _id: data && data._id
      },
      inputs: []
    },
    // Assets
    {
      id: 'asset-add',
      data: {
        name: '',
        stock: '',
        bond: '',
        alternative: '',
      },
      inputs: [
        { required: true, name: 'Наименование *', placeholder: 'Введите наименование актива', id: 'name', grid: '1 / 10', type: 'text', drop: false, max: 60, show: true },
        { required: false, name: 'Процент акций', placeholder: 'Введите процент акций', id: 'stock', grid: '1 / 4', mask: '##', type: 'text', drop: false, show: true },
        { required: false, name: 'Процент облигаций', placeholder: 'Введите процент облигаций', id: 'bond', grid: '4 / 7', mask: '##', type: 'text', drop: false, show: true },
        { required: false, name: 'Процент альтернативы', placeholder: 'Введите процент альтернативы', id: 'alternative', grid: '7 / 10', mask: '##', type: 'text', drop: false, show: true },
      ]
    },
    {
      id: 'asset-edit',
      data: {
        _id: data && data._id,
        name: data && data.name,
        stock: data && data.stock,
        bond: data && data.bond,
        alternative: data && data.alternative,
      },
      inputs: [
        { required: true, name: 'Наименование *', placeholder: 'Введите наименование актива', id: 'name', grid: '1 / 10', type: 'text', drop: false, max: 60, show: true },
        { required: false, name: 'Процент акций', placeholder: 'Введите процент акций', id: 'stock', grid: '1 / 4', mask: '##', type: 'text', drop: false, show: true },
        { required: false, name: 'Процент облигаций', placeholder: 'Введите процент облигаций', id: 'bond', grid: '4 / 7', mask: '##', type: 'text', drop: false, show: true },
        { required: false, name: 'Процент альтернативы', placeholder: 'Введите процент альтернативы', id: 'alternative', grid: '7 / 10', mask: '##', type: 'text', drop: false, show: true },
      ]
    },
    {
      id: 'asset-remove',
      data: {
        _id: data && data._id
      },
      inputs: []
    },
    // Currency
    {
      id: 'currency-add',
      data: {
        name: '',
        code: '',
        code_id: '',
        sign: '',
      },
      inputs: [
        { required: true, name: 'Название *', placeholder: 'Введите название валюты', id: 'name', grid: '1 / 10', type: 'text', drop: false, max: 60, show: true },
        { required: true, name: 'Код *', placeholder: 'Выберите код валюты', id: 'code', grid: '1 / 6', type: 'text', drop: true, showDrop: false, drop_data: [], show: true },
        { required: true, name: 'Символ валюты *', placeholder: 'Введите символ валюты', id: 'sign', grid: '6 / 10', type: 'email', drop: false, max: 60, show: true },
      ]
    },
    {
      id: 'currency-edit',
      data: {
        _id: data && data._id,
        name: data && data.name,
        code: data && data.code,
        code_id: data && data.code,
        sign: data && data.sign,
      },
      inputs: [
        { required: true, name: 'Название *', placeholder: 'Введите название валюты', id: 'name', grid: '1 / 10', type: 'text', drop: false, max: 60, show: true },
        { required: true, name: 'Код *', placeholder: 'Выберите код валюты', id: 'code', grid: '1 / 6', type: 'text', drop: true, showDrop: false, drop_data: [], show: true },
        { required: true, name: 'Символ валюты *', placeholder: 'Введите символ валюты', id: 'sign', grid: '6 / 10', type: 'email', drop: false, max: 60, show: true },
      ]
    },
    {
      id: 'currency-remove',
      data: {
        _id: data && data._id
      },
      inputs: []
    },
    // Expert
    {
      id: 'expert-add',
      data: {
        name: '',
        phone: '',
        email: '',
        avatar: '',
        accesses: []
      },
      inputs: [
        { required: true, name: 'ФИО *', placeholder: 'ФИО', id: 'name', grid: '1 / 10', type: 'text', drop: false, max: 60, show: true },
        { required: true, name: 'Телефон *', placeholder: '+71234567890', id: 'phone', grid: '1 / 10', type: 'phone', drop: false, mask: '+############', show: true },
        { required: true, name: 'Email *', placeholder: 'example@mail.ru', id: 'email', grid: '1 / 10', type: 'email', drop: false, max: 60, show: true },
        { required: true, name: 'Права *', placeholder: 'Выберите доступ', id: 'accesses', grid: '1 / 10', type: 'text', dropBox: true, showDrop: false, drop_data: countries, show: true },
        { required: true, name: 'Пароль *', placeholder: 'Введите пароль', id: 'password', grid: '1 / 10', type: 'text', drop: false, show: true },
      ]
    },
    {
      id: 'expert-edit',
      data: {
        _id: data && data._id,
        name: data && data.name,
        phone: data && data.phone,
        email: data && data.email,
        avatar: data && data.avatar && data.avatar.src,
        password: '',
        accesses: []
      },
      inputs: [
        { required: true, name: 'ФИО *', placeholder: 'ФИО', id: 'name', grid: '1 / 10', type: 'text', drop: false, max: 60, show: true },
        { required: true, name: 'Телефон *', placeholder: '+71234567890', id: 'phone', grid: '1 / 10', type: 'phone', drop: false, mask: '+############', show: true },
        { required: true, name: 'Email *', placeholder: 'example@mail.ru', id: 'email', grid: '1 / 10', type: 'email', drop: false, max: 60, show: true },
        { required: true, name: 'Права *', placeholder: 'Выберите доступ', id: 'accesses', grid: '1 / 10', type: 'text', dropBox: true, showDrop: false, drop_data: ACCESSES, show: true },
        { required: false, name: 'Пароль (не обязательно)', placeholder: 'Введите новый пароль', id: 'password', grid: '1 / 10', type: 'text', drop: false, show: true },
      ]
    },
    {
      id: 'expert-remove',
      data: {
        _id: data && data._id,
        expert: '',
        expert_id: '',
      },
      inputs: [
        { required: true, name: 'Эксперт, которому будут перенесены все непроверенные работы этого эксперта *', placeholder: 'Выберите эксперта', id: 'expert', grid: '1 / 10', type: 'text', drop: true, showDrop: false, drop_data: [], show: true },
      ]
    },
    // Support
    {
      id: 'support-add',
      data: {
        name: '',
        phone: '',
        email: '',
        avatar: '',
      },
      inputs: [
        { required: true, name: 'ФИО *', placeholder: 'ФИО', id: 'name', grid: '1 / 10', type: 'text', drop: false, max: 60, show: true },
        { required: true, name: 'Телефон *', placeholder: '+71234567890', id: 'phone', grid: '1 / 10', type: 'phone', drop: false, mask: '+############', show: true },
        { required: true, name: 'Email *', placeholder: 'example@mail.ru', id: 'email', grid: '1 / 10', type: 'email', drop: false, max: 60, show: true },
        { required: true, name: 'Пароль *', placeholder: 'Введите пароль', id: 'password', grid: '1 / 10', type: 'text', drop: false, show: true },
      ]
    },
    {
      id: 'support-edit',
      data: {
        _id: data && data._id,
        name: data && data.name,
        phone: data && data.phone,
        email: data && data.email,
        avatar: data && data.avatar && data.avatar.src,
      },
      inputs: [
        { required: true, name: 'ФИО *', placeholder: 'ФИО', id: 'name', grid: '1 / 10', type: 'text', drop: false, max: 60, show: true },
        { required: true, name: 'Телефон *', placeholder: '+71234567890', id: 'phone', grid: '1 / 10', type: 'phone', drop: false, mask: '+############', show: true },
        { required: true, name: 'Email *', placeholder: 'example@mail.ru', id: 'email', grid: '1 / 10', type: 'email', drop: false, max: 60, show: true },
      ]
    },
    {
      id: 'support-remove',
      data: {
        _id: data && data._id
      },
      inputs: []
    },
    // Questionnaire
    {
      id: 'questionnaires_archive-remove',
      data: {
        _id: data && data._id
      },
      inputs: []
    },
    {
      id: 'questionnaire_process-remove',
      data: {
        _id: data && data._id
      },
      inputs: []
    },
    {
      id: 'questionnaire_ready-remove',
      data: {
        _id: data && data._id
      },
      inputs: []
    },
    {
      id: 'questionnaires-remove',
      data: {
        _id: data && data._id
      },
      inputs: []
    },
    {
      id: 'questionnaire_student-remove',
      data: {
        _id: data && data._id
      },
      inputs: []
    },
    // students
    {
      id: 'students-add',
      data: {
        email: '',
        expert: '',
        expert_id: '',
        course: '',
        streamDate: '',
        chat: '',
        password: '',
      },
      inputs: [
        { required: true, name: 'Почта студента *', placeholder: 'Введите почту', id: 'email', grid: '1 / 11', type: 'text', drop: false, showDrop: false, drop_data: [], show: true },
        { required: true, name: 'Курс *', placeholder: 'Введите курс (ЯИ или Капитал)', id: 'course', grid: '1 / 11', type: 'text', drop: true, showDrop: false, drop_data: [], show: true },
        { required: true, name: 'Эксперт *', placeholder: 'Выберите эксперта', id: 'expert', grid: '1 / 11', type: 'text', drop: true, showDrop: false, drop_data: [], show: true },
        { required: true, name: 'Дата потока *', placeholder: 'Выберите дату потока', id: 'streamDate', grid: '1 / 6', type: 'text', drop: true, showDrop: false, drop_data: [], show: true },
        { required: true, name: 'Номер чата *', placeholder: 'Введите номер чата', id: 'chat', grid: '6 / 11', type: 'text', mask: '####', drop: false, showDrop: false, drop_data: [], show: true },
        { required: true, name: 'Пароль *', placeholder: 'Введите пароль', id: 'password', grid: '1 / 11', type: 'text', drop: false, showDrop: false, drop_data: [], show: true },
      ]
    },
    {
      id: 'stream-course-add',
      data: {
        streamDate: '',
        course: '',
        course_id: '',
      },
      inputs: [
        { required: true, name: 'Курс *', placeholder: 'Выберите курс', id: 'course', grid: '1 / 10', type: 'text', drop: true, showDrop: false, drop_data: [], show: true },
        { required: true, name: 'Дата потока *', placeholder: 'Введите дата потока', id: 'streamDate', grid: '1 / 10', type: 'text', mask: '##.##.####', drop: false, showDrop: false, drop_data: [], show: true },
      ]
    },
    {
      id: 'students-edit',
      data: {
        _id: data && data._id,
        email: data && data.studentEmail,
        expert: data && data.expert,
        expert_id: data && data.expert_id,
        course: data && data.course,
        course_id: data && data.course_id,
        streamDate: data && data.streamDate,
        chat: data && data.chat,
      },
      inputs: [
        { required: true, name: 'Почта студента *', placeholder: 'Введите почту', id: 'email', grid: '1 / 11', type: 'text', drop: false, showDrop: false, drop_data: [], show: true },
        { required: true, name: 'Курс *', placeholder: 'Выберите курс', id: 'course', grid: '1 / 11', type: 'text', drop: true, showDrop: false, drop_data: [], show: true },
        { required: true, name: 'Эксперт *', placeholder: 'Выберите эксперта', id: 'expert', grid: '1 / 11', type: 'text', drop: true, showDrop: false, drop_data: [], show: true },
        { required: true, name: 'Дата потока *', placeholder: 'Выберите дату потока', id: 'streamDate', grid: '1 / 6', type: 'text', drop: true, showDrop: false, drop_data: [], show: true, uncheck: true },
        { required: true, name: 'Номер чата *', placeholder: 'Введите номер чата', id: 'chat', grid: '6 / 11', type: 'text', mask: '####', drop: false, showDrop: false, drop_data: [], show: true },
      ]
    },
    {
      id: 'students-expert',
      data: {
        _id: data && data._id,
        expert: data && data.expert,
        expert_id: data && data.expert_id,
        studentEmail: data && data.studentEmail,
      },
      inputs: [
        { required: false, name: 'Студент', placeholder: '', id: 'studentEmail', grid: '1 / 10', type: 'text', drop: false, show: true, disabled: true },
        { required: true, name: 'Эксперт *', placeholder: 'Выберите эксперта', id: 'expert', grid: '1 / 10', type: 'text', drop: true, showDrop: false, drop_data: [], show: true },
      ]
    },
    {
      id: 'students-expert-change',
      data: {
        expert: '',
        expert_id: '',
        change_expert: '',
        change_expert_id: '',
      },
      inputs: [
        { required: true, name: 'Эксперт, с которого снять студентов *', placeholder: 'Выберите эксперта, с которого снять студентов', id: 'expert', grid: '1 / 10', type: 'text', drop: true, showDrop: false, drop_data: [], show: true },
        { required: true, name: 'Эксперт, на которого назначить студентов *', placeholder: 'Выберите эксперта, на которого назначить студентов', id: 'change_expert', grid: '1 / 10', type: 'text', drop: true, showDrop: false, drop_data: [], show: true },
      ]
    },
    {
      id: 'students-expert-change-list',
      data: {
        expert: '',
        expert_id: '',
        change_expert: '',
        change_expert_id: '',
        excel: ''
      },
      inputs: [
        { required: true, name: 'Эксперт, с которого переместить студентов *', placeholder: 'Выберите эксперта, с которого переместить студентов', id: 'expert', grid: '1 / 10', type: 'text', drop: true, showDrop: false, drop_data: [], show: true },
        { required: true, name: 'Эксперт, на которого переместить студентов *', placeholder: 'Выберите эксперта, на которого переместить студентов', id: 'change_expert', grid: '1 / 10', type: 'text', drop: true, showDrop: false, drop_data: [], show: true },
        { required: true, name: 'Файл (Список студентов) *', id: 'file', example: '/images/examples/excel.png', grid: '1 / 10', type: 'file', show: true, drop: false }
      ]
    },
    {
      id: 'students-added-list',
      data: {
        excel: ''
      },
      inputs: [
        { required: true, name: 'Файл (Список студентов) *', id: 'file', example: '/images/examples/students.png', grid: '1 / 10', type: 'file', show: true, drop: false }
      ]
    },
    {
      id: 'students-delete-list',
      data: {
        excel: ''
      },
      inputs: [
        { required: true, name: 'Файл (Список студентов) *', id: 'file', example: '/images/examples/excel.png', grid: '1 / 10', type: 'file', show: true, drop: false }
      ]
    },
    {
      id: 'students-stream',
      data: {
        _id: data && data._id,
        streamDate: data && data.streamDate,
        studentEmail: data && data.studentEmail,
      },
      inputs: [
        { required: false, name: 'Студент', placeholder: '', id: 'studentEmail', grid: '1 / 10', type: 'text', drop: false, show: true, disabled: true },
        { required: true, name: 'Дата потока *', placeholder: 'Введите дата потока', id: 'streamDate', grid: '1 / 10', type: 'text', mask: '##.##.####', drop: false, showDrop: false, drop_data: [], show: true },
      ]
    },
    {
      id: 'students-password',
      data: {
        _id: data && data._id,
        password: data && data.password,
        studentEmail: data && data.studentEmail,
      },
      inputs: [
        { required: false, name: 'Студент', placeholder: '', id: 'studentEmail', grid: '1 / 10', type: 'text', drop: false, show: true, disabled: true },
        { required: true, name: 'Новый пароль *', placeholder: 'Введите новый пароль', id: 'password', grid: '1 / 10', type: 'text', drop: false, showDrop: false, drop_data: [], show: true },
      ]
    },
    {
      id: 'students-file',
      data: {
        _id: data && data._id
      },
      inputs: []
    },
    {
      id: 'students-remove',
      data: {
        _id: data && data._id
      },
      inputs: []
    },
    // Instrument questionnaire
    {
      id: 'questionnaire-send',
      data: {

      },
      inputs: []
    },
    {
      id: 'common_instrument-create',
      data: {
        course: data && data.course,
        type: true,
        matdate: '',
        name: '',
        title: '',
        country_one: '',
        country_two: '',
        country_one_id: '',
        country_two_id: '',
        price: '',
        purchase_price: '',
        base_currency_one: '',
        base_currency_two: '',
        base_currency_one_id: '',
        base_currency_two_id: '',
        class_one: '',
        class_two: '',
        class_one_id: '',
        class_two_id: '',
        currency_one: '',
        currency_two: '',
        currency_one_id: '',
        currency_two_id: '',
        instrument_type_one: '',
        instrument_type_one_id: '',
        instrument_type_two: '',
        instrument_type_two_id: '',
        section_one: '',
        section_one_id: '',
        section_two: '',
        section_two_id: '',
        lot: 1,
      },
      inputs: [
        { required: true, name: 'Тикер', placeholder: 'Выберите тикер', id: 'name', grid: '1 / 10', type: 'text', drop: true, showDrop: false, drop_data: instruments, max: 60, show: true, uncheck: true },
        { required: false, name: 'Наименование', placeholder: 'Введите наименование', id: 'title', grid: '1 / 10', type: 'text', drop: false, max: 60, show: true },
        { required: true, name: 'Тип инструмента', placeholder: 'Выберите тип иструмента', id: 'instrument_type_' + data.course, grid: '1 / 7', type: 'text', drop: true, showDrop: false, drop_data: instrumentTypes(data && data.course), show: true },
        { required: true, name: 'Валюта покупки', placeholder: 'Выберите валюту покупки', id: 'currency_' + data.course, grid: '7 / 10', type: 'text', drop: true, showDrop: false, drop_data: store.getters.currencyList, show: true },
        { required: true, name: 'Базовая валюта для подсчета валютной диверс.', placeholder: 'Выберите валюту для подсчета валютной диверсиф.', id: 'base_currency_' + data.course, grid: '1 / 7', type: 'text', drop: true, showDrop: false, drop_data: isMultyCurrency, show: true },
        { required: true, name: 'Текущая цена за 1 шт', placeholder: 'Введите цену', id: 'price', grid: '7 / 10', type: 'number', drop: false, max: 60, show: true },
        { required: true, name: 'Класс активов', placeholder: 'Выберите класс активов', id: 'class_' + data.course, grid: '1 / 7', type: 'text', drop: true, showDrop: false, drop_data: classes(data && data.course), show: true },
        { required: true, name: 'Страна', placeholder: 'Выберите страну', id: 'country_' + data.course, grid: '7 / 10', type: 'text', drop: true, showDrop: false, drop_data: instrumentCountries, show: true },
        { required: data.course === COURSES_ENUM.ONE, name: 'Сектор экономики', placeholder: 'Выберите сектор экономики', id: 'section_' + data.course, grid: '1 / 7', type: 'text', drop: true, showDrop: false, drop_data: sectionList, show: true },
        { required: false, name: 'Дата погашения', placeholder: 'Введите дату погашения (гггг-мм-дд)', id: 'matdate', grid: '1 / 7', mask: '####-##-##', type: 'text', drop: false, show: false },
      ]
    },
    {
      id: 'common_instrument-edit',
      data: {
        _id: data && data._id,
        type: true,
        course: data && data.course,
        matdate: data && data.matdate,
        instrument_type_id: data && data.instrument_type_id,
        instrument_type: data && data.instrument_type,
        name: data && data.name,
        title: data && data.title,
        country_one: data && data.country_one,
        country_two: data && data.country_two,
        country_one_id: data && data.country_one_id,
        country_two_id: data && data.country_two_id,
        price: data && Number(data.price),
        purchase_price: data && Number(data.purchase_price),
        base_currency_one: data && data.base_currency_one,
        base_currency_two: data && data.base_currency_two,
        base_currency_one_id: data && data.base_currency_one_id,
        base_currency_two_id: data && data.base_currency_two_id,
        class_one: data && data.class_one,
        class_two: data && data.class_two,
        class_one_id: data && data.class_one_id,
        class_two_id: data && data.class_two_id,
        currency_one: data && data.currency_one,
        currency_two: data && data.currency_two,
        currency_one_id: data && data.currency_one_id,
        currency_two_id: data && data.currency_two_id,
        instrument_type_one: data && data.instrument_type_one,
        instrument_type_one_id: 1,
        instrument_type_two: data && data.instrument_type_two,
        instrument_type_two_id: 1,
        section_one: data && data.section_one,
        section_one_id: 1,
        section_two: data && data.section_two,
        section_two_id: 1,
        lot: data && data.lot,
      },
      inputs: [
        { required: true, name: 'Тикер', placeholder: 'Выберите тикер', id: 'name', grid: '1 / 10', type: 'text', drop: false, showDrop: false, max: 60, show: true },
        { required: false, name: 'Наименование', placeholder: 'Введите наименование', id: 'title', grid: '1 / 10', type: 'text', drop: false, max: 60, show: true },
        { required: true, name: 'Тип инструмента', placeholder: 'Выберите тип иструмента', id: 'instrument_type_' + data.course, grid: '1 / 7', type: 'text', drop: true, showDrop: false, drop_data: instrumentTypes(data && data.course), show: true },
        { required: true, name: 'Валюта покупки', placeholder: 'Выберите валюту покупки', id: 'currency_' + data.course, grid: '7 / 10', type: 'text', drop: true, showDrop: false, drop_data: store.getters.currencyList, show: true },
        { required: true, name: 'Базовая валюта для подсчета валютной диверс.', placeholder: 'Выберите валюту для подсчета валютной диверсиф.', id: 'base_currency_' + data.course, grid: '1 / 7', type: 'text', drop: true, showDrop: false, drop_data: isMultyCurrency, show: true },
        { required: true, name: 'Текущая цена за 1 шт', placeholder: 'Введите цену', id: 'price', grid: '7 / 10', type: 'number', drop: false, max: 60, show: true },
        { required: true, name: 'Класс активов', placeholder: 'Выберите класс активов', id: 'class_' + data.course, grid: '1 / 7', type: 'text', drop: true, showDrop: false, drop_data: classes(data && data.course), show: true },
        { required: true, name: 'Страна', placeholder: 'Выберите страну', id: 'country_' + data.course, grid: '7 / 10', type: 'text', drop: true, showDrop: false, drop_data: instrumentCountries, show: true },
        { required: data.course === COURSES_ENUM.ONE, name: 'Сектор экономики', placeholder: 'Выберите сектор экономики', id: 'section_' + data.course, grid: '1 / 7', type: 'text', drop: true, showDrop: false, drop_data: sectionList, show: true },
        { required: false, name: 'Дата погашения', placeholder: 'Введите дату погашения (гггг-мм-дд)', id: 'matdate', grid: '1 / 7', mask: '####-##-##', type: 'text', drop: false, show: false },
      ]
    },
    {
      id: 'common_instrument-remove',
      data: {
        _id: data && data._id,
        course: data && data.course,
      },
      inputs: []
    },
    {
      id: 'questionnaire_instrument-create',
      data: {
        portfolioId: data && data.portfolioId,
        type: data && data.type,
        matdate: '',
        title: '',
        name: '',
        name_id: '',
        country: '',
        country_one: '',
        country_two: '',
        country_one_id: '',
        country_two_id: '',
        price: '',
        purchase_price: '',
        percent: '',
        amount: '',
        number_papers: '',
        base_currency_one: '',
        base_currency_two: '',
        base_currency_one_id: '',
        base_currency_two_id: '',
        class_one: '',
        class_two: '',
        class_one_id: '',
        class_two_id: '',
        currency_one: '',
        currency_two: '',
        currency_one_id: '',
        currency_two_id: '',
        comments: '',
        comment: '',
        entryPoint: '',
        exitPoint: '',
        expert: '',
        instrument_type_one: '',
        instrument_type_one_id: '',
        instrument_type_two: '',
        instrument_type_two_id: '',
        section_one: '',
        section_one_id: '',
        section_two: '',
        section_two_id: '',
        dublicateExpert: false,
        dublicateStudent: false,
        dublicateExisting: false,
        lot: '',
        _id: '',
        commentStudent: '',
        commentInstrument: '',
      },
      inputs: [
        { required: true, name: 'Тикер/ISIN', placeholder: 'Выберите из списка', id: 'name', grid: '1 / 10', type: 'text', drop: true, showDrop: false, drop_data: instruments, max: 60, show: true },
        { required: true, name: 'Текущая цена за 1 шт', placeholder: 'Введите цену', id: 'price', grid: '1 / 4', type: 'number', drop: false, max: 60, show: true },
        { required: true, name: 'Количество', placeholder: 'Введите количество', id: 'number_papers', grid: '4 / 7', type: 'number', drop: false, show: true },
        { required: true, name: 'Валюта покупки', placeholder: 'Выберите валюту покупки', id: 'currency_' + store.getters.course, grid: '7 / 10', type: 'text', drop: true, showDrop: false, drop_data: store.getters.currencyList, show: true },
        { required: true, name: 'Базовая валюта для подсчета валютной диверс.', placeholder: 'Выберите валюту для подсчета валютной диверсиф.', id: 'base_currency_' + store.getters.course, grid: '1 / 7', type: 'text', drop: true, showDrop: false, drop_data: isMultyCurrency, show: true },
        { required: true, name: 'Тип инструмента', placeholder: 'Выберите тип иструмента', id: 'instrument_type_' + store.getters.course, grid: '7 / 10', type: 'text', drop: true, showDrop: false, drop_data: instrumentTypes(data && data.course), show: true },
        { required: true, name: 'Класс активов', placeholder: 'Выберите класс активов', id: 'class_' + store.getters.course, grid: '1 / 7', type: 'text', drop: true, showDrop: false, drop_data: classes(data && data.course), show: true },
        { required: true, name: 'Страна', placeholder: 'Выберите страну', id: 'country_' + store.getters.course, grid: '7 / 10', type: 'text', drop: true, showDrop: false, drop_data: instrumentCountries, show: true },
        { required: store.getters.course === COURSES_ENUM.ONE, name: 'Сектор экономики', placeholder: 'Выберите сектор экономики', id: 'section_' + store.getters.course, grid: '1 / 7', type: 'text', drop: true, showDrop: false, drop_data: sectionList, show: true },
        { required: false, name: 'Дата погашения', placeholder: 'Введите дату погашения (гггг-мм-дд)', id: 'matdate', grid: '1 / 7', mask: '####-##-##', type: 'text', drop: false, show: false },
        { required: !(data && data.role === ROLES_ENUM.EXPERT), name: data && data.role === ROLES_ENUM.EXPERT ? 'Комментарий к инструменту' : 'Комментарий для эксперта', placeholder: data && data.role === ROLES_ENUM.EXPERT ? 'Комментарий к инструменту' : 'Комментарий для эксперта, причины выбора, % допустимого убытка', id: data && data.role === ROLES_ENUM.EXPERT ? 'comment' : 'commentStudent', grid: '1 / 10', type: 'textarea', drop: false, show: true },
        { required: false, name: 'Комментарий к инструменту (Дополнительный)', placeholder: 'Комментарий к инструменту', id: 'commentInstrument', grid: '1 / 10', type: 'textarea', drop: false, show: !!(data && data.role === ROLES_ENUM.EXPERT) },
      ]
    },
    {
      id: 'questionnaire_instrument-edit',
      data: {
        portfolioId: data && data.portfolioId,
        type: data && data.type,
        matdate: data && data.matdate,
        instrument_type_id: data && data.instrument_type_id,
        instrument_type: data && data.instrument_type,
        title: data && data.title,
        name: data && data.name,
        name_id: data && data.name_id,
        country_one: data && data.country_one,
        country_two: data && data.country_two,
        country_one_id: data && data.country_one_id,
        country_two_id: data && data.country_two_id,
        price: data && Number(data.price),
        purchase_price: data && Number(data.purchase_price),
        percent: data && data.percent,
        amount: data && data.amount,
        number_papers: data && Number(data.number_papers),
        base_currency_one: data && data.base_currency_one,
        base_currency_two: data && data.base_currency_two,
        base_currency_one_id: data && data.base_currency_one_id,
        base_currency_two_id: data && data.base_currency_two_id,
        class_one: data && data.class_one,
        class_two: data && data.class_two,
        class_one_id: data && data.class_one_id,
        class_two_id: data && data.class_two_id,
        currency_one: data && data.currency_one,
        currency_two: data && data.currency_two,
        currency_one_id: data && data.currency_one_id,
        currency_two_id: data && data.currency_two_id,
        comments: data && data.comments,
        comment: data && data.comment,
        entryPoint: data && data.entryPoint,
        exitPoint: data && data.exitPoint,
        expert: data && data.expert,
        instrument_type_one: data && data.instrument_type_one,
        instrument_type_one_id: data && data.instrument_type_one_id,
        instrument_type_two: data && data.instrument_type_two,
        instrument_type_two_id: data && data.instrument_type_two_id,
        section_one: data && data.section_one,
        section_one_id: data && data.section_one_id,
        section_two: data && data.section_two,
        section_two_id: data && data.section_two_id,
        dublicateExpert: data && data.dublicateExpert,
        dublicateStudent: data && data.dublicateStudent,
        dublicateExisting: data && data.dublicateExisting,
        lot: data && data.lot,
        index: data && data.index,
        commentStudent: data && data.commentStudent,
        commentInstrument: data && data.commentInstrument,
        _id: data && data._id,
      },
      inputs: [
        { required: true, name: 'Тикер/ISIN', placeholder: 'Выберите из списка', id: 'name', grid: '1 / 10', type: 'text', drop: true, showDrop: false, drop_data: instruments, max: 60, show: true },
        { required: true, name: 'Текущая цена за 1 шт', placeholder: 'Введите цену', id: 'price', grid: '1 / 4', type: 'number', drop: false, max: 60, show: true },
        { required: true, name: 'Количество', placeholder: 'Введите количество', id: 'number_papers', grid: '4 / 7', type: 'number', drop: false, show: true },
        { required: true, name: 'Валюта покупки', placeholder: 'Выберите валюту покупки', id: 'currency_' + store.getters.course, grid: '7 / 10', type: 'text', drop: true, showDrop: false, drop_data: store.getters.currencyList, show: true },
        { required: true, name: 'Базовая валюта для подсчета валютной диверс.', placeholder: 'Выберите валюту для подсчета валютной диверсиф.', id: 'base_currency_' + store.getters.course, grid: '1 / 7', type: 'text', drop: true, showDrop: false, drop_data: isMultyCurrency, show: true },
        { required: true, name: 'Тип инструмента', placeholder: 'Выберите тип иструмента', id: 'instrument_type_' + store.getters.course, grid: '7 / 10', type: 'text', drop: true, showDrop: false, drop_data: instrumentTypes(data && data.course), show: true },
        { required: true, name: 'Класс активов', placeholder: 'Выберите класс активов', id: 'class_' + store.getters.course, grid: '1 / 7', type: 'text', drop: true, showDrop: false, drop_data: classes(data && data.course), show: true },
        { required: true, name: 'Страна', placeholder: 'Выберите страну', id: 'country_' + store.getters.course, grid: '7 / 10', type: 'text', drop: true, showDrop: false, drop_data: instrumentCountries, show: true },
        { required: store.getters.course === COURSES_ENUM.ONE, name: 'Сектор экономики', placeholder: 'Выберите сектор экономики', id: 'section_' + store.getters.course, grid: '1 / 7', type: 'text', drop: true, showDrop: false, drop_data: sectionList, show: true },
        { required: false, name: 'Дата погашения', placeholder: 'Введите дату погашения (гггг-мм-дд)', id: 'matdate', grid: '1 / 7', mask: '####-##-##', type: 'text', drop: false, show: false },
        { required: !(data && data.role === ROLES_ENUM.EXPERT), name: data && data.role === ROLES_ENUM.EXPERT ? 'Комментарий к инструменту' : 'Комментарий для эксперта', placeholder: data && data.role === ROLES_ENUM.EXPERT ? 'Комментарий к инструменту' : 'Комментарий для эксперта, причины выбора, % допустимого убытка', id: data && data.role === ROLES_ENUM.EXPERT ? 'comment' : 'commentStudent', grid: '1 / 10', type: 'textarea', drop: false, show: true },
        { required: false, name: 'Комментарий к инструменту (Дополнительный)', placeholder: 'Комментарий к инструменту', id: 'commentInstrument', grid: '1 / 10', type: 'textarea', drop: false, show: !!(data && data.role === ROLES_ENUM.EXPERT) },
      ]
    },
    {
      id: 'instrument-comment',
      data: {
        index: data && data.index,
        portfolioId: data && data.portfolioId,
        type: data && data.type,
        name: data && data.name,
        comment: data && data.comment,
        commentInstrument: data && data.commentInstrument,
        commentStudent: data && data.commentStudent
      },
      inputs: [
        { required: false, name: 'Тикер', placeholder: 'Выберите тикер', id: 'name', grid: '1 / 10', type: 'text', drop: false, max: 60, show: true, disabled: true },
        { required: false, name: 'Комментарий от студента', placeholder: 'Комментарий от студента, причины выбора, % допустимого убытка', id: 'commentStudent', grid: '1 / 10', type: 'textarea', drop: false, show: true },
        { required: false, name: 'Комментарий к инструменту', placeholder: 'Комментарий к инструменту', id: 'comment', grid: '1 / 10', type: 'textarea', drop: false, show: true },
        { required: false, name: 'Комментарий к инструменту (Дополнительный)', placeholder: 'Комментарий к инструменту', id: 'commentInstrument', grid: '1 / 10', type: 'textarea', drop: false, show: true },
      ]
    },
    {
      id: 'questionnaire_instrument-remove',
      data: {
        index: data && data.index,
        portfolioId: data && data.portfolioId,
        type: data && data.type,
        name: data && data.name,
        dublicateFrom: data && data.dublicateFrom,
      },
      inputs: []
    },
    {
      id: 'insurance-edit',
      data: {
        view: data && data.view,
        view_id: data && data.view_id,
        name: data && data.name,
        amount: data && data.amount,
        company: data && data.company,
      },
      inputs: [
        { required: false, name: 'Вид страхования', placeholder: 'Выберите вид страхования', id: 'view', grid: '1 / 10', type: 'text', drop: true, showDrop: false, drop_data: typesInsurance, show: true },
        { required: false, name: 'Наименование страхования', placeholder: 'Введите наименование страхования', id: 'name', grid: '1 / 10', type: 'text', drop: false, max: 60, show: true },
        { required: false, name: 'Стоимость программы', placeholder: 'Введите стоимость программы', id: 'amount', grid: '1 / 10', type: 'text', drop: false, show: true },
        { required: false, name: 'Страховая компания', placeholder: 'Введите страховую компанию', id: 'company', grid: '1 / 10', type: 'text', drop: false, show: true },
      ]
    },
    // verification
    {
      id: 'verification',
      data: {},
      inputs: []
    },
  ];

  const QIC: dynamicsObject = inputs.find(i => i.id === 'questionnaire_instrument-create') || {};
  const QIE: dynamicsObject = inputs.find(i => i.id === 'questionnaire_instrument-edit') || {};
  if (!QIC || !QIE) return;

  if (store.getters.course === COURSES_ENUM.ONE) {
    QIC.inputs[0].uncheck = true;
    QIE.inputs[0].uncheck = true;
  }

  if (store.getters.course === COURSES_ENUM.TWO) {
    if (data.portfolioId !== 'existingPortfolio') {
      QIC.inputs[2].placeholder = '';
      QIE.inputs[2].placeholder = '';
    }
    if (!data.type) {
      QIC.inputs[6] = { required: false, name: 'Точка входа', placeholder: 'Введите точку входа', id: 'entryPoint', grid: '1 / 7', type: 'text', drop: false, show: true };
      QIE.inputs[6] = { required: false, name: 'Точка входа', placeholder: 'Введите точку входа', id: 'entryPoint', grid: '1 / 7', type: 'text', drop: false, show: true };
      QIC.inputs[8] = { required: false, name: 'Точка/условие выхода', placeholder: 'Введите точку/условие выхода', id: 'exitPoint', grid: '1 / 7', type: 'text', drop: false, show: true };
      QIE.inputs[8] = { required: false, name: 'Точка/условие выхода', placeholder: 'Введите точку/условие выхода', id: 'exitPoint', grid: '1 / 7', type: 'text', drop: false, show: true };
    } else {
      if (data.instrument_type_two) {
        const el = { _id: data.instrument_type_two };
        QIE.inputs.find((i: dynamicsObject) => i.id === "section_two").required = !!(el._id === 'Акции' || el._id === 'Отраслевые ETF и БПИФ' || el._id === 'ETF и БПИФ на акции широкого рынка (не отраслевые)' || el._id === 'Альтернативные инвестиции');
        QIE.inputs.find((i: dynamicsObject) => i.id === "section_two").show = !!(el._id === 'Акции' || el._id === 'Отраслевые ETF и БПИФ' || el._id === 'ETF и БПИФ на акции широкого рынка (не отраслевые)' || el._id === 'Альтернативные инвестиции');
        QIE.inputs.find((i: dynamicsObject) => i.id === "matdate").show = !!(el._id === 'Облигации' || el._id === 'ВДО' || el._id === 'Надёжные облигации');
      }
    }

    QIC.inputs[2].name = 'Количество лотов';
    QIE.inputs[2].name = 'Количество лотов';
    QIC.inputs.splice(QIC.inputs.length - 2, 0, { required: false, name: 'Лотность', placeholder: 'Введите лотность', id: 'lot', grid: '7 / 10', type: 'text', mask: '######', drop: false, show: true });
    QIE.inputs.splice(QIE.inputs.length - 2, 0, { required: false, name: 'Лотность', placeholder: 'Введите лотность', id: 'lot', grid: '7 / 10', type: 'text', mask: '######', drop: false, show: true });
  }
  if (data && data.portfolioId === 'existingPortfolio') {
    QIC.inputs[0].grid = '1 / 7';
    QIE.inputs[0].grid = '1 / 7';
    QIC.inputs.splice(1, 0, { required: !!(store.getters.course === COURSES_ENUM.ONE), name: 'Цена покупки', placeholder: 'Введите цену покупки', id: 'purchase_price', grid: '7 / 10', type: 'number', drop: false, show: true })
    QIE.inputs.splice(1, 0, { required: !!(store.getters.course === COURSES_ENUM.ONE), name: 'Цена покупки', placeholder: 'Введите цену покупки', id: 'purchase_price', grid: '7 / 10', type: 'number', drop: false, show: true })
  }
  if (data && data.portfolioId !== 'existingPortfolio') {
    QIC.inputs[0].grid = '1 / 7';
    QIE.inputs[0].grid = '1 / 7';
    if (data && data.role === ROLES_ENUM.STUDENT) {
      QIC.inputs[2].disabled = true;
      QIE.inputs[2].disabled = true;
    }
    QIC.inputs.splice(1, 0, { required: true, name: 'Процент от суммы', placeholder: 'Введите процент', id: 'percent', grid: '7 / 10', type: 'number', drop: false, max: 60, show: true })
    QIE.inputs.splice(1, 0, { required: true, name: 'Процент от суммы', placeholder: 'Введите процент', id: 'percent', grid: '7 / 10', type: 'number', drop: false, max: 60, show: true })
  }
  if (data && data.portfolioId !== 'expertPortfolio' && data.role === ROLES_ENUM.EXPERT) {
    QIC.inputs.push(
      { required: false, name: 'Комментарий от студента', placeholder: 'Комментарий от студента, причины выбора, % допустимого убытка', id: 'commentStudent', grid: '1 / 10', type: 'textarea', drop: false, show: true },
    );
    QIE.inputs.push(
      { required: false, name: 'Комментарий от студента', placeholder: 'Комментарий от студента, причины выбора, % допустимого убытка', id: 'commentStudent', grid: '1 / 10', type: 'textarea', drop: false, show: true },
    );
  }
  
  if (store.getters.course === COURSES_ENUM.TWO) {
    const CIE: dynamicsObject = inputs.find(i => i.id === 'common_instrument-edit') || {};
    const CIC: dynamicsObject = inputs.find(i => i.id === 'common_instrument-create') || {};
    if (CIE) {
      const el = { _id: data.instrument_type_two };
      const section = CIE.inputs.find((i: dynamicsObject) => i.id === "section_two");
      const matdate = CIE.inputs.find((i: dynamicsObject) => i.id === "matdate");
      if (section) {
        section.required = !!(el._id === 'Акции' || el._id === 'Отраслевые ETF и БПИФ' || el._id === 'ETF и БПИФ на акции широкого рынка (не отраслевые)' || el._id === 'Альтернативные инвестиции');
        section.show = !!(el._id === 'Акции' || el._id === 'Отраслевые ETF и БПИФ' || el._id === 'ETF и БПИФ на акции широкого рынка (не отраслевые)' || el._id === 'Альтернативные инвестиции');
      }
      if (matdate) {
        matdate.show = !!(el._id === 'Облигации' || el._id === 'ВДО' || el._id === 'Надёжные облигации');
      }
      CIE.inputs.splice(CIE.inputs.length, 0, { required: false, name: 'Лотность', placeholder: 'Введите лотность', id: 'lot', grid: '7 / 10', type: 'text', mask: '######', drop: false, show: true });
    }
    if (CIC) {
      CIC.inputs.splice(CIC.inputs.length, 0, { required: false, name: 'Лотность', placeholder: 'Введите лотность', id: 'lot', grid: '7 / 10', type: 'text', mask: '######', drop: false, show: true });
    }
    QIC.inputs.unshift({ required: false, name: 'Наименование компании', placeholder: 'Введите наименование компании', id: 'title', grid: '1 / 10', type: 'text', drop: true, drop_data: [], show: true });
    QIE.inputs.unshift({ required: false, name: 'Наименование компании', placeholder: 'Введите наименование компании', id: 'title', grid: '1 / 10', type: 'text', drop: true, drop_data: [], show: true });
  }
  
  return inputs.find(i => i.id === id);
};