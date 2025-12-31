const createHttpError = require("http-errors");
const Reservation = require("../../models/Reservation");
const { RESERVATION_STATUS } = require("../../constants/common.constant");

async function updateReservationRequestStatus(reservationId, payload) {
    const { status } = payload;
    if (!reservationId) throw new createHttpError.BadRequest("Reservation ID is required");    
    if (!status || !Object.values(RESERVATION_STATUS).includes(status.toUpperCase())) throw new createHttpError.BadRequest("Invalid reservation status");
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) throw new createHttpError.NotFound("Reservation not found");
    reservation.reservationStatus = status.toUpperCase();
    await reservation.save();
    return {
        message: `Reservation status updated to ${reservation.reservationStatus}`,
        reservation
    };
}

module.exports = updateReservationRequestStatus;
