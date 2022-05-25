import { typesInsurance } from '../common/index';

const insuranceProduct = {
  data: {
    view: '',
    view_id: '',
    name: '',
    amount: '',
    company: '',
  },
  inputs: [
    { show: true, id: 'view', name: 'Вид страхования', placeholder: 'Выберите вид страхования', type: 'text', drop: true, showDrop: false, drop_data: typesInsurance, error: false, required: false },
    { show: true, id: 'name', name: 'Наименование страхования', placeholder: 'Введите наименование страхования', type: 'text', drop: false, error: false, required: false },
    { show: true, id: 'amount', name: 'Стоимость программы', placeholder: 'Введите стоимость программы', type: 'text', drop: false, error: false, required: false },
    { show: true, id: 'company', name: 'Страховая компания', placeholder: 'Введите страховую компанию', type: 'text', drop: false, error: false, required: false },
  ]
};

export default {
  id: 'insuranceProduct',
  name: 'Страховые продукты',
  module: insuranceProduct
};