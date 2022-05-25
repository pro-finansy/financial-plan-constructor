import { ObjectId } from "mongoose";

export default {
  STUDENT_NOT_FOUND: 'Студент не найден на платформе!',
  FILE_NOT_FOUND: 'Файл не найден!',
  MAX_FILES: 'Вы можете загрузить не более 5 файлов!',
  NOT_FOUND: 'Анкета не найдена!',
  NOT_EDIT: 'Анкета находится в стадии проверки экспертом, редактирование невозможно!',
  ALREADY_UPLOAD: 'Вы уже загрузили работу, повторная сдача невозможна!',
  COLLECTED_SUCCESS_ONEPAGE: 'Одностраничная анкета успешно собрана!',
  COLLECTED_SUCCESS: 'Анкета успешно собрана!',
  SENDED_SUCCESS: 'Анкета успешно отправлена!',
  REMOVE_QUESTIONNAIRE_IMPOSSIBLE: 'Анкету невозможно удалить, она уже проверяется экспертом!',
  SRC_VERIFIED: __dirname + '/templates/templates/verified.html',
  TITLE_VERIFIED: 'Ваша работа проверена!',
  SRC_HEADER: __dirname + "/templates/templates/one/assets/header.png",
  EDIT_ERROR_LENGTH: 'Ваши данные для сохранения не актуальны! Обновите страницу и повторите попытку!',
  SRC_QUESTIONNAIRE_TEMPLATE: (course: string) => __dirname + "/templates/templates/" + course + "/index.ejs",
  SRC_QUESTIONNAIRE_OUTPUT: (_id: ObjectId) => __dirname + `/../../../public/upload/files/${_id}.pdf`,
  SRC_QUESTIONNAIRE_OUTPUT_ONEPAGE: (_id: ObjectId) => __dirname + `/../../../public/upload/files/${_id}_onepage.pdf`,
}