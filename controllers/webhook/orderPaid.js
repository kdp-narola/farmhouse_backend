const createHttpError = require('http-errors');
const Reservation = require('../../models/Reservation');
const razorpay = require('../../config/razorpay');
const { RESERVATION_STATUS, PAYMENT_STATUS } = require('../../constants/common.constant');
async function orderPaid(event) {
    try {
        if (!event || !event.payload) throw new createHttpError[403]('WEBHHOK FAILED');
        const eventData = event.payload
        const razorpayOrderID = eventData?.order?.entity?.id

        const reservation = await Reservation.findOne({ razorpayOrderID });
        if (!reservation) throw new createHttpError(403, 'Reservation not exist.');

        const fetchOrder = await razorpay.orders.fetch(razorpayOrderID);
        if (fetchOrder && fetchOrder.status === 'paid') {
            reservation.paymentStatus = PAYMENT_STATUS.SUCCESS;
            reservation.cancellationReasons = null;
            await reservation.save();
        }
        return reservation;
    } catch (error) {
        console.error(error);
    }


}
module.exports = orderPaid;