const Reservation = require("../models/ReservationModel");
const OtpVerification = require("../models/OtpModel");
const emailService = require("../services/emailService");

// 1. POST /api/reservations/request-otp (Public - Guest requests verification code for table booking)
async function requestReservationOtp(req, res) {
  try {
    const { customerName, email, phone, date, time, guests, notes, totalEstimated } = req.body;

    if (!customerName || !email || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: Name, email, date, and time are required.",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    const guestCount = Number(guests) || 2;
    if (guestCount < 1 || guestCount > 20) {
      return res.status(400).json({
        success: false,
        message: "Guest count must be between 1 and 20 guests.",
      });
    }

    // Generate 6-digit OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresInMinutes = 10;
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);

    const cleanEmail = email.trim().toLowerCase();

    // Store or update pending verification in MongoDB
    await OtpVerification.findOneAndUpdate(
      { email: cleanEmail },
      {
        otp,
        reservationData: {
          customerName: customerName.trim(),
          email: cleanEmail,
          phone: phone ? phone.trim() : "",
          date,
          time,
          guests: guestCount,
          notes: notes ? notes.trim() : "Online guest booking via public reservation portal",
          totalEstimated: totalEstimated !== undefined ? Number(totalEstimated) : guestCount * 85,
        },
        expiresAt,
      },
      { upsert: true, new: true }
    );

    // Send OTP email
    await emailService.sendReservationOtpEmail({
      to: cleanEmail,
      name: customerName.trim(),
      otp,
      expiresInMinutes,
    });

    return res.status(200).json({
      success: true,
      message: `A 6-digit verification code has been dispatched to ${cleanEmail}.`,
      email: cleanEmail,
      expiresInSeconds: expiresInMinutes * 60,
      // Provide devOtp when in non-production or for testing convenience
      devOtp: process.env.NODE_ENV !== "production" ? otp : undefined,
    });
  } catch (error) {
    console.error("Error requesting reservation OTP:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to dispatch verification code. Please try again.",
    });
  }
}

// 2. POST /api/reservations/verify-otp (Public - Guest verifies OTP, saving reservation as Pending for admin)
async function verifyReservationOtp(req, res) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email address and 6-digit verification code are required.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.toString().trim();

    const record = await OtpVerification.findOne({
      email: cleanEmail,
      otp: cleanOtp,
    });

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code. Please check your email or request a new code.",
      });
    }

    if (new Date() > record.expiresAt) {
      await OtpVerification.deleteOne({ _id: record._id });
      return res.status(400).json({
        success: false,
        message: "Verification code has expired. Please request a new code.",
      });
    }

    const draft = record.reservationData;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const customId = `ORD-${randomSuffix}`;

    // Create active reservation for admin to review
    const newReservation = await Reservation.create({
      customId,
      customerName: draft.customerName,
      email: draft.email,
      phone: draft.phone || "",
      date: draft.date,
      time: draft.time,
      guests: draft.guests,
      notes: draft.notes,
      totalEstimated: draft.totalEstimated,
      status: "Pending",
    });

    // Clean up OTP record
    await OtpVerification.deleteOne({ _id: record._id });

    // Send acknowledgment email to customer (non-blocking)
    emailService
      .sendReservationReceivedEmail({
        to: newReservation.email,
        name: newReservation.customerName,
        customId: newReservation.customId,
        date: newReservation.date,
        time: newReservation.time,
        guests: newReservation.guests,
      })
      .catch((err) => console.error("Error sending received acknowledgment email:", err));

    return res.status(201).json({
      success: true,
      message: `Table held! Your reservation reference is ${newReservation.customId}.`,
      data: newReservation,
    });
  } catch (error) {
    console.error("Error verifying reservation OTP:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify reservation code.",
    });
  }
}

// 3. POST /api/reservations (Direct creation - Used by admin or direct callers)
async function createReservation(req, res) {
  try {
    const { customerName, email, phone, date, time, guests, tableNumber, status, notes, totalEstimated } = req.body;

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
    const initialStatus = status || "Pending";

    const newReservation = await Reservation.create({
      customId,
      customerName: customerName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : "",
      date,
      time,
      guests: guestCount,
      tableNumber: tableNumber || undefined,
      notes: notes || "Manual reservation recorded by staff",
      totalEstimated: totalEstimated !== undefined ? Number(totalEstimated) : guestCount * 85,
      status: initialStatus,
    });

    // If directly created as Confirmed by admin, send confirmation email immediately
    if (initialStatus === "Confirmed") {
      emailService
        .sendReservationConfirmedEmail({
          to: newReservation.email,
          name: newReservation.customerName,
          customId: newReservation.customId,
          date: newReservation.date,
          time: newReservation.time,
          guests: newReservation.guests,
          tableNumber: newReservation.tableNumber,
          notes: newReservation.notes,
        })
        .catch((err) => console.error("Error sending direct confirmation email:", err));
    }

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

// 4. GET /api/reservations/lookup (Public - User checks their reservation status)
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

// 5. GET /api/reservations or /api/orders (Admin protected)
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

// 6. GET /api/reservations/stats (Admin protected)
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

// 7. GET /api/reservations/:id (Admin protected)
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

// 8. PUT /api/reservations/:id or PATCH /api/reservations/:id (Admin protected)
// Triggers automatic customer emails on status change to "Confirmed" or "Completed"
async function updateReservation(req, res) {
  try {
    const { id } = req.params;

    // Fetch existing reservation first to compare status transition
    const existing = await Reservation.findOne({ customId: id });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: `Reservation '${id}' not found.`,
      });
    }

    const previousStatus = existing.status;

    const updated = await Reservation.findOneAndUpdate(
      { customId: id },
      req.body,
      { new: true }
    );

    const newStatus = updated.status;

    // Check status transitions for automated customer emails
    if (newStatus === "Confirmed" && previousStatus !== "Confirmed") {
      emailService
        .sendReservationConfirmedEmail({
          to: updated.email,
          name: updated.customerName,
          customId: updated.customId,
          date: updated.date,
          time: updated.time,
          guests: updated.guests,
          tableNumber: updated.tableNumber,
          notes: updated.notes,
        })
        .catch((err) => console.error("Error sending Confirmed email:", err));
    } else if (newStatus === "Completed" && previousStatus !== "Completed") {
      emailService
        .sendReservationCompletedEmail({
          to: updated.email,
          name: updated.customerName,
          customId: updated.customId,
          date: updated.date,
        })
        .catch((err) => console.error("Error sending Completed thank you email:", err));
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

// 9. DELETE /api/reservations/:id (Admin protected)
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
  requestReservationOtp,
  verifyReservationOtp,
  createReservation,
  lookupReservation,
  getAllReservations,
  getReservationStats,
  getReservationById,
  updateReservation,
  deleteReservation,
};
