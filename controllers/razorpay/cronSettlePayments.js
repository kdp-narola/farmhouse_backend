const { PAYMENT_STATUS, RESERVATION_STATUS } = require("../../constants/common.constant");
const Reservation = require("../../models/Reservation");
const moment = require('moment');
const razorpay = require("../../config/razorpay");

async function cronSettlePayments() {
    try {
        const reservation = await Reservation.distinct("razorpayOrderID", {
            paymentStatus: PAYMENT_STATUS.PEDNING,
            createdAt: { $lte: moment().subtract(15, 'minute') }
        });
        console.log('reservation :>> ', reservation);
        if (!reservation.length) {
            console.warn('Cron: No pending reservations to process in the last 15 minutes.');
        }
        const successPayment = new Array();
        const FaildPayment = new Array();
        for (let i = 0; i < reservation.length; i++) {
            const orderId = reservation[i];
            const order = await razorpay.orders.fetch(orderId);

            if (order && order.notes && order.notes.reservationId) {
                if (order.status === 'paid') successPayment.push(order.notes?.reservationId);
                else FaildPayment.push(order.notes?.reservationId)
            }
        }

        if (successPayment.length > 0) {
            await Reservation.updateMany({
                _id: { $in: successPayment }
            }, { paymentStatus: PAYMENT_STATUS.SUCCESS });
        }
        if (FaildPayment.length > 0) {
            await Reservation.updateMany({
                _id: { $in: FaildPayment }
            }, { paymentStatus: PAYMENT_STATUS.FAILED, reservationStatus: RESERVATION_STATUS.CANCELLED });
        }

        console.warn('Payment Settled SuccessFully');
    } catch (error) {
        console.error("cron", error);
    }

}
module.exports = cronSettlePayments;