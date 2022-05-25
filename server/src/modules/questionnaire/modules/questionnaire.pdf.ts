import { default as axios } from 'axios';
import pdf, { CreateOptions as PDFOptions } from "html-pdf";
import { Request, Response } from 'express';
import ejs from "ejs";
import fs from "fs";

import { Mixed } from "@/modules/mixedAssets/dto/mixed.dto";
import { Questionnaire } from "../dto/questionnaire.dto";

import { createQuestionnaireFile } from '../questionnaire.controller';

import { response } from '../../../utils/response';
import { COURSES, STATUSES } from "../../../utils/enums";
import transformData, { getCorrectInstrumentComment } from "../templates/modules/transformData";
import { parseLinks, secondQuestionnaireInfo, firstQuestionnaireInfo, base64_encode } from "../templates/modules/common";
import correctDescription from '../templates/modules/correctEnd';

import constants from "../questionnaire.constants";

export async function collectionDataPDF (questionnaire: Questionnaire.Dto) {

}

export async function createQuestionnairePDF (req: Request, res: Response, questionnaire: Questionnaire.Dto, assets: Array<Mixed.Dto>, collection: boolean, onresponse: boolean, onepage: boolean) {
  const options: PDFOptions = {
    format: "A4",
    orientation: "portrait",
    renderDelay: 2000,
    height: '802px',
    border: {
      top: '20px',
      bottom: '20px'
    }
  };

  const combine = !!questionnaire.content_COMBINE_EXPERT;
  const course = questionnaire.course.type;
  const targets = transformData(questionnaire.content_EXPERT, course, assets);
  const student = questionnaire.content_EXPERT.student.data.module.data;
  const comment = getCorrectInstrumentComment(questionnaire.content_EXPERT.comment.data.module.data.comment);
  const expert = questionnaire.expert;
  const days = correctDescription({ term: expert.dayLength, duration_id: 'DAYS' });
  const info = course === COURSES.ONE ? firstQuestionnaireInfo : secondQuestionnaireInfo;
  const header = base64_encode(constants.SRC_HEADER);

  const data = { days, targets, student, comment, expert, onepage, course, combine, info, header,
    avatar: expert.avatar ? base64_encode(__dirname + "/../../../../public/" + expert.avatar.src) : "",
  };

  try {
    const html = await ejs.renderFile(constants.SRC_QUESTIONNAIRE_TEMPLATE(course), data);
    if (onepage) {
      const result = await axios
        .post(`http://${process.env.LIVE_IP}:5555/pdf`, { html, filename: 'pdfcreate' }, { responseType: 'arraybuffer' });
      fs.writeFileSync(constants.SRC_QUESTIONNAIRE_OUTPUT_ONEPAGE(questionnaire._id), result.data, 'binary');
      
      const email = questionnaire.student ? questionnaire.student.email : questionnaire.content_EXPERT.student.data.module.data.email;
      response(res, STATUSES.OK, true, constants.COLLECTED_SUCCESS_ONEPAGE, { src: `/upload/files/${questionnaire._id}_onepage.pdf`, name: `${email || 'Отчет'}.pdf` });
    } else {
      pdf.create(html, options).toFile(
        constants.SRC_QUESTIONNAIRE_OUTPUT(questionnaire._id),
        async (err: Error) => {
          if (err) return console.log(err);
          if (collection) {
            res.locals.questionnaire = questionnaire;
            res.locals.fileData = { src: `/upload/files/${questionnaire._id}.pdf`, name: `${questionnaire._id}.pdf` };
            await createQuestionnaireFile(req, res);
            if (!onresponse) return;
            return response(res, STATUSES.OK, true, constants.COLLECTED_SUCCESS);
          } else {
            const email = questionnaire.student ? questionnaire.student.email : questionnaire.content_EXPERT.student.data.module.data.email;
            return response(res, STATUSES.OK, true, constants.COLLECTED_SUCCESS, { src: `/upload/files/${questionnaire._id}.pdf`, name: `${email || 'Отчет'}.pdf` });
          }
        }
      )
    }
  } catch (err) {
    response(res, STATUSES.CONFLICT, false, 'При генерации PDF-файла произошла ошибка');
  }
}

export default { createQuestionnairePDF };