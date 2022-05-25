import dateFilter from "@/filters/date.filter";

const inputs = [
  { id: 'expert', placeholder: 'Выберите эксперта', type: 'drop', drop: true, showDrop: false, drop_data: [], error: false, required: true },
  { id: 'date', placeholder: 'Дата начала работы', type: 'text', drop: false, error: false, mask: '##.##.#### ##:##', required: true },
];

const data = {
  expert: '',
  expert_id: '',
  date: dateFilter(new Date(), 'datetime')
}

export default {
  id: 'expert',
  name: 'Эксперт',
  module: {
    data,
    inputs
  }
};