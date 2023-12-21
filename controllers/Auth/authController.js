const Joi = require("joi");
const {
  ErrorMessages,
  SuccessMessages,
} = require("../../utils/ResponseMessages");
const User = require("../../Models/User");
const bcrypt = require("bcrypt");
const JwtService = require("../../services/JwtServices");
const DTOS = require("../../services/DTOS");

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
        lastName: Joi.string().required(),
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
        const isEmailExist = await User.exists({ email });
        if (isEmailExist) {
          return ErrorMessages(res, 409, "Email already exists");
        }
        const isPhoneExist = await User.exists({ phone });
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
    login: async (req, res) => {
      //   // validate the req
      const loginSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      });
      const { error } = loginSchema.validate(req.body);
      if (error) {
        return ErrorMessages(res, 422, error.message);
      }

      try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
          return ErrorMessages(res, 422, "Email or password incorrect");
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
          return ErrorMessages(res, 422, "Email or password incorrect");
        }

        const token = await JwtService.removeRefreshToken(user._id);
        const { accessToken, refreshToken } = JwtService.generateToken({
          _id: user._id,
          role: user.role,
        });

        const { result } = await JwtService.storeRefreshToken(
          refreshToken,
          user._id
        );

        if (!result) {
          return ErrorMessages(res);
        }

        res.cookie("refreshtoken", refreshToken, {
          maxAge: 1000 * 60 * 60 * 24, // 1 day
          httpOnly: true,
        });

        res.cookie("accesstoken", accessToken, {
          maxAge: 1000 * 60 * 60, // 1 hour
          httpOnly: true,
        });

        const userdata = DTOS.userDto(user);
        return SuccessMessages(res, userdata);
      } catch (error) {
        return ErrorMessages(res);
      }
    },
    logout: async (req, res) => {
      try {
        const token = await JwtService.removeRefreshToken(req.user._id);
        res.clearCookie("accesstoken");
        res.clearCookie("refreshtoken");
        return SuccessMessages(res, "Logout Successfully");
      } catch (err) {
        return ErrorMessages(res);
      }
    },
  };
}

module.exports = authController;
