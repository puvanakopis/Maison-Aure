const Reservation = require("../models/ReservationModel");

// POST /api/reservations (Public - User creates a reservation)
async function createReservation(req, res) {
  try {
    const { customerName, email, phone, date, time, guests, notes, totalEstimated } = req.body;

    if (!customerName || !email || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: customerName, email, date, and time are required.",
      });
    }

    const guestCount = Number(guests) || 2;
    if (guestCount < 1 || guestCount > 20) {
      return res.status(400).json({
        success: false,
        message: "Guest count must be between 1 and 20 guests.",
      });
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const customId = `ORD-${randomSuffix}`;

    const newReservation = await Reservation.create({
      customId,
      customerName: customerName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : "",
      date,
      time,
      guests: guestCount,
      notes: notes || "Online guest booking via public reservation portal",
      totalEstimated: totalEstimated !== undefined ? Number(totalEstimated) : guestCount * 85,
      status: "Pending",
    });

    return res.status(201).json({
      success: true,
      message: `Table held! Your reservation reference is ${newReservation.customId}.`,
      data: newReservation,
    });
  } catch (error) {
    console.error("Error creating reservation in MongoDB:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process reservation request.",
    });
  }
}

// GET /api/reservations/lookup (Public - User checks their reservation status)
async function lookupReservation(req, res) {
  try {
    const { id, email } = req.query;

    if (!id && !email) {
      return res.status(400).json({
        success: false,
        message: "Please provide either a reservation reference code (id) or an email address.",
      });
    }

    const query = {};
    if (id) {
      query.customId = { $regex: `^${id.trim()}$`, $options: "i" };
    } else if (email) {
      query.email = email.trim().toLowerCase();
    }

    const matches = await Reservation.find(query);

    if (matches.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No active reservation found for the provided information.",
      });
    }

    return res.status(200).json({
      success: true,
      data: matches,
    });
  } catch (error) {
    console.error("Error looking up reservation:", error);
    return res.status(500).json({
      success: false,
      message: "Error looking up reservation.",
    });
  }
}

// GET /api/reservations or /api/orders (Admin protected)
async function getAllReservations(req, res) {
  try {
    const { status, search, date } = req.query;

    const query = {};
    if (status && status !== "All") query.status = status;
    if (date) query.date = date;
    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { customId: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { notes: { $regex: search, $options: "i" } },
        { tableNumber: { $regex: search, $options: "i" } },
      ];
    }

    const reservations = await Reservation.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations,
    });
  } catch (error) {
    console.error("Error fetching reservations from MongoDB:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve reservations.",
    });
  }
}

// GET /api/reservations/stats (Admin protected)
async function getReservationStats(req, res) {
  try {
    const reservations = await Reservation.find({});
    const today = new Date().toISOString().split("T")[0];

    const stats = {
      total: reservations.length,
      pending: reservations.filter((r) => r.status === "Pending").length,
      confirmed: reservations.filter((r) => r.status === "Confirmed").length,
      completed: reservations.filter((r) => r.status === "Completed").length,
      cancelled: reservations.filter((r) => r.status === "Cancelled").length,
      todayCount: reservations.filter((r) => r.date === today).length,
      todayGuests: reservations
        .filter((r) => r.date === today && r.status !== "Cancelled")
        .reduce((sum, r) => sum + (r.guests || 0), 0),
      totalEstimatedRevenue: reservations
        .filter((r) => r.status !== "Cancelled")
        .reduce((sum, r) => sum + (r.totalEstimated || 0), 0),
    };

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error generating stats:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate reservation statistics.",
    });
  }
}

// GET /api/reservations/:id (Admin protected)
async function getReservationById(req, res) {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findOne({ customId: id });

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: `Reservation '${id}' not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch reservation.",
    });
  }
}

// PUT /api/reservations/:id or PATCH /api/reservations/:id (Admin protected)
async function updateReservation(req, res) {
  try {
    const { id } = req.params;
    const updated = await Reservation.findOneAndUpdate(
      { customId: id },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: `Reservation '${id}' not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Reservation ${id} updated in MongoDB.`,
      data: updated,
    });
  } catch (error) {
    console.error("Error updating reservation in MongoDB:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update reservation.",
    });
  }
}

// DELETE /api/reservations/:id (Admin protected)
async function deleteReservation(req, res) {
  try {
    const { id } = req.params;
    const deleted = await Reservation.findOneAndDelete({ customId: id });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: `Reservation '${id}' not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Reservation ${id} deleted from MongoDB.`,
      id,
    });
  } catch (error) {
    console.error("Error deleting reservation from MongoDB:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete reservation.",
    });
  }
}

module.exports = {
  createReservation,
  lookupReservation,
  getAllReservations,
  getReservationStats,
  getReservationById,
  updateReservation,
  deleteReservation,
};
