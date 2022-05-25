export default (n: string | number, width: number = 2) => {
  n = n + "";
  return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
};