'use strict';

const joi = require('joi');

const SignInRequestSchema = joi.object({
  email_address: joi.string().email().required(),
  password: joi.string().required()
});

const GetUserLimitSchema = joi.number().integer().min(1).max(50).default(50).optional();

const GetUserPageSchema = joi.number().integer().min(0).default(0).optional();

const SignUpRequestSchema = joi.object({
  email_address: joi.string().email().required(),
  first_name: joi.string().required(),
  last_name: joi.string().required(),
  mobile: joi.number().required(),
  date_of_birth: joi.string().required(),
  password: joi.string().required(),
  city: joi.string().required(),
  state: joi.string().required(),
  country: joi.string().required(),
  pin_code: joi.number().required()
});

module.exports = {
  SignUpRequestSchema,
  SignInRequestSchema,
  GetUserPageSchema,
  GetUserLimitSchema
};