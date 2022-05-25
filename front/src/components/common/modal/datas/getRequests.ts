import { dynamicsObject } from '@/interfaces';
import { ACCESSES } from '@/store/commonDatas';

export default (modal: dynamicsObject, options: dynamicsObject, datas: dynamicsObject, API: dynamicsObject) => {
  const isAccessesRequest = (modal.content.request === '/api/expert' || modal.content.action !== 'remove') && modal.content.request;
  const isExpertRequest = modal.content.id === 'students-expert' || modal.content.id === 'students-add' || modal.content.id === 'students-edit' || modal.content.id === 'expert-remove';
  const isExpertChangeRequest = modal.content.id.includes('students-expert-change');
  const isCourseRequest = modal.content.id === 'questionaire-select-course' || modal.content.id === 'students-add' || modal.content.id === 'students-edit' || modal.content.id === 'stream-course-add';
  const isCurrencyRequest = modal.content.id === 'currency-add' || modal.content.id === 'currency-edit';

  if (isAccessesRequest) getAccesses(modal, options, datas);
  if (isExpertRequest) getExperts(API, modal, options, datas);
  if (isExpertChangeRequest) getExpertsChange(API, modal, options, datas);
  if (isCourseRequest) getCourses(API, modal);
  if (isCurrencyRequest) getConvert(API, modal, datas);
};

async function getConvert(API: dynamicsObject, modal: dynamicsObject, datas: dynamicsObject) {
  const result = await API.common.getConvert();
  const data = Object.keys(result.data.list).map(e => ({ _id: e, name: e }));
  
  const input = modal.inputs.inputs.find((i: dynamicsObject) => i.id === 'code');
  if (input) input.drop_data = data;
  datas.codes = data;
}

function getAccesses(modal: dynamicsObject, options: dynamicsObject, datas: dynamicsObject) {
  const array = ACCESSES.slice();
  array.forEach(el => {
    el.selected = !!(options.data && options.data.accesses && options.data.accesses.find((a: string) => a === el._id));
  });
  const input = modal.inputs.inputs.find((i: dynamicsObject) => i.id === 'accesses');
  if (input) input.drop_data = array;
  datas.accesses = array;
  next(modal, 'accesses', array);
}

async function getExperts(API: dynamicsObject, modal: dynamicsObject, _options: dynamicsObject, datas: dynamicsObject) {
  const result = await API.user.getExpertList();
  const input = modal.inputs.inputs.find((i: dynamicsObject) => i.id === 'expert');
  if (input) input.drop_data = result.data;
  datas.experts = result.data;
}

async function getExpertsChange(API: dynamicsObject, modal: dynamicsObject, _options: dynamicsObject, datas: dynamicsObject) {
  const result = await API.user.getExpertList();
  const input = modal.inputs.inputs.find((i: dynamicsObject) => i.id === 'expert');
  const input2 = modal.inputs.inputs.find((i: dynamicsObject) => i.id === 'change_expert');
  if (input) input.drop_data = result.data;
  if (input2) input2.drop_data = result.data;
  datas.experts = result.data;
}

async function getCourses(API: dynamicsObject, modal: dynamicsObject) {
  const result = await API.common.getCourseList();
  const input = modal.inputs.inputs.find((i: dynamicsObject) => i.id === 'course');
  if (input) input.drop_data = result.data;
}

function next(modal: dynamicsObject, variable: string, array: Array<dynamicsObject>) {
  const a = array.filter(el => el.selected);
  modal.inputs.data[variable] = a.map(el => el.name);
  modal.inputs.data[variable + '_id'] = a.map(el => el._id);
}