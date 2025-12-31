const createHttpError = require("http-errors");
const Reservation = require("../../models/Reservation");
const moment = require('moment');
const { RESERVATION_STATUS } = require("../../constants/common.constant");

async function reservationAction(authUser, body, params) {
    const { action, cancellationReasons } = body;
    const reservation = await Reservation.findById(params?.reservationId).populate(['property']);
    if (!reservation) throw new createHttpError[400]('Reservation Not Found.');

    const isUser = reservation?.user?.toString() === authUser?._id?.toString();
    const isOwner = reservation.property.user.toString() === authUser?._id?.toString();

    if (!isUser && !isOwner) throw new createHttpError[400]('You are not authorized to cancel this booking.');

    const currentTime = moment();
    const checkIn = moment(reservation?.checkIn);
    if (checkIn.isBefore(currentTime)) throw new createHttpError[400]('You can not cancel and confirm reservation.');

    if (action === RESERVATION_STATUS.CONFIRMED) {
        if (!isOwner) throw new createHttpError[403]('Only property owner can confirm the booking.')
        reservation.status = RESERVATION_STATUS.CONFIRMED;
        await reservation.save();
        return { action, _id: reservation._id }
    }

    if (action === RESERVATION_STATUS.CANCELLED) {
        const hoursDiff = checkIn.diff(currentTime, "hours");
        if (hoursDiff < 24) throw new createHttpError[400]("You can cancel reservation only before 24 hours of check-in.");

        reservation.status = RESERVATION_STATUS.CANCELLED;
        if (cancellationReasons) reservation.cancellationReasons = cancellationReasons;
        await reservation.save()
        return { action, _id: reservation._id }
    }

    throw new createHttpError[422]('Invalid Action on Reservation.');
}
module.exports = reservationAction;