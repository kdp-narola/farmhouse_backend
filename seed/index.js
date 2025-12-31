const userData = require('./user.json');
const User = require('../models/User');
const mongoose = require('mongoose');
async function seedDatabase() {
    try {
        console.log('Started seeding of data');
        await require('../services/database')();
        var count = 0
        for (let userIndex = 0; userIndex < array.length; userIndex++) {
            const userObject = userData[userIndex];
            const userRecord = await User.create({ ...userObject });
            count += 1
        }
        console.warn(`${count} Record insertes in to User Collection.`);
        return true
    } catch (error) {
        console.error(error);
    }

}


(async function _() {
    await seedDatabase()
})().catch(() => {
    console.error(error);
}).finally(async () => {
    await mongoose.connection.close()
    console.warn("MongoDB connection closed.");
    process.exit(1)
})
