const Joi = require("joi");
const Category = require("../../Models/CategoryModel");
const {
  ErrorMessages,
  SuccessMessages,
} = require("../../utils/ResponseMessages");

function categoryController() {
  return {
    // all Categories
    index: async (req, res) => {
      try {
        const categoryData = await Category.find({ isDeleted: false });
        if (!categoryData.length) {
          return SuccessMessages(res, "No Category found");
        }
        return SuccessMessages(res, categoryData);
      } catch (error) {
        return ErrorMessages(res);
      }
    },
    addCategory: async (req, res) => {
      const CategorySchema = Joi.object({
        categoryName: Joi.string().required(),
      });
      try {
        const { error } = CategorySchema.validate(req.body);
        if (error) {
          return ErrorMessages(res, 422, error.message);
        }

        const isExist = await Category.exists({
          categoryName: req.body.categoryName,
        });
        if (isExist) {
          return ErrorMessages(res, 409, "Category already exists");
        }

        const newCategory = new Category({
          categoryName: req.body.categoryName,
        });

        const result = await newCategory.save();
        if (!result) {
          return ErrorMessages(res);
        }
        return SuccessMessages(res, result);
      } catch (error) {
        return ErrorMessages(res);
      }
    },
    updateCategory: async (req, res) => {
      const CategorySchema = Joi.object({
        categoryName: Joi.string().required(),
      });
      try {
        const { error } = CategorySchema.validate(req.body);
        if (error) {
          return ErrorMessages(res, 422, error.message);
        }

        const categoryData = await Category.findById(req.param.id);
        if (!categoryData) {
          return ErrorMessages(res, 404, "Category not found");
        }

        const isExist = await Category.exists({
          categoryName: req.body.categoryName,
        });
        if (isExist) {
          return ErrorMessages(res, 409, "Category already exists");
        }

        const updatedCategory = await Category.findByIdAndUpdate(
          req.params.id,
          { categoryName: req.body.categoryName },
          { new: true }
        );
        return SuccessMessages(res, updatedCategory);
      } catch (error) {
        return ErrorMessages(res);
      }
    },
    deleteCategory: async (req, res) => {
      try {
        const categoryData = await Category.findById(req.params.id);
        if (!categoryData) {
          return ErrorMessages(res, 404, "Category not found");
        }
        const deletedCategory = await Category.findByIdAndUpdate(
          req.params.id,
          { isDeleted: true },
          { new: true }
        );
        return SuccessMessages(res, "Category deleted successfully");
      } catch (error) {
        return ErrorMessages(res);
      }
    },
  };
}

module.exports = categoryController;
