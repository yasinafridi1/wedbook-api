const Category = require("../../Models/CategoryModel");
const Product = require("../../Models/ProductModel");
const User = require("../../Models/User");
const { productSchema } = require("../../ValidationSchema");
const {
  ErrorMessages,
  SuccessMessages,
} = require("../../utils/ResponseMessages");

function productController() {
  return {
    // all products
    index: async (req, res) => {
      try {
        const productData = await Product.find({ isDeleted: false });
        if (!productData.length) {
          return SuccessMessages(res, "No product found");
        }
        return SuccessMessages(res, productData);
      } catch (error) {
        return ErrorMessages(res);
      }
    },
    singleProduct: async (req, res) => {
      try {
        const productData = await Product.findById(req.param.id);
        if (!productData) {
          return ErrorMessages(res, 404, "Product not found");
        }
        return SuccessMessages(res, productData);
      } catch (error) {
        return ErrorMessages(res);
      }
    },
    deleteProduct: async (req, res) => {
      try {
        const productData = await Product.findById(req.param.id);
        if (!productData) {
          return ErrorMessages(res, 404, "Product not found");
        }
        // productData.isDeleted=true;
        // const result = productData.save();

        const deletedProduct = await Product.findByIdAndUpdate(
          req.param.id,
          { isDeleted: true },
          { new: true }
        );
        return SuccessMessages(res, "Product deleted successfully");
      } catch (error) {
        return ErrorMessages(res);
      }
    },
    addProduct: async (req, res) => {
      try {
        const { error } = productSchema.validate(req.body);
        if (error) {
          return ErrorMessages(res, 422, error.message);
        }

        const userData = await User.findById(req.body.userId);
        if (!userData) {
          return ErrorMessages(res, 404, "Invalid user id");
        }

        const categoryData = await Category.findById(req.body.categoryId);
        if (!categoryData) {
          return ErrorMessages(res, 404, "Invalid category id");
        }

        const { userId, categoryId, productName, description, price } =
          req.body;
        const newProduct = new Product({
          userId,
          categoryId,
          productName,
          description,
          price,
        });

        const result = await newProduct.save();
        if (!result) {
          return ErrorMessages(res);
        }

        return SuccessMessages(res, result);
      } catch (error) {
        return ErrorMessages(res);
      }
    },
    updateProduct: async (req, res) => {
      try {
        const { error } = productSchema.validate(req.body);
        if (error) {
          return ErrorMessages(res, 422, error.message);
        }

        const productData = await Product.findById(req.params.id);
        if (!productData) {
          return ErrorMessages(res, 404, "Product not found");
        }

        if (productData.userId !== req.user._id) {
          return ErrorMessages(res, 422, "Invalid user");
        }

        const categoryData = await Category.findById(req.body.categoryId);
        if (!categoryData) {
          return ErrorMessages(res, 404, "Invalid category id");
        }

        const { categoryId, productName, description, price } = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(
          req.params.id,
          {
            categoryId: categoryId,
            productName: productName,
            description: description,
            price: price,
          },
          { new: true }
        );
        return SuccessMessages(res, updatedProduct);
      } catch (error) {
        return ErrorMessages(res);
      }
    },
  };
}

module.exports = productController;
