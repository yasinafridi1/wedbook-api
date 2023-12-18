const Joi = require("joi");
const {
  ErrorMessages,
  SuccessMessages,
} = require("../../utils/ResponseMessages");
const User = require("../../Models/User");
const bcrypt = require("bcrypt");

function authController() {
  return {
    register: async (req, res) => {
      const {
        firstName,
        lastName,
        email,
        phone,
        password,
        role,
        town,
        city,
        province,
      } = req.body;
      const registerSchema = Joi.object({
        firstName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required().min(8).max(15).messages({
          "string.min": "Password must be minimum 8 character required",
          "string.max": "Password must be upto 15 characters ",
        }),
        confirmPassword: Joi.ref("password"),
        role: Joi.string().required(),
        town: Joi.string().required(),
        city: Joi.string().required(),
        province: Joi.string().required(),
        phone: Joi.string()
          .trim()
          .regex(/^((0)?)(3)([0-9]{9})$/)
          .required(),
      });

      try {
        const { error } = registerSchema.validate(req.body);
        if (error) {
          return ErrorMessages(res, 422, error.message);
        }
        const isEmailExist = await User.exists(email);
        if (isEmailExist) {
          return ErrorMessages(res, 409, "Email already exists");
        }
        const isPhoneExist = await User.exists(phone);
        if (isPhoneExist) {
          return ErrorMessages(res, 409, "Phone number already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const createUser = new User({
          firstName,
          lastName,
          email,
          phone,
          password: hashedPassword,
          role,
          town,
          city,
          province,
        });

        const result = await createUser.save();
        if (!result) {
          return ErrorMessages(res);
        }
        return SuccessMessages(res);
      } catch (error) {
        return ErrorMessages(res);
      }
    },
    login: (req, res) => {},
  };
}

module.exports = authController;
