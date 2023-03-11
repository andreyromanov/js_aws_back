import * as Joi from "joi";

export const validateObject = (input: object) => {
    const schema = Joi.object().keys({
      title: Joi.string().required(),
      description: Joi.string().required(),
      price: Joi.number().required(),
      count: Joi.number().required(),
    });
  return schema.validate(input);
};