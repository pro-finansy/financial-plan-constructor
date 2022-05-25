import store from '@/store';
import axios, { AxiosError } from 'axios';
import student from '../student/index';
import { main, defaultType, conclusion } from '../target/index';
import { createPortfolios } from '../portfolio/index';
import { expertPortfolioInstrument, existingPortfolioInstrument, studentPortfolioInstrument } from '../portfolio/common';
import comment from '../comment/index';
import insuranceProduct from '../insuranceProduct/index';
import { firstQuestionnaireInfo, secondQuestionnaireInfo, firstQuestionnaireRisks, secondQuestionnaireRisks, firstQuestionnaireColors, secondQuestionnaireColors } from '../preview/index';
import copyObject from '@/utils/copyObject';
import { firstType, secondType } from '../target/type';
import defaults from './defaults';
import { collectionCombineTarget } from '../target/combine';
import { COURSES_ENUM, QUESTIONNAIRE_VERSIONS_ENUM, ROLES_ENUM } from '@/utils/enums';
import { dynamicsObject, valueof } from '@/interfaces';
import { Questionnaire } from '@/interfaces/dto/questionnaire';
import { HELP_LIST } from '@/store/commonDatas';

function getCurrentType(type: number, course: valueof<COURSES_ENUM>, role: keyof typeof ROLES_ENUM) {
  const correctType = type === 1 ? firstType : secondType;
  const currentType = copyObject(defaultType(course, role));

  currentType.id = correctType.id;
  currentType.name = correctType.name;
  currentType.sections[0].name = correctType.section_name;
  return copyObject(currentType);
}

function createTarget(view: keyof typeof ROLES_ENUM, id: number, type = 2, course: valueof<COURSES_ENUM> = COURSES_ENUM.ONE, role: keyof typeof ROLES_ENUM = ROLES_ENUM.STUDENT, owner: keyof typeof ROLES_ENUM = ROLES_ENUM.STUDENT, comments: dynamicsObject = store?.getters?.user?.comments) {
  const name = `Цель ${course === COURSES_ENUM.ONE ? id : ''}`;
  return {
    id: id,
    selected: !!(id === 1),
    name,
    status: {
      existing: 0,
      student: course === COURSES_ENUM.ONE ? 1 : 0,
      expert: role === ROLES_ENUM.STUDENT ? 0 : 1
    },
    type: getCurrentType(type, course, role),
    main: copyObject(main(course)),
    conclusion: copyObject(conclusion(course, role, owner, view, comments)),
    portfolios: createPortfolios(course, role, comments),
  }
}

function getCorrectCourseModules(view: keyof typeof ROLES_ENUM, questionnaire: dynamicsObject, course: valueof<COURSES_ENUM>, role: keyof typeof ROLES_ENUM, owner: keyof typeof ROLES_ENUM) {
  questionnaire.student = copyObject(student(course, role, owner, view));
}

interface State {
  questionnaire: Questionnaire.Content,
  questionnaireStudent: Questionnaire.Content,
  questionnaireStatus: boolean,
  instruments: Array<dynamicsObject>,
  preview: dynamicsObject,
  uncombine: boolean,
  course: valueof<COURSES_ENUM>,
  role: keyof typeof ROLES_ENUM,
  questionnaireVersion: valueof<QUESTIONNAIRE_VERSIONS_ENUM>,
  questionnaireMode: string,
  owner: keyof typeof ROLES_ENUM,
  mixedAssets: Array<dynamicsObject>,
  files: Array<dynamicsObject>,
}

export default {
  state: {
    mixedAssets: [],
    questionnaire: {
      student: {},
      targets: [
        createTarget(ROLES_ENUM.STUDENT, 1),
      ],
      insuranceProduct: copyObject(insuranceProduct),
      comment: copyObject(comment()),
    },
    questionnaireStudent: {
      student: {},
      targets: [
        createTarget(ROLES_ENUM.STUDENT, 1),
      ],
      insuranceProduct: copyObject(insuranceProduct),
      comment: copyObject(comment()),
    },
    files: [],
    questionnaireStatus: false,
    instruments: [],
    course: COURSES_ENUM.ONE,
    role: ROLES_ENUM.STUDENT,
    questionnaireMode: "DEFAULT",
    questionnaireVersion: QUESTIONNAIRE_VERSIONS_ENUM.NEW,
    owner: ROLES_ENUM.STUDENT,
    uncombine: false,
    preview: {
      firstQuestionnaireInfo,
      secondQuestionnaireInfo,
      firstQuestionnaireRisks,
      secondQuestionnaireRisks,
      firstQuestionnaireColors,
      secondQuestionnaireColors,
    }
  },
  getters: {
    questionnaire: (state: State) => state.questionnaire,
    questionnaireStudent: (state: State) => state.questionnaireStudent,
    questionnaireStatus: (state: State) => state.questionnaireStatus,
    instruments: (state: State) => state.instruments,
    preview: (state: State) => state.preview,
    uncombine: (state: State) => state.uncombine,
    course: (state: State) => state.course,
    role: (state: State) => state.role,
    questionnaireVersion: (state: State) => state.questionnaireVersion,
    questionnaireMode: (state: State) => state.questionnaireMode,
    questionnaireOwner: (state: State) => state.owner,
    mixedAssets: (state: State) => state.mixedAssets,
  },
  mutations: {
    setCourse(state: State, course: valueof<COURSES_ENUM>) {
      state.course = course;
    },
    setUncombine(state: State) {
      state.uncombine = true;
    },
    dublicateInstrument(state: State, { indexSection, indexModule, target, dublicate, from, to, tactic }: { indexSection: number, indexModule: number, target: number, dublicate: string, from: Questionnaire.Portfolios, to: Questionnaire.Portfolios, tactic: string }) {
      const correctIndex = tactic ? 2 : 1;
      const portfolioDefaults = [
        { id: 'existing', default: existingPortfolioInstrument(state.course, 'core', state.role) },
        { id: 'student', default: studentPortfolioInstrument(state.course, 'core', state.role) },
        { id: 'expert', default: expertPortfolioInstrument(state.course, 'core', state.role) },
      ];
      const _default = portfolioDefaults.find(p => p.id === from);
      if (!_default) return;
      const currentDefault = copyObject(_default.default);
      const currentTarget = state.questionnaire.targets.find(t => t.id === target);
      if (!currentTarget) return;
      const currentData = copyObject(currentTarget.portfolios[to].sections[correctIndex].modules[indexModule].data);
      currentTarget.portfolios[from].sections[indexSection].modules = currentTarget.portfolios[from].sections[indexSection].modules.filter(m => m.data.name && m.data.price);
      
      currentDefault.data = {...currentDefault.data, ...currentData, dublicateFrom: to};
      currentDefault.data.comment = '';
      currentDefault.data.number_papers = '';
      currentDefault.data.percent = '';

      if (dublicate) {
        if (!currentDefault.data[`class_${state.course}_id`] || !currentDefault.data[`base_currency_${state.course}_id`] || !currentDefault.data[`currency_${state.course}_id`]) {
          currentTarget.portfolios[to].sections[correctIndex].modules[indexModule].data.dublicateExpert = false;
          store.commit("createNotification", {
            status: "error",
            message: `Актив ${currentDefault.data.name} не может быть дублирован, т.к он не заполнен!`,
          });
          return;
        }
        if (currentTarget.portfolios[from].sections[indexSection].modules.find(m => m.data.name.trim().toLowerCase() === currentDefault.data.name.trim().toLowerCase())) {
          currentTarget.portfolios[to].sections[correctIndex].modules[indexModule].data.dublicateExpert = false;
          store.commit("createNotification", {
            status: "error",
            message: `${currentDefault.data.name} уже есть в портфеле студента!`,
          });
          return;
        }
        currentTarget.portfolios[from].sections[indexSection].modules.splice(indexModule, 0, currentDefault);
      } else {
        const index = currentTarget.portfolios[from].sections[indexSection].modules.findIndex(m => m.data.name === currentData.name);
        currentTarget.portfolios[from].sections[indexSection].modules.splice(index, 1);
        if (currentTarget.portfolios[from].sections[indexSection].modules.length === 0) {
          const _default = portfolioDefaults.find(p => p.id === from);
          if (!_default) return;
          currentTarget.portfolios[from].sections[indexSection].modules = [copyObject(_default.default)];
        }
      }
    },
    dublicateStudentInstrument(state: State, { instrument, percent, targetId, type }: { instrument: dynamicsObject, percent: number, targetId: number, type: number }) {
      const target = state.questionnaire.targets.find(t => t.id === targetId);
      if (target) {
        const portfolio = target.portfolios.student;
        const sectionIndex = type ? 1 : 2;
        const percents = portfolio.sections[sectionIndex].modules.filter(m => m.data.name && m.data.price).map(m => m.data.percent).reduce((acc, percent) => Number(acc) + Number(percent), 0);
        const c_instrument = JSON.parse(JSON.stringify(instrument));
        const candidate = portfolio.sections[sectionIndex].modules.find(m => m.data.name.toLowerCase().trim() === c_instrument.name.toLowerCase().trim());
        if (candidate && instrument.dublicateStudent) {
          instrument.dublicateStudent = false;
          store.commit("createNotification", {
            status: "error",
            message: `${instrument.name} уже есть в портфеле студента!`,
          });
          return;
        }
        if (Number(percents) + percent > 100 && instrument.dublicateStudent) {
          instrument.dublicateStudent = false;
          store.commit("createNotification", {
            status: "error",
            message: `Дублировать ${instrument.name} в портфель студента нельзя, он занимает ${percent}% от портфеля!`,
          });
          return;
        }
        const checkMaxInstruments = () => {
          const rule = !type ? 'Тактика' : instrument[`class_${state.course}_id`] === 'alternative' ? 'Защита' : instrument[`instrument_type_${state.course}`];
          const rules = HELP_LIST.find(course => course.id === state.course)?.max;
          const currentRule = rules?.find(r => r.rules === rule);

          const getTotalRuleInstruments = (rule: string) => {
            const core = portfolio.sections[1].modules;
            const tactic = portfolio.sections[2].modules.filter(m => m.data.name && m.data.price);
            for (const module of core) {
              module.data.core = true;
            }
            const array = [...core, ...tactic];
            if (rule === 'Тактика') return tactic.length;
            if (rule === 'Защита') return array.filter((i) => i.data.core && i.data[`class_${state.course}_id`] === 'alternative').length;
            else return array.filter((i) => i.data.core && i.data[`instrument_type_${state.course}`] === rule).length; 
          };

          if (!currentRule) return { status: true, error: null };
          const total = getTotalRuleInstruments(currentRule.rules);
          if (currentRule.value <= total) {
            return { status: false, error: currentRule.error };
          }
          return { status: true, error: null };
        };

        const maxInstruments = checkMaxInstruments();
        if (!maxInstruments.status && instrument.dublicateStudent) {
          instrument.dublicateStudent = false;
          store.commit("createNotification", {
            status: "error",
            message: `В Вашем портфеле достигнуто максимальное количество ${maxInstruments.error}!`,
          });
          return false;
        }

        if (c_instrument.dublicateStudent) {
          c_instrument.percent = percent;
          portfolio.sections[sectionIndex].modules = [...portfolio.sections[sectionIndex].modules, { data: {...c_instrument, dublicateFrom: 'existing' }, inputs: [] }];
        } else {
          const index = portfolio.sections[sectionIndex].modules.findIndex(m => m.data.name.toLowerCase().trim() === c_instrument.name.toLowerCase().trim());
          portfolio.sections[sectionIndex].modules.splice(index, 1);
        }
      }
    },
    dublicateTableInstrument(state: State, { instrument, percent, targetId, type, portfolioId, from, all }: { instrument: dynamicsObject, percent: number, targetId: number, type: number, portfolioId: Questionnaire.Portfolios, from: string, all: boolean }) {
      const target = state.questionnaire.targets.find(t => t.id === targetId);
      if (target) {
        const portfolio = target.portfolios[portfolioId];
        const sectionIndex = type ? 1 : 2;
        const percents = portfolio.sections[sectionIndex].modules.filter(m => m.data.name && m.data.price).map(m => m.data.percent).reduce((acc, percent) => Number(acc) + Number(percent), 0);
        const c_instrument = JSON.parse(JSON.stringify(instrument));
        const candidate = portfolio.sections[sectionIndex].modules.find(m => m.data.name.toLowerCase().trim() === c_instrument.name.toLowerCase().trim());
        if (!portfolio.sections[0].modules[0].data.core) {
          instrument[portfolioId === 'expert' ? 'dublicateExpert' : 'dublicateStudent'] = false;
          store.commit("createNotification", {
            status: "error",
            message: `Для дублирования инструментов в портфель эксперта нужно указать распределение на ядро и тактику!`,
          });
          return;
        }
        if (candidate && instrument[portfolioId === 'expert' ? 'dublicateExpert' : 'dublicateStudent']) {
          if (all) return;
          instrument[portfolioId === 'expert' ? 'dublicateExpert' : 'dublicateStudent'] = false;
          store.commit("createNotification", {
            status: "error",
            message: `${instrument.name} уже есть в портфеле ${portfolioId === 'expert' ? 'эксперта' : 'студента'}!`,
          });
          return;
        }
        if (Number(percents) + percent > 100 && instrument[portfolioId === 'expert' ? 'dublicateExpert' : 'dublicateStudent']) {
          if (portfolioId === 'expert') {
            c_instrument.percent = '0';
            c_instrument.number_papers = 0;
            c_instrument.comment = '';
            c_instrument.commentInstrument = '';
            c_instrument.dublicateFrom = from.includes('existing') ? 'existing' : 'student';
            portfolio.sections[sectionIndex].modules = [...portfolio.sections[sectionIndex].modules, { data: c_instrument, inputs: [] }];
            return;
          }
          instrument['dublicateStudent'] = false;
          store.commit("createNotification", {
            status: "error",
            message: `Дублировать ${instrument.name} в портфель ${'студента'} нельзя, он занимает ${percent}% от портфеля!`,
          });
          return;
        }
        if (c_instrument[portfolioId === 'expert' ? 'dublicateExpert' : 'dublicateStudent']) {
          c_instrument.percent = percent;
          c_instrument.comment = '';
          c_instrument.commentInstrument = '';
          portfolio.sections[sectionIndex].modules = [...portfolio.sections[sectionIndex].modules, { data: {...c_instrument, dublicateFrom: from.includes('existing') ? 'existing' : 'student' }, inputs: [] }];
        } else {
          const index = portfolio.sections[sectionIndex].modules.findIndex(m => m.data.name.toLowerCase().trim() === c_instrument.name.toLowerCase().trim());
          if (index === -1) return;
          portfolio.sections[sectionIndex].modules.splice(index, 1);
        }
      }
    },
    setInstruments(state: State, instruments: Array<dynamicsObject>) {
      state.instruments = instruments;
    },
    clearQuestionnaire(state: State, { course, role = ROLES_ENUM.STUDENT, owner }: { course: valueof<COURSES_ENUM>, role: keyof typeof ROLES_ENUM, owner: keyof typeof ROLES_ENUM }) {
      const comments = store?.getters?.user?.comments;
      state.questionnaireMode = "DEFAULT";
      state.course = course;
      state.role = role;
      state.owner = owner || role;
      state.questionnaireStatus = false;
      state.questionnaireVersion = role === ROLES_ENUM.STUDENT ? QUESTIONNAIRE_VERSIONS_ENUM.NEW : QUESTIONNAIRE_VERSIONS_ENUM.OLD;
      state.questionnaire = {
        student: copyObject(student(course, role, owner || role, role)),
        targets: [
          createTarget(role, 1, 2, course, role, owner || role, comments),
        ],
        insuranceProduct: copyObject(insuranceProduct),
        comment: copyObject(comment(role, comments)),
      }
      state.questionnaireStudent = {
        student: copyObject(student(course, role, owner || role, ROLES_ENUM.STUDENT)),
        targets: [
          createTarget(ROLES_ENUM.STUDENT, 1, 2, course, role, owner || role),
        ],
        insuranceProduct: copyObject(insuranceProduct),
        comment: copyObject(comment(role, comments)),
      }
      getMixedAssets(state);
    },
    onQuestionnaireStatus(state: State, status: boolean) {
      state.questionnaireStatus = status;
    },
    sectionPortfolio(state: State, { targetId, portfolioId, status }: { targetId: number, portfolioId: Questionnaire.Portfolios, status: number }) {
      const target = state.questionnaire.targets.find(t => t.id === targetId);
      if (!target) return;
      target.status[portfolioId] = status;
    },
    changeTargetType(state: State, { id, data }: { id: number, data: dynamicsObject }) {
      const target = state.questionnaire.targets.find(t => t.id === id);
      if (!target) return;
      const correctType = data._id === 1 ? firstType : secondType;

      target.type.id = correctType.id;
      target.type.name = correctType.name;
      target.type.sections[0].name = correctType.section_name;
    },
    addTarget(state: State, role: keyof typeof ROLES_ENUM) {
      state.questionnaire.targets = [
        ...state.questionnaire.targets, createTarget(role, state.questionnaire.targets.length + 1, 2, COURSES_ENUM.ONE, state.role, state.owner)
      ];
      state.questionnaireStudent.targets = [
        ...state.questionnaireStudent.targets, createTarget(ROLES_ENUM.STUDENT, state.questionnaireStudent.targets.length + 1, 2, COURSES_ENUM.ONE, state.role, state.owner)
      ];
      setTimeout(() => {
        state.questionnaireStatus = false;
        setTimeout(() => {
          state.questionnaireStatus = true;
        }, 100)
      }, 100);
    },
    removeTarget(state: State, number: number) {
      state.questionnaire.targets.splice(number, 1);
    },
    combineTargets(state: State, targets: Array<number>) {
      state.uncombine = true;
      const expertTargets = state.questionnaire.targets.filter(t => !targets.includes(t.id));
      const newTarget = createTarget(ROLES_ENUM.EXPERT, 1, 2, COURSES_ENUM.ONE, ROLES_ENUM.EXPERT, ROLES_ENUM.EXPERT);
      collectionCombineTarget(ROLES_ENUM.EXPERT, targets, state.questionnaire.targets, newTarget, store.getters.currencies);

      if (expertTargets.length === 1) {
        expertTargets[0].id = 2;
        expertTargets[0].name = 'Цель 2';
      }
      state.questionnaire.targets = [newTarget, ...expertTargets];

      const studentTargets = state.questionnaireStudent.targets.filter(t => !targets.includes(t.id));
      const newTargetStudent = createTarget(ROLES_ENUM.STUDENT, 1, 2, COURSES_ENUM.ONE, ROLES_ENUM.STUDENT, ROLES_ENUM.STUDENT);
      collectionCombineTarget(ROLES_ENUM.STUDENT, targets, state.questionnaireStudent.targets, newTargetStudent, store.getters.currencies);

      if (studentTargets.length === 1) {
        studentTargets[0].id = 2;
        studentTargets[0].name = 'Цель 2';
      }
      state.questionnaireStudent.targets = [newTargetStudent, ...studentTargets];
    },
    addNewModule(state: State, { section, indexSection, targetId, element = {}, indexModule = -1 }: { section: dynamicsObject, indexSection: number, targetId: number, element: dynamicsObject, indexModule: number }) {
      const module = defaults(section.default, state.course, state.role, state.owner);
      if (element.name) {
        module.data = element;
        if (element.name && element.price) {
          section.modules = section.modules.filter((m: dynamicsObject) => m.data.name);
        }
      }
      if (indexModule >= 0) {
        section.modules.splice(indexModule + 1, 0, module);
      } else {
        section.modules = [...section.modules, module];
      }
      if (indexSection === 0) {
        const currentTarget = state.questionnaire.targets.find(t => t.id === targetId);
        if (!currentTarget) return;
        const currentFV = currentTarget.type.sections[3];
        currentFV.modules.push(defaults(currentFV.default, state.course));
      }
    },
    removeModule(state: State, { modules, indexModule, indexSection, targetId }: { modules: Array<dynamicsObject>, indexModule: number, indexSection: number, targetId: number }) {
      modules.splice(indexModule, 1);
      if (indexSection === 0) {
        const currentTarget = state.questionnaire.targets.find(t => t.id === targetId);
        if (!currentTarget) return;
        currentTarget.type.sections[3].modules.splice(indexModule, 1);
      }
    },
    addError(_state: State, { err, func }: { err: AxiosError, func: FunctionConstructor }) {
      let error = err;
      if (typeof error !== 'string') {
        error = err?.response ? err?.response.data : err?.message;
      }
      axios.post('/api/error', { err: error, func });
    },
    fillQuestionnaireData(state: State, { questionnaireData, course, role, pivot = false, first = false }: { questionnaireData: dynamicsObject, course: valueof<COURSES_ENUM>, role: keyof typeof ROLES_ENUM, pivot: boolean, first: boolean }) {
      if (role === ROLES_ENUM.OWNER) role = ROLES_ENUM.EXPERT;
      state.uncombine = !!questionnaireData.content_COMBINE_EXPERT;
      const currentContent = 'content_' + role;
      state.course = course;
      state.role = role;
      state.owner = questionnaireData.owner;
      state.questionnaireVersion = questionnaireData.version;
      state.files = questionnaireData.files;
      if (questionnaireData.owner === ROLES_ENUM.STUDENT && role !== ROLES_ENUM.STUDENT) {
        state.questionnaireMode = "GAP";
        collectQuestionnaire(ROLES_ENUM.STUDENT, state.questionnaireStudent, questionnaireData.content_STUDENT, course, ROLES_ENUM.STUDENT, state.owner, state.files);
      } else {
        collectQuestionnaire(ROLES_ENUM.STUDENT, state.questionnaireStudent, questionnaireData[currentContent], course, role, state.owner, state.files);
      }
      collectQuestionnaire(role, state.questionnaire, pivot ? questionnaireData.content_STUDENT : questionnaireData[currentContent], course, role, state.owner, state.files);
      getMixedAssets(state);
    }
  },
}

function getMixedAssets(state: State) {
  axios
    .get('/api/asset/list')
    .then(res => {
      state.mixedAssets = res.data;
    })
}

function collectQuestionnaire(view: keyof typeof ROLES_ENUM, questionnaire: any, content: any, course: valueof<COURSES_ENUM>, role: keyof typeof ROLES_ENUM, owner: keyof typeof ROLES_ENUM, files: Array<dynamicsObject>) {
  getCorrectCourseModules(view, questionnaire, course, role, owner);
  questionnaire.targets = [];
  const portfoliosKey = Object.typedKeys(content);
  for (const key of portfoliosKey) {
    if (Object.hasOwnProperty.call(content, key)) {
      const module = content[key];
      const correct_module = questionnaire[key];   
      if (Array.isArray(correct_module)) {
        const keys = ['type', 'conclusion'];
        module.data.forEach((target: dynamicsObject, indexTarget: number) => {
          correct_module[indexTarget] = createTarget(view, indexTarget + 1, target.type.id, course, role, owner);
          Object.keys(target.status).forEach(key => {
            correct_module[indexTarget].status[key] = target.status[key];
          });
          correct_module[indexTarget].main.data = target.main.data;
          keys.forEach(key => {
            target[key].sections.forEach((section: dynamicsObject, indexSection: number) => {
              const defaultModule = defaults(section.default, course, role, owner);
              correct_module[indexTarget][key].sections[indexSection].modules = [];
              section.modules.forEach((module: dynamicsObject) => {
                correct_module[indexTarget][key].sections[indexSection].modules 
                  = [...correct_module[indexTarget][key].sections[indexSection].modules, { ...copyObject(defaultModule), ...{data: module.data} }];
              });
            });
          });
          Object.keys(target.portfolios).forEach(key => {
            target.portfolios[key].sections.forEach((section: dynamicsObject, indexSection: number) => {
              const defaultModule = defaults(section.default, course, role, owner);
              correct_module[indexTarget].portfolios[key].sections[indexSection].optional = section.optional;
              correct_module[indexTarget].portfolios[key].sections[indexSection].selected = section.selected;
              correct_module[indexTarget].portfolios[key].sections[indexSection].modules = [];
              section.modules.forEach((module: dynamicsObject) => {
                correct_module[indexTarget].portfolios[key].sections[indexSection].modules 
                  = [...correct_module[indexTarget].portfolios[key].sections[indexSection].modules, { ...copyObject(defaultModule), ...{data: module.data} }];
              });
              if (indexSection === 2 && section.default.includes('tactic')) {
                correct_module[indexTarget].portfolios[key].sections[indexSection].files = fillingFiles(files, key, target.id);
              }
            });
          });
        })
      } else {
        correct_module.module.data = module.data.module.data;
      }
    }
  }
}

function fillingFiles(files: Array<dynamicsObject>, key: string, targetId: number) {
  return files.filter(f => f.meta.includes(`${targetId}-${key}`));
}