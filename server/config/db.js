const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Connected to DB ${conn.connection.name}`);
    } catch (error) {
        console.log(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;