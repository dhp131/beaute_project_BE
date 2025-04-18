const mongoose = require("mongoose");
const User = require("../models/user.model");
const Order = require("../models/order.model");
const SkinType = require("../models/skinType.model");
const Product = require("../models/product.model");

module.exports = {
  getOrderByDate: async (startDate, endDate) => {
    try {
      // Chuyển đổi ngày bắt đầu và ngày kết thúc sang kiểu Date
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Đảm bảo endDate lấy đến hết ngày (23:59:59)
      end.setHours(23, 59, 59, 999);

      // Truy vấn đơn hàng trong khoảng thời gian
      const orders = await Order.find({
        orderDate: { $gte: start, $lte: end },
      })
        .populate("products.productId", "name quantity") // Lấy thêm thông tin sản phẩm
        .sort({ orderDate: -1 }); // Sắp xếp theo thời gian mới nhất
      return {
        status: 200,
        ok: true,
        message: "Lấy danh sách đơn hàng thành công",
        data: orders,
      };
    } catch (error) {
      throw {
        status: error.status || 500,
        ok: false,
        message: error.message || "Lỗi hệ thống",
      };
    }
  },

  getOrderByDateAndStatus: async (startDate, endDate, status = null) => {
    try {
      // Chuyển đổi ngày bắt đầu và ngày kết thúc sang kiểu Date
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Đảm bảo endDate lấy đến hết ngày (23:59:59)
      end.setHours(23, 59, 59, 999);

      // Truy vấn đơn hàng trong khoảng thời gian
      const orders = await Order.find({
        orderDate: { $gte: start, $lte: end },
        status,
      })
        .populate("products.productId", "name quantity") // Lấy thêm thông tin sản phẩm
        .sort({ orderDate: -1 }); // Sắp xếp theo thời gian mới nhất
      return {
        status: 200,
        ok: true,
        message: "Lấy danh sách đơn hàng thành công",
        data: orders,
      };
    } catch (error) {
      throw {
        status: error.status || 500,
        ok: false,
        message: error.message || "Lỗi hệ thống",
      };
    }
  },

  getAccountByRoleByDate: async (startDate, endDate, role) => {
    try {
      if (!role) {
        throw {
          status: 400,
          message: "Thiếu thông tin vai trò (role)",
        };
      }

      const validRoles = ["customer", "staff", "manager"];
      if (!validRoles.includes(role)) {
        throw {
          status: 400,
          message: "Vai trò không hợp lệ",
        };
      }

      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      const users = await User.find({
        createdAt: { $gte: start, $lte: end },
        role: { $in: [role] }, // role là một mảng nên cần dùng $in
      }).sort({ createdAt: -1 }); // Sắp xếp theo thời gian tạo

      const usersQuantity = users.length;

      return {
        status: 200,
        ok: true,
        message: "Lấy danh sách người dùng thành công",
        quantity: usersQuantity,
        data: users,
      };
    } catch (error) {
      return {
        status: error.status || 500,
        ok: false,
        message: error.message || "Lỗi hệ thống",
      };
    }
  },

  getCustomerDoneQuiz: async (startDate, endDate) => {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      const users = await User.find({
        createdAt: { $gte: start, $lte: end },
        role: "customer",
        skinType: { $ne: null },
      }).sort({ createdAt: -1 });

      const usersQuantity = users.length;

      return {
        status: 200,
        ok: true,
        message: "Lấy danh sách người dùng thành công",
        quantity: usersQuantity,
        data: users,
      };
    } catch (error) {
      return {
        status: error.status || 500,
        ok: false,
        message: error.message || "Lỗi hệ thống",
      };
    }
  },
};
