import { dynamicsObject } from "@/interfaces";

export default (term: dynamicsObject) => {
  const terms = [
    { id: 'MONTH', desc: ['месяцев', 'месяц', 'месяца'] },
    { id: 'YEAR', desc: ['лет', 'год', 'года'] },
    { id: 'DAYS', desc: ['дней', 'день', 'дня'] },
  ]
  const correct = terms.find(t => t.id === term.duration_id);
  if (!correct) return '';
  return getDescription(term.term, correct.desc);
};

function getDescription(currVal: number, objDesc: string[]) {
  if (currVal <= 10 || currVal >= 20) {
    if (currVal % 10 === 1) return objDesc[1];
    else if ((currVal % 10 >= 2) && (currVal % 10 <= 4)) return objDesc[2];
  }
  return objDesc[0];
}