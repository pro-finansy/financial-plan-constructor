import { Request } from "express";
import { ObjectId } from "mongoose";

import { dynamicsObject } from "@/interfaces";
import investmentModel from "../../investment/investment.model";

import { COURSES, QUESTIONNAIRE_STATUSES } from "../../../utils/enums";
import { Questionnaire } from "../dto/questionnaire.dto";

function fillInstrument(questionnareInstruments: Array<dynamicsObject>, instruments: Array<dynamicsObject>, expert: ObjectId) {
  const keys = [`class_one`, `class_one_id`, `country_one`, `country_one_id`, `currency_one`, `currency_one_id`, `base_currency_one`, `base_currency_one_id`, `instrument_type_one`, `instrument_type_one_id`, `section_one`, `section_one_id`];
  for (const instrument of questionnareInstruments) {
    const findInstrument = instruments.find((i: dynamicsObject) => i.name.trim() === instrument.data.name.trim());
    if (findInstrument) {
      for (const key of keys) instrument.data[key] = findInstrument[key];
      const comment = findInstrument.comments.find((c: dynamicsObject) => String(c._id) === String(expert));
      if (comment) instrument.data.comment = comment.comment;
    }
  }
}

export async function fillExpertContent(studentContent: dynamicsObject, data: dynamicsObject) {
  const instruments = await investmentModel.find().lean();
  studentContent.targets.data.forEach((target: dynamicsObject) => {
    for (const portfolioId in target.portfolios) {
      const portfolio = target.portfolios[portfolioId];
      if (portfolioId === 'expert') break;
      if (portfolioId === 'existing') {
        if ((portfolio.sections[1].modules.find((m: dynamicsObject) => m.data.name) || portfolio.sections[2].modules.find((m: dynamicsObject) => m.data.name)))
          target.status.existing = 1;
        else 
          target.status.existing = -1;
      }
      if (data.course.type === COURSES.ONE) {
        fillInstrument(portfolio.sections[1].modules, instruments, data.expert._id);
        fillInstrument(portfolio.sections[2].modules, instruments, data.expert._id);
      }
    }
  });
  data.content_EXPERT = studentContent;
  data.markModified('content_EXPERT');
};

export function editContents(req: Request, data: Questionnaire.Dto, email: string) {
  req.body.content_STUDENT.student.data.module.data.email = email;
  req.body.content_STUDENT.targets.data.forEach((target: dynamicsObject) => {
    target.status.expert = 1;
    target.status.student = 1;
    if (target.portfolios.existing.sections[1].modules.find((m: dynamicsObject) => m.data.name) || target.portfolios.existing.sections[2].modules.find((m: dynamicsObject) => m.data.name)) {
      target.status.existing = 1;
    } else {
      target.status.existing = -1;
    }
    for (const key in target.portfolios) {
      const portfolio = target.portfolios[key];
      if (key === 'expert') break;
      portfolio.sections[1].modules.forEach((m: dynamicsObject) => {
        let lot = m.data.lot && data.course.type === COURSES.TWO ? m.data.lot : 1
        m.data.formula = Number((m.data.number_papers * m.data.price * lot).toFixed(2));
      });
      portfolio.sections[2].modules.forEach((m: dynamicsObject) => {
        let lot = m.data.lot && data.course.type === COURSES.TWO ? m.data.lot : 1
        m.data.formula = Number((m.data.number_papers * m.data.price * lot).toFixed(2));
      });
      const tacticSection = portfolio.sections.find((s: dynamicsObject) => s.default.includes('tactic'));
      if (tacticSection && tacticSection.modules.find((m: dynamicsObject) => m.data.name && m.data.price)) {
        tacticSection.selected = true;
      }
    }
  });
  data.content_STUDENT = req.body.content_STUDENT;
  data.seconds = 0;
  data.updatedAt = Date.now();
  data.status = QUESTIONNAIRE_STATUSES.NOTVERIFIED;
  data.markModified("content_STUDENT");
};

export default { editContents, fillExpertContent }