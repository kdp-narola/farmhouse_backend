const mongoose = require("mongoose");
const Property = require("../models/Property");
const User = require("../models/User");
const Reservation = require("../models/Reservation");
const {
  RESERVATION_STATUS,
  PAYMENT_STATUS,
} = require("../constants/common.constant");

async function getDashboardStatistics(authUser) {
  try {
    const userId = new mongoose.Types.ObjectId(authUser._id);

    const userDetail = await User.findById(userId)
      .select("+role")
      .lean();

    if (!userDetail) throw new Error("User not found");

    const role = userDetail.role;

    const startOfThisMonth = new Date();
    startOfThisMonth.setDate(1);
    startOfThisMonth.setHours(0, 0, 0, 0);

    const startOfLastMonth = new Date(startOfThisMonth);
    startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);

    /** ---------------- ADMIN ---------------- */
    if (role === "ADMIN") {
      const [
        totalProperties,
        totalUsers,
        pendingReservations,
        confirmedStats,
      ] = await Promise.all([
        Property.countDocuments({ deletedAt: null }),
        User.countDocuments({ deletedAt: null }),

        Reservation.countDocuments({
          reservationStatus: RESERVATION_STATUS.PEDNING,
        }),

        Reservation.aggregate([
          // {
          //   $match: {
          //     reservationStatus: RESERVATION_STATUS.CONFIRMED,
          //     paymentStatus: PAYMENT_STATUS.SUCCESS,
          //   },
          // },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: "$finalAmount" },
              totalReservations: { $sum: 1 },
            },
          },
        ]),
      ]);

      const completedReservation = confirmedStats[0]?.totalReservations - pendingReservations;
      const successRate = (completedReservation * 100 / confirmedStats[0]?.totalReservations).toFixed(2);

      return {
        totalProperties,
        totalUsers,
        pendingReservations,
        totalRevenue: confirmedStats[0]?.totalRevenue || 0,
        totalConfirmedReservations: confirmedStats[0]?.totalReservations || 0,
        successRate
      };
    }

    /** ---------------- OWNER ---------------- */
    if (role === "OWNER") {
      const [
        totalProperties,
        pendingReservations,
        revenueStats,
      ] = await Promise.all([
        Property.countDocuments({ user: userId, deletedAt: null }),

        Reservation.aggregate([
          {
            $lookup: {
              from: "properties",
              localField: "property",
              foreignField: "_id",
              as: "property",
            },
          },
          { $unwind: "$property" },
          {
            $match: {
              "property.user": userId,
              reservationStatus: RESERVATION_STATUS.PEDNING,
            },
          },
          { $count: "count" },
        ]),

        Reservation.aggregate([
          {
            $lookup: {
              from: "properties",
              localField: "property",
              foreignField: "_id",
              as: "property",
            },
          },
          { $unwind: "$property" },
          {
            $match: {
              "property.user": userId,
              // reservationStatus: RESERVATION_STATUS.CONFIRMED,
              // paymentStatus: PAYMENT_STATUS.SUCCESS,
            },
          },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: "$finalAmount" },
              totalReservations: { $sum: 1 },

              thisMonthRevenue: {
                $sum: {
                  $cond: [
                    { $gte: ["$createdAt", startOfThisMonth] },
                    "$finalAmount",
                    0,
                  ],
                },
              },

              lastMonthRevenue: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        { $gte: ["$createdAt", startOfLastMonth] },
                        { $lt: ["$createdAt", startOfThisMonth] },
                      ],
                    },
                    "$finalAmount",
                    0,
                  ],
                },
              },
            },
          },
        ]),
      ]);

      const stats = revenueStats[0] || {};

      return {
        totalProperties,
        pendingReservations: pendingReservations[0]?.count || 0,
        totalConfirmedReservations: stats.totalReservations || 0,
        totalRevenue: stats.totalRevenue || 0,
        thisMonthRevenue: stats.thisMonthRevenue || 0,
        lastMonthRevenue: stats.lastMonthRevenue || 0,
      };
    }

    /** ---------------- CUSTOMER ---------------- */
    if (role === "CUSTOMER") {
      const [
        totalReservations,
        pendingReservations,
        confirmedStats,
      ] = await Promise.all([
        Reservation.countDocuments({ user: userId }),

        Reservation.countDocuments({
          user: userId,
          reservationStatus: RESERVATION_STATUS.PEDNING,
        }),

        Reservation.aggregate([
          {
            $match: {
              user: userId,
              reservationStatus: RESERVATION_STATUS.CONFIRMED,
              paymentStatus: PAYMENT_STATUS.SUCCESS,
            },
          },
          {
            $group: {
              _id: null,
              totalSpent: { $sum: "$finalAmount" },
            },
          },
        ]),
      ]);

      return {
        totalReservations,
        pendingReservations,
        totalSpent: confirmedStats[0]?.totalSpent || 0,
      };
    }

    return {};
  } catch (error) {
    console.error("Statistics Error:", error);
    throw error;
  }
}

module.exports = getDashboardStatistics;