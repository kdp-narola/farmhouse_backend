const createHttpError = require("http-errors");
const Reservation = require("../../models/Reservation");
const { ERRORS } = require("../../constants/errors.constants");

async function reservationDetails(authUser, params) {
    const populate = [
        {
            path: 'property',
            select: 'title images address'
        }
    ]
    const reservation = await Reservation.findById(params?.reservationId).populate(populate);
    if (!reservation) throw new createHttpError(404, ERRORS.RESERVATION_NOTEXIST);
    if (reservation.user.toString() !== authUser._id.toString()) {
        throw new createHttpError(400, "You are unauthorized to access this Reservation Data.");
    }
    return reservation
}
module.exports = reservationDetails;