import { dynamicsObject, valueof } from '@/interfaces';
import { Questionnaire } from '@/interfaces/dto/questionnaire';
import { COURSES_ENUM } from '@/utils/enums';
import { currency, getCurrencyTwo } from '../modules/container/table/modules/container/calculation';

function recalculationQuantity(questionnaire: Questionnaire.Content, course: valueof<COURSES_ENUM>) {
  questionnaire.targets.forEach(target => {
    const targetTotal = currency(target.type.sections[2].modules[0].data.amount, target.type.sections[2].modules[0].data.currency_id, target.main.data.currency_id);
    const targetCurrencyId = target.main.data.currency_id;
    const portfolio = target.portfolios.student;
    const sections = [1, 2];
    for (const section of sections) {
      for (const m of portfolio.sections[section].modules) {
        if (m.data.percent === 0 && m.data.number_papers) continue;
        const totalInstrument = getCurrencyTwo(m.data, targetCurrencyId, course);
        const number_papers = Math.floor((targetTotal * (+m.data.percent / 100)) / totalInstrument);
        if (!isNaN(number_papers)) {
          const total = totalInstrument * number_papers;
          const percent = Math.ceil10((total / targetTotal) * 100, -2);
          m.data.number_papers = number_papers;
          m.data.percent = percent;
        }
      }
    }
  });
};

function createNotification(self: any, input: dynamicsObject, text: string, _module: dynamicsObject, key: string, targetId = '', portfolioId = '', indexSection: number | string = '', indexModule: number | string = '', targetSection: number | string = '') {
  console.log(`[data-id="${key}"] ${targetId ? `[data-id="target-${targetId}"]` : ''} ${portfolioId ? `[data-id="${portfolioId}"]` : ''} ${targetSection ? `.target--${targetSection}` : ''} ${indexSection ? `[data-id="section-${indexSection}"]` : ''} ${indexModule ? `[data-id="module-${indexModule}"]` : ''} [data-id="${input.id}"]`);
  if (targetId) {
    self.correctSection = portfolioId || 'target';
    self.questionnaire.targets.forEach((t: dynamicsObject) => t.selected = false);
    self.questionnaire.targets.find((t: dynamicsObject) => t.id === targetId).selected = true;
  }
  setTimeout(() => {
    input.error = true;
    const element = self.jq(`[data-id="${key}"] ${targetId ? `[data-id="target-${targetId}"]` : ''} ${portfolioId ? `[data-id="${portfolioId}"]` : ''} ${targetSection ? `.target--${targetSection}` : ''} ${indexSection ? `[data-id="section-${indexSection}"]` : ''} ${indexModule ? `[data-id="module-${indexModule}"]` : ''} [data-id="${input.id}"]`);
    const element_offset = Math.abs(
      element.offset()?.top || 160
    );
    self.jq("html, body").stop().animate({ scrollTop: element_offset - 160 }, 0);
    self.jq(".questionnaire").stop().animate({ scrollTop: element_offset - 160 }, 0);
    self.$store.commit("createNotification", {
      status: "error",
      message: text,
    });
  }, 200);
};

function checkFields(self: any) {
  const moduleCheck = (module: dynamicsObject, key: string, targetId = '', portfolioId = '', indexSection: number | string = '', indexModule: number | string = '', targetSection: number | string = '') => {
    for (const input of module.inputs) {
      if ((!module.data[input.id] && module.data[input.id] !== 0 && input.required)) {
        createNotification(self, input, `Заполните поле "${input.name || input.placeholder}"`, module, key, targetId, portfolioId, indexSection, indexModule, targetSection);
        return false;
      } else if ((!module.data[input.id + '_id'] && input.drop && input.required && !input.uncheck)) {
        createNotification(self, input, `Вам необходимо выбрать вариант из списка в поле "${input.name}"!`, module, key, targetId, portfolioId, indexSection, indexModule, targetSection);
        return false;
      } else {
        input.error = false;
      }
    }
    return true;
  }
  for (const key in self.questionnaire) {
    if (Object.hasOwnProperty.call(self.questionnaire, key)) {
      const element = self.questionnaire[key];
      if (Array.isArray(element)) {
        for (const target of element) {
          const ids = ['type', 'conclusion'];
          if (!moduleCheck(target.main, key, target.id)) return false;
          for (const id of ids) {
            for (let indexSection = 0; indexSection < target[id].sections.length; indexSection++) {
              const section = target[id].sections[indexSection];
              if (!section.show) continue;
              for (let indexModule = 0; indexModule < section.modules.length; indexModule++) {
                const module = section.modules[indexModule];
                if (!moduleCheck(module, key, target.id, '', indexSection, indexModule, id)) return false;
              }
            }
          }
          if (target.status.existing === 0) {
            const offset = self.jq('.questionnaire--container').height() + self.jq(`[data-id="${key}"] [data-id="target-${target.id}"] [data-id="existing"]`).offset().top - window.innerHeight;
            self.jq(".questionnaire").stop().animate({ scrollTop: offset }, 500);
            self.$store.commit("createNotification", {
              status: "error",
              message: 'Необходимо выбрать наличие существующего профиля! Есть или нет',
            });
            return false;
          }
          for (const keyP in target.portfolios) {
            if (Object.hasOwnProperty.call(target.portfolios, keyP)) {
              const portfolio = target.portfolios[keyP];
              if (portfolio.id === 'existingPortfolio' && target.status.existing !== 1) continue;
              if (portfolio.id === 'studentPortfolio' && target.status.student !== 1) continue;
              if (portfolio.id === 'expertPortfolio' && target.status.expert !== 1) continue;
              for (let indexSection = 0; indexSection < portfolio.sections.length; indexSection++) {
                const section = portfolio.sections[indexSection];
                if (!section.show) continue;
                if (section.optional && !section.selected) continue;
                for (let indexModule = 0; indexModule < section.modules.length; indexModule++) {
                  const module = section.modules[indexModule];
                  if (!moduleCheck(module, key, target.id, keyP, indexSection, indexModule)) return false;
                }
              }
            }
          }
        }
      } else {
        if (!moduleCheck(element.module, key)) return false;
      }
    }
  }
  return true;
};

function createStudentNotification(self: any, input: dynamicsObject, text: string, _module: dynamicsObject, key: string, targetId = '', portfolioId = '', indexSection: number | string = '', indexModule: number | string = '', targetSection: number | string = '') {
  self.mode = 'list';
  if (targetId) {
    self.questionnaire.targets.forEach((t: dynamicsObject) => t.selected = false);
    self.questionnaire.targets.find((t: dynamicsObject) => t.id === targetId).selected = true;
  }
  console.log(`[data-id="${key}"] ${targetId ? `[data-id="target-${targetId}"]` : ''} ${portfolioId ? `[data-id="${portfolioId}"]` : ''} ${targetSection ? `.target--${targetSection}` : ''} ${indexSection ? `[data-id="section-${indexSection}"]` : ''} ${indexModule ? `[data-id="module-${indexModule}"]` : ''} [data-id="${input.id}"]`);
  setTimeout(() => {
    input.error = true;
    const element = self.jq(`[data-id="${key}"] ${targetId ? `[data-id="target-${targetId}"]` : ''} ${portfolioId ? `[data-id="${portfolioId}"]` : ''} ${targetSection ? `.target--${targetSection}` : ''} ${indexSection ? `[data-id="section-${indexSection}"]` : ''} ${indexModule ? `[data-id="module-${indexModule}"]` : ''} [data-id="${input.id}"]`);
    const element_offset = Math.abs(
      element.offset()?.top || 160
    );
    self.jq("html, body").stop().animate({ scrollTop: element_offset - 160 }, 0);
    self.jq(".questionnaire").stop().animate({ scrollTop: element_offset - 160 }, 0);
    self.$store.commit("createNotification", {
      status: "error",
      message: text,
    });
  }, 200);
};

function checkStudentNullInstruments(sections: Array<Questionnaire.QSection>) {
  const indexes = [1, 2];
  for (const index of indexes) {
    for (const module of sections[index].modules) {
      if (Number(module.data.percent) === 0 && Number(module.data.number_papers) === 0 && module.data.name && module.data.price) {
        return false;
      }
    }
  }
  return true;
}

function checkStudentFields(self: any) {
  const moduleCheck = (module: dynamicsObject, key: string, targetId = '', portfolioId = '', indexSection: number | string = '', indexModule: number | string = '', targetSection: number | string = '') => {
    for (const input of module.inputs) {
      if (!module.data[input.id] && module.data[input.id] !== 0 && input.required) {
        createStudentNotification(self, input, `Заполните поле "${input.name || input.placeholder}"`, module, key, targetId, portfolioId, indexSection, indexModule, targetSection);
        return false;
      } else if ((!module.data[input.id + '_id'] && input.drop && input.required && !input.uncheck)) {
        createStudentNotification(self, input, `Вам необходимо выбрать вариант из списка в поле "${input.name}"!`, module, key, targetId, portfolioId, indexSection, indexModule, targetSection);
        return false;
      } else {
        input.error = false;
      }
    }
    return true;
  }
  for (const key in self.questionnaire) {
    if (Object.hasOwnProperty.call(self.questionnaire, key)) {
      const element = self.questionnaire[key];
      if (Array.isArray(element)) {
        for (const target of element) {
          const ids = ['type', 'conclusion'];
          if (!moduleCheck(target.main, key, target.id)) return false;
          for (const id of ids) {
            for (let indexSection = 0; indexSection < target[id].sections.length; indexSection++) {
              const section = target[id].sections[indexSection];
              if (!section.show) continue;
              for (let indexModule = 0; indexModule < section.modules.length; indexModule++) {
                const module = section.modules[indexModule];
                if (!moduleCheck(module, key, target.id, '', indexSection, indexModule, id)) return false;
              }
            }
          }

          const modules = target.portfolios.student.sections[1].modules.filter((m: dynamicsObject) => m.data.name && m.data.price);
          if (modules.length === 0) {
            const message = (self.course === COURSES_ENUM.ONE) ?
              `Вы не добавили инструменты в Цель №${target.id}. Мы не можем проверить пустой портфель. Пожалуйста, добавьте активы или удалите Цель.` :
              `Вы не добавили инструменты в Цель. Мы не можем проверить пустой портфель. Пожалуйста, добавьте активы или проверьте сумму вашей цели.`;
            self.$store.commit("createNotification", {
              status: "error",
              message: message,
              timeout: 8000
            });
            self.emitter.emit('changeTarget', target.id);
            return false;
          }

          const categories = target.portfolios.student.sections.filter((section: dynamicsObject) => section.default.includes('portfolio-instrument-'));
          const array = Number(([].concat(...categories.map((c: dynamicsObject) => c.modules)).map((m: dynamicsObject) => m.data).reduce((acc, m) => acc + Number(m.percent), 0)).toFixed(2));
          if (array < 90) {
            const message = (self.course === COURSES_ENUM.ONE) ?
              `Вы не полностью заполнили портфель на всю сумму в Цели №${target.id}. Заполнено ${array}%. Пожалуйста, добавьте активы или удалите Цель.` :
              `Вы не полностью заполнили портфель на всю сумму цели. Заполнено ${array}%. Пожалуйста, добавьте активы или проверьте сумму вашей цели.`;
            self.$store.commit("createNotification", {
              status: "error",
              message: message,
              timeout: 8000
            });
            self.emitter.emit('changeTarget', target.id);
            return false;
          }
        }
      } else {
        if (!moduleCheck(element.module, key)) return false;
      }
    }
  }
  return true;
};

export { recalculationQuantity, checkFields, checkStudentFields, checkStudentNullInstruments };