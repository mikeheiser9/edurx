import Joi from "joi";
import { returnAppropriateError } from "../../util/commonFunctions.js";

// Validator for adding a new resource
const addResourceValidator = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().required().min(2),
    link: Joi.string().uri().required().min(2),
    publisher: Joi.string().required().min(2),
    isResource: Joi.string().required().valid("news", "resource"),
    tags: Joi.array().items(Joi.string()),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  next();
};

// Validator for userId and resourceId
const validateIds = (req, res, next) => {
  const schema = Joi.object({
    userId: Joi.string().required(),
    resourceId: Joi.string().required(),
  });

  const { error } = schema.validate(req.params);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  next();
};

const addCategoryFilterValidator = async (req, res, next) => {
  try {

    const objectSchema = Joi.object({
      label: Joi.string(),
      value: Joi.string()
    });

    const schema = Joi.object({
      name: Joi.string().required().min(2),
      type: Joi.string().required().valid("category", "filter"),
      forumType: Joi.array().required().min(1).items(objectSchema),
    });

    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    returnAppropriateError(res, error);
  }
};
export { addResourceValidator, validateIds , addCategoryFilterValidator };
