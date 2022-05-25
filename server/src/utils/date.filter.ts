import zero from './zero.filter';

export default (value: Date | string | number, filter: string = 'date') => {
  const date = new Date(value);
  const result = [];
  if (filter.includes('date')) {
    result.push(`${zero(date.getDate())}.${zero(date.getMonth() + 1)}.${date.getFullYear()}`);
  }
  if (filter.includes('time')) {
    result.push(`${zero(date.getHours())}:${zero(date.getMinutes())}`);
  }
  return result.join(' ');
};