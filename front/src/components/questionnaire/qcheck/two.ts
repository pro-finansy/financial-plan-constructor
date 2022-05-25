import { dynamicsObject } from '@/interfaces';
import { Questionnaire } from '@/interfaces/dto/questionnaire';
import store from '@/store';

function createNotification(message: string) {
  store.commit("createNotification", {
    status: "error",
    message: message,
  });
}

function _fieldError(self: any, input: dynamicsObject, message: string) {
  input.error = true;
  self.correctSection = 'target';
  createNotification(message);
  setTimeout(() => {
    const field = self.jq(`[data-id="targets"] .error`);
    const field_offset = Math.abs(field.offset()?.top || 200);
    self.jq("html, body").stop().animate({ scrollTop: field_offset - 200 }, 0);
  }, 100);
}

function _main(self: any, main: Questionnaire.QSectionModules) {
  for (const input of main.inputs) {
    if (input.required && !main.data[input.id] && main.data[input.id] !== 0) {
      _fieldError(self, input, `Заполните поле "${input.name || input.placeholder}"`);
      return false;
    }
    if (input.required && input.drop && !input.uncheck && !main.data[input.id + '_id']) {
      _fieldError(self, input, `Вам необходимо выбрать вариант из списка в поле "${input.name}"!`);
      return false;
    }
    input.error = false;
  }
  return true;
}

function _portfolio(self: any, sections: Array<Questionnaire.QSection>) {
  const categories = sections.filter((section) => section.default.includes('portfolio-instrument-'));
  const arr = categories.map(c => c.modules).reduce((acc, arr) => acc.concat(arr));
  const percents = Math.ceil10(arr.filter(m => m.data.price && m.data.name).map(m => m.data).reduce((acc, m) => acc + Number(m.percent), 0), -2);
  if (percents < 90) {
    createNotification(`Вы не полностью заполнили портфель эксперта. Заполнено ${percents}%. Пожалуйста, добавьте активы.`);
    self.correctSection = 'expert';
    self.jq("html, body").stop().animate({ scrollTop: 0 }, 0);
    return false;
  }
  const instruments = arr.filter(m => m.data.price && m.data.name).map(m => m.data);
  for (const instrument of instruments) {
    if (Number(instrument.percent) === 0 && Number(instrument.number_papers) === 0) {
      createNotification(`У Вас есть "нулевой" инструмент в портфеле эксперта!`);
      self.correctSection = 'expert';
      self.jq("html, body").stop().animate({ scrollTop: 0 }, 0);
      return false;
    }
  }
  return true;
}

function _section(self: any, sections: Array<Questionnaire.QSection>) {
  for (const section of sections) {
    for (const module of section.modules) {
      for (const input of module.inputs) {
        if (input.required && !module.data[input.id] && module.data[input.id] !== 0) {
          _fieldError(self, input, `Заполните поле "${input.name || input.placeholder}"`);
          return false;
        }
        if (input.required && input.drop && !input.uncheck && !module.data[input.id + '_id']) {
          _fieldError(self, input, `Вам необходимо выбрать вариант из списка в поле "${input.name}"!`);
          return false;
        }
        input.error = false;
      }
    }
  }
  return true;
}

const checkTwoCourse = (self: any) => {
  for (const target of self.questionnaire.targets) {
    const sections = ['type', 'conclusion'];
    if (!_main(self, target.main)) return false;
    for (const section of sections) {
      if (!_section(self, target[section].sections)) return false;
    }
    if (!_portfolio(self, target.portfolios.expert.sections)) return false;
  }
  return true;
}

export { checkTwoCourse };