const mongoose = require('mongoose');
require('dotenv').config({ quiet: true });

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI.trim());
        console.log('Database Connected.');
    } catch (error) {
        console.error(error);
        process.exit(1)
    }
}

module.exports = connectDB;