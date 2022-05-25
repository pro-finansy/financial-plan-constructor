export default (module: any) => {
  return JSON.parse(JSON.stringify(module));
};