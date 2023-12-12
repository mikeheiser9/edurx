import Joi from 'joi';

// Validator for adding a new resource
const addResourceValidator = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    link: Joi.string().uri().required(),
    publisher: Joi.string().required(),
    isResource: Joi.boolean().required(),
    tags: Joi.array().items(Joi.string())
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
    resourceId: Joi.string().required()
  });

  const { error } = schema.validate(req.params);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  next();
};

export { addResourceValidator, validateIds }; 
