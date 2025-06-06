const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getSingleProduct,
  searchProducts,
  uploadImage,
} = require("../controllers/product");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middleware/verifyToken");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Store files in the 'uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// ADMIN ROUTES
router.post("/", verifyTokenAndAdmin, createProduct);
router.post(
  "/upload",
  verifyTokenAndAdmin,
  upload.single("image"),
  uploadImage
);
router.delete("/:id", verifyTokenAndAdmin, deleteProduct);
router.patch("/:id", verifyTokenAndAdmin, updateProduct);

// PUBLIC ROUTES
router.get("/", getAllProducts);
router.get("/search", searchProducts);
router.get("/:id", getSingleProduct);

module.exports = router;
