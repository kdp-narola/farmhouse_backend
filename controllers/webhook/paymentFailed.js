const createHttpError = require("http-errors");
const Reservation = require("../../models/Reservation");
const razorpay = require('../../config/razorpay');

const { RESERVATION_STATUS, PAYMENT_STATUS } = require("../../constants/common.constant");

async function paymentFailed(event) {
    try {
        if (!event || !event.payload) throw new createHttpError[403]('WEBHHOK FAILED');
        const razorpayOrderID = event.payload?.payment?.entity?.order_id;

        const reservation = await Reservation.findOne({ razorpayOrderID });
        if (!reservation) throw new createHttpError(403, 'Reservation not exist.');


        const fetchPayment = await razorpay.orders.fetchPayments(razorpayOrderID);

        const paymentStatus = event.payload?.payment?.entity?.status;
        const cancellationReasons = event.payload?.payment?.entity?.error_description

        if (paymentStatus === "failed") {
            reservation.reservationStatus = RESERVATION_STATUS.CANCELLED;
            reservation.paymentStatus = PAYMENT_STATUS.FAILED;
            reservation.cancellationReasons = cancellationReasons
            await reservation.save()
            return true
        }
    } catch (error) {
        console.error(error);
    }
}
module.exports = paymentFailed