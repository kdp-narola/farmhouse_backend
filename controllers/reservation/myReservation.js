const { RESERVATION_STATUS, PAYMENT_STATUS } = require("../../constants/common.constant");
const Reservation = require("../../models/Reservation");
const moment = require('moment');

async function myReservation(authUser) {
    const populate = [{ path: 'property', select: 'title images description address.city address.state' }];
    const sort = { checkIn: 1 };
    const select = 'checkIn checkOut finalAmount reservationStatus paymentStatus guest createdAt bookingType status';
    const filterQuery = {
        user: authUser?._id, checkOut: { $gte: moment() },
        paymentStatus: { $ne: PAYMENT_STATUS.FAILED }
    };

    const reservation = await Reservation.find(filterQuery).sort(sort).populate(populate).select(select);
    return reservation;
}
module.exports = myReservation;