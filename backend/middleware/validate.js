const ApiError = require('../utils/ApiError');

/**
 * Factory that returns an Express middleware validating req.body
 * against the given Joi schema.
 */
const validate = (schema) => (req, _res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const message = error.details.map((d) => d.message).join(', ');
    return next(ApiError.badRequest(message));
  }

  req.body = value; // use sanitized value
  next();
};

module.exports = validate;
