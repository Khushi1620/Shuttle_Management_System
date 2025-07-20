const mongoose = require('mongoose');

async function main() {
    await mongoose.connect(process.env.MONGO_DB_CONNECT_STRING);
}
module.exports = main;