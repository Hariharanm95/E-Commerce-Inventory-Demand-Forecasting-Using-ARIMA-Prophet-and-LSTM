const express = require("express");
const router = express.Router();
const {
  updateUser,
  getAllUsers,
  deleteUser,
  updatePassword,
  getMe,
} = require("../controllers/user");
const {
  verifyToken,
  verifyTokenAndAdmin,
} = require("../middleware/verifyToken");

router.get("/", verifyTokenAndAdmin, getAllUsers);
router.get("/me", verifyToken, getMe);
router.patch("/:id", verifyToken, updatePassword);
router.delete("/:id", verifyTokenAndAdmin, deleteUser);
router.patch("/update", verifyToken, updateUser);

module.exports = router;
