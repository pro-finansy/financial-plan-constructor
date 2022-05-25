import { dynamicsObject } from "@/interfaces";

export default (data: dynamicsObject, inputs: Array<dynamicsObject>) => {
  for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
      const input = inputs.find((i) => i.id === key);
      if (!input) continue;
      if (input.drop && !data[key + '_id'] && input.required && !input.uncheck) {
        input.error = true;
        return { status: false, input, showMessage: true };
      } 
      if ((!data[key] || data[key].length === 0) && input.required) {
        input.error = true;
        return { status: false, input };
      } else {
        input.error = false;
      }
    }
  }
  return { status: true };
};