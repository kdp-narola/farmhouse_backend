const createHttpError = require('http-errors');
const razorpay = require('../../config/razorpay');
const Reservation = require('../../models/Reservation');
const crypto = require('crypto');
const { PAYMENT_STATUS, RESERVATION_STATUS } = require('../../constants/common.constant');

async function verifyPayment(body) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = body;

    if (razorpay_order_id && razorpay_payment_id && razorpay_signature) {
        const reservation = await Reservation.findOne({ razorpayOrderID: razorpay_order_id });
        if (!reservation) throw new createHttpError[400]('Reservation Not Found.');

        const payload = reservation.razorpayOrderID + "|" + razorpay_payment_id;
        const verify = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(payload)
            .digest('hex');

        try {
            const order = await razorpay.orders.fetch(razorpay_order_id);
            if (verify === razorpay_signature) {
                if (order && order.notes && order.notes.reservationId && order.status === 'paid') {
                    const update = await Reservation.findByIdAndUpdate(order.notes.reservationId,
                        { paymentStatus: PAYMENT_STATUS.SUCCESS },
                        { new: true })
                        .populate([{ path: 'property', select: 'title address.city address.state' }])
                        .select('-razorpayPaymentID -razorPaySignature -razorPayReferenceID -razorpayOrderID').lean();
                    return update
                } else throw new createHttpError[400]('Order status not verified.');
            }
            return { paymentStatus: PAYMENT_STATUS.FAILED }
        } catch (error) {
            throw new createHttpError[error.statusCode || 500](error.message || 'Error At Verify Payment.');
        }
    } else if (orderId) {
        const order = await razorpay.orders.fetch(orderId);
        const update = await Reservation.findByIdAndUpdate(order.notes?.reservationId, {
            reservationStatus: RESERVATION_STATUS.CANCELLED,
            PAYMENT_STATUS: PAYMENT_STATUS.FAILED,
            cancellationReasons: 'Payment TimeOut'
        })

        return { PAYMENT_STATUS: PAYMENT_STATUS.FAILED, }
    }
}


module.exports = verifyPayment;