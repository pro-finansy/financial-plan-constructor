import { ACCESSES, COURSE_ELEMENT_STATUS, QUESTIONNAIRE_STATUS } from '../store/commonDatas';
import { QUESTIONNAIRE_STATUSES_ENUM, ROLES_ENUM, ACCESSES_ENUM, COURSE_ELEMENT_STATUSES_ENUM } from './enums';
import { dynamicsObject } from '@/interfaces';

import dateFilter from '../filters/date.filter';
import zero from "../filters/zero.filter";


function getCourseStatusName(status: keyof typeof COURSE_ELEMENT_STATUSES_ENUM) {
  return COURSE_ELEMENT_STATUS.find(s => s._id === status)?.name;
}

export default (element: any, variable: string, row: dynamicsObject, table_id: string) => {
  // console.log(element, variable, row, table_id);

  if (element === null) {
    if (variable === 'expert' && row.prevExpert) {
      return `<div class="col"><span class="error">${row.prevExpert}</span></div>`
    }
    return `<div class="col"></div>`;
  }

  if (variable === 'avatar') {
    return `<div class="col">
      <img src="${element.src}" loading="lazy"  alt=""/>
    </div>`;
  }

  if (variable === 'accesses') {
    const array = element.map((access: keyof typeof ACCESSES_ENUM) => ACCESSES.find(a => a._id === access)?.name).join(', ');
    const isAllCourses = element.join(' - ') === 'HOMEWORK - INVESTMENT' ? 'Доступ ко всем курсам' : '';
    const isAllAccesses = element.join(' - ') === 'HOMEWORK - INVESTMENT - EXPERT' ? 'Доступ ко всем курсам и экспертам' : '';
    return `<div class="col">${isAllCourses || isAllAccesses || array}</div>`;
  }

  if (Array.isArray(element)) {
    return `<div class="col">${element.join(', ')}</div>`;
  }

  if (variable === 'status' && table_id === 'questionnaire_student') {
    const status = QUESTIONNAIRE_STATUS.find(status => status._id === element)?.name;
    return `<div class="col">${status === 'Проверено' ? 'Проверяется' : status}</div>`;
  }

  if (variable === 'status' && table_id.includes('questionnaire')) {
    const status = QUESTIONNAIRE_STATUS.find(status => status._id === element)?.name;
    return `<div class="col">${status}</div>`;
  }

  if (variable === 'status' && table_id === 'students') {
    return `<div class="col">${getCourseStatusName(element)}</div>`;
  }

  if (variable === 'streamDate' && table_id === 'students') {
    return `<div class="col"><span class="link">${row.streamDate || row.course.streamDate}</span></div>`;
  }
  if (variable === 'expert' && table_id === 'students') {
    return `<div class="col"><span class="link">${element.name}</span></div>`;
  }

  if (variable === 'streamDate') {
    return `<div class="col">${row.streamDate || row.course.streamDate}</div>`;
  }

  if (variable === 'course' || variable === 'expert') {
    return `<div class="col">${element.name}</div>`;
  }

  if (variable === 'preview' && row.owner === ROLES_ENUM.STUDENT) {
    return `<div class="col">
      ${`<a href="/questionnaire/${row._id}/pivot">Предпросмотр</a>`}
    </div>`;
  }

  if (variable === 'preview') {
    return `<div class="col"></div>`
  }

  if (variable === 'report') {
    return `<div class="col">
      ${row.status === QUESTIONNAIRE_STATUSES_ENUM.ready || row.status === QUESTIONNAIRE_STATUSES_ENUM.VERIFIED || row.status === QUESTIONNAIRE_STATUSES_ENUM.SENDED ? `<a href="/preview/${row._id}" target="_blank">Предпросмотр</a>` : ''}
    </div>`;
  }

  if (variable === 'fileStudent') {
    return `<div class="col">
      <label class="uploadFile">
        <input type="file" name="fileStudent">
        <span>${!element ? 'Загрузить' : 'Изменить'} файл</span>
      </label>
    </div>`;
  }

  if (variable === 'filePortfolio') {
    return `<div class="col">
      ${row.fileStudent ? `<span class="link">Скачать</span>` : 'Не сформирован'}
    </div>`;
  }

  if (variable === 'fileExpert' && (table_id === 'questionnaire_student')) {
    return `<div class="col">
      ${row.fileExpert && row.status === QUESTIONNAIRE_STATUSES_ENUM.SENDED ? `<span class="link">Скачать</span>` : 'Не сформирован'}
    </div>`;
  }

  if (variable === 'file' && table_id === 'students') {
    return `<div class="col">
      ${row.fileStudent ? `<span class="link">Скачать</span>` : 'Не загружен'}
    </div>`;
  }

  if (variable === 'fileExpert' && (table_id === 'students')) {
    return `<div class="col">
      ${element && row.questionnaire?.status === QUESTIONNAIRE_STATUSES_ENUM.SENDED ? `<span class="link">Скачать отчёт</span>` : 'Не собран'}
    </div>`;
  }

  if (variable === 'qqsentedAt') {
    return `<div class="col">${row.sentedAt ? dateFilter(row.sentedAt, 'datetime') : ''}</div>`;
  }

  if (variable === 'qqcompletedAt') {
    return `<div class="col">${row.completedAt ? dateFilter(row.completedAt, 'datetime') : ''}</div>`;
  }

  if (variable === 'qqstatus') {
    const status = QUESTIONNAIRE_STATUS.find(status => status._id === row.questionnaire?.status);
    return `<div class="col">${status?.name || ''}</div>`;
  }

  if (variable === 'targetName') {
    const targets = row.content_STUDENT?.targets;
    return `<div class="col">${targets ? targets.data[0].main.data.name : ''}</div>`
  }

  if (variable === 'targetLength') {
    return `<div class="col">${row.targets || 0}</div>`;
  }

  if (variable === 'seconds') {
    const seconds = zero(element % 60);
    const minutes = zero(Math.floor(element / 60));
    return `<div class="col">${minutes}:${seconds}</div>`;
  }

  if (variable === 'studentData') {
    return `<div class="col">
      <div>${row.student && row.student.name ? row.student.name : ''}</div>
      <div>${row.studentEmail || row.student?.email || row.content_EXPERT?.student.data.module.data.email || ''}</div>
    </div>`
  }
  
  if (variable === 'studentEmail') {
    return `<div class="col">${row.studentEmail || row.student?.email || row.content_EXPERT?.student.data.module.data.email || ''}</div>`;
  }

  if (variable === 'date' || variable === 'completedAt' || variable === 'createdAt' || variable === 'sentedAt' || variable === 'updatedAt') {
    return `<div class="col">${element ? dateFilter(element, 'datetime') : ''}</div>`;
  }

  if (variable === 'active' && (table_id === 'expert' || table_id === 'support')) {
    return `<div class="col">
      <input type="checkbox" id="${row._id}" ${element ? 'checked' : ''}>
      <label for="${row._id}"></label>
    </div>`;
  }

  return `<div class="col">${element}</div>`;
};