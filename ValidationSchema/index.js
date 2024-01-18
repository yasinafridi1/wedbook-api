const Joi = require("joi");

export const productSchema = Joi.object({
  productName: Joi.string().required(),
  categoryId: Joi.string().required(),
  price: Joi.number().required(),
  description: Joi.string().required(),
  userId: Joi.string().required(),
});
