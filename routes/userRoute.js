const express = require("express");
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  toggleUserActive,
  getUserStats,
  changeUserPassword,
} = require("../services/userService");
const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changePasswordValidator,
} = require("../utils/validator/userValidator");

const router = express.Router();

// User statistics (must be before /:id route)
router.get("/stats", getUserStats);

// CRUD operations
router.route("/").get(getAllUsers).post(createUserValidator, createUser);

router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

// Additional user operations
router.put(
  "/:id/toggle-active",
  getUserValidator,
  toggleUserActive
);

router.put(
  "/:id/password",
  changePasswordValidator,
  changeUserPassword
);

module.exports = router;

