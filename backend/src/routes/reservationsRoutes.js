const express = require("express");
const router = express.Router();
const reservationsController = require("../controllers/reservationsController");
const { authMiddleware } = require("../middleware/auth");

// Public endpoints (Used by guests reserving a table and checking status)
router.post("/", reservationsController.createReservation);
router.get("/lookup", reservationsController.lookupReservation);

// Admin-only endpoints (Used by restaurant manager / Maitre D')
router.get("/stats", authMiddleware, reservationsController.getReservationStats);
router.get("/", authMiddleware, reservationsController.getAllReservations);
router.get("/:id", authMiddleware, reservationsController.getReservationById);
router.put("/:id", authMiddleware, reservationsController.updateReservation);
router.patch("/:id", authMiddleware, reservationsController.updateReservation);
router.delete("/:id", authMiddleware, reservationsController.deleteReservation);

module.exports = router;
