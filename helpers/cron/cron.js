const cron = require('node-cron');
const cronSettlePayments = require('../../controllers/razorpay/cronSettlePayments');

const scheduleJOB = () => {
    console.warn('cron job started for every 15 Miniutes....');
    cron.schedule('*/15 * * * *', async () => {
        console.log('Cron: Finding Unsettled Payment...');
        cronSettlePayments()
    });
}
module.exports = scheduleJOB;