const createHttpError = require("http-errors");
const razorpay = require("../../config/razorpay");
const Reservation = require("../../models/Reservation");
const { PAYMENT_STATUS, RESERVATION_STATUS } = require("../../constants/common.constant");
const { ERRORS } = require("../../constants/errors.constants");

async function deniedPayment(body) {
    const orderId = body?.orderId;
    const reservation = await Reservation.findOne({ razorpayOrderID: orderId });
    if (!reservation) throw new createHttpError(400, ERRORS.RESERVATION_NOTEXIST);
    try {
        const order = await razorpay.orders.fetch(orderId);
        if (order && order.notes && order.notes.reservationId) {
            reservation.paymentStatus = PAYMENT_STATUS.FAILED
            reservation.reservationStatus = RESERVATION_STATUS.CANCELLED
            await reservation.save()
            return { ...reservation, paymentStatus: PAYMENT_STATUS.FAILED }
        } else {
            throw new createHttpError[400]('Order not found.')
        }
    } catch (error) {
        throw new createHttpError(error.statusCode || 400, error.message || ERRORS.PAYMENT_GATWAY_ERROR);
    }
}
module.exports = deniedPayment;