const express = require("express");
const router = express.Router();
const itemsController = require("../controllers/itemsController");
const { authMiddleware } = require("../middleware/auth");

// Public endpoints (Viewable on public portal & menu pages)
router.get("/", itemsController.getAllItems);
router.get("/categories", itemsController.getCategories);
router.get("/:id", itemsController.getItemById);

// Protected executive endpoints (Admin only)
router.post("/", authMiddleware, itemsController.createMenuItem);
router.put("/:id", authMiddleware, itemsController.updateMenuItem);
router.delete("/:id", authMiddleware, itemsController.deleteMenuItem);
router.post("/reset", authMiddleware, itemsController.resetMenuItems);

module.exports = router;
