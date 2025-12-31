const { RESERVATION_STATUS } = require("../../constants/common.constant");
const { USER_STATUS } = require("../../constants/user.constants");
const Property = require("../../models/Property");
const Reservation = require("../../models/Reservation");
const User = require("../../models/User")
const moment = require('moment');
async function dashboardDetails() {
    const dashbaord = {}

    const userCount = await User.countDocuments({ status: USER_STATUS.VERIFIED });
    dashbaord.userCount = userCount;

    const propertyCount = await Property.countDocuments({ deletedAt: null });
    dashbaord.propertyCount = propertyCount;

    const totalReservationCount = await Reservation.countDocuments({
        status: RESERVATION_STATUS.CONFIRMED,
    });
    dashbaord.totalReservationCount = totalReservationCount;

    //date-wise
    const upcomingReservationCount = await Reservation.countDocuments({
        status: RESERVATION_STATUS.CONFIRMED,
        checkIn: { $gte: moment().utc().toISOString() }
    });

    dashbaord.upcomingReservationCount = upcomingReservationCount;

    return dashbaord
}
module.exports = dashboardDetails