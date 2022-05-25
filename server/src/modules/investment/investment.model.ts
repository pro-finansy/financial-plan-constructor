import { model, Schema } from "mongoose";

const investments = new Schema({
  title: { type: String, default: '' },
  name: { type: String, required: true },

  lot: { type: Number, default: 1 },

  instrument_type_one: { type: String, default: '' },
  instrument_type_two: { type: String, default: '' },
  section_one: { type: String, default: '' },
  section_two: { type: String, default: '' },

  purchase_price: { type: String, default: '0' },
  formula: { type: String, default: '0' },
  price: { type: Number, required: false },
  number_papers: { type: Number, required: false },

  currency: { type: String, required: false },
  currency_one: { type: String, required: false },
  currency_two: { type: String, required: false },
  
  currency_id: { type: String, required: false },
  currency_one_id: { type: String, required: false },
  currency_two_id: { type: String, required: false },

  class: { type: String, required: false },
  class_one: { type: String, required: false },
  class_two: { type: String, required: false },

  class_id: { type: String, required: false },
  class_one_id: { type: String, required: false },
  class_two_id: { type: String, required: false },

  country: { type: String, required: false },
  country_one: { type: String, required: false },
  country_two: { type: String, required: false },

  country_id: { type: String, required: false },
  country_one_id: { type: String, required: false },
  country_two_id: { type: String, required: false },

  base_currency: { type: String, required: false },
  base_currency_one: { type: String, required: false },
  base_currency_two: { type: String, required: false },

  base_currency_id: { type: String, required: false },
  base_currency_one_id: { type: String, required: false },
  base_currency_two_id: { type: String, required: false },

  blocked: { type: Boolean, default: false },
  matdate: { type: String, default: '' },
  entryPoint: { type: String, default: '' },
  exitPoint: { type: String, default: '' },
  comments: { type: Array, default: [] },
  expert: { type: Schema.Types.ObjectId, ref: 'users' },
});

export default model("investments", investments);
